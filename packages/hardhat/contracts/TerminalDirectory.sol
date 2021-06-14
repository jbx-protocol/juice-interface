// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./interfaces/IJuicer.sol";
import "./interfaces/ITerminalDirectory.sol";
import "./interfaces/IProjects.sol";
import "./libraries/Operations.sol";

import "./DirectPaymentAddress.sol";

// Allows project owners to deploy proxy contracts that can fund them when receiving funds directly.
contract TerminalDirectory is ITerminalDirectory {
    // A list of contracts for each project ID that can receive funds directly.
    mapping(uint256 => IDirectPaymentAddress[]) private _addresses;

    /// @notice The Projects contract which mints ERC-721's that represent project ownership and transfers.
    IProjects public immutable override projects;

    /// @notice For each project ID, the juice terminal that the direct payment addresses are proxies for.
    mapping(uint256 => ITerminal) public override terminals;

    /// @notice For each address, the address that will be used as the beneficiary of direct payments made.
    mapping(address => address) public override beneficiaries;

    /// @notice For each address, the preference of whether ticket will be auto claimed as ERC20s when a payment is made.
    mapping(address => bool) public override preferUnstakedTickets;

    /** 
      @notice A list of all direct payment addresses for the specified project ID.
      @param _projectId The ID of the project to get direct payment addresses for.
      @return A list of direct payment addresses for the specified project ID.
    */
    function addresses(uint256 _projectId)
        external
        view
        override
        returns (IDirectPaymentAddress[] memory)
    {
        return _addresses[_projectId];
    }

    /** 
      @param _projects A Projects contract which mints ERC-721's that represent project ownership and transfers.
    */
    constructor(IProjects _projects) {
        projects = _projects;
    }

    /** 
      @notice Allows anyone to deploy a new direct payment address for a project.
      @param _projectId The ID of the project to deploy a direct payment address for.
      @param _memo The note to use for payments made through the new direct payment address.
    */
    function deployAddress(uint256 _projectId, string calldata _memo)
        external
        override
    {
        require(
            _projectId > 0,
            "TerminalDirectory::deployAddress: ZERO_PROJECT"
        );

        // Deploy the contract and push it to the list.
        _addresses[_projectId].push(
            new DirectPaymentAddress(this, _projectId, _memo)
        );

        emit DeployAddress(_projectId, _memo, msg.sender);
    }

    /** 
      @notice Update the juice terminal that payments to direct payment addresses will be forwarded for the specified project ID.
      @param _projectId The ID of the project to set a new terminal for.
      @param _terminal The new terminal to set.
    */
    function setTerminal(uint256 _projectId, ITerminal _terminal)
        external
        override
    {
        require(
            projects.exists(_projectId),
            "TerminalDirectory::setTerminal: NOT_FOUND"
        );

        // Get a reference to the current terminal being used.
        ITerminal _currentTerminal = terminals[_projectId];

        // If the terminal is already set, nothing to do.
        if (_currentTerminal == _terminal) return;

        require(
            _currentTerminal == ITerminal(address(0)) ||
                msg.sender == address(_currentTerminal),
            "TerminalDirectory::setTerminal: UNAUTHORIZED"
        );

        // Set the new terminal.
        terminals[_projectId] = _terminal;

        emit SetTerminal(_projectId, _terminal, msg.sender);
    }

    /** 
      @notice Allows any address to pre set the beneficiary of their payments to any direct payment address,
      @notice any any address to pre set whether to prefer to auto claim ERC20 tickets when making a payment.
      @param _beneficiary The beneficiary to set.
      @param _preferClaimedTickets The preference to set.
    */
    function setPayerPreferences(
        address _beneficiary,
        bool _preferClaimedTickets
    ) external override {
        beneficiaries[msg.sender] = _beneficiary;
        preferUnstakedTickets[msg.sender] = _preferClaimedTickets;

        emit SetPayerPreferences(
            msg.sender,
            _beneficiary,
            _preferClaimedTickets
        );
    }
}
