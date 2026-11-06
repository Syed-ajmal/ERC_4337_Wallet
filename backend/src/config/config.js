import dotenv from "dotenv";

dotenv.config();

if (!process.env.SEPOLIA_RPC_URL) {
  throw new Error("SEPOLIA_RPC_URL is not defined in environment variable");
}

if (!process.env.PIMLICO_API_KEY) {
  throw new Error("PIMLICO_API_KEY is not defined in environment variable");
}

if (!process.env.CHAIN_ID) {
  throw new Error("CHAIN_ID is not defined in environment variable");
}

if (!process.env.FACTORY_CA) {
  throw new Error("FACTORY_CA is not defined in environment variable");
}

if (!process.env.ENTRY_POINT) {
  throw new Error("ENTRY_POINT is not defined in environment variable");
}

if (!process.env.WALLET_SALT) {
  throw new Error("WALLET_SALT is not defined in environment variable");
}

if (!process.env.ETHERSCAN_API_KEY) {
  throw new Error("ETHERSCAN_API_KEY is not defined in environment variable");
}

const config = {
  SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL,
  PIMLICO_API_KEY: process.env.PIMLICO_API_KEY,
  CHAIN_ID: process.env.CHAIN_ID,
  FACTORY_CA: process.env.FACTORY_CA,
  WALLET_SALT: process.env.WALLET_SALT,
  ENTRY_POINT: process.env.ENTRY_POINT,
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
};

export default config;
