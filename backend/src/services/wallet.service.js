import { ethers } from "ethers";
import axios from "axios";
import provider from "../config/provider.js";
import config from "../config/config.js";
import factoryArtifact from "../abi/SmartWalletFactory.json" with { type: "json" };
import smartWalletArtifact from "../abi/SmartWallet.json" with { type: "json" };

// Create a contract instance
const factory = new ethers.Contract(
  config.FACTORY_CA,
  factoryArtifact.abi,
  provider,
);

// Predict Smart Wallet address
export async function predictWalletAddress(owner) {
  try {
    // Validate owner address
    if (!ethers.isAddress(owner)) {
      throw new Error("Invalid owner address");
    }

    // Validate salt
    if (!ethers.isHexString(config.WALLET_SALT, 32)) {
      throw new Error("Invalid wallet salt");
    }

    // Get contract function
    const predictFunction = factory.getFunction("predictWalletAddress");

    // Call the contract's view function
    const walletAddress = await predictFunction.staticCall(
      ethers.getAddress(owner),
      config.WALLET_SALT,
    );

    return walletAddress;
  } catch (error) {
    console.error("Wallet prediction failed:", error);

    throw new Error(`Wallet prediction failed: ${error.message}`);
  }
}

export const getWalletDetails = async (walletAddress) => {
  try {
    if (!ethers.isAddress(walletAddress)) {
      throw new Error("Invalid wallet address");
    }

    walletAddress = ethers.getAddress(walletAddress);

    // Check whether the wallet is deployed
    const code = await provider.getCode(walletAddress);

    const isDeployed = code !== "0x";

    // Get wallet ETH balance
    const balance = await provider.getBalance(walletAddress);

    let owner = null;
    let entryPoint = null;

    // Read contract details only if deployed
    if (isDeployed) {
      const smartWallet = new ethers.Contract(
        walletAddress,
        smartWalletArtifact.abi,
        provider,
      );

      owner = await smartWallet.owner();
      entryPoint = await smartWallet.getEntryPoint();
    }

    return {
      walletAddress,
      isDeployed,
      balance: balance.toString(),
      balanceInEther: ethers.formatEther(balance),
      owner,
      entryPoint,
    };
  } catch (error) {
    throw new Error(`Failed to get wallet details: ${error.message}`);
  }
};

export const getWalletNonce = async (walletAddress) => {
  try {
    const ENTRY_POINT_ABI = [
      "function getNonce(address sender, uint192 key) view returns (uint256)",
    ];

    const entryPoint = new ethers.Contract(
      config.ENTRY_POINT,
      ENTRY_POINT_ABI,
      provider,
    );

    if (!ethers.isAddress(walletAddress)) {
      throw new Error("Invalid wallet address");
    }

    const nonce = await entryPoint.getNonce(
      ethers.getAddress(walletAddress),
      0,
    );

    return nonce.toString();
  } catch (error) {
    throw new Error(`Failed to get wallet nonce: ${error.message}`);
  }
};

