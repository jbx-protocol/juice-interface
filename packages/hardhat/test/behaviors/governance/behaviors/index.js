const allowMigration = require("./allow_migration");
const setYielder = require("./set_yielder");
const addPriceFeed = require("./add_price_feed");
const setTargetLocalEth = require("./set_target_local_eth");
const setFee = require("./set_fee");
const appointGovernance = require("./appoint_governance");

module.exports = {
  allowMigration,
  setYielder,
  addPriceFeed,
  setTargetLocalEth,
  setFee,
  appointGovernance
};
