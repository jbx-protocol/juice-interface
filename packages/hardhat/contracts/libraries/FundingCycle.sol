// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./FullMath.sol";
import "./DSMath.sol";

/// @notice Funding cycle data and logic.
library FundingCycle {
    using SafeMath for uint256;

    /// @notice Possible states that a funding cycle may be in
    /// @dev Funding cycles's are immutable once they are active.
    enum State {Standby, Active, Redistributing}

    /// @notice The funding cycle structure represents a project stewarded by an address, and accounts for which addresses have helped sustain the project.
    struct Data {
        // A unique number that's incremented for each new funding cycle, starting with 1.
        uint256 id;
        // The ID of the project contract that this funding cycle belongs to.
        uint256 projectId;
        // The number of this funding cycle for the project.
        uint256 number;
        // The ID of the project's funding cycle that came before this one. 0 if none.
        uint256 previous;
        // The amount that this funding cycle is targeting.
        uint256 target;
        // The currency that the target is measured in.
        uint256 currency;
        // The time when this funding cycle will become active.
        uint256 start;
        // The number of seconds until this funding cycle's surplus is redistributed.
        uint256 duration;
        // The amount of available funds that have been tapped by the project in terms of the currency.
        uint256 tappedTarget;
        // The amount of available funds that have been tapped by the project in terms of eth.
        uint256 tappedTotal;
        // The percentage of tickets to reserve for the project once the funding cycle has expired.
        uint256 reserved;
        // The percentage of each payment to send as a fee to the Juice admin.
        uint256 fee;
        // A number determining the amount of redistribution shares this funding cycle will issue to each sustainer.
        uint256 weight;
        // A percentage indicating how much more weight to give a funding cycle compared to its predecessor.
        uint256 discountRate;
        // The rate that describes the bonding curve at which overflow can be claimed.
        uint256 bondingCurveRate;
        // The time when this funding cycle was last configured.
        uint256 configured;
        // The time after which this cycle is eligible to become the active cycle.
        uint256 eligibleAfter;
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
        _self.bondingCurveRate = _baseFundingCycle.bondingCurveRate;
        _self.weight = _derivedWeight(_baseFundingCycle);
        _self.reserved = _baseFundingCycle.reserved;
        _self.configured = _baseFundingCycle.configured;
        _self.eligibleAfter = _baseFundingCycle.eligibleAfter;
        _self.number = _baseFundingCycle.number.add(1);
        _self.previous = _baseFundingCycle.id;
        _self.fee = _baseFundingCycle.fee;
    }

    // --- internal views --- //

    /** 
        @notice The state the funding cycle is in.
        @param _self The funding cycle to get the state of.
        @return state The state.
    */
    function _state(Data memory _self) internal view returns (State) {
        if (_hasExpired(_self)) return State.Redistributing;
        if (_hasStarted(_self) && _self.tappedTotal > 0) return State.Active;
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
        uint256 _end = _self.start.add(_self.duration);
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
                0,
                _self.projectId,
                _self.number.add(1),
                _self.id,
                _self.target,
                _self.currency,
                _determineNextStart(_self),
                _self.duration,
                0,
                0,
                _self.reserved,
                _self.fee,
                _derivedWeight(_self),
                _self.discountRate,
                _self.bondingCurveRate,
                _self.configured,
                _self.eligibleAfter
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
        @param _ethPrice The current price of ETH.
        @param _currentlyDrawable The amount of ETH that can be drawn from an external source if there's not enough in the funding cycle total.
        @return convertedEthAmount The amount of ETH that was tapped.
    */
    function _tap(
        Data storage _self,
        uint256 _amount,
        uint256 _ethPrice,
        uint256 _currentlyDrawable
    ) internal returns (uint256 convertedEthAmount) {
        // The amount being tapped must be less than the tappable amount plus the drawable amount.
        require(
            // Amount must be within what is drawable.
            _amount <= DSMath.wmul(_currentlyDrawable, _ethPrice) &&
                // Amount must be within what is still tappable.
                _amount <= _ownerTappableAmount(_self),
            "FundingCycle: INSUFFICIENT_FUNDS"
        );

        // Add the amount to the funding cycle's tapped amount.
        _self.tappedTarget = _self.tappedTarget.add(_amount);

        // The amount of ETH that is being tapped.
        convertedEthAmount = DSMath.wdiv(_amount, _ethPrice);

        // Add the converted currency amount to the funding cycle's total amount.
        _self.tappedTotal = _self.tappedTotal.add(convertedEthAmount);
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
        return block.timestamp > _self.start.add(_self.duration);
    }

    // --- private views --- //

    /** 
        @notice Returns the amount available for the project owner to tap in to.
        @param _self The funding cycle to make the calculation for.
        @return The resulting amount.
    */
    function _ownerTappableAmount(Data memory _self)
        private
        pure
        returns (uint256)
    {
        if (_self.tappedTarget == _self.target) return 0;
        return
            FullMath
                .mulDiv(_self.target, 1000, uint256(1000).add(_self.fee))
                .sub(_self.tappedTarget);
    }
}
