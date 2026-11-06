import { ethers } from "ethers";
import {
  predictWalletAddress,
  getWalletDetails,
  getWalletNonce,
  getWalletTransactions,
} from "../services/wallet.service.js";
import config from "../config/config.js";

export async function predictWallet(req, res) {
  try {
    const { owner } = req.params;

    if (!ethers.isAddress(owner)) {
      res.status(400).json({
        success: false,
        message: "Invalid owner Address",
      });
    }

    const checksumOwner = ethers.getAddress(owner);

    const smartWalletAddress = await predictWalletAddress(checksumOwner);

    return res.status(200).json({
      success: true,
      data: {
        owner: checksumOwner,
        smartWalletAddress,
        salt: config.WALLET_SALT,
      },
    });
  } catch (error) {
    console.error("Wallet prediction error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to predict Smart Wallet address",
    });
  }
}

export async function getWallet(req, res) {
  try {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({
        success: false,
        message: "Invalid wallet address",
      });
    }

    const walletDetails = await getWalletDetails(address);

    return res.status(200).json({
      success: true,
      data: walletDetails,
    });
  } catch (error) {
    console.error("Get wallet error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve wallet details",
    });
  }
}

export async function getNonce(req, res) {
  try {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({
        success: false,
        message: "Invalid wallet address",
      });
    }

    const nonce = await getWalletNonce(address);

    return res.status(200).json({
      success: true,
      data: {
        walletAddress: ethers.getAddress(address),
        nonce,
      },
    });
  } catch (error) {
    console.error("Get nonce error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve wallet nonce",
    });
  }
}

export async function getTransactions(req, res) {
  try {
    const { address } = req.params;

    const page = Number(req.query.page) || 1;
    const offset = Number(req.query.offset) || 10;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({
        success: false,
        message: "Invalid wallet address",
      });
    }

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(offset) ||
      offset < 1 ||
      offset > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
      });
    }

    const data = await getWalletTransactions(address, page, offset);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
