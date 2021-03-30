// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface ITicketStore is IERC1155 {
    function timelocks(uint256 projectId, address _staker)
        external
        returns (uint256 expiry);

    function totalSupply(uint256 _projectId) external view returns (uint256);

    function isTimelockController(address _account)
        external
        view
        returns (bool);

    function print(
        address _for,
        uint256 _projectId,
        uint256 _amount
    ) external;

    function redeem(
        uint256 _projectId,
        address _holder,
        uint256 _amount
    ) external;

    function setTimelock(
        address _holder,
        uint256 _projectId,
        uint256 _expiry
    ) external;

    function setTimelockControllerStatus(address _controller, bool _status)
        external;
}
