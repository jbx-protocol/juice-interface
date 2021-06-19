const appointGovernance = require("./appoint_governance");
const acceptGovernance = require("./accept_governance");
const setFee = require("./set_fee");
const setYielder = require("./set_yielder");
const setTargetLocalWei = require("./set_target_local_wei");
const allowMigration = require("./allow_migration");
const addToBalance = require("./add_to_balance");
const migrate = require("./migrate");
const deposit = require("./deposit");
const deploy = require("./deploy");
const configure = require("./configure");
const pay = require("./pay");
const printTickets = require("./print_tickets");
const redeem = require("./redeem");
const tap = require("./tap");

module.exports = {
  appointGovernance,
  acceptGovernance,
  setFee,
  setYielder,
  setTargetLocalWei,
  allowMigration,
  addToBalance,
  migrate,
  deposit,
  deploy,
  configure,
  pay,
  printTickets,
  redeem,
  tap
};
