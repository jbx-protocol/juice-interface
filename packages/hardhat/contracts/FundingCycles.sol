// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./libraries/FundingCycle.sol";
import "./interfaces/IFundingCycles.sol";
import "./interfaces/IPrices.sol";
import "./abstract/Administered.sol";

/** 
  @notice An immutable contract to manage funding cycle configurations.
*/
contract FundingCycles is Administered, IFundingCycles {
    using SafeMath for uint256;
    using FundingCycle for FundingCycle.Data;

    // --- private properties --- //

    // The official record of all funding cycles ever created.
    mapping(uint256 => FundingCycle.Data) private fundingCycles;

    // --- public properties --- //

    // The starting weight for each project's first funding cycle.
    uint256 public constant override BASE_WEIGHT = 1E22;

    /// @notice The latest FundingCycle ID for each project id.
    mapping(uint256 => uint256) public override latestId;

    /// @notice The total number of funding cycles created, which is used for issuing funding cycle IDs.
    /// @dev Funding cycles have IDs > 0.
    uint256 public override count = 0;

    // --- external views --- //

    /**
        @notice Get the funding cycle with the given ID.
        @param _fundingCycleId The ID of the funding cycle to get.
        @return _fundingCycle The funding cycle.
    */
    function get(uint256 _fundingCycleId)
        external
        view
        override
        returns (FundingCycle.Data memory)
    {
        require(
            _fundingCycleId > 0 && _fundingCycleId <= count,
            "FundingCycle::get: NOT_FOUND"
        );
        return fundingCycles[_fundingCycleId];
    }

    /**
        @notice The funding cycle that's next up for a project and not currently accepting payments.
        @param _projectId The ID of the project of the funding cycle being looked for.
        @return _fundingCycle The funding cycle.
    */
    function getQueued(uint256 _projectId)
        external
        view
        override
        returns (FundingCycle.Data memory)
    {
        FundingCycle.Data memory _sFundingCycle = _standby(_projectId);
        FundingCycle.Data memory _aFundingCycle = _active(_projectId);

        // If there are both active and standby funding cycle, the standby fundingCycle must be queued.
        if (_sFundingCycle.id > 0 && _aFundingCycle.id > 0)
            return _sFundingCycle;
        require(_aFundingCycle.id > 0, "FundingCycle::getQueued: NOT_FOUND");
        return _aFundingCycle._nextUp();
    }

    /**
        @notice The funding cycle that would be currently accepting sustainments for the provided project.
        @dev This runs very similar logic to `_ensureActive`.
        @param _projectId The ID of the project of the funding cycle being looked for.
        @return fundingCycle The funding cycle.
    */
    function getCurrent(uint256 _projectId)
        external
        view
        override
        returns (FundingCycle.Data memory fundingCycle)
    {
        require(
            latestId[_projectId] > 0,
            "FundingCycle::getCurrent: NOT_FOUND"
        );
        // Check if there is an active funding cycle.
        fundingCycle = _active(_projectId);
        if (fundingCycle.id > 0) return fundingCycle;
        // No active funding cycle found, check if there is a standby funding cycle.
        fundingCycle = _standby(_projectId);
        // Funding cycle if exists, has been approved by the previous funding cycle's ballot.
        if (fundingCycle.id > 0 && fundingCycle._isConfigurationApproved())
            return fundingCycle;
        // No upcoming funding cycle found that is eligible to become active, clone the latest active funding cycle.
        // Use the standby funding cycle's previous funding cycle if it exists but doesn't meet activation criteria.
        fundingCycle = fundingCycles[
            fundingCycle.id > 0 ? fundingCycle.previous : latestId[_projectId]
        ];
        // Funding cycles with a discountRate of 0 are non-recurring.
        require(
            fundingCycle.id > 0 && fundingCycle.discountRate > 0,
            "FundingCycle::getCurrent: NOT_FOUND"
        );
        return fundingCycle._nextUp();
    }

    // --- external transactions --- //

    constructor() {}

    /**
        @notice Configures the sustainability target and duration of the sender's current funding cycle if it hasn't yet received sustainments, or
        sets the properties of the funding cycle that will take effect once the current one expires.
        @dev The msg.sender is the project of the funding cycle.
        @param _projectId The ID of the project being reconfigured. 
        @param _target The amount that the project wants to receive in this funding stage. Sent as a wad.
        @param _currency The currency of the `target`. Send 0 for ETH or 1 for USD.
        @param _duration The duration of the funding stage for which the `target` amount is needed. Measured in seconds.
        @param _discountRate A number from 0-1000 indicating how valuable a contribution to this funding stage is compared to the project's previous funding stage.
        If it's 1000, each funding stage will have equal weight.
        If the number is 900, a contribution to the next funding stage will only give you 90% of tickets given to a contribution of the same amount during the current funding stage.
        If the number is 0, an non-recurring funding stage will get made.
        @param _fee The fee that this configuration will incure when tapping.
        @param _ballot The new ballot that will be used to approve subsequent reconfigurations.
        @param _metadata Data to store with the funding cycle. 
        @param _configureActiveFundingCycle If the active funding cycle should be configurable.
        @return The funding cycle that was successfully configured.
    */
    function configure(
        uint256 _projectId,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        uint256 _fee,
        IFundingCycleBallot _ballot,
        uint256 _metadata,
        bool _configureActiveFundingCycle
    ) external override onlyAdmin returns (FundingCycle.Data memory) {
        // Target must be greater than 0.
        require(_target > 0, "FundingCycles::reconfigure: BAD_TARGET");

        // Duration must be greater than 0.
        require(_duration > 0, "FundingCycles::reconfigure: BAD_DURATION");

        // Return's the project's editable funding cycle. Creates one if one doesn't already exists.
        FundingCycle.Data storage _fundingCycle =
            _ensureConfigurable(_projectId, _configureActiveFundingCycle);

        // The `discountRate` token must be between 0% and 100%.
        require(
            _discountRate >= 0 && _discountRate <= 1000,
            "FundingCycles::deploy: BAD_DISCOUNT_RATE"
        );

        // Set the properties of the funding cycle.
        _fundingCycle.target = _target;
        _fundingCycle.duration = uint32(_duration);
        _fundingCycle.currency = uint8(_currency);
        _fundingCycle.discountRate = uint16(_discountRate);
        _fundingCycle.metadata = _metadata;
        _fundingCycle.fee = uint16(_fee);
        _fundingCycle.configured = uint48(block.timestamp);
        _fundingCycle.ballot = _ballot;

        // If there isn't a current ballot inherited, set the current ballot to the provided one.
        if (_fundingCycle.currentBallot == IFundingCycleBallot(0))
            _fundingCycle.currentBallot = _ballot;

        // Return the funding cycle.
        return _fundingCycle;
    }

    /** 
      @notice Tracks a project tapping its funds.
      @param _projectId The ID of the project being tapped.
      @param _amount The amount of being tapped.
        @return fundingCycle The funding cycle that was successfully tapped.
    */
    function tap(uint256 _projectId, uint256 _amount)
        external
        override
        onlyAdmin
        returns (FundingCycle.Data memory)
    {
        // Get a reference to the funding cycle being tapped.
        FundingCycle.Data storage _fundingCycle = _ensureActive(_projectId);

        // Tap the amount.
        _fundingCycle._tap(_amount);

        return _fundingCycle;
    }

    // --- private transactions --- //

    /**
        @notice Returns the configurable funding cycle for this project if it exists, otherwise making one appropriately.
        @param _projectId The ID of the project to which the funding cycle being looked for belongs.
        @param _configureActiveFundingCycle If the active funding cycle should be configurable.
        @return fundingCycle The resulting funding cycle.
    */
    function _ensureConfigurable(
        uint256 _projectId,
        bool _configureActiveFundingCycle
    ) private returns (FundingCycle.Data storage fundingCycle) {
        // Cannot update active funding cycle, check if there is a standby funding cycle.
        fundingCycle = _standby(_projectId);
        if (fundingCycle.id > 0) return fundingCycle;
        // Get the latest funding cycle.
        fundingCycle = fundingCycles[latestId[_projectId]];
        // If there's an active funding cycle, its end time should correspond to the start time of the new funding cycle.
        FundingCycle.Data storage _aFundingCycle = _active(_projectId);

        // Return the active funding cycle if allowed.
        if (_aFundingCycle.id > 0 && _configureActiveFundingCycle)
            return _aFundingCycle;

        // Make sure the funding cycle is recurring.
        require(
            _aFundingCycle.id == 0 || _aFundingCycle.discountRate > 0,
            "FundingCycle::_configureActiveFundingCycle: NON_RECURRING"
        );

        //Base a new funding cycle on the latest funding cycle if one exists.
        fundingCycle = _aFundingCycle.id > 0
            ? _init(
                _projectId,
                uint256(_aFundingCycle.start).add(_aFundingCycle.duration),
                fundingCycle
            )
            : _init(_projectId, block.timestamp, fundingCycle);
    }

    /**
        @notice Returns the active funding cycle for this project if it exists, otherwise activating one appropriately.
        @param _projectId The ID of the project to which the funding cycle being looked for belongs.
        @return fundingCycle The resulting funding cycle.
    */
    function _ensureActive(uint256 _projectId)
        private
        returns (FundingCycle.Data storage fundingCycle)
    {
        // Check if there is an active funding cycle.
        fundingCycle = _active(_projectId);
        if (fundingCycle.id > 0) return fundingCycle;
        // No active funding cycle found, check if there is a standby funding cycle.
        fundingCycle = _standby(_projectId);
        // Funding cycle if exists, has been in standby for enough time to become eligible.
        if (
            fundingCycle.id > 0 &&
            // Funding cycle if exists, has been approved by the previous funding cycle's ballot.
            fundingCycle._isConfigurationApproved()
        ) return fundingCycle;
        // No upcoming funding cycle found that is eligible to become active, clone the latest active funding cycle.
        // Use the standby funding cycle's previous funding cycle if it exists but doesn't meet activation criteria.
        fundingCycle = fundingCycles[
            fundingCycle.id > 0 ? fundingCycle.previous : latestId[_projectId]
        ];
        // Funding cycles with a discountRate of 0 are non-recurring.
        require(
            fundingCycle.id > 0 && fundingCycle.discountRate > 0,
            "FundingCycle::_ensureActive: NOT_FOUND"
        );
        // Use a start date that's a multiple of the duration.
        // This creates the effect that there have been scheduled funding cycles ever since the `latest`, even if `latest` is a long time in the past.
        fundingCycle = _init(
            _projectId,
            fundingCycle._determineNextStart(),
            fundingCycle
        );
    }

    /**
        @notice Initializes a funding cycle to be sustained for the sending address.
        @param _projectId The ID of the project to which the funding cycle being initialized belongs.
        @param _start The start time for the new funding cycle.
        @param _latestFundingCycle The latest funding cycle for the project.
        @return newFundingCycle The initialized funding cycle.
    */
    function _init(
        uint256 _projectId,
        uint256 _start,
        FundingCycle.Data storage _latestFundingCycle
    ) private returns (FundingCycle.Data storage newFundingCycle) {
        count++;
        newFundingCycle = fundingCycles[count];
        newFundingCycle.id = count;
        newFundingCycle.start = uint48(_start);
        latestId[_projectId] = count;

        if (_latestFundingCycle.id > 0) {
            newFundingCycle._basedOn(_latestFundingCycle);
        } else {
            newFundingCycle.projectId = _projectId;
            newFundingCycle.weight = BASE_WEIGHT;
            newFundingCycle.number = 1;
        }
    }

    /**
        @notice An project's funding cycle that hasn't yet started.
        @param _projectId The ID of project to which the funding cycle being looked for belongs.
        @return fundingCycle The standby funding cycle.
    */
    function _standby(uint256 _projectId)
        private
        view
        returns (FundingCycle.Data storage fundingCycle)
    {
        fundingCycle = fundingCycles[latestId[_projectId]];
        if (fundingCycle.id == 0) return fundingCycles[0];
        // There is no upcoming funding cycle if the latest funding cycle is not upcoming
        if (fundingCycle._state() != FundingCycle.State.Standby)
            return fundingCycles[0];
    }

    /**
        @notice The funding cycle for a project that has started and hasn't yet expired.
        @param _projectId The ID of the project to which the funding cycle being looked for belongs.
        @return fundingCycle active funding cycle.
    */
    function _active(uint256 _projectId)
        private
        view
        returns (FundingCycle.Data storage fundingCycle)
    {
        fundingCycle = fundingCycles[latestId[_projectId]];
        if (fundingCycle.id == 0) return fundingCycles[0];
        // An Active funding cycle must be either the latest funding cycle or the
        // one immediately before it.
        if (fundingCycle._state() == FundingCycle.State.Active)
            return fundingCycle;
        fundingCycle = fundingCycles[fundingCycle.previous];

        // Return the 0th empty cycle if the previous doesn't exist or if its not active.
        if (
            fundingCycle.id == 0 ||
            fundingCycle._state() != FundingCycle.State.Active
        ) fundingCycle = fundingCycles[0];
    }
}
