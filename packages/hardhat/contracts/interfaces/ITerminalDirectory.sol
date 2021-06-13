// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./IDirectPaymentAddress.sol";
import "./ITerminal.sol";
import "./IProjects.sol";

interface ITerminalDirectory {
    function addresses(uint256 _projectId)
        external
        view
        returns (IDirectPaymentAddress[] memory);

    function terminals(uint256 _projectId) external view returns (ITerminal);

    function beneficiaries(address account) external returns (address);

    function preferUnstakedTickets(address account) external returns (bool);

    function projects() external returns (IProjects);

    function operatorStore() external returns (IOperatorStore);

    function deployAddress(uint256 _projectId, string calldata _memo) external;

    function setTerminal(uint256 _projectId, ITerminal _terminal) external;

    function setPayerPreferences(
        address _beneficiary,
        bool _preferClaimedTickets
    ) external;
}
