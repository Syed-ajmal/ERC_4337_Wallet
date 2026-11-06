// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import {SmartWallet} from "./SmartWallet.sol";

contract SmartWalletFactory {
    error Invalid_EntryPoint_Address();
    error Invalid_Address();

    address private immutable i_entryPoint;

    event WalletCreated(address indexed owner, address wallet, bytes32 salt);

    constructor(address entryPoint) {
        require(entryPoint != address(0), Invalid_EntryPoint_Address());
        i_entryPoint = entryPoint;
    }

    function createWallet(
        address walletOwner,
        bytes32 salt
    ) external returns (address walletAddress) {
        require(walletOwner != address(0), Invalid_Address());

        // if the wallet already exists, just return it (no revert)
        walletAddress = predictWalletAddress(walletOwner, salt);
        if (walletAddress.code.length > 0) return walletAddress;

        SmartWallet wallet = new SmartWallet{salt: salt}(
            i_entryPoint,
            walletOwner
        );
        walletAddress = address(wallet);

        emit WalletCreated(walletOwner, walletAddress, salt);
    }

    function predictWalletAddress(
        address walletOwner,
        bytes32 salt
    ) public view returns (address) {
        bytes32 initCodeHash = keccak256(
            abi.encodePacked(
                type(SmartWallet).creationCode,
                abi.encode(i_entryPoint, walletOwner)
            )
        );

        return Create2.computeAddress(salt, initCodeHash, address(this));
    }
}
