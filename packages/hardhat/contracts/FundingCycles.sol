// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "prb-math/contracts/PRBMathCommon.sol";

import "./interfaces/IFundingCycles.sol";
import "./interfaces/IPrices.sol";
import "./abstract/Administered.sol";

/** 
  @notice An immutable contract to manage funding cycle configurations.
*/
contract FundingCycles is Administered, IFundingCycles {
    // --- private properties --- //

    mapping(uint256 => uint256) private packedConfigurationProperties;
    mapping(uint256 => uint256) private packedIntrinsicProperties;
    mapping(uint256 => uint256) private metadata;
    mapping(uint256 => uint256) private targetAmounts;
    mapping(uint256 => uint256) private tappedAmounts;

    // The official record of all funding cycles ever created.

    // --- public properties --- //

    // The starting weight for each project's first funding cycle.
    uint256 public constant override BASE_WEIGHT = 1E19;

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
        returns (FundingCycle memory)
    {
        require(
            _fundingCycleId > 0 && _fundingCycleId <= count,
            "FundingCycle::get: NOT_FOUND"
        );
        return _getStruct(_fundingCycleId, true, true, true, true);
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
        returns (FundingCycle memory)
    {
        // Get a reference to the standby funding cycle.
        uint256 _standbyFundingCycleId = _standby(_projectId);

        // If it exists, return it.
        if (_standbyFundingCycleId > 0)
            return _getStruct(_standbyFundingCycleId, true, true, true, true);

        // Get a reference to the active funding cycle.
        uint256 _activeFundingCycleId = _active(_projectId);

        // If it exists, return its next up.
        if (_activeFundingCycleId > 0)
            return
                _mockFundingCycleAfter(
                    _getStruct(_activeFundingCycleId, true, true, true, true)
                );

        // Get the latest funding cycle.
        uint256 _latestFundingCycleId = latestId[_projectId];

        // A funding cycle must exist.
        require(
            _latestFundingCycleId > 0,
            "FundingCycle::getQueued: NOT_FOUND"
        );

        // Return the second next up.
        return
            _mockFundingCycleAfter(
                _mockFundingCycleAfter(
                    _getStruct(_latestFundingCycleId, true, true, true, true)
                )
            );
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
        returns (FundingCycle memory fundingCycle)
    {
        require(
            latestId[_projectId] > 0,
            "FundingCycle::getCurrent: NOT_FOUND"
        );
        // Check if there is an active funding cycle.
        uint256 _fundingCycleId = _active(_projectId);

        if (_fundingCycleId > 0)
            return _getStruct(_fundingCycleId, true, true, true, true);

        // No active funding cycle found, check if there is a standby funding cycle.
        _fundingCycleId = _standby(_projectId);

        // Funding cycle if exists, has been approved by the previous funding cycle's ballot.
        if (_fundingCycleId > 0) {
            FundingCycle memory _standbyFundingCycle =
                _getStruct(_fundingCycleId, true, false, false, false);
            if (
                _ballotState(
                    _standbyFundingCycle.id,
                    _standbyFundingCycle.previous,
                    _standbyFundingCycle.configured
                ) == BallotState.Approved
            ) return _standbyFundingCycle;
            _fundingCycleId = _standbyFundingCycle.previous;
        } else {
            // No upcoming funding cycle found that is eligible to become active, clone the latest active funding cycle.
            // Use the standby funding cycle's previous funding cycle if it exists but doesn't meet activation criteria.
            _fundingCycleId = latestId[_projectId];
        }

        require(_fundingCycleId > 0, "FundingCycle::getCurrent: NOT_FOUND");

        FundingCycle memory _fundingCycle =
            _getStruct(_fundingCycleId, true, true, true, true);

        // Funding cycles with a discountRate of 0 are non-recurring.
        require(
            _fundingCycle.discountRate > 0,
            "FundingCycle::getCurrent: NON_RECURRING"
        );

        return _mockFundingCycleAfter(_fundingCycle);
    }

    /** 
      @notice Checks whether a project has a pending reconfiguration.
      @param _projectId The ID of the project to check for a pending reconfiguration.
      @return Whether or not the project has a pending approval.
    */
    function currentBallotState(uint256 _projectId)
        external
        view
        override
        returns (BallotState)
    {
        // Get a reference to the latest funding cycle.
        uint256 _fundingCycleId = latestId[_projectId];

        // Get the latest funding cycle's packed intrinsic properties.
        uint256 _packedIntrinsicProperties =
            packedIntrinsicProperties[_fundingCycleId];
        // The previous is packed in bits 161-208
        uint256 _previous = uint256(uint48(_packedIntrinsicProperties >> 160));
        // The start is packed in bits 208-256
        uint256 _start = uint256(uint48(_packedIntrinsicProperties >> 208));

        // If the latest funding cycle is the first, or if it has already started, it must be approved.
        if (_previous == 0 || _start < block.timestamp)
            return BallotState.Approved;

        // The configured is packed in bits 161-208
        uint256 _configured =
            uint256(
                uint48(packedConfigurationProperties[_fundingCycleId] >> 160)
            );

        return _ballotState(_fundingCycleId, _previous, _configured);
    }

    // --- external transactions --- //

    constructor() {}

    // /**
    //     @notice Configures the sustainability target and duration of the sender's current funding cycle if it hasn't yet received sustainments, or
    //     sets the properties of the funding cycle that will take effect once the current one expires.
    //     @dev The msg.sender is the project of the funding cycle.
    //     @param _projectId The ID of the project being reconfigured.
    //     @param _target The amount that the project wants to receive in this funding stage. Sent as a wad.
    //     @param _currency The currency of the `target`. Send 0 for ETH or 1 for USD.
    //     @param _duration The duration of the funding stage for which the `target` amount is needed. Measured in seconds.
    //     @param _discountRate A number from 0-200 indicating how valuable a contribution to this funding stage is compared to the project's previous funding stage.
    //     If it's 200, each funding stage will have equal weight.
    //     If the number is 180, a contribution to the next funding stage will only give you 90% of tickets given to a contribution of the same amount during the current funding stage.
    //     If the number is 0, an non-recurring funding stage will get made.
    //     @param _fee The fee that this configuration will incure when tapping.
    //     @param _ballot The new ballot that will be used to approve subsequent reconfigurations.
    //     @param _metadata Data to store with the funding cycle.
    //     @param _configureActiveFundingCycle If the active funding cycle should be configurable.
    //     @return The ID of the funding cycle that was successfully configured.
    // */
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
        require(_target > 0, "FundingCycles::reconfigure: BAD_TARGET");

        // Duration must be greater than 0.
        require(_duration > 0, "FundingCycles::reconfigure: BAD_DURATION");

        // The `discountRate` token must be between 0% and 100%.
        require(
            _discountRate >= 0 && _discountRate <= 200,
            "FundingCycles::deploy: BAD_DISCOUNT_RATE"
        );

        // Return's the project's editable funding cycle. Creates one if one doesn't already exists.
        fundingCycleId = _ensureConfigurable(
            _projectId,
            _configureActiveFundingCycle
        );

        _packAndSaveConfigurationProperties(
            fundingCycleId,
            block.timestamp,
            _ballot,
            _duration,
            _currency,
            _fee,
            _discountRate
        );

        targetAmounts[fundingCycleId] = _target;
        metadata[fundingCycleId] = _metadata;
    }

    /** 
      @notice Tracks a project tapping its funds.
      @param _projectId The ID of the project being tapped.
      @param _amount The amount of being tapped.
      @return fundingCycleId The ID of the funding cycle that was successfully configured.
    */
    function tap(uint256 _projectId, uint256 _amount)
        external
        override
        onlyAdmin
        returns (uint256 fundingCycleId)
    {
        // Get a reference to the funding cycle being tapped.
        fundingCycleId = _ensureActive(_projectId);
        uint256 _tappedAmount = tappedAmounts[fundingCycleId];

        // Amount must be within what is still tappable.
        require(
            _amount <= targetAmounts[fundingCycleId] - _tappedAmount,
            "FundingCycles::tap: INSUFFICIENT_FUNDS"
        );

        // Add the amount to the funding cycle's tapped amount.
        tappedAmounts[fundingCycleId] = _tappedAmount + _amount;
    }

    // --- private helper functions --- //

    // /**
    //     @notice Returns the configurable funding cycle for this project if it exists, otherwise making one appropriately.
    //     @param _projectId The ID of the project to which the funding cycle being looked for belongs.
    //     @param _configureActiveFundingCycle If the active funding cycle should be configurable.
    //     @return fundingCycle The resulting funding cycle.
    // */
    function _ensureConfigurable(
        uint256 _projectId,
        bool _configureActiveFundingCycle
    ) private returns (uint256 fundingCycleId) {
        // Cannot update active funding cycle, check if there is a standby funding cycle.
        fundingCycleId = _standby(_projectId);
        if (fundingCycleId > 0) return fundingCycleId;
        // Get the latest funding cycle.
        fundingCycleId = latestId[_projectId];

        // If there's an active funding cycle, its end time should correspond to the start time of the new funding cycle.
        uint256 _aFundingCycleId = _active(_projectId);

        // Return the active funding cycle if allowed.
        if (_aFundingCycleId > 0 && _configureActiveFundingCycle)
            return _aFundingCycleId;

        if (_aFundingCycleId == 0) {
            //Base a new funding cycle on the latest funding cycle if one exists.
            fundingCycleId = _init(_projectId, block.timestamp, 0, false);
        } else {
            FundingCycle memory _aFundingCycle =
                _getStruct(_aFundingCycleId, true, true, false, false);

            // Make sure the funding cycle is recurring.
            require(
                _aFundingCycle.discountRate > 0,
                "FundingCycle::_configureActiveFundingCycle: NON_RECURRING"
            );
            //Base a new funding cycle on the latest funding cycle if one exists.
            fundingCycleId = _init(
                _projectId,
                _aFundingCycle.start + _aFundingCycle.duration,
                fundingCycleId,
                false
            );
        }
    }

    // /**
    //     @notice Returns the active funding cycle for this project if it exists, otherwise activating one appropriately.
    //     @param _projectId The ID of the project to which the funding cycle being looked for belongs.
    //     @return fundingCycle The resulting funding cycle.
    // */
    function _ensureActive(uint256 _projectId)
        private
        returns (uint256 fundingCycleId)
    {
        // Check if there is an active funding cycle.
        fundingCycleId = _active(_projectId);
        if (fundingCycleId > 0) return fundingCycleId;

        // No active funding cycle found, check if there is a standby funding cycle.
        fundingCycleId = _standby(_projectId);

        // Funding cycle if exists, has been in standby for enough time to become eligible.
        if (fundingCycleId > 0) {
            FundingCycle memory _standbyFundingCycle =
                _getStruct(fundingCycleId, true, false, false, false);
            if (
                _ballotState(
                    _standbyFundingCycle.id,
                    _standbyFundingCycle.previous,
                    _standbyFundingCycle.configured
                ) == BallotState.Approved
            ) return fundingCycleId;
            fundingCycleId = _standbyFundingCycle.previous;
        } else {
            // No upcoming funding cycle found that is eligible to become active, clone the latest active funding cycle.
            // Use the standby funding cycle's previous funding cycle if it exists but doesn't meet activation criteria.
            fundingCycleId = latestId[_projectId];
        }

        require(fundingCycleId > 0, "FundingCycle::_ensureActive: NOT_FOUND");

        FundingCycle memory _fundingCycle =
            _getStruct(fundingCycleId, true, true, true, true);

        // Funding cycles with a discountRate of 0 are non-recurring.
        require(
            _fundingCycle.discountRate > 0,
            "FundingCycle::_ensureActive: NON_RECURRING"
        );

        // Use a start date that's a multiple of the duration.
        // This creates the effect that there have been scheduled funding cycles ever since the `latest`, even if `latest` is a long time in the past.
        fundingCycleId = _init(
            _projectId,
            _determineNextStart(_fundingCycle),
            fundingCycleId,
            true
        );
    }

    // /**
    //     @notice Initializes a funding cycle to be sustained for the sending address.
    //     @param _projectId The ID of the project to which the funding cycle being initialized belongs.
    //     @param _start The start time for the new funding cycle.
    //     @param _latestFundingCycle The latest funding cycle for the project.
    //     @return newFundingCycle The initialized funding cycle.
    // */
    function _init(
        uint256 _projectId,
        uint256 _start,
        uint256 _latestFundingCycleId,
        bool _copy
    ) private returns (uint256 newFundingCycleId) {
        count++;
        latestId[_projectId] = count;

        uint256 _weight;
        uint256 _number;
        uint256 _previous;
        if (_latestFundingCycleId > 0) {
            FundingCycle memory _latestFundingCycle =
                _getStruct(_latestFundingCycleId, true, true, false, false);

            _weight = PRBMathCommon.mulDiv(
                _latestFundingCycle.weight,
                _latestFundingCycle.discountRate,
                200
            );
            _number = _latestFundingCycle.number + 1;
            _previous = _latestFundingCycle.id;

            if (_copy) {
                packedConfigurationProperties[
                    count
                ] = packedConfigurationProperties[_latestFundingCycleId];
                metadata[count] = metadata[_latestFundingCycleId];
                targetAmounts[count] = targetAmounts[_latestFundingCycleId];
            }
        } else {
            _weight = BASE_WEIGHT;
            _number = 1;
            _previous = 0;
        }
        _packAndSaveIntrinsicProperties(
            count,
            _projectId,
            _weight,
            _number,
            _previous,
            _start
        );

        return count;
    }

    // /**
    //     @notice An project's funding cycle that hasn't yet started.
    //     @param _projectId The ID of project to which the funding cycle being looked for belongs.
    //     @return fundingCycle The standby funding cycle.
    // */
    function _standby(uint256 _projectId)
        private
        view
        returns (uint256 fundingCycleId)
    {
        fundingCycleId = latestId[_projectId];
        if (fundingCycleId == 0) return 0;

        FundingCycle memory _fundingCycle =
            _getStruct(fundingCycleId, true, false, false, false);

        // There is no upcoming funding cycle if the latest funding cycle has already started.
        if (block.timestamp >= _fundingCycle.start) return 0;
    }

    // /**
    //     @notice The funding cycle for a project that has started and hasn't yet expired.
    //     @param _projectId The ID of the project to which the funding cycle being looked for belongs.
    //     @return fundingCycle active funding cycle.
    // */
    function _active(uint256 _projectId)
        private
        view
        returns (uint256 fundingCycleId)
    {
        // Get a reference to the latest.
        fundingCycleId = latestId[_projectId];

        FundingCycle memory _fundingCycle =
            _getStruct(fundingCycleId, true, true, false, false);

        // If the latest funding cycle doesn't exist, or if its expired, return the 0th empty cycle.
        if (
            fundingCycleId == 0 ||
            block.timestamp > _fundingCycle.start + _fundingCycle.duration
        ) return 0;

        // An Active funding cycle must be either the latest funding cycle or the
        // one immediately before it.
        if (
            block.timestamp >= _fundingCycle.start ||
            // The first funding cycle on local can be in the future for some reason.
            _fundingCycle.previous == 0
        ) return fundingCycleId;

        fundingCycleId = _fundingCycle.previous;
    }

    /** 
        @notice A view of the funding cycle that would be created after this one if the project doesn't make a reconfiguration.
        @param _fundingCycle The funding cycle to make the calculation for.
        @return The next funding cycle, with an ID set to 0.
    */
    function _mockFundingCycleAfter(FundingCycle memory _fundingCycle)
        internal
        view
        returns (FundingCycle memory)
    {
        return
            FundingCycle(
                0,
                _fundingCycle.projectId,
                _fundingCycle.number + 1,
                _fundingCycle.id,
                _fundingCycle.configured,
                PRBMathCommon.mulDiv(
                    _fundingCycle.weight,
                    _fundingCycle.discountRate,
                    200
                ),
                _fundingCycle.ballot,
                _determineNextStart(_fundingCycle),
                _fundingCycle.duration,
                _fundingCycle.target,
                _fundingCycle.currency,
                _fundingCycle.fee,
                _fundingCycle.discountRate,
                0,
                _fundingCycle.metadata
            );
    }

    // /**
    //   @notice Validate and pack the funding cycle metadata.
    //   @param _metadata The metadata to validate and pack.
    //   @return packed The packed uint256 of all metadata params. The first 8 bytes specify the version.
    //  */
    function _packAndSaveIntrinsicProperties(
        uint256 _fundingCycleId,
        uint256 _projectId,
        uint256 _weight,
        uint256 _number,
        uint256 _previous,
        uint256 _start
    ) private {
        // weight in first 64 bytes.
        uint256 packed = _weight;
        // projectId in bytes 65-112 bytes.
        packed |= _projectId << 64;
        // number in bytes 113-160 bytes.
        packed |= _number << 112;
        // previous in bytes 161-208 bytes.
        packed |= _previous << 160;
        // start in bytes 209-256 bytes.
        packed |= _start << 208;

        packedIntrinsicProperties[_fundingCycleId] = packed;
    }

    function _packAndSaveConfigurationProperties(
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
        // previous in bytes 233-240 bytes.
        packed |= _currency << 232;
        // fee in bytes 241-248 bytes.
        packed |= _fee << 240;
        // discountRate in bytes 249-256 bytes.
        packed |= _discountRate << 248;

        packedConfigurationProperties[_fundingCycleId] = packed;
    }

    // /**
    //     @notice Whether a funding cycle configuration is currently approved.
    //     @param _fundingCycle The funding cycle configuration to check the approval of.
    //     @return Whether the funding cycle's configuration is approved.
    // */
    function _ballotState(
        uint256 _id,
        uint256 _ballotFundingCycleId,
        uint256 _configuration
    ) private view returns (BallotState) {
        // If there is no ballot funding cycle, the id is auto approved.
        if (_ballotFundingCycleId == 0) return BallotState.Approved;

        IFundingCycleBallot _ballot =
            IFundingCycleBallot(
                address(
                    uint160(
                        packedConfigurationProperties[_ballotFundingCycleId]
                    )
                )
            );

        // If there is no ballot, the id is auto approved.
        return
            _ballot == IFundingCycleBallot(address(0))
                ? BallotState.Approved
                : _ballot.state(_id, _configuration);
    }

    function _getStruct(
        uint256 _fundingCycleId,
        bool _includeIntrinsicProperties,
        bool _includeConfigurationProperties,
        bool _includeAmounts,
        bool _includeMetadata
    ) private view returns (FundingCycle memory _fundingCycle) {
        _fundingCycle.id = _fundingCycleId;
        if (_includeIntrinsicProperties) {
            uint256 _packedIntrinsicProperties =
                packedIntrinsicProperties[_fundingCycleId];

            _fundingCycle.weight = uint256(uint64(_packedIntrinsicProperties));
            _fundingCycle.projectId = uint256(
                uint48(_packedIntrinsicProperties >> 64)
            );
            _fundingCycle.number = uint256(
                uint48(_packedIntrinsicProperties >> 112)
            );
            _fundingCycle.previous = uint256(
                uint48(_packedIntrinsicProperties >> 160)
            );
            _fundingCycle.start = uint256(
                uint48(_packedIntrinsicProperties >> 208)
            );
        }
        if (_includeConfigurationProperties) {
            uint256 _packedConfigurationProperties =
                packedConfigurationProperties[_fundingCycleId];
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
            _fundingCycle.target = targetAmounts[_fundingCycleId];
            _fundingCycle.tapped = tappedAmounts[_fundingCycleId];
        }
        if (_includeMetadata)
            _fundingCycle.metadata = metadata[_fundingCycleId];
    }

    /** 
        @notice The date that is the nearest multiple of duration from oldEnd.
        @param _fundingCycle The funding cycle to make the calculation for.
        @return start The date.
    */
    function _determineNextStart(FundingCycle memory _fundingCycle)
        internal
        view
        returns (uint256)
    {
        uint256 _end = _fundingCycle.start + _fundingCycle.duration;
        // Use the old end if the current time is still within the duration.
        if (block.timestamp < _end + _fundingCycle.duration) return _end;
        // Otherwise, use the closest multiple of the duration from the old end.
        uint256 _distanceToStart =
            (block.timestamp - _end) % _fundingCycle.duration;
        return block.timestamp - _distanceToStart;
    }
}
