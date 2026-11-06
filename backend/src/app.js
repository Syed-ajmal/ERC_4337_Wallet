import express from "express";
import morgan from "morgan";
import cors from "cors";

import walletRouter from "./routes/wallet.routes.js";
import userOperationRouter from "./routes/userOperation.routes.js";

const app = express();

app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "ERC-4337 wallet API is running" });
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/wallet", walletRouter);
app.use("/api/user-operation", userOperationRouter);

export default app;
