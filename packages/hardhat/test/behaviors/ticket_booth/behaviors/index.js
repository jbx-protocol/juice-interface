const print = require("./print");
const unstake = require("./unstake");
const stake = require("./stake");
const issue = require("./issue");
const transfer = require("./transfer");
const redeem = require("./redeem");
const lock = require("./lock");
const unlock = require("./unlock");
const balanceOf = require("./balance_of");
const totalSupplyOf = require("./total_supply_of");

module.exports = {
  print,
  unstake,
  stake,
  issue,
  transfer,
  redeem,
  lock,
  unlock,
  balanceOf,
  totalSupplyOf
};
