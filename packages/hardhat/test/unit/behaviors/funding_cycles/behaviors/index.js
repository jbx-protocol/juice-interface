const configure = require("./configure");
const tap = require("./tap");
const currentOf = require("./current_of");
const queuedOf = require("./queued_of");
const currentBallotStateOf = require("./current_ballot_state_of");

module.exports = {
  configure,
  tap,
  currentOf,
  queuedOf,
  currentBallotStateOf
};
