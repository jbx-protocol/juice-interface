const shouldBehaveLike = require("./behaviors");

const contractName = "TerminalV1";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    const operatorStore = await this.deployMockLocalContractFn("OperatorStore");
    const projects = await this.deployMockLocalContractFn("Projects", [
      operatorStore.address
    ]);
    const prices = await this.deployMockLocalContractFn("Prices");
    const terminalDirectory = await this.deployMockLocalContractFn(
      "TerminalDirectory",
      [projects.address, operatorStore.address]
    );
    const fundingCycles = await this.deployMockLocalContractFn(
      "FundingCycles",
      [terminalDirectory.address]
    );
    const ticketBooth = await this.deployMockLocalContractFn("TicketBooth", [
      projects.address,
      operatorStore.address,
      terminalDirectory.address
    ]);
    const modStore = await this.deployMockLocalContractFn("ModStore", [
      projects.address,
      operatorStore.address
    ]);

    const governance = this.addrs[9];

    this.governance = governance;

    this.mockContracts = {
      operatorStore,
      projects,
      prices,
      terminalDirectory,
      fundingCycles,
      ticketBooth,
      modStore
    };

    this.targetContract = await this.deployContractFn(contractName, [
      projects.address,
      fundingCycles.address,
      ticketBooth.address,
      operatorStore.address,
      modStore.address,
      prices.address,
      terminalDirectory.address,
      governance.address
    ]);

    this.contractName = contractName;
  });

  // Test each function.
  describe("appointGovernance(...)", shouldBehaveLike.appointGovernance);
  describe("acceptGovernance(...)", shouldBehaveLike.acceptGovernance);
  describe("setFee(...)", shouldBehaveLike.setFee);
  describe("allowMigration(...)", shouldBehaveLike.allowMigration);
  describe("addToBalance(...)", shouldBehaveLike.addToBalance);
  describe("migrate(...)", shouldBehaveLike.migrate);
  describe("deploy(...)", shouldBehaveLike.deploy);
  describe("configure(...)", shouldBehaveLike.configure);
  describe("pay(...)", shouldBehaveLike.pay);
  describe("printPremineTickets(...)", shouldBehaveLike.printPreminedTickets);
  describe("redeem(...)", shouldBehaveLike.redeem);
  describe("tap(...)", shouldBehaveLike.tap);
  describe("printReservedTickets(...)", shouldBehaveLike.printReservedTickets);
};
