// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@paulrberg/contracts/math/PRBMath.sol";

import "./interfaces/IFundingCycles.sol";
import "./interfaces/IPrices.sol";
import "./abstract/TerminalUtility.sol";

/** 
  @notice Manage funding cycle configurations, accounting, and scheduling.
*/
contract FundingCycles is TerminalUtility, IFundingCycles {
    // --- private stored contants --- //

    // The number of seconds in a day.
    uint256 private constant SECONDS_IN_DAY = 86400;

    // --- private stored properties --- //

    // Stores the reconfiguration properties of each funding cycle, packed into one storage slot.
    mapping(uint256 => uint256) private _packedConfigurationPropertiesOf;

    // Stores the properties added by the mechanism to manage and schedule each funding cycle, packed into one storage slot.
    mapping(uint256 => uint256) private _packedIntrinsicPropertiesOf;

    // Stores the metadata for each funding cycle, packed into one storage slot.
    mapping(uint256 => uint256) private _metadataOf;

    // Stores the amount that each funding cycle can tap funding cycle.
    mapping(uint256 => uint256) private _targetOf;

    // Stores the amount that has been tapped within each funding cycle.
    mapping(uint256 => uint256) private _tappedOf;

    // --- public stored constants --- //

    /// @notice The weight used for each project's first funding cycle.
    uint256 public constant override BASE_WEIGHT = 1E24;

    /// @notice The maximum value that a cycle limit can be set to.
    uint256 public constant override MAX_CYCLE_LIMIT = 32;

    // --- public stored properties --- //

    /// @notice The ID of the latest funding cycle for each project.
    mapping(uint256 => uint256) public override latestIdOf;

    /// @notice The total number of funding cycles created, which is used for issuing funding cycle IDs.
    /// @dev Funding cycles have IDs > 0.
    uint256 public override count = 0;

    // --- external views --- //

    /**
        @notice 
        Get the funding cycle with the given ID.

        @param _fundingCycleId The ID of the funding cycle to get.

        @return _fundingCycle The funding cycle.
    */
    function get(uint256 _fundingCycleId)
        external
        view
        override
        returns (FundingCycle memory)
    {
        // The funding cycle should exist.
        require(
            _fundingCycleId > 0 && _fundingCycleId <= count,
            "FundingCycle::get: NOT_FOUND"
        );

        return _getStruct(_fundingCycleId);
    }

    /**
        @notice 
        The funding cycle that's next up for a project, and therefor not currently accepting payments.

        @dev 
        This runs roughly similar logic to `_configurable`.

        @param _projectId The ID of the project being looked through.

        @return _fundingCycle The queued funding cycle.
    */
    function queuedOf(uint256 _projectId)
        external
        view
        override
        returns (FundingCycle memory)
    {
        // The project must have funding cycles.
        if (latestIdOf[_projectId] == 0) return _getStruct(0);

        // Get a reference to the standby funding cycle.
        uint256 _fundingCycleId = _standby(_projectId);

        // If it exists, return it.
        if (_fundingCycleId > 0) return _getStruct(_fundingCycleId);

        // Get a reference to the eligible funding cycle.
        _fundingCycleId = _eligible(_projectId);

        // If an eligible funding cycle exists...
        if (_fundingCycleId > 0) {
            // Get the necessary properties for the standby funding cycle.
            FundingCycle memory _fundingCycle = _getStruct(_fundingCycleId);

            // There's no queued if the current has a duration of 0.
            if (_fundingCycle.duration == 0) return _getStruct(0);

            // Check to see if the correct ballot is approved for this funding cycle.
            // If so, return a funding cycle based on it.
            if (_isApproved(_fundingCycle))
                return _mockFundingCycleBasedOn(_fundingCycle, false);

            // If it hasn't been approved, set the ID to be its base funding cycle, which carries the last approved configuration.
            _fundingCycleId = _fundingCycle.basedOn;
        } else {
            // No upcoming funding cycle found that is eligible to become active,
            // so use the ID of the latest active funding cycle, which carries the last approved configuration.
            _fundingCycleId = latestIdOf[_projectId];
        }

        // A funding cycle must exist.
        if (_fundingCycleId == 0) return _getStruct(0);

        // Return a mock of what its second next up funding cycle would be.
        // Use second next because the next would be a mock of the current funding cycle.
        return _mockFundingCycleBasedOn(_getStruct(_fundingCycleId), false);
    }

    /**
        @notice 
        The funding cycle that is currently active for the specified project.

        @dev 
        This runs very similar logic to `_tappable`.

        @param _projectId The ID of the project being looked through.

        @return fundingCycle The current funding cycle.
    */
    function currentOf(uint256 _projectId)
        external
        view
        override
        returns (FundingCycle memory fundingCycle)
    {
        // The project must have funding cycles.
        if (latestIdOf[_projectId] == 0) return _getStruct(0);

        // Check for an active funding cycle.
        uint256 _fundingCycleId = _eligible(_projectId);

        // If no active funding cycle is found, check if there is a standby funding cycle.
        // If one exists, it will become active one it has been tapped.
        if (_fundingCycleId == 0) _fundingCycleId = _standby(_projectId);

        // Keep a reference to the eligible funding cycle.
        FundingCycle memory _fundingCycle;

        // If a standy funding cycle exists...
        if (_fundingCycleId > 0) {
            // Get the necessary properties for the standby funding cycle.
            _fundingCycle = _getStruct(_fundingCycleId);

            // Check to see if the correct ballot is approved for this funding cycle, and that it has started.
            if (
                _fundingCycle.start <= block.timestamp &&
                _isApproved(_fundingCycle)
            ) return _fundingCycle;

            // If it hasn't been approved, set the ID to be the based funding cycle,
            // which carries the last approved configuration.
            _fundingCycleId = _fundingCycle.basedOn;
        } else {
            // No upcoming funding cycle found that is eligible to become active,
            // so us the ID of the latest active funding cycle, which carries the last approved configuration.
            _fundingCycleId = latestIdOf[_projectId];
        }

        // The funding cycle cant be 0.
        if (_fundingCycleId == 0) return _getStruct(0);

        // The funding cycle to base a current one on.
        _fundingCycle = _getStruct(_fundingCycleId);

        // Return a mock of what the next funding cycle would be like,
        // which would become active one it has been tapped.
        return _mockFundingCycleBasedOn(_fundingCycle, true);
    }

    /** 
      @notice 
      The currency ballot state of the project.

      @param _projectId The ID of the project to check for a pending reconfiguration.

      @return The current ballot's state.
    */
    function currentBallotStateOf(uint256 _projectId)
        external
        view
        override
        returns (BallotState)
    {
        // The project must have funding cycles.
        require(
            latestIdOf[_projectId] > 0,
            "FundingCycles::currentBallotStateOf: NOT_FOUND"
        );

        // Get a reference to the latest funding cycle ID.
        uint256 _fundingCycleId = latestIdOf[_projectId];

        // Get the necessary properties for the latest funding cycle.
        FundingCycle memory _fundingCycle = _getStruct(_fundingCycleId);

        // If the latest funding cycle is the first, or if it has already started, it must be approved.
        if (_fundingCycle.basedOn == 0) return BallotState.Standby;

        return
            _ballotState(
                _fundingCycleId,
                _fundingCycle.configured,
                _fundingCycle.basedOn
            );
    }

    // --- external transactions --- //

    /** 
      @param _terminalDirectory A directory of a project's current Juicebox terminal to receive payments in.
    */
    constructor(ITerminalDirectory _terminalDirectory)
        TerminalUtility(_terminalDirectory)
    {}

    /**
        @notice 
        Configures the next eligible funding cycle for the specified project.

        @dev
        Only a project's current terminal can configure its funding cycles.

        @param _projectId The ID of the project being reconfigured.
        @param _properties The funding cycle configuration.
          @dev _properties.target The amount that the project wants to receive in each funding cycle. 18 decimals.
          @dev _properties.currency The currency of the `_target`. Send 0 for ETH or 1 for USD.
          @dev _properties.duration The duration of the funding cycle for which the `_target` amount is needed. Measured in days. 
            Set to 0 for no expiry and to be able to reconfigure anytime.
          @dev _cycleLimit The number of cycles that this configuration should last for before going back to the last permanent. This does nothing for a project's first funding cycle.
          @dev _properties.discountRate A number from 0-200 indicating how valuable a contribution to this funding cycle is compared to previous funding cycles.
            If it's 0, each funding cycle will have equal weight.
            If the number is 100, a contribution to the next funding cycle will only give you 90% of tickets given to a contribution of the same amount during the current funding cycle.
            If the number is 200, a contribution to the next funding cycle will only give you 80% of tickets given to a contribution of the same amoutn during the current funding cycle.
            If the number is 201, an non-recurring funding cycle will get made.
          @dev _ballot The new ballot that will be used to approve subsequent reconfigurations.
        @param _metadata Data to associate with this funding cycle configuration.
        @param _fee The fee that this configuration will incure when tapping.
        @param _configureActiveFundingCycle If a funding cycle that has already started should be configurable.

        @return fundingCycle The funding cycle that the configuration will take effect during.
    */
    function configure(
        uint256 _projectId,
        FundingCycleProperties calldata _properties,
        uint256 _metadata,
        uint256 _fee,
        bool _configureActiveFundingCycle
    )
        external
        override
        onlyTerminal(_projectId)
        returns (FundingCycle memory fundingCycle)
    {
        // Duration must fit in a uint16.
        require(
            _properties.duration <= type(uint16).max,
            "FundingCycles::configure: BAD_DURATION"
        );

        // Currency must be less than the limit.
        require(
            _properties.cycleLimit <= MAX_CYCLE_LIMIT,
            "FundingCycles::configure: BAD_CYCLE_LIMIT"
        );

        // Discount rate token must be less than or equal to 100%.
        require(
            _properties.discountRate <= 201,
            "FundingCycles::configure: BAD_DISCOUNT_RATE"
        );

        // Currency must fit into a uint8.
        require(
            _properties.currency <= type(uint8).max,
            "FundingCycles::configure: BAD_CURRENCY"
        );

        // Fee must be less than or equal to 100%.
        require(_fee <= 200, "FundingCycles::configure: BAD_FEE");

        // Set the configuration timestamp is now.
        uint256 _configured = block.timestamp;

        // Gets the ID of the funding cycle to reconfigure.
        uint256 _fundingCycleId = _configurable(
            _projectId,
            _configured,
            _configureActiveFundingCycle
        );

        // Store the configuration.
        _packAndStoreConfigurationProperties(
            _fundingCycleId,
            _configured,
            _properties.cycleLimit,
            _properties.ballot,
            _properties.duration,
            _properties.currency,
            _fee,
            _properties.discountRate
        );

        // Set the target amount.
        _targetOf[_fundingCycleId] = _properties.target;

        // Set the metadata.
        _metadataOf[_fundingCycleId] = _metadata;

        emit Configure(
            _fundingCycleId,
            _projectId,
            _configured,
            _properties,
            _metadata,
            msg.sender
        );

        return _getStruct(_fundingCycleId);
    }

    /** 
      @notice 
      Tap funds from a project's currently tappable funding cycle.

      @dev
      Only a project's current terminal can tap funds for its funding cycles.

      @param _projectId The ID of the project being tapped.
      @param _amount The amount being tapped.

      @return fundingCycle The tapped funding cycle.
    */
    function tap(uint256 _projectId, uint256 _amount)
        external
        override
        onlyTerminal(_projectId)
        returns (FundingCycle memory fundingCycle)
    {
        // Get a reference to the funding cycle being tapped.
        uint256 fundingCycleId = _tappable(_projectId);

        // Get a reference to how much has already been tapped from this funding cycle.
        uint256 _tapped = _tappedOf[fundingCycleId];

        // Amount must be within what is still tappable.
        require(
            _amount <= _targetOf[fundingCycleId] - _tapped,
            "FundingCycles::tap: INSUFFICIENT_FUNDS"
        );

        // The new amount that has been tapped.
        uint256 _newTappedAmount = _tapped + _amount;

        // Store the new amount.
        _tappedOf[fundingCycleId] = _newTappedAmount;

        emit Tap(
            fundingCycleId,
            _projectId,
            _amount,
            _newTappedAmount,
            msg.sender
        );

        return _getStruct(fundingCycleId);
    }

    // --- private helper functions --- //

    /**
        @notice 
        Returns the configurable funding cycle for this project if it exists, otherwise creates one.

        @param _projectId The ID of the project to find a configurable funding cycle for.
        @param _configured The time at which the configuration is occuring.
        @param _configureActiveFundingCycle If the active funding cycle should be configurable. Otherwise the next funding cycle will be used.

        @return fundingCycleId The ID of the configurable funding cycle.
    */
    function _configurable(
        uint256 _projectId,
        uint256 _configured,
        bool _configureActiveFundingCycle
    ) private returns (uint256 fundingCycleId) {
        // If there's not yet a funding cycle for the project, return the ID of a newly created one.
        if (latestIdOf[_projectId] == 0)
            return _init(_projectId, _getStruct(0), block.timestamp, false);

        // Get the standby funding cycle's ID.
        fundingCycleId = _standby(_projectId);

        // If it exists, make sure its updated, then return it.
        if (fundingCycleId > 0) {
            // Get the funding cycle that the specified one is based on.
            FundingCycle memory _baseFundingCycle = _getStruct(
                _getStruct(fundingCycleId).basedOn
            );

            // The base's ballot must have ended.
            _updateFundingCycle(
                fundingCycleId,
                _baseFundingCycle,
                _getTimeAfterBallot(_baseFundingCycle, _configured),
                false
            );
            return fundingCycleId;
        }

        // Get the active funding cycle's ID.
        fundingCycleId = _eligible(_projectId);

        // If the ID of an eligible funding cycle exists, it's approved, and active funding cycles are configurable, return it.
        if (fundingCycleId > 0) {
            if (!_isIdApproved(fundingCycleId)) {
                // If it hasn't been approved, set the ID to be the based funding cycle,
                // which carries the last approved configuration.
                fundingCycleId = _getStruct(fundingCycleId).basedOn;
            } else if (_configureActiveFundingCycle) {
                return fundingCycleId;
            }
        } else {
            // Get the ID of the latest funding cycle which has the latest reconfiguration.
            fundingCycleId = latestIdOf[_projectId];
        }

        // Determine if the configurable funding cycle can only take effect on or after a certain date.
        uint256 _mustStartOnOrAfter;

        // Base off of the active funding cycle if it exists.
        FundingCycle memory _fundingCycle = _getStruct(fundingCycleId);

        // Make sure the funding cycle is recurring.
        require(
            _fundingCycle.discountRate < 201,
            "FundingCycles::_configurable: NON_RECURRING"
        );

        if (_configureActiveFundingCycle) {
            // If the duration is zero, always go back to the original start.
            if (_fundingCycle.duration == 0) {
                _mustStartOnOrAfter = _fundingCycle.start;
            } else {
                // Set to the start time of the current active start time.
                uint256 _timeFromStartMultiple = (block.timestamp -
                    _fundingCycle.start) %
                    (_fundingCycle.duration * SECONDS_IN_DAY);
                _mustStartOnOrAfter = block.timestamp - _timeFromStartMultiple;
            }
        } else {
            // The ballot must have ended.
            _mustStartOnOrAfter = _getTimeAfterBallot(
                _fundingCycle,
                _configured
            );
        }

        // Return the newly initialized configurable funding cycle.
        fundingCycleId = _init(
            _projectId,
            _fundingCycle,
            _mustStartOnOrAfter,
            false
        );
    }

    /**
        @notice 
        Returns the funding cycle that can be tapped at the time of the call.

        @param _projectId The ID of the project to find a configurable funding cycle for.

        @return fundingCycleId The ID of the tappable funding cycle.
    */
    function _tappable(uint256 _projectId)
        private
        returns (uint256 fundingCycleId)
    {
        // Check for the ID of an eligible funding cycle.
        fundingCycleId = _eligible(_projectId);

        // No eligible funding cycle found, check for the ID of a standby funding cycle.
        // If this one exists, it will become eligible one it has started.
        if (fundingCycleId == 0) fundingCycleId = _standby(_projectId);

        // Keep a reference to the funding cycle eligible for being tappable.
        FundingCycle memory _fundingCycle;

        // If the ID of an eligible funding cycle exists,
        // check to see if it has been approved by the based funding cycle's ballot.
        if (fundingCycleId > 0) {
            // Get the necessary properties for the funding cycle.
            _fundingCycle = _getStruct(fundingCycleId);

            // Check to see if the cycle is approved. If so, return it.
            if (
                _fundingCycle.start <= block.timestamp &&
                _isApproved(_fundingCycle)
            ) return fundingCycleId;

            // If it hasn't been approved, set the ID to be the base funding cycle,
            // which carries the last approved configuration.
            fundingCycleId = _fundingCycle.basedOn;
        } else {
            // No upcoming funding cycle found that is eligible to become active, clone the latest active funding cycle.
            // which carries the last approved configuration.
            fundingCycleId = latestIdOf[_projectId];
        }

        // The funding cycle cant be 0.
        require(fundingCycleId > 0, "FundingCycles::_tappable: NOT_FOUND");

        // Set the eligible funding cycle.
        _fundingCycle = _getStruct(fundingCycleId);

        // Funding cycles with a discount rate of 100% are non-recurring.
        require(
            _fundingCycle.discountRate < 201,
            "FundingCycles::_tappable: NON_RECURRING"
        );

        // The time when the funding cycle immediately after the eligible funding cycle starts.
        uint256 _nextImmediateStart = _fundingCycle.start +
            (_fundingCycle.duration * SECONDS_IN_DAY);

        // The distance from now until the nearest past multiple of the cycle duration from its start.
        // A duration of zero means the reconfiguration can start right away.
        uint256 _timeFromImmediateStartMultiple = _fundingCycle.duration == 0
            ? 0
            : (block.timestamp - _nextImmediateStart) %
                (_fundingCycle.duration * SECONDS_IN_DAY);

        // Return the tappable funding cycle.
        fundingCycleId = _init(
            _projectId,
            _fundingCycle,
            block.timestamp - _timeFromImmediateStartMultiple,
            true
        );
    }

    /**
        @notice 
        Initializes a funding cycle with the appropriate properties.

        @param _projectId The ID of the project to which the funding cycle being initialized belongs.
        @param _baseFundingCycle The funding cycle to base the initialized one on.
        @param _mustStartOnOrAfter The time before which the initialized funding cycle can't start.
        @param _copy If non-intrinsic properties should be copied from the base funding cycle.

        @return newFundingCycleId The ID of the initialized funding cycle.
    */
    function _init(
        uint256 _projectId,
        FundingCycle memory _baseFundingCycle,
        uint256 _mustStartOnOrAfter,
        bool _copy
    ) private returns (uint256 newFundingCycleId) {
        // Increment the count of funding cycles.
        count++;

        // Set the project's latest funding cycle ID to the new count.
        latestIdOf[_projectId] = count;

        // If there is no base, initialize a first cycle.
        if (_baseFundingCycle.id == 0) {
            // Set fresh intrinsic properties.
            _packAndStoreIntrinsicProperties(
                count,
                _projectId,
                BASE_WEIGHT,
                1,
                0,
                block.timestamp
            );
        } else {
            // Update the intrinsic properties of the funding cycle being initialized.
            _updateFundingCycle(
                count,
                _baseFundingCycle,
                _mustStartOnOrAfter,
                _copy
            );
        }

        // Get a reference to the funding cycle with updated intrinsic properties.
        FundingCycle memory _fundingCycle = _getStruct(count);

        emit Init(
            count,
            _fundingCycle.projectId,
            _fundingCycle.number,
            _fundingCycle.basedOn,
            _fundingCycle.weight,
            _fundingCycle.start
        );

        return _fundingCycle.id;
    }

    /**
        @notice 
        The project's funding cycle that hasn't yet started, if one exists.

        @param _projectId The ID of project to look through.

        @return fundingCycleId The ID of the standby funding cycle.
    */
    function _standby(uint256 _projectId)
        private
        view
        returns (uint256 fundingCycleId)
    {
        // Get a reference to the project's latest funding cycle.
        fundingCycleId = latestIdOf[_projectId];

        // If there isn't one, theres also no standy funding cycle.
        if (fundingCycleId == 0) return 0;

        // Get the necessary properties for the latest funding cycle.
        FundingCycle memory _fundingCycle = _getStruct(fundingCycleId);

        // There is no upcoming funding cycle if the latest funding cycle has already started.
        if (block.timestamp >= _fundingCycle.start) return 0;
    }

    /**
        @notice 
        The project's funding cycle that has started and hasn't yet expired.

        @param _projectId The ID of the project to look through.

        @return fundingCycleId The ID of the active funding cycle.
    */
    function _eligible(uint256 _projectId)
        private
        view
        returns (uint256 fundingCycleId)
    {
        // Get a reference to the project's latest funding cycle.
        fundingCycleId = latestIdOf[_projectId];

        // If the latest funding cycle doesn't exist, return an undefined funding cycle.
        if (fundingCycleId == 0) return 0;

        // Get the necessary properties for the latest funding cycle.
        FundingCycle memory _fundingCycle = _getStruct(fundingCycleId);

        // If the latest is expired, return an undefined funding cycle.
        // A duration of 0 can not be expired.
        if (
            _fundingCycle.duration > 0 &&
            block.timestamp >=
            _fundingCycle.start + (_fundingCycle.duration * SECONDS_IN_DAY)
        ) return 0;

        // The first funding cycle when running on local can be in the future for some reason.
        // This will have no effect in production.
        if (
            _fundingCycle.basedOn == 0 || block.timestamp >= _fundingCycle.start
        ) return fundingCycleId;

        // The base cant be expired.
        FundingCycle memory _baseFundingCycle = _getStruct(
            _fundingCycle.basedOn
        );

        // If the current time is past the end of the base, return 0.
        // A duration of 0 is always eligible.
        if (
            _baseFundingCycle.duration > 0 &&
            block.timestamp >=
            _baseFundingCycle.start +
                (_baseFundingCycle.duration * SECONDS_IN_DAY)
        ) return 0;

        // Return the funding cycle immediately before the latest.
        fundingCycleId = _fundingCycle.basedOn;
    }

    /** 
        @notice 
        A view of the funding cycle that would be created based on the provided one if the project doesn't make a reconfiguration.

        @param _baseFundingCycle The funding cycle to make the calculation for.
        @param _allowMidCycle Allow the mocked funding cycle to already be mid cycle.

        @return The next funding cycle, with an ID set to 0.
    */
    function _mockFundingCycleBasedOn(
        FundingCycle memory _baseFundingCycle,
        bool _allowMidCycle
    ) internal view returns (FundingCycle memory) {
        // Can't mock a non recurring funding cycle.
        if (_baseFundingCycle.discountRate == 201) return _getStruct(0);

        // If the base has a limit, find the last permanent funding cycle, which is needed to make subsequent calculations.
        // Otherwise, the base is already the latest permanent funding cycle.
        FundingCycle memory _latestPermanentFundingCycle = _baseFundingCycle
        .cycleLimit > 0
            ? _latestPermanentCycleBefore(_baseFundingCycle)
            : _baseFundingCycle;

        // The distance of the current time to the start of the next possible funding cycle.
        uint256 _timeFromImmediateStartMultiple;

        if (_allowMidCycle && _baseFundingCycle.duration > 0) {
            // Get the end time of the last cycle.
            uint256 _cycleEnd = _baseFundingCycle.start +
                (_baseFundingCycle.cycleLimit *
                    _baseFundingCycle.duration *
                    SECONDS_IN_DAY);

            // If the cycle end time is in the past, the mock should start at a multiple of the last permanent cycle since the cycle ended.
            if (
                _baseFundingCycle.cycleLimit > 0 && _cycleEnd < block.timestamp
            ) {
                _timeFromImmediateStartMultiple = _latestPermanentFundingCycle
                .duration == 0
                    ? 0
                    : ((block.timestamp - _cycleEnd) %
                        (_latestPermanentFundingCycle.duration *
                            SECONDS_IN_DAY));
            } else {
                _timeFromImmediateStartMultiple =
                    _baseFundingCycle.duration *
                    SECONDS_IN_DAY;
            }
        } else {
            _timeFromImmediateStartMultiple = 0;
        }

        // Derive what the start time should be.
        uint256 _start = _deriveStart(
            _baseFundingCycle,
            _latestPermanentFundingCycle,
            block.timestamp - _timeFromImmediateStartMultiple
        );

        // Derive what the cycle limit should be.
        uint256 _cycleLimit = _deriveCycleLimit(_baseFundingCycle, _start);

        // Copy the last permanent funding cycle if the bases' limit is up.
        FundingCycle memory _fundingCycleToCopy = _cycleLimit == 0
            ? _latestPermanentFundingCycle
            : _baseFundingCycle;

        return
            FundingCycle(
                0,
                _fundingCycleToCopy.projectId,
                _deriveNumber(
                    _baseFundingCycle,
                    _latestPermanentFundingCycle,
                    _start
                ),
                _fundingCycleToCopy.id,
                _fundingCycleToCopy.configured,
                _cycleLimit,
                _deriveWeight(
                    _baseFundingCycle,
                    _latestPermanentFundingCycle,
                    _start
                ),
                _fundingCycleToCopy.ballot,
                _start,
                _fundingCycleToCopy.duration,
                _fundingCycleToCopy.target,
                _fundingCycleToCopy.currency,
                _fundingCycleToCopy.fee,
                _fundingCycleToCopy.discountRate,
                0,
                _fundingCycleToCopy.metadata
            );
    }

    /** 
      @notice
      Updates intrinsic properties for a funding cycle given a base cycle.

      @param _fundingCycleId The ID of the funding cycle to make sure is update.
      @param _baseFundingCycle The cycle that the one being updated is based on.
      @param _mustStartOnOrAfter The time before which the initialized funding cycle can't start.
      @param _copy If non-intrinsic properties should be copied from the base funding cycle.
    */
    function _updateFundingCycle(
        uint256 _fundingCycleId,
        FundingCycle memory _baseFundingCycle,
        uint256 _mustStartOnOrAfter,
        bool _copy
    ) private {
        // Get the latest permanent funding cycle.
        FundingCycle memory _latestPermanentFundingCycle = _baseFundingCycle
        .cycleLimit > 0
            ? _latestPermanentCycleBefore(_baseFundingCycle)
            : _baseFundingCycle;

        // Derive the correct next start time from the base.
        uint256 _start = _deriveStart(
            _baseFundingCycle,
            _latestPermanentFundingCycle,
            _mustStartOnOrAfter
        );

        // Derive the correct weight.
        uint256 _weight = _deriveWeight(
            _baseFundingCycle,
            _latestPermanentFundingCycle,
            _start
        );

        // Derive the correct number.
        uint256 _number = _deriveNumber(
            _baseFundingCycle,
            _latestPermanentFundingCycle,
            _start
        );

        // Copy if needed.
        if (_copy) {
            // Derive what the cycle limit should be.
            uint256 _cycleLimit = _deriveCycleLimit(_baseFundingCycle, _start);

            // Copy the last permanent funding cycle if the bases' limit is up.
            FundingCycle memory _fundingCycleToCopy = _cycleLimit == 0
                ? _latestPermanentFundingCycle
                : _baseFundingCycle;

            // Save the configuration efficiently.
            _packAndStoreConfigurationProperties(
                _fundingCycleId,
                _fundingCycleToCopy.configured,
                _cycleLimit,
                _fundingCycleToCopy.ballot,
                _fundingCycleToCopy.duration,
                _fundingCycleToCopy.currency,
                _fundingCycleToCopy.fee,
                _fundingCycleToCopy.discountRate
            );

            _metadataOf[count] = _metadataOf[_fundingCycleToCopy.id];
            _targetOf[count] = _targetOf[_fundingCycleToCopy.id];
        }

        // Update the intrinsic properties.
        _packAndStoreIntrinsicProperties(
            _fundingCycleId,
            _baseFundingCycle.projectId,
            _weight,
            _number,
            _baseFundingCycle.id,
            _start
        );
    }

    /**
      @notice 
      Efficiently stores a funding cycle's provided intrinsic properties.

      @param _fundingCycleId The ID of the funding cycle to pack and store.
      @param _projectId The ID of the project to which the funding cycle belongs.
      @param _weight The weight of the funding cycle.
      @param _number The number of the funding cycle.
      @param _basedOn The ID of the based funding cycle.
      @param _start The start time of this funding cycle.

     */
    function _packAndStoreIntrinsicProperties(
        uint256 _fundingCycleId,
        uint256 _projectId,
        uint256 _weight,
        uint256 _number,
        uint256 _basedOn,
        uint256 _start
    ) private {
        // weight in bytes 0-79 bytes.
        uint256 packed = _weight;
        // projectId in bytes 80-135 bytes.
        packed |= _projectId << 80;
        // basedOn in bytes 136-183 bytes.
        packed |= _basedOn << 136;
        // start in bytes 184-231 bytes.
        packed |= _start << 184;
        // number in bytes 232-255 bytes.
        packed |= _number << 232;

        // Set in storage.
        _packedIntrinsicPropertiesOf[_fundingCycleId] = packed;
    }

    /**
      @notice 
      Efficiently stores a funding cycles provided configuration properties.

      @param _fundingCycleId The ID of the funding cycle to pack and store.
      @param _configured The timestamp of the configuration.
      @param _cycleLimit The number of cycles that this configuration should last for before going back to the last permanent.
      @param _ballot The ballot to use for future reconfiguration approvals. 
      @param _duration The duration of the funding cycle.
      @param _currency The currency of the funding cycle.
      @param _fee The fee of the funding cycle.
      @param _discountRate The discount rate of the based funding cycle.
     */
    function _packAndStoreConfigurationProperties(
        uint256 _fundingCycleId,
        uint256 _configured,
        uint256 _cycleLimit,
        IFundingCycleBallot _ballot,
        uint256 _duration,
        uint256 _currency,
        uint256 _fee,
        uint256 _discountRate
    ) private {
        // ballot in bytes 0-159 bytes.
        uint256 packed = uint160(address(_ballot));
        // configured in bytes 160-207 bytes.
        packed |= _configured << 160;
        // duration in bytes 208-223 bytes.
        packed |= _duration << 208;
        // basedOn in bytes 224-231 bytes.
        packed |= _currency << 224;
        // fee in bytes 232-239 bytes.
        packed |= _fee << 232;
        // discountRate in bytes 240-247 bytes.
        packed |= _discountRate << 240;
        // cycleLimit in bytes 248-255 bytes.
        packed |= _cycleLimit << 248;

        // Set in storage.
        _packedConfigurationPropertiesOf[_fundingCycleId] = packed;
    }

    /**
        @notice 
        Unpack a funding cycle's packed stored values into an easy-to-work-with funding cycle struct.

        @param _id The ID of the funding cycle to get a struct of.

        @return _fundingCycle The funding cycle struct.
    */
    function _getStruct(uint256 _id)
        private
        view
        returns (FundingCycle memory _fundingCycle)
    {
        // Return an empty funding cycle if the ID specified is 0.
        if (_id == 0) return _fundingCycle;

        _fundingCycle.id = _id;

        uint256 _packedIntrinsicProperties = _packedIntrinsicPropertiesOf[_id];

        _fundingCycle.weight = uint256(uint80(_packedIntrinsicProperties));
        _fundingCycle.projectId = uint256(
            uint56(_packedIntrinsicProperties >> 80)
        );
        _fundingCycle.basedOn = uint256(
            uint48(_packedIntrinsicProperties >> 136)
        );
        _fundingCycle.start = uint256(
            uint48(_packedIntrinsicProperties >> 184)
        );
        _fundingCycle.number = uint256(
            uint24(_packedIntrinsicProperties >> 232)
        );


            uint256 _packedConfigurationProperties
         = _packedConfigurationPropertiesOf[_id];
        _fundingCycle.ballot = IFundingCycleBallot(
            address(uint160(_packedConfigurationProperties))
        );
        _fundingCycle.configured = uint256(
            uint48(_packedConfigurationProperties >> 160)
        );
        _fundingCycle.duration = uint256(
            uint16(_packedConfigurationProperties >> 208)
        );
        _fundingCycle.currency = uint256(
            uint8(_packedConfigurationProperties >> 224)
        );
        _fundingCycle.fee = uint256(
            uint8(_packedConfigurationProperties >> 232)
        );
        _fundingCycle.discountRate = uint256(
            uint8(_packedConfigurationProperties >> 240)
        );
        _fundingCycle.cycleLimit = uint256(
            uint8(_packedConfigurationProperties >> 248)
        );
        _fundingCycle.target = _targetOf[_id];
        _fundingCycle.tapped = _tappedOf[_id];
        _fundingCycle.metadata = _metadataOf[_id];
    }

    /** 
        @notice 
        The date that is the nearest multiple of the specified funding cycle's duration from its end.

        @param _baseFundingCycle The funding cycle to make the calculation for.
        @param _latestPermanentFundingCycle The latest funding cycle in the same project as `_baseFundingCycle` to not have a limit.
        @param _mustStartOnOrAfter A date that the derived start must be on or come after.

        @return start The next start time.
    */
    function _deriveStart(
        FundingCycle memory _baseFundingCycle,
        FundingCycle memory _latestPermanentFundingCycle,
        uint256 _mustStartOnOrAfter
    ) internal pure returns (uint256 start) {
        // A subsequent cycle to one with a duration of 0 should start as soon as possible.
        if (_baseFundingCycle.duration == 0) return _mustStartOnOrAfter;

        // Save a reference to the duration measured in seconds.
        uint256 _durationInSeconds = _baseFundingCycle.duration *
            SECONDS_IN_DAY;

        // The time when the funding cycle immediately after the specified funding cycle starts.
        uint256 _nextImmediateStart = _baseFundingCycle.start +
            _durationInSeconds;

        // If the next immediate start is now or in the future, return it.
        if (_nextImmediateStart >= _mustStartOnOrAfter)
            return _nextImmediateStart;

        uint256 _cycleLimit = _baseFundingCycle.cycleLimit;

        uint256 _timeFromImmediateStartMultiple;
        // Only use base
        if (
            _mustStartOnOrAfter <=
            _baseFundingCycle.start + _durationInSeconds * _cycleLimit
        ) {
            // Otherwise, use the closest multiple of the duration from the old end.
            _timeFromImmediateStartMultiple =
                (_mustStartOnOrAfter - _nextImmediateStart) %
                _durationInSeconds;
        } else {
            // If the cycle has ended, make the calculation with the latest permanent funding cycle.
            _timeFromImmediateStartMultiple = _latestPermanentFundingCycle
            .duration == 0
                ? 0
                : ((_mustStartOnOrAfter -
                    (_baseFundingCycle.start +
                        (_durationInSeconds * _cycleLimit))) %
                    (_latestPermanentFundingCycle.duration * SECONDS_IN_DAY));

            // Use the duration of the permanent funding cycle from here on out.
            _durationInSeconds =
                _latestPermanentFundingCycle.duration *
                SECONDS_IN_DAY;
        }

        // Otherwise use an increment of the duration from the most recent start.
        start = _mustStartOnOrAfter - _timeFromImmediateStartMultiple;

        // Add increments of duration as necessary to satisfy the threshold.
        while (_mustStartOnOrAfter > start) start = start + _durationInSeconds;
    }

    /** 
        @notice 
        The accumulated weight change since the specified funding cycle.

        @param _baseFundingCycle The funding cycle to make the calculation with.
        @param _latestPermanentFundingCycle The latest funding cycle in the same project as `_fundingCycle` to not have a limit.
        @param _start The start time to derive a weight for.

        @return weight The next weight.
    */
    function _deriveWeight(
        FundingCycle memory _baseFundingCycle,
        FundingCycle memory _latestPermanentFundingCycle,
        uint256 _start
    ) internal pure returns (uint256 weight) {
        // A subsequent cycle to one with a duration of 0 should have the next possible weight.
        if (_baseFundingCycle.duration == 0)
            return
                PRBMath.mulDiv(
                    _baseFundingCycle.weight,
                    1000 - _baseFundingCycle.discountRate,
                    1000
                );

        // The difference between the start of the base funding cycle and the proposed start.
        uint256 _startDistance = _start - _baseFundingCycle.start;

        // The number of seconds that the base funding cycle is limited to.
        uint256 _limitLength = _baseFundingCycle.cycleLimit == 0 ||
            _baseFundingCycle.basedOn == 0
            ? 0
            : _baseFundingCycle.cycleLimit *
                (_baseFundingCycle.duration * SECONDS_IN_DAY);

        // The weight should be based off the base funding cycle's weight.
        weight = _baseFundingCycle.weight;

        // If there's no limit or if the limit is greater than the start distance,
        // apply the discount rate of the base.
        if (_limitLength == 0 || _limitLength > _startDistance) {
            // If the discount rate is 0, return the same weight.
            if (_baseFundingCycle.discountRate == 0) return weight;

            uint256 _discountMultiple = _startDistance /
                (_baseFundingCycle.duration * SECONDS_IN_DAY);

            for (uint256 i = 0; i < _discountMultiple; i++) {
                // The number of times to apply the discount rate.
                // Base the new weight on the specified funding cycle's weight.
                weight = PRBMath.mulDiv(
                    weight,
                    1000 - _baseFundingCycle.discountRate,
                    1000
                );
            }
        } else {
            // If the time between the base start at the given start is longer than
            // the limit, the discount rate for the limited base has to be applied first,
            // and then the discount rate for the last permanent should be applied to
            // the remaining distance.

            // Use up the limited discount rate up until the limit.
            if (_baseFundingCycle.discountRate > 0) {
                for (uint256 i = 0; i < _baseFundingCycle.cycleLimit; i++) {
                    weight = PRBMath.mulDiv(
                        weight,
                        1000 - _baseFundingCycle.discountRate,
                        1000
                    );
                }
            }

            if (_latestPermanentFundingCycle.discountRate > 0) {
                // The number of times to apply the latest permanent discount rate.


                    uint256 _permanentDiscountMultiple
                 = _latestPermanentFundingCycle.duration == 0
                    ? 0
                    : (_startDistance - _limitLength) /
                        (_latestPermanentFundingCycle.duration *
                            SECONDS_IN_DAY);

                for (uint256 i = 0; i < _permanentDiscountMultiple; i++) {
                    // base the weight on the result of the previous calculation.
                    weight = PRBMath.mulDiv(
                        weight,
                        1000 - _latestPermanentFundingCycle.discountRate,
                        1000
                    );
                }
            }
        }
    }

    /** 
        @notice 
        The number of the next funding cycle given the specified funding cycle.

        @param _baseFundingCycle The funding cycle to make the calculation with.
        @param _latestPermanentFundingCycle The latest funding cycle in the same project as `_fundingCycle` to not have a limit.
        @param _start The start time to derive a number for.

        @return number The next number.
    */
    function _deriveNumber(
        FundingCycle memory _baseFundingCycle,
        FundingCycle memory _latestPermanentFundingCycle,
        uint256 _start
    ) internal pure returns (uint256 number) {
        // A subsequent cycle to one with a duration of 0 should be the next number.
        if (_baseFundingCycle.duration == 0)
            return _baseFundingCycle.number + 1;

        // The difference between the start of the base funding cycle and the proposed start.
        uint256 _startDistance = _start - _baseFundingCycle.start;

        // The number of seconds that the base funding cycle is limited to.
        uint256 _limitLength = _baseFundingCycle.cycleLimit == 0
            ? 0
            : _baseFundingCycle.cycleLimit *
                (_baseFundingCycle.duration * SECONDS_IN_DAY);

        if (_limitLength == 0 || _limitLength > _startDistance) {
            // If there's no limit or if the limit is greater than the start distance,
            // get the result by finding the number of base cycles that fit in the start distance.
            number =
                _baseFundingCycle.number +
                (_startDistance /
                    (_baseFundingCycle.duration * SECONDS_IN_DAY));
        } else {
            // If the time between the base start at the given start is longer than
            // the limit, first calculate the number of cycles that passed under the limit,
            // and add any cycles that have passed of the latest permanent funding cycle afterwards.

            number =
                _baseFundingCycle.number +
                (_limitLength / (_baseFundingCycle.duration * SECONDS_IN_DAY));

            number =
                number +
                (
                    _latestPermanentFundingCycle.duration == 0
                        ? 0
                        : ((_startDistance - _limitLength) /
                            (_latestPermanentFundingCycle.duration *
                                SECONDS_IN_DAY))
                );
        }
    }

    /** 
        @notice 
        The limited number of times a funding cycle configuration can be active given the specified funding cycle.

        @param _fundingCycle The funding cycle to make the calculation with.
        @param _start The start time to derive cycles remaining for.

        @return start The inclusive nunmber of cycles remaining.
    */
    function _deriveCycleLimit(
        FundingCycle memory _fundingCycle,
        uint256 _start
    ) internal pure returns (uint256) {
        if (_fundingCycle.cycleLimit <= 1 || _fundingCycle.duration == 0)
            return 0;
        uint256 _cycles = ((_start - _fundingCycle.start) /
            (_fundingCycle.duration * SECONDS_IN_DAY));

        if (_cycles >= _fundingCycle.cycleLimit) return 0;
        return _fundingCycle.cycleLimit - _cycles;
    }

    /** 
      @notice 
      Checks to see if the funding cycle of the provided ID is approved according to the correct ballot.

      @param _fundingCycleId The ID of the funding cycle to get an approval flag for.

      @return The approval flag.
    */
    function _isIdApproved(uint256 _fundingCycleId)
        private
        view
        returns (bool)
    {
        FundingCycle memory _fundingCycle = _getStruct(_fundingCycleId);
        return _isApproved(_fundingCycle);
    }

    /** 
      @notice 
      Checks to see if the provided funding cycle is approved according to the correct ballot.

      @param _fundingCycle The ID of the funding cycle to get an approval flag for.

      @return The approval flag.
    */
    function _isApproved(FundingCycle memory _fundingCycle)
        private
        view
        returns (bool)
    {
        return
            _ballotState(
                _fundingCycle.id,
                _fundingCycle.configured,
                _fundingCycle.basedOn
            ) == BallotState.Approved;
    }

    /**
        @notice 
        A funding cycle configuration's currency status.

        @param _id The ID of the funding cycle configuration to check the status of.
        @param _configuration The timestamp of when the configuration took place.
        @param _ballotFundingCycleId The ID of the funding cycle which is configured with the ballot that should be used.

        @return The funding cycle's configuration status.
    */
    function _ballotState(
        uint256 _id,
        uint256 _configuration,
        uint256 _ballotFundingCycleId
    ) private view returns (BallotState) {
        // If there is no ballot funding cycle, auto approve.
        if (_ballotFundingCycleId == 0) return BallotState.Approved;

        // Get the ballot funding cycle.
        FundingCycle memory _ballotFundingCycle = _getStruct(
            _ballotFundingCycleId
        );

        // If the configuration is the same as the ballot's funding cycle,
        // the ballot isn't applicable. Auto approve since the ballot funding cycle is approved.
        if (_ballotFundingCycle.configured == _configuration)
            return BallotState.Approved;

        // If there is no ballot, the ID is auto approved.
        // Otherwise, return the ballot's state.
        return
            _ballotFundingCycle.ballot == IFundingCycleBallot(address(0))
                ? BallotState.Approved
                : _ballotFundingCycle.ballot.state(_id, _configuration);
    }

    /** 
      @notice 
      Finds the last funding cycle that was permanent in relation to the specified funding cycle.

      @dev
      Determined what the latest funding cycle with a `cycleLimit` of 0 is, or isn't based on any previous funding cycle.


      @param _fundingCycle The funding cycle to find the most recent permanent cycle compared to.

      @return fundingCycle The most recent permanent funding cycle.
    */
    function _latestPermanentCycleBefore(FundingCycle memory _fundingCycle)
        private
        view
        returns (FundingCycle memory fundingCycle)
    {
        if (_fundingCycle.basedOn == 0) return _fundingCycle;
        fundingCycle = _getStruct(_fundingCycle.basedOn);
        if (fundingCycle.cycleLimit == 0) return fundingCycle;
        return _latestPermanentCycleBefore(fundingCycle);
    }

    /** 
      @notice
      The time after the ballot of the provided funding cycle has expired.

      @dev
      If the ballot ends in the past, the current block timestamp will be returned.

      @param _fundingCycle The ID funding cycle to make the caluclation the ballot of.
      @param _from The time from which the ballot duration should be calculated.

      @return The time when the ballot duration ends.
    */
    function _getTimeAfterBallot(
        FundingCycle memory _fundingCycle,
        uint256 _from
    ) private view returns (uint256) {
        // The ballot must have ended.
        uint256 _ballotExpiration = _fundingCycle.ballot !=
            IFundingCycleBallot(address(0))
            ? _from + _fundingCycle.ballot.duration()
            : 0;

        return
            block.timestamp > _ballotExpiration
                ? block.timestamp
                : _ballotExpiration;
    }
}
