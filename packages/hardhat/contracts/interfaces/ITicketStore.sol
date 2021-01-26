// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IStore.sol";
import "./ITickets.sol";

interface ITicketStore is IStore {
    function tickets(address _issuer) external view returns (ITickets);

    function claimable(address _issuer, IERC20 _ticket)
        external
        view
        returns (uint256);

    function swappable(
        address _issuer,
        IERC20 _from,
        IERC20 _to
    ) external view returns (uint256);

    function getClaimableRewardsAmount(
        address _holder,
        uint256 _amount,
        address _issuer
    ) external view returns (uint256);

    function getTicketValue(address _issuer) external view returns (uint256);

    function getTicketBalance(address _issuer, address _holder)
        external
        view
        returns (uint256);

    function getTicketSupply(address _issuer) external view returns (uint256);

    function getTicketRewardToken(address _issuer)
        external
        view
        returns (IERC20);

    function saveTickets(address _issuer, ITickets _tickets) external;

    function addClaimableRewards(
        address _issuer,
        IERC20 _token,
        uint256 _amount
    ) external;

    function subtractClaimableRewards(
        address _issuer,
        IERC20 _token,
        uint256 _amount
    ) external;

    function addSwappable(
        address _issuer,
        IERC20 _from,
        uint256 _amount,
        IERC20 _to
    ) external;

    function subtractSwappable(
        address _issuer,
        IERC20 _from,
        uint256 _amount,
        IERC20 _to
    ) external;
}
