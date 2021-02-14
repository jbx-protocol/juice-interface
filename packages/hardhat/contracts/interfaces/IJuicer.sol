// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./ITicketStore.sol";
import "./IBudgetStore.sol";
import "./IBudgetController.sol";
import "./ITicketsController.sol";

interface IJuicer is IBudgetController, ITicketsController {
    event DistributeReserves(address minter, address issuer);

    function admin() external view returns (address);

    function budgetStore() external view returns (IBudgetStore);

    function ticketStore() external view returns (ITicketStore);

    function fee() external view returns (uint256);

    function claim() external returns (uint256 amount);

    function getReserves(address _issuer, bool _onlyDistributable)
        external
        view
        returns (
            uint256 issuerTickets,
            uint256 adminFees,
            uint256 beneficiaryDonations
        );

    function setAdmin(address _admin) external;

    function distributeReserves(address _issuer) external;
}
