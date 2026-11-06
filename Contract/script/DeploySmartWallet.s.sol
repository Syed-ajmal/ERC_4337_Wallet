// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {SmartWalletFactory} from "../src/SmartWalletFactory.sol";

contract DeploySmartWallet is Script {
    address constant ENTRY_POINT = 0x0000000071727De22E5E9d8BAf0edAc6f37da032;

    function run() external returns (SmartWalletFactory) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        SmartWalletFactory factory = new SmartWalletFactory(ENTRY_POINT);

        vm.stopBroadcast();

        return factory;
    }
}
