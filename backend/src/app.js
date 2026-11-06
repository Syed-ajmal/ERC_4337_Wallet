import express from "express";
import morgan from "morgan";
import walletRouter from "./routes/wallet.routes.js";
import userOperationRouter from "./routes/userOperation.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/wallet", walletRouter);

app.use("/api/user-operation", userOperationRouter);

export default app;
