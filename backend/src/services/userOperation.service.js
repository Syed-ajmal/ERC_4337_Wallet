import axios from "axios";
import config from "../config/config.js";

const PIMLICO_URL = `https://api.pimlico.io/v2/${config.CHAIN_ID}/rpc?apikey=${config.PIMLICO_API_KEY}`;

export async function estimateUserOperationGas(userOp) {
  try {
    const response = await axios.post(PIMLICO_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_estimateUserOperationGas",
      params: [userOp, config.ENTRY_POINT],
    });

    return response.data.result;
  } catch (error) {
    const message = error.response?.data?.error?.message || error.message;

    throw new Error(`Gas estimation failed: ${message}`);
  }
}

export async function sendUserOperation(userOp) {
  try {
    const response = await axios.post(PIMLICO_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_sendUserOperation",
      params: [userOp, config.ENTRY_POINT],
    });

    console.log("Pimlico HTTP status:", response.status);
    console.log("Pimlico raw response:", response.data);

    if (response.data.error) {
      throw new Error(JSON.stringify(response.data.error));
    }

    if (!response.data.result) {
      throw new Error("Pimlico returned no UserOperation hash");
    }

    return response.data.result;
  } catch (error) {
    console.error("Pimlico submission error:", error.message);
    throw new Error(`UserOperation submission failed: ${error.message}`);
  }
}

export async function getUserOperationStatus(userOpHash) {
  try {
    // Check whether the bundler knows this UserOperation
    const operationResponse = await axios.post(PIMLICO_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getUserOperationByHash",
      params: [userOpHash],
    });

    const userOperation = operationResponse.data.result;

    // Check whether the UserOperation has been included
    const receiptResponse = await axios.post(PIMLICO_URL, {
      jsonrpc: "2.0",
      id: 2,
      method: "eth_getUserOperationReceipt",
      params: [userOpHash],
    });

    const receipt = receiptResponse.data.result;

    let status = "not_found";

    if (receipt) {
      status = receipt.success ? "success" : "failed";
    } else if (userOperation) {
      status = "pending";
    }

    return {
      status,
      userOperation,
      receipt,
    };
  } catch (error) {
    const message = error.response?.data?.error?.message || error.message;

    throw new Error(`Failed to get UserOperation status: ${message}`);
  }
}


export async function getUserOperationGasPrice() {
  try {
    const response = await axios.post(PIMLICO_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "pimlico_getUserOperationGasPrice",
      params: [],
    });

    if (response.data.error || !response.data.result) {
      throw new Error(response.data.error?.message || "Pimlico returned no gas prices");
    }

    return response.data.result;
  } catch (error) {
    const message = error.response?.data?.error?.message || error.message;
    throw new Error(`Failed to retrieve UserOperation gas prices: ${message}`, { cause: error });
  }
}
