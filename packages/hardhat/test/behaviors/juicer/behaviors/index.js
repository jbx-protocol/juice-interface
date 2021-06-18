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
  deploy
};
