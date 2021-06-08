// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "prb-math/contracts/PRBMathCommon.sol";

import "./interfaces/IFundingCycles.sol";
import "./interfaces/IPrices.sol";
import "./abstract/Administered.sol";

/** 
  @notice Manage funding cycle configurations, accounting, and scheduling.
*/
contract FundingCycles is Administered, IFundingCycles {
    // --- public properties --- //

    /// @notice Stores the reconfiguration properties of each funding cycle,
    /// packed into one storage slot.
    mapping(uint256 => uint256) public override packedConfigurationProperties;

    /// @notice Stores the properties added by the mechanism to manage and schedule each funding cycle,
    /// packed into one storage slot.
    mapping(uint256 => uint256) public override packedIntrinsicProperties;

    /// @notice Stores the metadata for each funding cycle,
    /// packed into one storage slot.
    mapping(uint256 => uint256) public override metadata;

    /// @notice Stores the amount that each funding cycle can tap funding cycle,
    /// packed into one storage slot.
    mapping(uint256 => uint256) public override targetAmounts;

    /// @notice Stores the amount that has been tapped within each funding cycle,
    /// packed into one storage slot.
    mapping(uint256 => uint256) public override tappedAmounts;

    /// @notice The starting weight for each project's first funding cycle.
    uint256 public constant override BASE_WEIGHT = 1E19;

    /// @notice The latest FundingCycle ID for each project id.
    mapping(uint256 => uint256) public override latestId;

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

        return _getStruct(_fundingCycleId, true, true, true, true);
    }

    /**
        @notice 
        The funding cycle that's next up for a project, and therefor not currently accepting payments.

        @param _projectId The ID of the project being looked through.

        @return _fundingCycle The queued funding cycle.
    */
    function getQueued(uint256 _projectId)
        external
        view
        override
        returns (FundingCycle memory)
    {
        // The project must have funding cycles.
        require(
            latestId[_projectId] > 0,
            "FundingCycles::getQueued: NOT_FOUND"
        );

        // Get a reference to the standby funding cycle.
        uint256 _standbyFundingCycleId = _standby(_projectId);

        // If it exists, return it.
        if (_standbyFundingCycleId > 0)
            return _getStruct(_standbyFundingCycleId, true, true, true, true);

        // Get a reference to the eligible funding cycle.
        uint256 _eligibleFundingCycleId = _eligible(_projectId);

        uint256 _fundingCycleId;

        // If an eligible funding cycle exists,
        // check to see if it has been approved by the base funding cycle's ballot.
        if (_eligibleFundingCycleId > 0) {
            // Get the necessary properties for the standby funding cycle.
            FundingCycle memory _eligibleFundingCycle =
                _getStruct(_eligibleFundingCycleId, true, true, false, false);

            // Check to see if the correct ballot is approved for this funding cycle.
            if (_isApproved(_eligibleFundingCycle))
                return _mockFundingCycleAfter(_eligibleFundingCycle);

            // If it hasn't been approved, set the ID to be the based funding cycle,
            // which carries the last approved configuration.
            _fundingCycleId = _eligibleFundingCycle.basedOn;
        } else {
            // No upcoming funding cycle found that is eligible to become active,
            // so us the ID of the latest active funding cycle, which carries the last approved configuration.
            _fundingCycleId = latestId[_projectId];
        }

        // A funding cycle must exist.
        require(_fundingCycleId > 0, "FundingCycle::getQueued: NOT_FOUND");

        // Return a mock of what its second next up funding cycle would be like.
        // Use second next because the next would be a mock of the current funding cycle.
        return
            _mockFundingCycleAfter(
                _mockFundingCycleAfter(
                    _getStruct(_fundingCycleId, true, true, true, true)
                )
            );
    }

    /**
        @notice 
        The funding cycle that is currently tappable for the specified project.

        @dev 
        This runs very similar logic to `_tappable`.

        @param _projectId The ID of the project being looked through.

        @return fundingCycle The current funding cycle.
    */
    function getCurrent(uint256 _projectId)
        external
        view
        override
        returns (FundingCycle memory fundingCycle)
    {
        // The project must have funding cycles.
        require(
            latestId[_projectId] > 0,
            "FundingCycles::getCurrent: NOT_FOUND"
        );

        // Check for an active funding cycle.
        uint256 _fundingCycleId = _eligible(_projectId);

        // No active funding cycle found, check if there is a standby funding cycle.
        // If this one exists, it will become active one it has been tapped.
        if (_fundingCycleId == 0) _fundingCycleId = _standby(_projectId);

        // If a standy funding cycle exists,
        // check to see if it has been approved by the base funding cycle's ballot.
        if (_fundingCycleId > 0) {
            // Get the necessary properties for the standby funding cycle.
            FundingCycle memory _eligibleFundingCycle =
                _getStruct(_fundingCycleId, true, true, false, false);

            // Check to see if the correct ballot is approved for this funding cycle.
            if (_isApproved(_eligibleFundingCycle))
                return _eligibleFundingCycle;

            // If it hasn't been approved, set the ID to be the based funding cycle,
            // which carries the last approved configuration.
            _fundingCycleId = _eligibleFundingCycle.basedOn;
        } else {
            // No upcoming funding cycle found that is eligible to become active,
            // so us the ID of the latest active funding cycle, which carries the last approved configuration.
            _fundingCycleId = latestId[_projectId];
        }

        // The funding cycle cant be 0.
        require(_fundingCycleId > 0, "FundingCycles::getCurrent: NOT_FOUND");

        // Return a mock of what the next funding cycle would be like,
        // which would become active one it has been tapped.
        return
            _mockFundingCycleAfter(
                _getStruct(_fundingCycleId, true, true, true, true)
            );
    }

    /** 
      @notice 
      Checks whether a project has a pending reconfiguration.

      @param _projectId The ID of the project to check for a pending reconfiguration.

      @return The current ballot's state.
    */
    function currentBallotState(uint256 _projectId)
        external
        view
        override
        returns (BallotState)
    {
        // The project must have funding cycles.
        require(
            latestId[_projectId] > 0,
            "FundingCycles::currentBallotState: NOT_FOUND"
        );

        // Get a reference to the latest funding cycle ID.
        uint256 _fundingCycleId = latestId[_projectId];

        // Get the necessary properties for the latest funding cycle.
        FundingCycle memory _fundingCycle =
            _getStruct(_fundingCycleId, true, true, false, false);

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
        @notice 
        Configures the next eligible funding for the specified project.

        @param _projectId The ID of the project being reconfigured.
        @param _target The amount that the project wants to receive in each funding cycle. 18 decimals.
        @param _currency The currency of the `_target`. Send 0 for ETH or 1 for USD.
        @param _duration The duration of the funding cycle for which the `_target` amount is needed. Measured in seconds.
        @param _discountRate A number from 0-200 indicating how valuable a contribution to this funding cycle is compared to previous funding cycles.
        If it's 200, each funding cycle will have equal weight.
        If the number is 180, a contribution to the next funding cycle will only give you 90% of tickets given to a contribution of the same amount during the current funding cycle.
        If the number is 0, an non-recurring funding cycle will get made.
        @param _fee The fee that this configuration will incure when tapping.
        @param _ballot The new ballot that will be used to approve subsequent reconfigurations.
        @param _metadata Data to store associated to this funding cycle configuration.
        @param _configureActiveFundingCycle If a funding cycle that has already started should be configurable.

        @return fundingCycleId The ID of the funding cycle that the configuration will take effect during.
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
    ) external override onlyAdmin returns (uint256 fundingCycleId) {
        // Target must be greater than 0.
        require(_target > 0, "FundingCycles::configure: BAD_TARGET");

        // Duration must be greater than 0, and must fit in a uint24.
        require(
            _duration > 0 && _duration <= type(uint24).max,
            "FundingCycles::configure: BAD_DURATION"
        );

        // Discount rate token must be less than or equal to 100%.
        require(
            _discountRate <= 200,
            "FundingCycles::configure: BAD_DISCOUNT_RATE"
        );

        // Currency must fit into a uint8.
        require(
            _currency <= type(uint8).max,
            "FundingCycles::configure: BAD_CURRENCY"
        );

        // Fee must be less than or equal to 100%.
        assert(_fee <= 200);

        // Set the configuration timestamp to now.
        uint256 _configured = block.timestamp;

        // Gets the ID of the funding cycle to reconfigure.
        fundingCycleId = _configurable(
            _projectId,
            _configured,
            _configureActiveFundingCycle
        );

        // Save the configuration efficiently.
        _packAndStoreConfigurationProperties(
            fundingCycleId,
            _configured,
            _ballot,
            _duration,
            _currency,
            _fee,
            _discountRate
        );

        // Set the target amount.
        targetAmounts[fundingCycleId] = _target;

        // Set the metadata.
        metadata[fundingCycleId] = _metadata;

        emit Configure(
            fundingCycleId,
            _projectId,
            _configured,
            _target,
            _currency,
            _duration,
            _discountRate,
            _metadata,
            _ballot,
            msg.sender
        );
    }

    /** 
      @notice 
      Tap funds from a project's currently tappable funding cycle.

      @param _projectId The ID of the project being tapped.
      @param _amount The amount of being tapped.

      @return fundingCycleId The ID of the funding cycle that was tapped from.
    */
    function tap(uint256 _projectId, uint256 _amount)
        external
        override
        onlyAdmin
        returns (uint256 fundingCycleId)
    {
        // Get a reference to the funding cycle being tapped.
        fundingCycleId = _tappable(_projectId);

        // Get a reference to how much has already been tapped from this funding cycle.
        uint256 _tappedAmount = tappedAmounts[fundingCycleId];

        // Amount must be within what is still tappable.
        require(
            _amount <= targetAmounts[fundingCycleId] - _tappedAmount,
            "FundingCycles::tap: INSUFFICIENT_FUNDS"
        );

        // The new amount that has been tapped.
        uint256 _newTappedAmount = _tappedAmount + _amount;

        // Add the amount to the funding cycle's tapped amount.
        tappedAmounts[fundingCycleId] = _newTappedAmount;

        emit Tap(
            fundingCycleId,
            _projectId,
            _amount,
            _newTappedAmount,
            msg.sender
        );
    }

    // --- private helper functions --- //

    /**
        @notice 
        Returns the configurable funding cycle for this project if it exists, 
        otherwise creates one.

        @param _projectId The ID of the project being looked through.
        @param _configured The time at which the configuration is occuring.
        @param _configureActiveFundingCycle If the active funding cycle should be configurable. Otherwise the next funding cycle will be used.

        @return fundingCycleId The ID of the configurable funding cycle.
    */
    function _configurable(
        uint256 _projectId,
        uint256 _configured,
        bool _configureActiveFundingCycle
    ) private returns (uint256 fundingCycleId) {
        // Get the standby funding cycle's ID.
        fundingCycleId = _standby(_projectId);

        // If it exists, return it.
        if (fundingCycleId > 0) return fundingCycleId;

        // Get the active funding cycle's ID.
        uint256 _eligibleFundingCycleId = _eligible(_projectId);

        // If the ID of an eligible funding cycle exists, it's approved, and active funding cycles are configurable, and its approved, return it.
        if (
            _eligibleFundingCycleId > 0 &&
            _configureActiveFundingCycle &&
            _isIdApproved(_eligibleFundingCycleId)
        ) return _eligibleFundingCycleId;

        // Get the ID of the latest funding cycle which has the latest reconfiguration.
        fundingCycleId = latestId[_projectId];

        // Determine which funding cycle to base the configurable one on.
        FundingCycle memory _fundingCycle;

        // Determine if the configurable funding cycle can only take effect on or after a certain date.
        uint256 _mustStartOnOrAfter;

        // If there is a funding cycle, base the next funding cycle on it.
        if (fundingCycleId > 0) {
            // Base off of the active funding cycle if it exists.
            _fundingCycle = _getStruct(
                fundingCycleId,
                true,
                true,
                false,
                false
            );

            // Make sure the funding cycle is recurring.
            require(
                _fundingCycle.discountRate > 0,
                "FundingCycles::_configurable: NON_RECURRING"
            );

            if (_configureActiveFundingCycle) {
                // Set to the start time of the current active start time.
                uint256 _timeFromStartMultiple =
                    (block.timestamp - _fundingCycle.start) %
                        _fundingCycle.duration;
                _mustStartOnOrAfter = block.timestamp - _timeFromStartMultiple;
            } else {
                // The ballot must have ended.
                uint256 _ballotExpiration =
                    _configured +
                        IFundingCycleBallot(_fundingCycle.ballot).duration();

                _mustStartOnOrAfter = block.timestamp > _ballotExpiration
                    ? block.timestamp
                    : _ballotExpiration;
            }
        } else {
            _mustStartOnOrAfter = block.timestamp;
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
        Returns the one funding cycle that can be tapped at the time of the call.

        @param _projectId The ID of the project being looked through.

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

        // If the ID of an eligible funding cycle exists,
        // check to see if it has been approved by the based funding cycle's ballot.
        if (fundingCycleId > 0) {
            // Get the necessary properties for the funding cycle.
            FundingCycle memory _eligibleFundingCycle =
                _getStruct(fundingCycleId, true, true, false, false);

            // Check to see if the cycle is approved. If so, return it.
            if (_isApproved(_eligibleFundingCycle)) return fundingCycleId;

            // If it hasn't been approved, set the ID to be the base funding cycle,
            // which carries the last approved configuration.
            fundingCycleId = _eligibleFundingCycle.basedOn;
        } else {
            // No upcoming funding cycle found that is eligible to become active, clone the latest active funding cycle.
            // which carries the last approved configuration.
            fundingCycleId = latestId[_projectId];
        }

        // The funding cycle cant be 0.
        require(fundingCycleId > 0, "FundingCycles::_tappable: NOT_FOUND");

        // Get the properties of the funding cycle.
        FundingCycle memory _fundingCycle =
            _getStruct(fundingCycleId, true, true, true, true);

        // Funding cycles with a discount rate of 0 are non-recurring.
        require(
            _fundingCycle.discountRate > 0,
            "FundingCycles::_tappable: NON_RECURRING"
        );

        // Return the tappable funding cycle.
        fundingCycleId = _init(
            _projectId,
            _fundingCycle,
            block.timestamp,
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
        latestId[_projectId] = count;

        // Set the intrinsic properties depending on whether or not a base funding cycle was specified.
        uint256 _start;
        uint256 _weight;
        uint256 _number;
        uint256 _basedOn;

        if (_baseFundingCycle.id > 0) {
            _start = _deriveStart(_baseFundingCycle, _mustStartOnOrAfter);
            _weight = _deriveWeight(_baseFundingCycle, _start);
            _number = _deriveNumber(_baseFundingCycle, _start);
            _basedOn = _baseFundingCycle.id;

            // Copy if needed.
            if (_copy) {
                packedConfigurationProperties[
                    count
                ] = packedConfigurationProperties[_baseFundingCycle.id];
                metadata[count] = metadata[_baseFundingCycle.id];
                targetAmounts[count] = targetAmounts[_baseFundingCycle.id];
            }
        } else {
            _weight = BASE_WEIGHT;
            _number = 1;
            _basedOn = 0;
            _start = block.timestamp;
        }

        // Save the intrinsic properties efficiently.
        _packAndStoreIntrinsicProperties(
            count,
            _projectId,
            _weight,
            _number,
            _basedOn,
            _start
        );

        emit Init(count, _projectId, _number, _basedOn, _weight, _start);

        return count;
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
        fundingCycleId = latestId[_projectId];

        // If there isn't one, theres also no standy funding cycle.
        if (fundingCycleId == 0) return 0;

        // Get the necessary properties for the latest funding cycle.
        FundingCycle memory _fundingCycle =
            _getStruct(fundingCycleId, true, false, false, false);

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
        fundingCycleId = latestId[_projectId];

        // If the latest funding cycle doesn't exist, return an undefined funding cycle.
        if (fundingCycleId == 0) return 0;

        // Get the necessary properties for the latest funding cycle.
        FundingCycle memory _fundingCycle =
            _getStruct(fundingCycleId, true, true, false, false);

        // If the latest is expired, return an undefined funding cycle.
        if (block.timestamp >= _fundingCycle.start + _fundingCycle.duration)
            return 0;

        // The first funding cycle when running on local can be in the future for some reason.
        // This will have no effect in production.
        if (_fundingCycle.basedOn == 0) return fundingCycleId;

        // An Active funding cycle must be either the latest funding cycle or the
        // one immediately before it.
        if (block.timestamp >= _fundingCycle.start) return fundingCycleId;

        // Return the funding cycle immediately before the latest.
        fundingCycleId = _fundingCycle.basedOn;
    }

    /** 
        @notice 
        A view of the funding cycle that would be created after this one if the project doesn't make a reconfiguration.

        @param _fundingCycle The funding cycle to make the calculation for.

        @return The next funding cycle, with an ID set to 0.
    */
    function _mockFundingCycleAfter(FundingCycle memory _fundingCycle)
        internal
        view
        returns (FundingCycle memory)
    {
        // Can't mock a non recurring funding cycle.
        require(
            _fundingCycle.discountRate > 0,
            "FundingCycles::_mockFundingCycleAfter: NON_RECURRING"
        );

        uint256 _start = _deriveStart(_fundingCycle, block.timestamp);
        return
            FundingCycle(
                0,
                _fundingCycle.projectId,
                _deriveNumber(_fundingCycle, _start),
                _fundingCycle.id,
                _fundingCycle.configured,
                _deriveWeight(_fundingCycle, _start),
                _fundingCycle.ballot,
                _start,
                _fundingCycle.duration,
                _fundingCycle.target,
                _fundingCycle.currency,
                _fundingCycle.fee,
                _fundingCycle.discountRate,
                0,
                _fundingCycle.metadata
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
        // weight in first 64 bytes.
        uint256 packed = _weight;
        // projectId in bytes 65-112 bytes.
        packed |= _projectId << 64;
        // number in bytes 113-160 bytes.
        packed |= _number << 112;
        // basedOn in bytes 161-208 bytes.
        packed |= _basedOn << 160;
        // start in bytes 209-256 bytes.
        packed |= _start << 208;

        // Set in storage.
        packedIntrinsicProperties[_fundingCycleId] = packed;
    }

    /**
      @notice 
      Efficiently stores a funding cycles provided configuration properties.

      @param _fundingCycleId The ID of the funding cycle to pack and store.
      @param _configured The timestamp of the configuration.
      @param _ballot The ballot to use for future reconfiguration approvals. 
      @param _duration The duration of the funding cycle.
      @param _currency The currency of the funding cycle.
      @param _fee The fee of the funding cycle.
      @param _discountRate The discount rate of the based funding cycle.
     */
    function _packAndStoreConfigurationProperties(
        uint256 _fundingCycleId,
        uint256 _configured,
        IFundingCycleBallot _ballot,
        uint256 _duration,
        uint256 _currency,
        uint256 _fee,
        uint256 _discountRate
    ) private {
        // ballot in first 160 bytes.
        uint256 packed = uint160(address(_ballot));
        // configured in bytes 161-208 bytes.
        packed |= _configured << 160;
        // duration in bytes 209-232 bytes.
        packed |= _duration << 208;
        // basedOn in bytes 233-240 bytes.
        packed |= _currency << 232;
        // fee in bytes 241-248 bytes.
        packed |= _fee << 240;
        // discountRate in bytes 249-256 bytes.
        packed |= _discountRate << 248;

        // Set in storage.
        packedConfigurationProperties[_fundingCycleId] = packed;
    }

    /**
        @notice 
        Unpack a funding cycle's packed stored values into an easy-to-work-with funding cycle struct.

        @param _id The ID of the funding cycle to get a struct of.
        @param _includeIntrinsicProperties Whether to unpack instrinsic properties in the struct.
        @param _includeConfigurationProperties Whether to unpack configuration properties in the struct.
        @param _includeAmounts Whether to include the target and tapped amounts in the struct.
        @param _includeMetadata Whether to include the metadata in the struct.

        @return _fundingCycle The funding cycle struct.
    */
    function _getStruct(
        uint256 _id,
        bool _includeIntrinsicProperties,
        bool _includeConfigurationProperties,
        bool _includeAmounts,
        bool _includeMetadata
    ) private view returns (FundingCycle memory _fundingCycle) {
        _fundingCycle.id = _id;

        if (_includeIntrinsicProperties) {
            uint256 _packedIntrinsicProperties = packedIntrinsicProperties[_id];

            _fundingCycle.weight = uint256(uint64(_packedIntrinsicProperties));
            _fundingCycle.projectId = uint256(
                uint48(_packedIntrinsicProperties >> 64)
            );
            _fundingCycle.number = uint256(
                uint48(_packedIntrinsicProperties >> 112)
            );
            _fundingCycle.basedOn = uint256(
                uint48(_packedIntrinsicProperties >> 160)
            );
            _fundingCycle.start = uint256(
                uint48(_packedIntrinsicProperties >> 208)
            );
        }
        if (_includeConfigurationProperties) {
            uint256 _packedConfigurationProperties =
                packedConfigurationProperties[_id];
            _fundingCycle.ballot = IFundingCycleBallot(
                address(uint160(_packedConfigurationProperties))
            );
            _fundingCycle.configured = uint256(
                uint48(_packedConfigurationProperties >> 160)
            );
            _fundingCycle.duration = uint256(
                uint24(_packedConfigurationProperties >> 208)
            );
            _fundingCycle.currency = uint256(
                uint8(_packedConfigurationProperties >> 232)
            );
            _fundingCycle.fee = uint256(
                uint8(_packedConfigurationProperties >> 240)
            );
            _fundingCycle.discountRate = uint256(
                uint8(_packedConfigurationProperties >> 248)
            );
        }
        if (_includeAmounts) {
            _fundingCycle.target = targetAmounts[_id];
            _fundingCycle.tapped = tappedAmounts[_id];
        }
        if (_includeMetadata) _fundingCycle.metadata = metadata[_id];
    }

    /** 
        @notice 
        The date that is the nearest multiple of the specified funding cycle's duration from its end.

        @param _fundingCycle The funding cycle to make the calculation for.
        @param _mustStartOnOrAfter A date that the derived start must be on or come after.

        @return result start The next start time.
    */
    function _deriveStart(
        FundingCycle memory _fundingCycle,
        uint256 _mustStartOnOrAfter
    ) internal pure returns (uint256 result) {
        // The time when the funding cycle immediately after the specified funding cycle starts.
        uint256 _nextImmediateStart =
            _fundingCycle.start + _fundingCycle.duration;

        // If the next immediate start is now or in the future, return it.
        if (_nextImmediateStart >= _mustStartOnOrAfter)
            return _nextImmediateStart;

        // Otherwise, use the closest multiple of the duration from the old end.
        uint256 _timeFromImmediateStartMultiple =
            (_mustStartOnOrAfter - _nextImmediateStart) %
                _fundingCycle.duration;

        // If the minimum start date is possible, use it.
        if (_timeFromImmediateStartMultiple == 0) return _mustStartOnOrAfter;

        // Otherwise use an increment of the duration from the most recent start.
        result =
            _mustStartOnOrAfter -
            _timeFromImmediateStartMultiple +
            _fundingCycle.duration;

        // Add increments of duration as necessary to satisfy the threshold.
        while (_mustStartOnOrAfter > result)
            result = result + _fundingCycle.duration;
    }

    /** 
        @notice 
        The accumulated weight change since the specified funding cycle.

        @param _fundingCycle The funding cycle to make the calculation with.
        @param _start The start time to derive a weight for.

        @return start The next weight.
    */
    function _deriveWeight(FundingCycle memory _fundingCycle, uint256 _start)
        internal
        pure
        returns (uint256)
    {
        // The number of times to apply the discount rate.
        uint256 _discountMultiple =
            (_start - _fundingCycle.start) / _fundingCycle.duration;

        // Base the new weight on the specified funding cycle's weight.
        return
            PRBMathCommon.mulDiv(
                _fundingCycle.weight,
                _fundingCycle.discountRate**_discountMultiple,
                200**_discountMultiple
            );
    }

    /** 
        @notice 
        The number of next funding cycle given the specified funding cycle.

        @param _fundingCycle The funding cycle to make the calculation with.
        @param _start The start time to derive a number for.

        @return start The next number.
    */
    function _deriveNumber(FundingCycle memory _fundingCycle, uint256 _start)
        internal
        pure
        returns (uint256)
    {
        return
            _fundingCycle.number +
            ((_start - _fundingCycle.start) / _fundingCycle.duration);
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
        FundingCycle memory _fundingCycle =
            _getStruct(_fundingCycleId, true, true, false, false);
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

        // Get a reference to the ballot to use.
        // The ballot is stored in bits 0-159 of the packed configuration properties.
        IFundingCycleBallot _ballot =
            IFundingCycleBallot(
                address(
                    uint160(
                        packedConfigurationProperties[_ballotFundingCycleId]
                    )
                )
            );

        // If there is no ballot, the ID is auto approved.
        // Otherwise, return the ballot's state.
        return
            _ballot == IFundingCycleBallot(address(0))
                ? BallotState.Approved
                : _ballot.state(_id, _configuration);
    }
}
