// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./interfaces/IAdministered.sol";
import "./interfaces/IJuicer.sol";
import "./interfaces/IProjects.sol";

contract DirectPayments {
    mapping(uint256 => DirectPaymentAddress[]) private addresses;
    mapping(uint256 => IJuicer) public juicers;
    mapping(address => address) public beneficiaries;
    /// @notice The projects contract.
    IProjects public immutable projects;

    constructor(IProjects _projects) {
        projects = _projects;
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
        IJuicer _juicer,
        string memory _note
    ) external {
        if (juicers[_projectId] == IJuicer(0)) juicers[_projectId] = _juicer;

        require(
            juicers[_projectId] == _juicer,
            "DirectPayment::deployAddress: WRONG_JUICER"
        );

        addresses[_projectId].push(
            new DirectPaymentAddress(this, _projectId, _note)
        );

        if (beneficiaries[msg.sender] == address(0))
            beneficiaries[msg.sender] = msg.sender;
    }

    function setJuicer(uint256 _projectId, IJuicer _juicer) external {
        // Get a reference to the project owner.
        address _owner = projects.ownerOf(_projectId);

        // Only a project owner or a specified operator can tap its funds.
        require(
            msg.sender == _owner || _juicer.operators(_owner, msg.sender),
            "Juicer::tap: UNAUTHORIZED"
        );

        juicers[_projectId] = _juicer;
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
        directPayments.juicers(projectId).pay{value: msg.value}(
            projectId,
            directPayments.beneficiaries(msg.sender),
            note
        );
    }
}
