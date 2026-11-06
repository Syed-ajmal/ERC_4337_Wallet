import { ethers } from "ethers";
import config from "./config.js";

const provider = new ethers.JsonRpcProvider(config.SEPOLIA_RPC_URL);

export default provider;
