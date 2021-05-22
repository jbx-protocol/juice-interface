// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library Operations {
    uint256 public constant Deploy = 0;
    uint256 public constant Reconfigure = 1;
    uint256 public constant Redeem = 2;
    uint256 public constant Migrate = 3;
    uint256 public constant SetInfo = 4;
    uint256 public constant TransferHandle = 5;
    uint256 public constant ClaimHandle = 6;
    uint256 public constant Issue = 7;
    uint256 public constant Convert = 8;
    uint256 public constant Transfer = 9;
    uint256 public constant SetPaymentMods = 10;
    uint256 public constant SetTicketMods = 11;
    uint256 public constant SetTerminal = 12;
}
