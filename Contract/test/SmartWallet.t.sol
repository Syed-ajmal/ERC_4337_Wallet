// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {SmartWallet} from "../src/SmartWallet.sol";
import {
    PackedUserOperation
} from "@openzeppelin/contracts/interfaces/IERC4337.sol";
import {
    MessageHashUtils
} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract NumberBox {
    uint256 public number;
    function setNumber(uint256 n) external {
        number = n;
    }
}

contract SmartWalletTest is Test {
    SmartWallet wallet;
    NumberBox box;

    address entryPoint = makeAddr("entryPoint");
    address stranger = makeAddr("stranger");
    address owner;
    uint256 ownerKey;

    function setUp() public {
        (owner, ownerKey) = makeAddrAndKey("owner");
        box = new NumberBox();

        vm.prank(owner); // owner becomes msg.sender in the constructor
        wallet = new SmartWallet(entryPoint, owner);

        vm.deal(address(wallet), 10 ether); // wallet needs ETH for transfers and prefund
    }

    /*//////////////////////////////////////////////////////////////
                            HEALPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    // minimal UserOp with only the fields we need
    function _userOp(
        bytes memory sig
    ) internal view returns (PackedUserOperation memory op) {
        op.sender = address(wallet);
        op.signature = sig;
    }

    // signs the hash exactly like the wallet expects
    function _sign(
        uint256 pk,
        bytes32 userOpHash
    ) internal pure returns (bytes memory) {
        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(userOpHash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, digest);
        return abi.encodePacked(r, s, v); // order: r, s, v
    }

    /*//////////////////////////////////////////////////////////////
                            TESTING FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function test_ConstructorSetsState() public view {
        assertEq(wallet.getEntryPoint(), entryPoint);
        assertEq(wallet.owner(), owner);
    }
    function test_OwnerCanExecute() public {
        vm.prank(owner);
        wallet.execute(address(box), 0, abi.encodeCall(box.setNumber, (42)));
        assertEq(box.number(), 42);
    }

    function test_EntryPointCanExecute() public {
        vm.prank(entryPoint);
        wallet.execute(address(box), 0, abi.encodeCall(box.setNumber, (7)));
        assertEq(box.number(), 7);
    }

    function test_StrangercallingRever() public {
        vm.prank(stranger);
        vm.expectRevert(SmartWallet.Account__NotFromEntryPointOrOwner.selector);
        wallet.execute(address(box), 0, abi.encodeCall(box.setNumber, (42)));
    }

    function test_RevertWhen_DestIsZero() public {
        vm.prank(owner);
        vm.expectRevert(SmartWallet.Invalid_Address.selector);
        wallet.execute(address(0), 0, "");
    }

    function test_ExecuteSendsEth() public {
        vm.prank(owner);
        wallet.execute(stranger, 1 ether, "");

        assertEq(stranger.balance, 1 ether);
        assertEq(address(wallet).balance, 9 ether);
    }

    function test_RevertWhen_ValidateNotFromEntryPoint() public {
        PackedUserOperation memory op = _userOp("");
        vm.prank(owner); // even the owner is blocked
        vm.expectRevert(SmartWallet.Account__NotFromEntryPoint.selector);
        wallet.validateUserOp(op, bytes32(0), 0);
    }

    function test_ValidSignatureReturnsZero() public {
        bytes32 h = keccak256("userOp"); // fake hash, any bytes32 works
        PackedUserOperation memory op = _userOp(_sign(ownerKey, h));

        vm.prank(entryPoint);
        uint256 result = wallet.validateUserOp(op, h, 0); // 0 = no prefund needed
        assertEq(result, 0);
    }
}
