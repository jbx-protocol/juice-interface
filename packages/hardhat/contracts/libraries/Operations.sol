// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

library Operations {
    uint256 public constant Configure = 1;
    uint256 public constant PrintPreminedTickets = 2;
    uint256 public constant Redeem = 3;
    uint256 public constant Migrate = 4;
    uint256 public constant SetHandle = 5;
    uint256 public constant SetUri = 6;
    uint256 public constant ClaimHandle = 7;
    uint256 public constant RenewHandle = 8;
    uint256 public constant Issue = 9;
    uint256 public constant Stake = 10;
    uint256 public constant Unstake = 11;
    uint256 public constant Transfer = 12;
    uint256 public constant Lock = 13;
    uint256 public constant SetPayoutMods = 14;
    uint256 public constant SetTicketMods = 15;
    uint256 public constant SetTerminal = 16;
}
