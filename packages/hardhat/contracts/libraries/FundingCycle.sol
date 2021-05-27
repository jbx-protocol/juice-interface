// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "prb-math/contracts/PRBMathUD60x18.sol";
import "prb-math/contracts/PRBMathCommon.sol";

import "./../interfaces/IFundingCycleBallot.sol";

/// @notice Funding cycle data and logic.
library FundingCycle {
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
        // The time when this funding cycle was last configured.
        uint256 configuration;
        // A number determining the amount of redistribution shares this funding cycle will issue to each sustainer.
        uint256 weight;
        // The ballot contract to use to determine a subsequent funding cycle's reconfiguration status.
        IFundingCycleBallot ballot;
        // The time when this funding cycle will become active.
        uint256 start;
        // The number of seconds until this funding cycle's surplus is redistributed.
        uint256 duration;
        // The amount that this funding cycle is targeting in terms of the currency.
        uint256 target;
        // The currency that the target is measured in.
        uint256 currency;
        // The percentage of each payment to send as a fee to the Juice admin.
        uint256 fee;
        // A percentage indicating how much more weight to give a funding cycle compared to its predecessor.
        uint256 discountRate;
        // The amount of available funds that have been tapped by the project in terms of the currency.
        uint256 tapped;
        // A packed list of extra data. The first 8 bytes are reserved for versioning.
        uint256 metadata;
    }

    // --- internal views --- //

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
        uint256 _end = _self.start + _self.duration;
        // Use the old end if the current time is still within the duration.
        if (block.timestamp < _end + _self.duration) return _end;
        // Otherwise, use the closest multiple of the duration from the old end.
        uint256 _distanceToStart = (block.timestamp - _end) % _self.duration;
        return block.timestamp - _distanceToStart;
    }

    /** 
        @notice Whether a funding cycle configuration is currently pending approval.
        @param _self The funding cycle configuration to check the pending status of.
        @return Whether the funding cycle's configuration is pending approved.
    */
    function _isConfigurationPending(
        Data memory _self,
        IFundingCycleBallot _ballot
    ) internal view returns (bool) {
        return
            _ballot != IFundingCycleBallot(address(0)) &&
            _ballot.isPending(_self.id, _self.configuration);
    }
}
