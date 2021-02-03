pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./interfaces/IJuicer.sol";
import "./interfaces/IMaintainer.sol";

contract Maintainer is IMaintainer {
    using Budget for Budget.Data;

    /// @notice The Juicer that is being maintained.
    IJuicer public immutable juicer;

    constructor(IJuicer _juicer) public {
        juicer = _juicer;
    }

    /**
        @notice Cleans the `want` token tracking array for an owner and a redeemable token.
        @dev This rarely needs to get called, if ever.
        @dev It's only useful if an owner has iterated through many `want` tokens that are just taking up space.
        @param _owner The owner of the Budgets that have specified `want` tokens.
        @param _token The reward token to clean accepted tokens for.
    */
    function cleanTrackedWantedTokens(address _owner, IERC20 _token)
        external
        override
    {
        IBudgetStore _budgetStore = juicer.budgetStore();
        ITicketStore _ticketStore = juicer.ticketStore();

        // Get a reference to all of the token's the owner has wanted since this transaction was last called.
        IERC20[] memory _currentWantedTokens =
            _budgetStore.getWantedTokens(_owner, _token);

        // Clear the array entirely in the store so that it can be repopulated.
        _budgetStore.clearWantedTokens(_owner, _token);

        // Get a reference to the current Budget for the owner. The `want` token for this Budget shouldn't be cleared.
        Budget.Data memory _cBudget = _budgetStore.getCurrentBudget(_owner);

        // For each token currently tracked, check to see if there are swappable funds from the token.
        for (uint256 i = 0; i < _currentWantedTokens.length; i++) {
            IERC20 _wantedToken = _currentWantedTokens[i];
            // Only retrack tokens in used.
            if (
                _cBudget.want == _wantedToken ||
                _ticketStore.swappable(_owner, _wantedToken, _token) > 0
            ) {
                // Add the token back to the store.
                _budgetStore.trackWantedToken(msg.sender, _token, _wantedToken);
            }
        }
        emit CleanTrackedWantToken(_owner, _token);
    }
}
