// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {
    IAccount,
    PackedUserOperation,
    IEntryPoint
} from "@openzeppelin/contracts/interfaces/IERC4337.sol";
import {
    MessageHashUtils
} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SmartWallet is IAccount, Ownable {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error Account__NotFromEntryPoint();
    error Account__NotFromEntryPointOrOwner();
    error Account__PayPreFundFailed();
    error Account__CallFailed(bytes);
    error Invalid_Address();

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    IEntryPoint private immutable i_entryPoint;

    /*//////////////////////////////////////////////////////////////
                            MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier requireFromEntryPoint() {
        if (msg.sender != address(i_entryPoint)) {
            revert Account__NotFromEntryPoint();
        }
        _;
    }

    modifier requireFromEntryPointOrOwner() {
        if (msg.sender != address(i_entryPoint) && msg.sender != owner()) {
            revert Account__NotFromEntryPointOrOwner();
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                            FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    constructor(
        address entryPoint,
        address initialOwner
    ) Ownable(initialOwner) {
        require(entryPoint != address(0), Invalid_Address());
        require(initialOwner != address(0), Invalid_Address());
        i_entryPoint = IEntryPoint(entryPoint);
    }

    receive() external payable {}

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function validateUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external requireFromEntryPoint returns (uint256 validationData) {
        validationData = _validateSignature(userOp, userOpHash);

        _payPrefund(missingAccountFunds);
    }

    function execute(
        address dest,
        uint256 value,
        bytes calldata functionData
    ) external requireFromEntryPointOrOwner {
        require(dest != address(0), Invalid_Address());
        (bool success, bytes memory result) = dest.call{value: value}(
            functionData
        );
        if (!success) {
            revert Account__CallFailed(result);
        }
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function _validateSignature(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash
    ) internal view returns (uint256) {
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(
            userOpHash
        );

        (address signer, ECDSA.RecoverError recoverError, ) = ECDSA.tryRecover(
            ethSignedMessageHash,
            userOp.signature
        );

        if (recoverError != ECDSA.RecoverError.NoError || signer != owner()) {
            return 1; // SIG_VALIDATION_FAILED
        }

        return 0; // SIG_VALIDATION_SUCCESS
    }

    function _payPrefund(uint256 missingAccountFunds) internal {
        if (missingAccountFunds == 0) return;

        (bool success, ) = payable(msg.sender).call{
            value: missingAccountFunds,
            gas: type(uint256).max
        }("");
        if (!success) {
            revert Account__PayPreFundFailed();
        }
    }

    /*//////////////////////////////////////////////////////////////
                                GETTERS
    //////////////////////////////////////////////////////////////*/
    function getEntryPoint() external view returns (address) {
        return address(i_entryPoint);
    }
}
