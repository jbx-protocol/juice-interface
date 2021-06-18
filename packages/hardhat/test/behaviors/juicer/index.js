const shouldBehaveLike = require("./behaviors");

const contractName = "Juicer";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.operatorStore = await this.deployMockLocalContract("OperatorStore");
    this.projects = await this.deployMockLocalContract("Projects", [
      this.operatorStore.address
    ]);
    this.prices = await this.deployMockLocalContract("Prices");
    this.terminalDirectory = await this.deployMockLocalContract(
      "TerminalDirectory",
      [this.projects.address]
    );
    this.fundingCycles = await this.deployMockLocalContract("FundingCycles", [
      this.terminalDirectory.address
    ]);
    this.ticketBooth = await this.deployMockLocalContract("TicketBooth", [
      this.projects.address,
      this.operatorStore.address,
      this.terminalDirectory.address
    ]);
    this.modStore = await this.deployMockLocalContract("ModStore", [
      this.projects.address,
      this.operatorStore.address
    ]);

    this.governance = this.addrs[9];

    // Deploy mock dependency contracts.
    this.contract = await this.deployContract(contractName, [
      this.projects.address,
      this.fundingCycles.address,
      this.ticketBooth.address,
      this.operatorStore.address,
      this.modStore.address,
      this.prices.address,
      this.terminalDirectory.address,
      this.governance.address
    ]);
  });

  // Test each function.
  describe("appointGovernance(...)", shouldBehaveLike.appointGovernance);
  describe("acceptGovernance(...)", shouldBehaveLike.acceptGovernance);
  describe("setFee(...)", shouldBehaveLike.setFee);
  describe("setYielder(...)", shouldBehaveLike.setYielder);
  describe("setTargetLocalWei(...)", shouldBehaveLike.setTargetLocalWei);
  describe("allowMigration(...)", shouldBehaveLike.allowMigration);
  describe("addToBalance(...)", shouldBehaveLike.addToBalance);
  describe("migrate(...)", shouldBehaveLike.migrate);
  describe("deposit(...)", shouldBehaveLike.deposit);
  describe("deploy(...)", shouldBehaveLike.deploy);
};
