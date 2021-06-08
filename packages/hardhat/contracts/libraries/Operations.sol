// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library Operations {
    uint256 public constant Deploy = 0;
    uint256 public constant PrintInitialTickets = 1;
    uint256 public constant Reconfigure = 2;
    uint256 public constant Redeem = 3;
    uint256 public constant Migrate = 4;
    uint256 public constant SetInfo = 5;
    uint256 public constant TransferHandle = 6;
    uint256 public constant ClaimHandle = 7;
    uint256 public constant Issue = 8;
    uint256 public constant Stake = 9;
    uint256 public constant Unstake = 10;
    uint256 public constant Transfer = 11;
    uint256 public constant SetPaymentMods = 12;
    uint256 public constant SetTicketMods = 13;
    uint256 public constant SetTerminal = 14;
}
