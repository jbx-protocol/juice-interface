const deploy = require("./deploy");
const migrate = require("./migrate");
const payoutToPaymentMods = require("./tap");
const setPaymentMods = require("./set_payment_mods");
const tap = require("./tap");
const redeem = require("./redeem");
// const printReservedTickets = require("./print_reserved_tickets");

module.exports = {
  deploy,
  migrate,
  payoutToPaymentMods,
  setPaymentMods,
  tap,
  redeem
  // printReservedTickets
};
