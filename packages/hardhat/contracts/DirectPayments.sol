// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./interfaces/IAdministered.sol";
import "./interfaces/IJuicer.sol";
import "./interfaces/IProjects.sol";

// Allows project owners to deploy proxy contracts that can fund them when receiving funds directly.
contract DirectPayments {
    // A list of contracts for each project ID that can receive funds directly.
    mapping(uint256 => DirectPaymentAddress[]) private addresses;

    // For each project ID, the juice terminal that the direct payment addresses are proxies for.
    mapping(uint256 => IJuiceTerminal) public juiceTerminals;

    // For each address, the address that will be used as the beneficiary of direct payments made.
    mapping(address => address) public beneficiaries;

    // For each address, the preference of whether ticket will be auto claimed as ERC20s when a payment is made.
    mapping(address => bool) public preferClaimedTickets;

    /// @notice The Projects contract which mints ERC-721's that represent project ownership and transfers.
    IProjects public immutable projects;

    /// @notice A contract storing operator assignments.
    IOperatorStore public immutable operatorStore;

    /** 
      @param _projects A Projects contract which mints ERC-721's that represent project ownership and transfers.
      @param _operatorStore A contract storing operator assignments.
    */
    constructor(IProjects _projects, IOperatorStore _operatorStore) {
        projects = _projects;
        operatorStore = _operatorStore;
    }

    /** 
      @notice A list of all direct payment addresses for the specified project ID.
      @param _projectId The ID of the project to get direct payment addresses for.
      @return A list of direct payment addresses for the specified project ID.
    */
    function allAddresses(uint256 _projectId)
        external
        view
        returns (DirectPaymentAddress[] memory)
    {
        return addresses[_projectId];
    }

    /** 
      @notice Allows a project to deploy a new direct payment address.
      @param _projectId The ID of the project to deploy a direct payment address for.
      @param _juiceTerminal The terminal to use for the direct payment. This can be updated later.
      @param _note The note to use for payments made through the new direct payment address.
    */
    function deployAddress(
        uint256 _projectId,
        IJuiceTerminal _juiceTerminal,
        string memory _note
    ) external {
        // Set the terminal for the project if it's not already set.
        if (juiceTerminals[_projectId] == IJuiceTerminal(0))
            juiceTerminals[_projectId] = _juiceTerminal;

        // The specified juice terminal must match the one stored.
        require(
            juiceTerminals[_projectId] == _juiceTerminal,
            "DirectPayment::deployAddress: WRONG_TERMINAL"
        );

        // Deploy the contract and push it to the list.
        addresses[_projectId].push(
            new DirectPaymentAddress(this, _projectId, _note)
        );
    }

    /** 
      @notice Update the juice terminal that payments to direct payment addresses will be forwarded for the specified project ID.
      @param _projectId The ID of the project to set a new terminal for.
      @param _juiceTerminal The new terminal to set.
    */
    function setJuiceTerminal(uint256 _projectId, IJuiceTerminal _juiceTerminal)
        external
    {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only a project owner or a specified operator of level 2 or greater can tap its funds.
        require(
            msg.sender == _owner ||
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) >=
                2,
            "Juicer::setJuiceTerminal: UNAUTHORIZED"
        );

        // Set the new terminal.
        juiceTerminals[_projectId] = _juiceTerminal;
    }

    /** 
      @notice Allows any address to pre set the beneficiary of their payments to any direct payment address.
      @param _beneficiary The beneficiary to set.
    */
    function setBeneficiary(address _beneficiary) external {
        beneficiaries[msg.sender] = _beneficiary;
    }

    /** 
      @notice Allows any address to pre set whether to prefer to auto claim ERC20 tickets when making a payment.
      @param _preference The preference to set.
    */
    function setPreferClaimedTickets(bool _preference) external {
        preferClaimedTickets[msg.sender] = _preference;
    }
}

contract DirectPaymentAddress {
    /// @notice The direct payment contract to use with this address.
    DirectPayments public directPayments;
    /// @notice The project ID to pay when this contract receives funds.
    uint256 public projectId;
    /// @notice The note to use when this contract receives funds.
    string public note;

    constructor(
        DirectPayments _directPayments,
        uint256 _projectId,
        string memory _note
    ) {
        directPayments = _directPayments;
        projectId = _projectId;
        note = _note;
    }

    // Receive funds and make a payment.
    receive() external payable {
        address _beneficiary = directPayments.beneficiaries(msg.sender);
        directPayments.juiceTerminals(projectId).pay{value: msg.value}(
            projectId,
            _beneficiary != address(0) ? _beneficiary : msg.sender,
            note,
            directPayments.preferClaimedTickets(msg.sender)
        );
    }
}
