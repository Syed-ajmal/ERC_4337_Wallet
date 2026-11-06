import { Router } from "express";
import * as walletController from "../controllers/wallet.controller.js";

const walletRouter = Router();

/*
 * GET api/wallet/predit/:owner
 */
walletRouter.get("/predict/:owner", walletController.predictWallet);

/*
 * GET api/wallet/:address
 */
walletRouter.get("/:address", walletController.getWallet);

walletRouter.get("/:address/nonce", walletController.getNonce);

walletRouter.get("/:address/transactions", walletController.getTransactions);

export default walletRouter;
