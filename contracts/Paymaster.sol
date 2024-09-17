// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@account-abstraction/contracts/interfaces/IPaymaster.sol";

contract Paymaster is IPaymaster {
    function validatePaymasterUserOp(
        UserOperation calldata,
        bytes32,
        uint256
    ) external pure returns (bytes memory context, uint256 validationData) {
        /*---FOR PRODUCTION---*/
        // First 20 bytes : Paymaster Address
        // timestamp
        // signature
        // userOp.paymasterAndData

        /*---FOR NON-PRODUCTION---*/
        context = new bytes(0);
        validationData = 0;
    }

    function postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) external {}
}
