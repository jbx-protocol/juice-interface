// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITicketsController {
    event IssueTickets(
        address issuer,
        string name,
        string symbol,
        IERC20 rewardToken
    );

    event Redeem(
        address indexed holder,
        address beneficiary,
        uint256 redeemedAmount,
        uint256 rewardAmount
    );

    event Migrate(address indexed to);

    event MintReservedTickets(address minter, address issuer);

    event Swap(
        address issuer,
        IERC20 from,
        uint256 amount,
        IERC20 to,
        uint256 swappedAmount
    );

    function getReservedTickets(address _issuer)
        external
        view
        returns (
            uint256 _issuers,
            uint256 _beneficiaries,
            uint256 _admins
        );

    function issueTickets(
        string calldata _name,
        string calldata _symbol,
        IERC20 _rewardToken
    ) external;

    function redeem(
        address _issuer,
        uint256 _amount,
        uint256 _minRewardAmount,
        address _beneficiary
    ) external returns (IERC20 _rewardToken);

    function swap(
        address _issuer,
        IERC20 _from,
        uint256 _amount,
        IERC20 _to,
        uint256 _minSwappedAmount
    ) external;

    function mintReservedTickets(address _issuer) external;

    function addToMigrationAllowList(address _contract) external;

    function migrate(address _to) external;
}
