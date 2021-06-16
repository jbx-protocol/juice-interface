const appointGovernance = require("./appoint_governance");
const acceptGovernance = require("./accept_governance");
const setFee = require("./set_fee");
const setYielder = require("./set_yielder");
const setTargetLocalWei = require("./set_target_local_wei");
const allowMigration = require("./allow_migration");

module.exports = {
  appointGovernance,
  acceptGovernance,
  setFee,
  setYielder,
  setTargetLocalWei,
  allowMigration
};
