import { ethers } from "ethers";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = "http://localhost:3000";

const SMART_WALLET = "0xcFD38Fda410A7b398aAa3165D1A0C5e7565f4682";
const ENTRY_POINT = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";

const PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const ownerWallet = new ethers.Wallet(PRIVATE_KEY, provider);

const walletABI = [
  "function execute(address dest, uint256 value, bytes functionData)",
];

const walletInterface = new ethers.Interface(walletABI);

async function testUserOperation() {
  try {
    // 1. Get current nonce
    const nonceResponse = await axios.get(
      `${API_URL}/api/wallet/${SMART_WALLET}/nonce`,
    );

    const nonce = BigInt(nonceResponse.data.data.nonce);
    console.log("Nonce:", nonce.toString());

    // 2. Prepare transaction
    const recipient = ownerWallet.address;
    const amount = ethers.parseEther("0.001");

    // 3. Encode execute()
    const callData = walletInterface.encodeFunctionData("execute", [
      recipient,
      amount,
      "0x",
    ]);

    // 4. Build initial UserOperation
    const userOp = {
      sender: SMART_WALLET,
      nonce: ethers.toBeHex(nonce),
      callData,

      callGasLimit: "0x0",
      verificationGasLimit: "0x0",
      preVerificationGas: "0x0",

      maxFeePerGas: "0x0",
      maxPriorityFeePerGas: "0x0",

      signature: "0x",
    };

    // 5. Estimate gas
    const estimateResponse = await axios.post(
      `${API_URL}/api/user-operation/estimate`,
      { userOp },
    );

    const gasEstimate = estimateResponse.data.data;

    userOp.callGasLimit = gasEstimate.callGasLimit;
    userOp.verificationGasLimit = gasEstimate.verificationGasLimit;

    // Add buffer to preVerificationGas
    const PRE_VERIFICATION_GAS_BUFFER = 5000n;

    userOp.preVerificationGas = ethers.toBeHex(
      BigInt(gasEstimate.preVerificationGas) + PRE_VERIFICATION_GAS_BUFFER,
    );

    console.log("Gas estimation:", gasEstimate);
    console.log("Buffered preVerificationGas:", userOp.preVerificationGas);

    // 6. Get Pimlico recommended gas prices
    const gasPriceResponse = await axios.post(
      `https://api.pimlico.io/v2/11155111/rpc?apikey=${process.env.PIMLICO_API_KEY}`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "pimlico_getUserOperationGasPrice",
        params: [],
      },
    );

    if (gasPriceResponse.data.error) {
      throw new Error(gasPriceResponse.data.error.message);
    }

    const gasPrices = gasPriceResponse.data.result;

    if (!gasPrices?.standard) {
      throw new Error("Pimlico did not return standard gas prices");
    }

    userOp.maxFeePerGas = gasPrices.standard.maxFeePerGas;
    userOp.maxPriorityFeePerGas = gasPrices.standard.maxPriorityFeePerGas;

    console.log("Updated max fee:", userOp.maxFeePerGas);
    console.log("Updated priority fee:", userOp.maxPriorityFeePerGas);

    // 7. Create EntryPoint contract
    const entryPointABI = [
      "function getUserOpHash((address sender,uint256 nonce,bytes initCode,bytes callData,bytes32 accountGasLimits,uint256 preVerificationGas,bytes32 gasFees,bytes paymasterAndData,bytes signature) userOp) view returns (bytes32)",
    ];

    const entryPoint = new ethers.Contract(
      ENTRY_POINT,
      entryPointABI,
      provider,
    );

    // 8. Build packed UserOperation
    const packedUserOp = {
      sender: userOp.sender,
      nonce: userOp.nonce,
      initCode: "0x",
      callData: userOp.callData,

      accountGasLimits: ethers.solidityPacked(
        ["uint128", "uint128"],
        [BigInt(userOp.verificationGasLimit), BigInt(userOp.callGasLimit)],
      ),

      preVerificationGas: userOp.preVerificationGas,

      gasFees: ethers.solidityPacked(
        ["uint128", "uint128"],
        [BigInt(userOp.maxPriorityFeePerGas), BigInt(userOp.maxFeePerGas)],
      ),

      paymasterAndData: "0x",
      signature: "0x",
    };

    // 9. Calculate final UserOperation hash
    const userOpHash = await entryPoint.getUserOpHash(packedUserOp);

    console.log("UserOperation hash:", userOpHash);

    // 10. Sign final hash
    userOp.signature = await ownerWallet.signMessage(
      ethers.getBytes(userOpHash),
    );

    // 11. Verify signature
    const recoveredAddress = ethers.verifyMessage(
      ethers.getBytes(userOpHash),
      userOp.signature,
    );

    console.log("Owner:", ownerWallet.address);
    console.log("Recovered:", recoveredAddress);

    if (recoveredAddress.toLowerCase() !== ownerWallet.address.toLowerCase()) {
      throw new Error("Signature verification failed");
    }

    console.log("Signature valid: true");
    console.log("Final UserOperation:", JSON.stringify(userOp, null, 2));

    // 12. Submit UserOperation
    const sendResponse = await axios.post(
      `${API_URL}/api/user-operation/send`,
      { userOp },
    );

    console.log("Submission response:", sendResponse.data);
  } catch (error) {
    console.error("Test failed:", error.response?.data || error.message);
  }
}

testUserOperation();
