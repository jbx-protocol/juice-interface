// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./libraries/FundingCycle.sol";
import "./interfaces/IFundingCycles.sol";
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
        fundingCycle = _active(_projectId);
        if (fundingCycle.id > 0) return fundingCycle;
        fundingCycle = _standby(_projectId);
        if (fundingCycle.id > 0) return fundingCycle;
        fundingCycle = fundingCycles[latestId[_projectId]];
        return fundingCycle._nextUp();
    }

    // --- external transactions --- //

    constructor() {}

    /**
        @notice Configures the sustainability target and duration of the sender's current funding cycle if it hasn't yet received sustainments, or
        sets the properties of the funding cycle that will take effect once the current one expires.
        @dev The msg.sender is the project of the funding cycle.
        @param _projectId The ID of the project being configured. Send 0 to configure a new project.
        @param _target The cashflow target to set.
        @param _currency The currency of the target.
        @param _duration The duration to set, measured in seconds.
        @param _discountRate A number from 95-100 indicating how valuable a contribution to the current funding cycle is 
        compared to the project's previous funding cycle.
        If it's 100, each funding cycle will have equal weight.
        If it's 95, each Money pool will be 95% as valuable as the previous Money pool's weight.
        @param _bondingCurveRate The rate that describes the bonding curve at which overflow can be claimed.
        @param _reserved The percentage of this funding cycle's overflow to reserve for the project.
        @param _reconfigurationDelay The number of seconds that must pass for this configuration to become active.
        @param _fee The fee that this configuration incures.
        @return fundingCycle The funding cycle that was successfully configured.
    */
    function configure(
        uint256 _projectId,
        uint256 _target,
        uint256 _currency,
        uint256 _duration,
        uint256 _discountRate,
        uint256 _bondingCurveRate,
        uint256 _reserved,
        uint256 _reconfigurationDelay,
        uint256 _fee
    )
        external
        override
        onlyAdmin
        returns (FundingCycle.Data memory fundingCycle)
    {
        // Return's the project's editable funding cycle. Creates one if one doesn't already exists.
        FundingCycle.Data storage _fundingCycle = _ensureStandby(_projectId);

        // Set the properties of the funding cycle.
        _fundingCycle.target = _target;
        _fundingCycle.duration = _duration;
        _fundingCycle.currency = _currency;
        _fundingCycle.discountRate = _discountRate;
        _fundingCycle.bondingCurveRate = _bondingCurveRate;
        _fundingCycle.reserved = _reserved;
        _fundingCycle.fee = _fee;
        _fundingCycle.configured = block.timestamp;
        _fundingCycle.eligibleAfter = block.timestamp.add(
            _reconfigurationDelay
        );

        // Return the funding cycle.
        fundingCycle = _fundingCycle;
    }

    /** 
      @notice Tracks a project tapping its funds.
      @param _projectId The ID of the project being tapped.
      @param _amount The amount of being tapped.
      @param _currency The currency of the amount.
      @param _currentOverflow The current amount of overflow the project has.
      @param _ethPrice The current price of ETH.
      @return id The ID of the funding cycle that was tapped.
      @return convertedEthAmount The amount of eth tapped.
      @return feeAmount The amount of eth that should be charged as a fee.
    */
    function tap(
        uint256 _projectId,
        uint256 _amount,
        uint256 _currency,
        uint256 _currentOverflow,
        uint256 _ethPrice
    )
        external
        override
        onlyAdmin
        returns (
            uint256 id,
            uint256 convertedEthAmount,
            uint256 feeAmount
        )
    {
        // Get a reference to the funding cycle being tapped.
        FundingCycle.Data storage _fundingCycle = _ensureActive(_projectId);

        require(
            _currency == _fundingCycle.currency,
            "FundingCycle::tap: UNEXPECTED_CURRENCY"
        );

        // Tap the amount.
        convertedEthAmount = _fundingCycle._tap(
            _amount,
            _ethPrice,
            // The funding cycle can tap from the project's overflow.
            _currentOverflow
        );

        // The amount that should be charged as a fee for tapping.
        feeAmount = _fundingCycle.fee == 0
            ? 0
            : FullMath.mulDiv(convertedEthAmount, 1000, _fundingCycle.fee).sub(
                convertedEthAmount
            );

        // Return the ID of the funding cycle that was tapped.
        id = _fundingCycle.id;
    }

    // --- private transactions --- //

    /**
        @notice Returns the standby funding cycle for this project if it exists, otherwise putting one in standby appropriately.
        @param _projectId The ID of the project to which the funding cycle being looked for belongs.
        @return fundingCycle The resulting funding cycle.
    */
    function _ensureStandby(uint256 _projectId)
        private
        returns (FundingCycle.Data storage fundingCycle)
    {
        // Cannot update active funding cycle, check if there is a standby funding cycle.
        fundingCycle = _standby(_projectId);
        if (fundingCycle.id > 0) return fundingCycle;
        // Get the latest funding cycle.
        fundingCycle = fundingCycles[latestId[_projectId]];
        // If there's an active funding cycle, its end time should correspond to the start time of the new funding cycle.
        FundingCycle.Data memory _aFundingCycle = _active(_projectId);

        // Make sure the funding cycle is recurring.
        require(
            _aFundingCycle.id == 0 || _aFundingCycle.discountRate > 0,
            "FundingCycle::_ensureStandby: NON_RECURRING"
        );

        //Base a new funding cycle on the latest funding cycle if one exists.
        fundingCycle = _aFundingCycle.id > 0
            ? _init(
                _projectId,
                _aFundingCycle.start.add(_aFundingCycle.duration),
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
        if (fundingCycle.id > 0 && block.timestamp > fundingCycle.eligibleAfter)
            return fundingCycle;
        // No upcoming funding cycle found that is eligible to become active, clone the latest active funding cycle.
        // Use the standby funding cycle's previous funding cycle if it exists but doesn't meet activation criteria.
        fundingCycle = fundingCycles[
            fundingCycle.id > 0 ? fundingCycle.previous : latestId[_projectId]
        ];
        // Funding cycles with a discountRate of 0 are non-recurring.
        require(
            fundingCycle.id > 0 && fundingCycle.discountRate > 0,
            "FundingCycle::ensureActiveFundingCycle: NOT_FOUND"
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
        newFundingCycle.start = _start;
        newFundingCycle.tappedTotal = 0;
        newFundingCycle.tappedTarget = 0;
        latestId[_projectId] = count;

        if (_latestFundingCycle.id > 0) {
            newFundingCycle._basedOn(_latestFundingCycle);
        } else {
            newFundingCycle.projectId = _projectId;
            newFundingCycle.weight = 10E28;
            newFundingCycle.number = 1;
            newFundingCycle.previous = 0;
        }
    }

    /**
        @notice An project's editable funding cycle.
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
        @notice The currently active funding cycle for a project.
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
        if (
            fundingCycle.id == 0 ||
            fundingCycle._state() != FundingCycle.State.Active
        ) fundingCycle = fundingCycles[0];
    }
}
