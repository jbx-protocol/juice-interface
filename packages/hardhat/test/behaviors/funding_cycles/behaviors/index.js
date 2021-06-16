const configure = require("./configure");
const tap = require("./tap");
const getCurrentOf = require("./get_current_of");
const getQueuedOf = require("./get_queued_of");
const currentBallotStateOf = require("./current_ballot_state_of");

module.exports = {
  configure,
  tap,
  getCurrentOf,
  getQueuedOf,
  currentBallotStateOf
};
