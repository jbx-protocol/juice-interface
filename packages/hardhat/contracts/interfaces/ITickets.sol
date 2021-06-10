// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./IProjects.sol";
import "./IOperatorStore.sol";
import "./ITicket.sol";

interface ITickets {
    event Issue(
        uint256 indexed projectId,
        string name,
        string symbol,
        address caller
    );
    event Print(
        address indexed holder,
        uint256 indexed projectId,
        uint256 amount,
        bool convertedTickets,
        bool preferConvertedTickets,
        address controller
    );

    event Redeem(
        address indexed holder,
        uint256 indexed projectId,
        uint256 amount,
        uint256 IOUs,
        bool preferConverted,
        address controller
    );

    event Stake(
        address indexed holder,
        uint256 indexed projectId,
        uint256 amount,
        address caller
    );

    event Unstake(
        address indexed holder,
        uint256 indexed projectId,
        uint256 amount,
        address caller
    );

    event Lock(
        address indexed holder,
        uint256 indexed projectId,
        uint256 amount,
        address caller
    );

    event Unlock(
        address indexed holder,
        uint256 indexed projectId,
        uint256 amount,
        address caller
    );

    event Transfer(
        address indexed holder,
        uint256 indexed projectId,
        address indexed recipient,
        uint256 amount,
        address caller
    );

    function tickets(uint256 _projectId) external view returns (ITicket);

    function issuePermissionIndex() external view returns (uint256);

    function stakePermissionIndex() external view returns (uint256);

    function unstakePermissionIndex() external view returns (uint256);

    function transferPermissionIndex() external view returns (uint256);

    function lockPermissionIndex() external view returns (uint256);

    function locked(address _holder, uint256 _projectId)
        external
        view
        returns (uint256);

    function lockedBy(
        address _operator,
        address _holder,
        uint256 _projectId
    ) external view returns (uint256);

    function IOUBalance(address _holder, uint256 _projectId)
        external
        view
        returns (uint256);

    function IOUTotalSupply(uint256 _projectId) external view returns (uint256);

    function totalSupply(uint256 _projectId) external view returns (uint256);

    function totalBalanceOf(address _holder, uint256 _projectId)
        external
        view
        returns (uint256 _result);

    function issue(
        uint256 _projectId,
        string calldata _name,
        string calldata _symbol
    ) external;

    function print(
        address _holder,
        uint256 _projectId,
        uint256 _amount,
        bool _preferConvertedTickets
    ) external;

    function redeem(
        address _holder,
        uint256 _projectId,
        uint256 _amount,
        bool _preferConverted
    ) external;

    function stake(
        address _holder,
        uint256 _projectId,
        uint256 _amount
    ) external;

    function unstake(
        address _holder,
        uint256 _projectId,
        uint256 _amount
    ) external;

    function lock(
        address _holder,
        uint256 _projectId,
        uint256 _amount
    ) external;

    function unlock(
        address _holder,
        uint256 _projectId,
        uint256 _amount
    ) external;

    function transfer(
        address _holder,
        uint256 _projectId,
        uint256 _amount,
        address _recipient
    ) external;
}
