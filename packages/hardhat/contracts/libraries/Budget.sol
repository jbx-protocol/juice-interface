// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./Math.sol";

/// @notice Budget data and logic.
library Budget {
    using SafeMath for uint256;

    /// @notice Possible states that a Budget may be in
    /// @dev Budget's are immutable once they are active.
    enum State {Standby, Active, Redistributing}

    /// @notice The Budgets structure represents a project stewarded by an address, and accounts for which addresses have helped sustain the project.
    struct Data {
        // A unique number that's incremented for each new Budget, starting with 1.
        uint256 id;
        // The address who defined this Budget and who has access to its funds.
        address owner;
        // The ID of the owner's Budget that came before this one.
        uint256 previous;
        // A brief description of the Budget.
        string brief;
        // A link that points to a justification for these parameters.
        string link;
        // The token that this Budget can be funded with.
        IERC20 want;
        // The amount that this Budget is targeting.
        uint256 target;
        // The running amount that's been contributed to sustaining this Budget.
        uint256 total;
        // The time when this Budget will become active.
        uint256 start;
        // The number of seconds until this Budget's surplus is redistributed.
        uint256 duration;
        // The amount of available funds that have been tapped by the owner.
        uint256 tapped;
        // The percentage of overflow to reserve for the owner once the Budget has expired.
        uint256 o;
        // The percentage of overflow to reserve for a specified beneficiary once the Budget has expired.
        uint256 b;
        // The specified beneficiary.
        address bAddress;
        // If the reserved tickets have been minted.
        bool hasMintedReserves;
        // A number determining the amount of redistribution shares this Budget will issue to each sustainer.
        uint256 weight;
        // A number indicating how much more weight to give a Budget compared to its predecessor.
        uint256 bias;
        // The time when this Budget was last configured.
        uint256 configured;
    }

    // --- internal transactions --- //

    /**
        @notice Clones the properties from the base Budget.
        @dev The base must be the Budget directly preceeding self.
        @param self The Budget to clone onto.
        @param _baseBudget The Budget to clone from.
    */
    function _basedOn(Data storage self, Data memory _baseBudget) internal {
        self.brief = _baseBudget.brief;
        self.link = _baseBudget.link;
        self.target = _baseBudget.target;
        self.duration = _baseBudget.duration;
        self.want = _baseBudget.want;
        self.bias = _baseBudget.bias;
        self.weight = _derivedWeight(_baseBudget);
        self.o = _baseBudget.o;
        self.b = _baseBudget.b;
        self.bAddress = _baseBudget.bAddress;
        self.configured = _baseBudget.configured;
    }

    // --- internal views --- //

    /** 
        @notice The state the Budget is in.
        @param self The Budget to get the state of.
        @return state The state.
    */
    function _state(Data memory self) internal view returns (State) {
        if (_hasExpired(self)) return State.Redistributing;
        if (_hasStarted(self) && self.total > 0) return State.Active;
        return State.Standby;
    }

    /** 
        @notice The date that is the nearest multiple of duration from oldEnd.
        @return start The date.
    */
    function _determineNextStart(Data memory self)
        internal
        view
        returns (uint256)
    {
        uint256 _end = self.start.add(self.duration);
        // Use the old end if the current time is still within the duration.
        if (_end.add(self.duration) > block.timestamp) return _end;
        // Otherwise, use the closest multiple of the duration from the old end.
        uint256 _distanceToStart =
            (block.timestamp.sub(_end)).mod(self.duration);
        return block.timestamp.sub(_distanceToStart);
    }

    /** 
        @notice A view of the Budget that would be created after this one if the owner doesn't make a reconfiguration.
        @return _budget The next Budget, with an ID set to 0.
    */
    function _nextUp(Data memory self) internal view returns (Data memory) {
        return
            Data(
                0,
                self.owner,
                self.id,
                self.brief,
                self.link,
                self.want,
                self.target,
                0,
                _determineNextStart(self),
                self.duration,
                0,
                self.o,
                self.b,
                self.bAddress,
                false,
                self.weight,
                self.bias,
                self.configured
            );
    }

    /** 
        @notice Returns the percentage of overflow that is unreserved.
        @param _withholding An additional percentage to withhold.
        @return _percentage The percentage.
    */
    function _unreserved(Data memory self, uint256 _withholding)
        internal
        pure
        returns (uint256)
    {
        return uint256(100).sub(self.o).sub(self.b).sub(_withholding);
    }

    /** 
        @notice The weight derived from the current weight and the bias.
        @return _weight The new weight.
    */
    function _derivedWeight(Data memory self) internal pure returns (uint256) {
        return self.weight.mul(self.bias).div(100);
    }

    /** 
        @notice Returns the amount available for the given Budget's owner to tap in to.
        @param self The Budget to make the calculation for.
        @return The resulting amount.
    */
    function _tappableAmount(Data memory self) internal pure returns (uint256) {
        return Math.min(self.target, self.total).sub(self.tapped);
    }

    /** 
        @notice The weight that a certain amount carries in this Budget.
        @param self The Budget to get the weight from.
        @param _amount The amount to get the weight of.
        @param _percentage The percentage to account for.
        @return state The weighted amount.
    */
    function _weighted(
        Data memory self,
        uint256 _amount,
        uint256 _percentage
    ) internal pure returns (uint256) {
        return
            self.weight.mul(_amount).mul(_percentage).div(self.target).div(100);
    }

    // --- private views --- //

    /** 
        @notice Check to see if the given Budget has started.
        @param self The Budget to check.
        @return hasStarted The boolean result.
    */
    function _hasStarted(Data memory self) private view returns (bool) {
        return block.timestamp >= self.start;
    }

    /** 
        @notice Check to see if the given Budget has expired.
        @param self The Budget to check.
        @return hasExpired The boolean result.
    */
    function _hasExpired(Data memory self) private view returns (bool) {
        return block.timestamp > self.start.add(self.duration);
    }
}
