const simpleDeploy = require("./simple_deploy");
const migrate = require("./migrate");
const payoutToPaymentMods = require("./tap");
const setPaymentMods = require("./set_payment_mods");
const tap = require("./tap");
const redeem = require("./redeem");
// const printReservedTickets = require("./print_reserved_tickets");

module.exports = {
  simpleDeploy,
  migrate,
  payoutToPaymentMods,
  setPaymentMods,
  tap,
  redeem
  // printReservedTickets
};