export async function getWalletTransactions(
  walletAddress,
  page = 1,
  offset = 10,
) {
  try {
    const BASE_URL = "https://api.etherscan.io/v2/api";

    const commonParams = {
      chainid: config.CHAIN_ID,
      module: "account",
      address: walletAddress,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 10000,
      sort: "desc",
      apikey: config.ETHERSCAN_API_KEY,
    };

    // 1. Fetch normal and internal transactions
    const [normalResponse, internalResponse] = await Promise.all([
      axios.get(BASE_URL, {
        params: {
          ...commonParams,
          action: "txlist",
        },
      }),

      axios.get(BASE_URL, {
        params: {
          ...commonParams,
          action: "txlistinternal",
        },
      }),
    ]);

    // 2. Extract API results
    function extractTransactions(response, type) {
      if (response.status === "1" && Array.isArray(response.result)) {
        return response.result;
      }

      if (
        response.status === "0" &&
        response.message === "No transactions found"
      ) {
        return [];
      }

      throw new Error(
        `Etherscan ${type} API error: ${response.result || response.message}`,
      );
    }

    const normalTransactions = extractTransactions(
      normalResponse.data,
      "normal",
    );

    const internalTransactions = extractTransactions(
      internalResponse.data,
      "internal",
    );

    // 3. Group transactions using their transaction hash
    const transactionMap = new Map();

    function getOrCreateTransaction(hash, tx) {
      const normalizedHash = hash.toLowerCase();

      if (!transactionMap.has(normalizedHash)) {
        transactionMap.set(normalizedHash, {
          hash,
          from: tx.from,
          to: tx.to,
          blockNumber: Number(tx.blockNumber),
          timestamp: Number(tx.timeStamp),
          transfers: [],
          status: "success",
          gasCost: null,
          gasCostInEth: null,
        });
      }

      return transactionMap.get(normalizedHash);
    }

    // 4. Process normal transactions
    for (const tx of normalTransactions) {
      const transaction = getOrCreateTransaction(tx.hash, tx);

      transaction.transfers.push({
        from: tx.from,
        to: tx.to,
        value: tx.value,
        valueInEth: ethers.formatEther(tx.value),
        type: "normal",
        direction:
          tx.from.toLowerCase() === walletAddress.toLowerCase()
            ? "sent"
            : tx.to.toLowerCase() === walletAddress.toLowerCase()
              ? "received"
              : "self",
      });

      if (tx.isError === "1" || tx.txreceipt_status === "0") {
        transaction.status = "failed";
      }
    }

    // 5. Process internal transactions
    for (const tx of internalTransactions) {
      const transaction = getOrCreateTransaction(tx.hash, tx);

      transaction.transfers.push({
        from: tx.from,
        to: tx.to,
        value: tx.value,
        valueInEth: ethers.formatEther(tx.value),
        traceId: tx.traceId,
        type: "internal",
        direction:
          tx.from.toLowerCase() === walletAddress.toLowerCase()
            ? "sent"
            : tx.to.toLowerCase() === walletAddress.toLowerCase()
              ? "received"
              : "self",
      });

      if (tx.isError === "1") {
        transaction.status = "failed";
      }
    }

    // 6. Get EntryPoint UserOperationEvent
    const entryPointInterface = new ethers.Interface([
      "event UserOperationEvent(bytes32 indexed userOpHash,address indexed sender,address indexed paymaster,uint256 nonce,bool success,uint256 actualGasCost,uint256 actualGasUsed)",
    ]);

    // 7. Fetch receipts and calculate gas cost
    const transactions = [...transactionMap.values()];

    await Promise.all(
      transactions.map(async (transaction) => {
        try {
          const receipt = await provider.getTransactionReceipt(
            transaction.hash,
          );

          if (!receipt) return;

          // Look for EntryPoint UserOperationEvent
          let userOpGasCost = null;

          for (const log of receipt.logs) {
            try {
              if (
                log.address.toLowerCase() !== config.ENTRY_POINT.toLowerCase()
              ) {
                continue;
              }

              const parsedLog = entryPointInterface.parseLog({
                topics: log.topics,
                data: log.data,
              });

              if (parsedLog?.name === "UserOperationEvent") {
                userOpGasCost = parsedLog.args.actualGasCost;
                break;
              }
            } catch {
              // Ignore logs that don't match this event
            }
          }

          if (userOpGasCost !== null) {
            // Actual gas charged for this UserOperation
            transaction.gasCost = userOpGasCost.toString();
            transaction.gasCostInEth = ethers.formatEther(userOpGasCost);
          } else {
            // Fallback for ordinary transactions
            const effectiveGasPrice =
              receipt.gasPrice ?? receipt.effectiveGasPrice;

            if (effectiveGasPrice !== undefined) {
              const gasCost = receipt.gasUsed * effectiveGasPrice;

              transaction.gasCost = gasCost.toString();
              transaction.gasCostInEth = ethers.formatEther(gasCost);
            }
          }

          // Use receipt status as the final transaction status
          transaction.status = receipt.status === 1 ? "success" : "failed";
        } catch (error) {
          console.error(
            `Receipt lookup failed for ${transaction.hash}:`,
            error.message,
          );
        }
      }),
    );

    // 8. Format transactions correctly
    const formattedTransactions = transactions.map((tx) => {
      const wallet = walletAddress.toLowerCase();
      const entryPoint = config.ENTRY_POINT.toLowerCase();

      // Identify transfers involving the Smart Wallet.
      // EntryPoint movements are gas-related, not user transfers.
      const formattedTransfers = tx.transfers.map((transfer) => {
        const from = transfer.from.toLowerCase();
        const to = transfer.to.toLowerCase();

        const isGasRelated = from === entryPoint || to === entryPoint;

        let direction = "unknown";

        if (from === wallet && to === wallet) {
          direction = "self";
        } else if (from === wallet) {
          direction = "sent";
        } else if (to === wallet) {
          direction = "received";
        }

        return {
          ...transfer,
          direction,
          isGasRelated,
        };
      });

      // Exclude EntryPoint movements from actual transfers
      const actualTransfers = formattedTransfers.filter(
        (transfer) =>
          !transfer.isGasRelated &&
          (transfer.direction === "sent" ||
            transfer.direction === "received" ||
            transfer.direction === "self"),
      );

      // Calculate total value of actual wallet transfers
      const totalTransferredWei = actualTransfers.reduce(
        (total, transfer) => total + BigInt(transfer.value),
        0n,
      );

      // Determine overall transaction direction
      const directions = [
        ...new Set(actualTransfers.map((transfer) => transfer.direction)),
      ];

      let direction = "unknown";

      if (directions.length === 1) {
        direction = directions[0];
      } else if (directions.length > 1) {
        direction = "multiple";
      }

      return {
        hash: tx.hash,

        direction,

        transfers: formattedTransfers,

        totalTransferred: ethers.formatEther(totalTransferredWei),

        totalTransferredWei: totalTransferredWei.toString(),

        gasCost: tx.gasCost,
        gasCostInEth: tx.gasCostInEth,

        timestamp: tx.timestamp,

        date: new Date(tx.timestamp * 1000).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        }),

        blockNumber: tx.blockNumber,
        status: tx.status,

        explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`,
      };
    });

    // 9. Sort newest first
    formattedTransactions.sort((a, b) => b.timestamp - a.timestamp);

    // 10. Apply pagination
    const startIndex = (page - 1) * offset;

    const paginatedTransactions = formattedTransactions.slice(
      startIndex,
      startIndex + offset,
    );

    return {
      transactions: paginatedTransactions,

      pagination: {
        page,
        offset,
        totalTransactions: formattedTransactions.length,
        totalPages: Math.ceil(formattedTransactions.length / offset),
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch wallet transactions: ${error.message}`);
  }
}
