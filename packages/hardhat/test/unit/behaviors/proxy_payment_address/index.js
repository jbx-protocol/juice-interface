const shouldBehaveLike = require("./behaviors");

const contractName = "ProxyPaymentAddress";

module.exports = function () {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function () {
    // Deploy mock dependency contracts.
    this.terminalV1 = await this.deployMockLocalContractFn("TerminalV1");
    this.terminalDirectory = await this.deployMockLocalContractFn(
      "TerminalDirectory"
    );
    this.ticketBooth = await this.deployMockLocalContractFn("TicketBooth");

    // Deploy the contract.
    this.projectId = 1;
    this.memo = "some-memo";
    this.contract = await this.deployContractFn(contractName, [
      this.terminalDirectory.address,
      this.ticketBooth.address,
      this.projectId,
      this.memo,
    ]);
  });

  // Test each function.
  describe("tap(...)", shouldBehaveLike.tap);
  describe("transfer_tickets(...)", shouldBehaveLike.transferTickets);
};
