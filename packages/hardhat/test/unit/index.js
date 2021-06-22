const shouldBehaveLike = require("./behaviors");

module.exports = function() {
  // Test each contract.
  describe("OperatorStore", shouldBehaveLike.operatorStore);
  describe("Prices", shouldBehaveLike.prices);
  describe("Projects", shouldBehaveLike.projects);
  describe("TerminalDirectory", shouldBehaveLike.terminalDirectory);
  describe("Governance", shouldBehaveLike.governance);
  describe("JuiceProject", shouldBehaveLike.juiceProject);

  // Depends on TerminalDirectory.
  describe("FundingCycles", shouldBehaveLike.fundingCycles);
  // Depends on TerminalDirectory.
  describe("DirectPaymentAddress", shouldBehaveLike.directPaymentAddress);
  // Depends on OperatorStore and Projects.
  describe("ModStore", shouldBehaveLike.modStore);
  // Depends on OperatorStore and Projects.
  describe("TicketBooth", shouldBehaveLike.ticketBooth);

  // Depends on everything.
  // describe("Juicer", shouldBehaveLike.juicer);
};
