// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./ITicketStore.sol";
import "./IBudgetStore.sol";
import "./IBudgetController.sol";
import "./ITicketsController.sol";

interface IJuicer is IBudgetController, ITicketsController {
    function budgetStore() external returns (IBudgetStore);

    function ticketStore() external returns (ITicketStore);

    function setAdmin(address _admin) external;
}
