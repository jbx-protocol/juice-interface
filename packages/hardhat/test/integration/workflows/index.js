const deploy = require("./deploy");
const migrate = require("./migrate");
const payoutToPayoutMods = require("./tap");
const setPayoutMods = require("./set_payout_mods");
const setTicketMods = require("./set_ticket_mods");
const tap = require("./tap");
const redeem = require("./redeem");
const printReservedTickets = require("./print_reserved_tickets");
const issueTickets = require("./issue_tickets");
const reconfigure = require("./reconfigure");
const approvedBallot = require("./approved_ballot");
const failedBallot = require("./failed_ballot");
const iteratedFailedBallot = require("./iterated_failed_ballot");
const governance = require("./governance");
const setFee = require("./set_fee");
const printPreminedTickets = require("./print_premined_tickets");
const projects = require("./projects");
const currencyConversion = require("./currency_conversion");
const transferProjectOwnership = require("./transfer_project_ownership");
const directPaymentAddresses = require("./direct_payment_addresses");
const operatorPermissions = require("./operator_permissions");
const ticketLockingAndTransfers = require("./ticket_locking_and transfers");
const setTerminal = require("./set_terminal");
const limit = require("./limit");
const zeroDuration = require("./zero_duration");
const nonRecurring = require("./non_recurring");
const challengeHandle = require("./challenge_handle");
const takeFee = require("./take_fee");
const proxyPaymentAddresses = require("./proxy_payment_addresses");

module.exports = {
  deploy,
  projects,
  migrate,
  payoutToPayoutMods,
  setPayoutMods,
  setTicketMods,
  tap,
  redeem,
  printReservedTickets,
  issueTickets,
  reconfigure,
  approvedBallot,
  failedBallot,
  iteratedFailedBallot,
  governance,
  setFee,
  printPreminedTickets,
  currencyConversion,
  transferProjectOwnership,
  directPaymentAddresses,
  operatorPermissions,
  ticketLockingAndTransfers,
  setTerminal,
  limit,
  zeroDuration,
  nonRecurring,
  challengeHandle,
  takeFee,
  proxyPaymentAddresses,
};
