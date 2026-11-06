import { ethers } from "ethers";
import {
  estimateUserOperationGas,
  sendUserOperation,
  getUserOperationStatus,
  getUserOperationGasPrice,
} from "../services/userOperation.service.js";

export async function estimateGas(req, res) {
  try {
    const { userOp } = req.body;

    if (!userOp || !userOp.sender || !userOp.callData) {
      return res.status(400).json({
        success: false,
        message: "Invalid UserOperation",
      });
    }

    const gasEstimate = await estimateUserOperationGas(userOp);

    return res.status(200).json({
      success: true,
      data: gasEstimate,
    });
  } catch (error) {
    console.error("Gas estimation error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function sendUserOp(req, res) {
  try {
    const { userOp } = req.body;

    if (!userOp || !userOp.sender || !userOp.callData || !userOp.signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid UserOperation",
      });
    }

    const userOpHash = await sendUserOperation(userOp);

    console.log("Returned UserOperation hash:", userOpHash);

    if (!userOpHash) {
      throw new Error("Pimlico did not return a UserOperation hash");
    }

    return res.status(200).json({
      success: true,
      data: {
        userOpHash,
      },
    });
  } catch (error) {
    console.error("Send UserOperation error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getUserOpStatus(req, res) {
  try {
    const { hash } = req.params;

    if (!ethers.isHexString(hash, 32)) {
      return res.status(400).json({
        success: false,
        message: "Invalid UserOperation hash",
      });
    }

    const result = await getUserOperationStatus(hash);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get UserOperation status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve UserOperation status",
    });
  }
}


export async function getGasPrice(req, res) {
  try {
    const gasPrices = await getUserOperationGasPrice();
    return res.status(200).json({ success: true, data: gasPrices });
  } catch (error) {
    console.error("UserOperation gas price error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to retrieve UserOperation gas prices" });
  }
}
