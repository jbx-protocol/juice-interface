// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library Operations {
    uint256 public constant Configure = 1;
    uint256 public constant PrintTickets = 2;
    uint256 public constant Redeem = 3;
    uint256 public constant Migrate = 4;
    uint256 public constant SetHandle = 5;
    uint256 public constant SetUri = 6;
    uint256 public constant ClaimHandle = 7;
    uint256 public constant Issue = 8;
    uint256 public constant Stake = 9;
    uint256 public constant Unstake = 10;
    uint256 public constant Transfer = 11;
    uint256 public constant Lock = 12;
    uint256 public constant SetPaymentMods = 13;
    uint256 public constant SetTicketMods = 14;
    uint256 public constant SetTerminal = 15;
}
