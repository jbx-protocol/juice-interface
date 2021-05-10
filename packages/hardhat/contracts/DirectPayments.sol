// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./interfaces/IAdministered.sol";
import "./interfaces/IJuicer.sol";
import "./interfaces/IProjects.sol";

contract DirectPayments {
    mapping(uint256 => DirectPaymentAddress[]) private addresses;
    mapping(uint256 => IJuiceTerminal) public juiceTerminals;
    mapping(address => address) public beneficiaries;
    /// @notice The projects contract.
    IProjects public immutable projects;
    IOperatorStore public immutable operatorStore;

    constructor(IProjects _projects, IOperatorStore _operatorStore) {
        projects = _projects;
        operatorStore = _operatorStore;
    }

    function allAddresses(uint256 _projectId)
        external
        view
        returns (DirectPaymentAddress[] memory)
    {
        return addresses[_projectId];
    }

    function deployAddress(
        uint256 _projectId,
        IJuiceTerminal _juiceTerminal,
        string memory _note
    ) external {
        if (juiceTerminals[_projectId] == IJuiceTerminal(0))
            juiceTerminals[_projectId] = _juiceTerminal;

        require(
            juiceTerminals[_projectId] == _juiceTerminal,
            "DirectPayment::deployAddress: WRONG_TERMINAL"
        );

        addresses[_projectId].push(
            new DirectPaymentAddress(this, _projectId, _note)
        );

        if (beneficiaries[msg.sender] == address(0))
            beneficiaries[msg.sender] = msg.sender;
    }

    function setJuiceTerminal(uint256 _projectId, IJuiceTerminal _juiceTerminal)
        external
    {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only a project owner or a specified operator can tap its funds.
        require(
            msg.sender == _owner ||
                // Allow level 2 operators.
                operatorStore.operatorLevel(_owner, _projectId, msg.sender) >=
                2,
            "Juicer::tap: UNAUTHORIZED"
        );

        juiceTerminals[_projectId] = _juiceTerminal;
    }

    function setBeneficiary(address _beneficiary) external {
        beneficiaries[msg.sender] = _beneficiary;
    }
}

contract DirectPaymentAddress {
    DirectPayments directPayments;
    uint256 projectId;
    string note;

    constructor(
        DirectPayments _directPayments,
        uint256 _projectId,
        string memory _note
    ) {
        directPayments = _directPayments;
        projectId = _projectId;
        note = _note;
    }

    receive() external payable {
        directPayments.juiceTerminals(projectId).pay{value: msg.value}(
            projectId,
            directPayments.beneficiaries(msg.sender),
            note
        );
    }
}
