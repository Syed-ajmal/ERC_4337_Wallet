// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {SmartWalletFactory} from "../src/SmartWalletFactory.sol";
import {SmartWallet} from "../src/SmartWallet.sol";

contract SmartWalletFactoryTest is Test {
    SmartWalletFactory private factory;
    address private entryPoint;
    address private walletOwner;

    function setUp() public {
        entryPoint = makeAddr("entryPoint");
        walletOwner = makeAddr("walletOwner");
        factory = new SmartWalletFactory(entryPoint);
    }

    function testPredictedAddressMatchesDeployedWalletAddress() public {
        bytes32 salt = keccak256("first wallet");

        address predictedAddress = factory.predictWalletAddress(
            walletOwner,
            salt
        );
        address deployedAddress = factory.createWallet(walletOwner, salt);

        assertEq(deployedAddress, predictedAddress);
        assertEq(SmartWallet(payable(deployedAddress)).owner(), walletOwner);
    }
}
