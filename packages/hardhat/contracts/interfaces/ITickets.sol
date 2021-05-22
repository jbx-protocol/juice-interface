// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

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
        uint256 projectId,
        address holder,
        uint256 amount,
        ITicket ticket,
        bool preferConvertedTickets,
        address controller
    );

    event Redeem(
        uint256 projectId,
        address holder,
        uint256 amount,
        uint256 IOU,
        address controller
    );

    event Convert(
        address indexed account,
        uint256 indexed projectId,
        uint256 amount,
        address caller
    );

    event Initialize(
        address indexed controller,
        uint256 indexed projectId,
        address caller
    );

    event AddController(
        address indexed controller,
        uint256 indexed projectId,
        address caller
    );
    event RemoveController(
        address indexed controller,
        uint256 indexed projectId,
        address caller
    );

    event Lock(
        address indexed holder,
        uint256 projectId,
        uint256 amount,
        address caller
    );

    event Unlock(
        address indexed holder,
        uint256 projectId,
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

    function operatorStore() external view returns (IOperatorStore);

    function projects() external view returns (IProjects);

    function tickets(uint256 _projectId) external view returns (ITicket);

    function locked(address _holder, uint256 _projectId)
        external
        view
        returns (uint256);

    function IOU(address _holder, uint256 _projectId)
        external
        view
        returns (uint256);

    function isController(uint256 _projectId, address _controller)
        external
        view
        returns (bool);

    function totalSupply(uint256 _projectId) external view returns (uint256);

    function totalBalanceOf(address _holder, uint256 _projectId)
        external
        view
        returns (uint256 _result);

    function issue(
        uint256 _projectId,
        string memory _name,
        string memory _symbol
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
        uint256 _amount
    ) external;

    function convert(address _holder, uint256 _projectId) external;

    function initialize(address _controller, uint256 _projectId) external;

    function addController(address _controller, uint256 _projectId) external;

    function removeController(address _controller, uint256 _projectId) external;

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
