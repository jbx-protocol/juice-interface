const setOperator = require("./set_operator");
const setOperators = require("./set_operators");
const transferProjectOwnership = require("./transfer_project_ownership");
const pay = require("./pay");
const setProjectId = require("./set_project_id");
const withdraw = require("./withdraw");
const takeFee = require("./take_fee");

module.exports = {
  transferProjectOwnership,
  setOperator,
  setOperators,
  pay,
  setProjectId,
  withdraw,
  takeFee
};
