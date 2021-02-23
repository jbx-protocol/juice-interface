// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./ITicketStore.sol";
import "./IBudgetStore.sol";
import "./IBudgetController.sol";
import "./ITicketsController.sol";
import "./IOverflowYielder.sol";

interface IJuicer is IBudgetController, ITicketsController {
    event DistributeReserves(address minter, address issuer);

    event Migrate(IJuicer indexed to, uint256 _amount);

    event Collect(
        address indexed collecter,
        address indexed beneficiary,
        uint256 amount
    );

    function admin() external view returns (address);

    function budgetStore() external view returns (IBudgetStore);

    function ticketStore() external view returns (ITicketStore);

    function overflowYielder() external view returns (IOverflowYielder);

    function depositable() external view returns (uint256);

    function stash(address _by) external view returns (uint256);

    function fee() external view returns (uint256);

    function stablecoin() external view returns (IERC20);

    function bondingCurveRate() external view returns (uint256);

    function collect(address _beneficiary) external returns (uint256 amount);

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

    function setOverflowYielder(IOverflowYielder _newOverflowYielder) external;

    function migrate(IJuicer _to) external;

    function transferClaimable(
        address _issuer,
        uint256 _amount,
        IERC20 _token
    ) external;

    function setBondingCurveRate(uint256 _rate) external;
}
