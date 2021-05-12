// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./FullMath.sol";
import "./DSMath.sol";
import "./../interfaces/IFundingCycleBallot.sol";

/// @notice Funding cycle data and logic.
library FundingCycle {
    using SafeMath for uint256;

    /// @notice Possible states that a funding cycle may be in
    /// @dev Funding cycles's are immutable once they are active.
    enum State {Standby, Active, Expired}

    /// @notice The funding cycle structure represents a project stewarded by an address, and accounts for which addresses have helped sustain the project.
    struct Data {
        // The ballot contract to use to determine a subsequent funding cycle's reconfiguration status.
        IFundingCycleBallot ballot;
        // The ballot contract to use to determine this funding cycle's reconfiguration status.
        IFundingCycleBallot currentBallot;
        // The currency that the target is measured in.
        uint8 currency;
        // The percentage of each payment to send as a fee to the Juice admin.
        uint16 fee;
        // A percentage indicating how much more weight to give a funding cycle compared to its predecessor.
        uint16 discountRate;
        // The number of seconds until this funding cycle's surplus is redistributed.
        uint32 duration;
        // The time when this funding cycle will become active.
        uint48 start;
        // The time when this funding cycle was last configured.
        uint48 configured;
        // A unique number that's incremented for each new funding cycle, starting with 1.
        uint256 id;
        // The ID of the project contract that this funding cycle belongs to.
        uint256 projectId;
        // The number of this funding cycle for the project.
        uint256 number;
        // The ID of the project's funding cycle that came before this one. 0 if none.
        uint256 previous;
        // The amount that this funding cycle is targeting in terms of the currency.
        uint256 target;
        // The amount of available funds that have been tapped by the project in terms of the currency.
        uint256 tapped;
        // A number determining the amount of redistribution shares this funding cycle will issue to each sustainer.
        uint256 weight;
        // A packed list of extra data. The first 8 bytes are reserved for versioning.
        uint256 metadata;
    }

    // --- internal transactions --- //

    /**
        @notice Clones the properties from the base funding cycle.
        @dev The base must be the funding cycle directly preceeding self.
        @param _self The funding cycle to clone onto.
        @param _baseFundingCycle The funding cycle to clone from.
    */
    function _basedOn(Data storage _self, Data memory _baseFundingCycle)
        internal
    {
        _self.target = _baseFundingCycle.target;
        _self.currency = _baseFundingCycle.currency;
        _self.duration = _baseFundingCycle.duration;
        _self.projectId = _baseFundingCycle.projectId;
        _self.discountRate = _baseFundingCycle.discountRate;
        _self.metadata = _baseFundingCycle.metadata;
        _self.weight = _derivedWeight(_baseFundingCycle);
        _self.configured = _baseFundingCycle.configured;
        _self.number = _baseFundingCycle.number.add(1);
        _self.previous = _baseFundingCycle.id;
        _self.fee = _baseFundingCycle.fee;
        _self.ballot = _baseFundingCycle.ballot;

        // Use the base funding cycle's ballot as this funding cycle's current ballot.
        _self.currentBallot = _baseFundingCycle.ballot;
    }

    // --- internal views --- //

    /** 
        @notice The state the funding cycle is in.
        @param _self The funding cycle to get the state of.
        @return state The state.
    */
    function _state(Data memory _self) internal view returns (State) {
        if (_hasExpired(_self)) return State.Expired;
        if (_hasStarted(_self)) return State.Active;
        return State.Standby;
    }

    /** 
        @notice The date that is the nearest multiple of duration from oldEnd.
        @param _self The funding cycle to make the calculation for.
        @return start The date.
    */
    function _determineNextStart(Data memory _self)
        internal
        view
        returns (uint256)
    {
        uint256 _end = uint256(_self.start).add(uint256(_self.duration));
        // Use the old end if the current time is still within the duration.
        if (_end.add(_self.duration) > block.timestamp) return _end;
        // Otherwise, use the closest multiple of the duration from the old end.
        uint256 _distanceToStart =
            (block.timestamp.sub(_end)).mod(_self.duration);
        return block.timestamp.sub(_distanceToStart);
    }

    /** 
        @notice A view of the funding cycle that would be created after this one if the project doesn't make a reconfiguration.
        @param _self The funding cycle to make the calculation for.
        @return _fundingCycle The next funding cycle, with an ID set to 0.
    */
    function _nextUp(Data memory _self) internal view returns (Data memory) {
        return
            Data(
                _self.ballot,
                _self.currentBallot,
                _self.currency,
                _self.fee,
                _self.discountRate,
                _self.duration,
                uint32(_determineNextStart(_self)),
                _self.configured,
                0,
                _self.projectId,
                _self.number.add(1),
                _self.id,
                _self.target,
                0,
                _derivedWeight(_self),
                _self.metadata
            );
    }

    /** 
        @notice The weight derived from the current weight and the discountRate.
        @param _self The funding cycle to make the calculation for.
        @return _weight The new weight.
    */
    function _derivedWeight(Data memory _self) internal pure returns (uint256) {
        return FullMath.mulDiv(_self.weight, _self.discountRate, 1000);
    }

    /** 
        @notice The weight that a certain amount carries in this funding cycle.
        @param _self The funding cycle to get the weight from.
        @param _amount The amount to get the weight of in the same currency as the funding cycle's currency.
        @param _percentage The percentage to account for. Out of 1000.
        @return state The weighted amount.
    */
    function _weighted(
        Data memory _self,
        uint256 _amount,
        uint256 _percentage
    ) internal pure returns (uint256) {
        return
            FullMath.mulDiv(
                FullMath.mulDiv(_self.weight, _amount, _self.target),
                _percentage,
                1000
            );
    }

    /** 
        @notice Taps an amount from the funding cycle.
        @param _self The funding cycle to tap an amount from.
        @param _amount An amount to tap. In `currency`.
    */
    function _tap(Data storage _self, uint256 _amount) internal {
        // Amount must be within what is still tappable.
        require(
            _amount <= _self.target - _self.tapped,
            "FundingCycle: INSUFFICIENT_FUNDS"
        );

        // Add the amount to the funding cycle's tapped amount.
        _self.tapped = _self.tapped + _amount;
    }

    /** 
        @notice Check to see if the given funding cycle has started.
        @param _self The funding cycle to check.
        @return hasStarted The boolean result.
    */
    function _hasStarted(Data memory _self) internal view returns (bool) {
        return block.timestamp >= _self.start;
    }

    /** 
        @notice Check to see if the given funding cycle has expired.
        @param _self The funding cycle to check.
        @return hasExpired The boolean result.
    */
    function _hasExpired(Data memory _self) internal view returns (bool) {
        return block.timestamp > uint256(_self.start).add(_self.duration);
    }

    /** 
        @notice Whether a funding cycle configuration is currently approved.
        @param _self The funding cycle configuration to check the approval of.
        @return Whether the funding cycle's configuration is approved.
    */
    function _isConfigurationApproved(Data memory _self)
        internal
        view
        returns (bool)
    {
        return
            _self.currentBallot == IFundingCycleBallot(0) ||
            _self.currentBallot.isApproved(_self.id, _self.configured);
    }

    /** 
        @notice Whether a funding cycle configuration is currently pending approval.
        @param _self The funding cycle configuration to check the pending status of.
        @return Whether the funding cycle's configuration is pending approved.
    */
    function _isConfigurationPending(Data memory _self)
        internal
        view
        returns (bool)
    {
        return
            _self.currentBallot != IFundingCycleBallot(0) &&
            _self.currentBallot.isPending(_self.id, _self.configured);
    }
}
