import { Router } from "express";
import * as userOperationController from "../controllers/userOperation.controller.js";

const userOperationRouter = Router();

userOperationRouter.post("/estimate", userOperationController.estimateGas);
userOperationRouter.get("/gas-price", userOperationController.getGasPrice);

userOperationRouter.post("/send", userOperationController.sendUserOp);

userOperationRouter.get("/:hash", userOperationController.getUserOpStatus);

export default userOperationRouter;
