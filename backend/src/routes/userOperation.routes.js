import { Router } from "express";
import * as userOperationController from "../controllers/userOperation.controller.js";

const userOperationRouter = Router();

userOperationRouter.post("/estimate", userOperationController.estimateGas);

userOperationRouter.post("/send", userOperationController.sendUserOp);

userOperationRouter.get("/:hash", userOperationController.getUserOpStatus);

export default userOperationRouter;
