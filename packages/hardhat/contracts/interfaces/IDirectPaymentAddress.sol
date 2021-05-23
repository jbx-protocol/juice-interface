// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./IDirectPayments.sol";
import "./IJuiceTerminal.sol";

interface IDirectPaymentAddress {
    function directPayments() external returns (IDirectPayments);

    function projectId() external returns (uint256);

    function note() external returns (string memory);
}
