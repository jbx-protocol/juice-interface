// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import "./IJuicer.sol";

interface IFundingCycleBallot {
    event Vote(
        address voter,
        IERC1155 token,
        uint256 projectId,
        uint256 budgetId,
        uint256 configured,
        bool yay,
        uint256 amount
    );

    function RECONFIGURATION_VOTING_PERIOD() external view returns (uint256);

    function juicer() external view returns (IJuicer);

    function votes(
        uint256 _budgetId,
        uint256 _configured,
        bool _yay
    ) external returns (uint256);

    function votesByAddress(
        uint256 _budgetId,
        uint256 _configured,
        address _voter
    ) external returns (uint256);

    function isApproved(uint256 _budgetId, uint256 _configured)
        external
        view
        returns (bool);

    function vote(
        uint256 _budgetId,
        bool _yay,
        uint256 _count
    ) external;
}
