const appointGovernance = require("./appoint_governance");
const acceptGovernance = require("./accept_governance");
const setFee = require("./set_fee");
const allowMigration = require("./allow_migration");
const addToBalance = require("./add_to_balance");
const migrate = require("./migrate");
const deploy = require("./deploy");
const configure = require("./configure");
const pay = require("./pay");
const printPreminedTickets = require("./print_premined_tickets");
const redeem = require("./redeem");
const tap = require("./tap");
const printReservedTickets = require("./print_reserved_tickets");

module.exports = {
  appointGovernance,
  acceptGovernance,
  setFee,
  allowMigration,
  addToBalance,
  migrate,
  deploy,
  configure,
  pay,
  printPreminedTickets,
  redeem,
  tap,
  printReservedTickets
};
