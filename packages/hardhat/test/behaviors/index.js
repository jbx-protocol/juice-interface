const operatorStore = require("./operator_store");
const projects = require("./projects");
const prices = require("./prices");
const modStore = require("./mod_store");
const ticketBooth = require("./ticket_booth");
const fundingCycles = require("./funding_cycles");
const directPaymentAddress = require("./direct_payment_address");
const terminalDirectory = require("./terminal_directory");
const governance = require("./governance");
const juiceProject = require("./juice_project");
const juicer = require("./juicer");
const integration = require("./integration");

module.exports = {
  operatorStore,
  projects,
  prices,
  modStore,
  ticketBooth,
  fundingCycles,
  directPaymentAddress,
  terminalDirectory,
  governance,
  juiceProject,
  juicer,
  integration
};
