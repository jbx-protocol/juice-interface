// // SPDX-License-Identifier: MIT
// pragma solidity >=0.6.0 <0.8.0;
// pragma experimental ABIEncoderV2;

// import "@openzeppelin/contracts/math/SafeMath.sol";

// import "./interfaces/IJuicer.sol";
// import "./interfaces/IMinter.sol";

// contract MintViewer is IMinter {
//     using SafeMath for uint256;
//     using Budget for Budget.Data;

//     /// @notice The Juicer that minting data is sourced from.
//     IJuicer public immutable override juicer;

//     constructor(IJuicer _juicer) public {
//         juicer = _juicer;
//     }

//     /**
//         @notice The amount of unminted tickets that are reserved for owners, beneficieries, and the admin.
//         @dev Reserved tickets are only mintable once a Budget expires.
//         @dev This logic should be the same as mintReservedTickets in Juicer.
//         @param _issuer The Tickets issuer whos Budgets are being searched for unminted reserved tickets.
//         @return _issuers The amount of unminted reserved tickets belonging to issuer of the tickets.
//         @return _beneficiaries The amount of unminted reserved tickets belonging to beneficiaries.
//         @return _admin The amount of unminted reserved tickets belonging to the admin.
//     */
//     function getReservedTickets(address _issuer)
//         public
//         view
//         override
//         returns (
//             uint256 _issuers,
//             uint256 _beneficiaries,
//             uint256 _admin
//         )
//     {
//         // Get a reference to the owner's tickets.
//         ITickets _tickets = juicer.ticketStore().tickets(_issuer);

//         // If the owner doesn't have tickets, throw.
//         require(
//             _tickets != ITickets(0),
//             "ReservedTicketsView::getReservedTickets: NOT_FOUND"
//         );

//         IBudgetStore _budgetStore = juicer.budgetStore();
//         uint256 _fee = juicer.fee();

//         // Get a reference to the owner's latest Budget.
//         Budget.Data memory _budget = _budgetStore.getLatestBudget(_issuer);

//         // Iterate sequentially through the owner's Budgets, starting with the latest one.
//         // If the budget has already minted reserves, each previous budget is guarenteed to have also minted reserves.
//         while (_budget.id > 0 && !_budget.hasMintedReserves) {
//             // If the budget has overflow and is redistributing, it has unminted reserved tickets.
//             if (
//                 _budget.total > _budget.target &&
//                 _budget._state() == Budget.State.Redistributing
//             ) {
//                 // Unminted reserved tickets are all relavative to the amount of overflow available.
//                 uint256 _overflow = _budget.total.sub(_budget.target);

//                 // The admin gets the admin fee percentage.
//                 _admin = _admin.add(_budget._weighted(_overflow, _fee));

//                 // The owner gets the budget's owner percentage, if one is specified.
//                 if (_budget.o > 0) {
//                     _issuers = _issuers.add(
//                         _budget._weighted(_overflow, _budget.o)
//                     );
//                 }

//                 // The beneficiary gets the budget's beneficiary percentage, if one is specified.
//                 if (_budget.b > 0) {
//                     _beneficiaries = _beneficiaries.add(
//                         _budget._weighted(_overflow, _budget.b)
//                     );
//                 }
//             }

//             // Continue the loop with the previous Budget.
//             _budget = _budgetStore.getBudget(_budget.previous);
//         }
//     }
// }
