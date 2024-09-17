// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Account is IAccount {
    uint public count;
    address public owner;

    constructor(address _owner) {
        count = 0;
        owner = _owner;
    }

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32,
        uint256
    ) external view returns (uint256 validationData) {
        address recovered = ECDSA.recover(
            ECDSA.toEthSignedMessageHash(keccak256("wee")),
            userOp.signature
        );
        return owner == recovered ? 0 : 1;
    }

    function execute() external {
        count++;
    }
}

contract AccountFactory {
    function createAccount(address owner) external returns (address) {
        Account acc = new Account(owner);
        return address(acc);
    }
}
