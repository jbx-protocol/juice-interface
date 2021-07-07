const create = require("./create");
const setHandle = require("./set_handle");
const setUri = require("./set_uri");
const transferHandle = require("./transfer_handle");
const claimHandle = require("./claim_handle");
const renewHandle = require("./renew_handle");
const challengeHandle = require("./challenge_handle");

module.exports = {
  create,
  setHandle,
  setUri,
  transferHandle,
  claimHandle,
  renewHandle,
  challengeHandle
};
