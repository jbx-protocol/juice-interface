const shouldBehaveLike = require("./behaviors");

const contractName = "Juicer";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    const operatorStore = await this.deployMockLocalContract("OperatorStore");
    const projects = await this.deployMockLocalContract("Projects", [
      operatorStore.address
    ]);
    const prices = await this.deployMockLocalContract("Prices");
    const terminalDirectory = await this.deployMockLocalContract(
      "TerminalDirectory",
      [projects.address]
    );
    const fundingCycles = await this.deployMockLocalContract("FundingCycles", [
      terminalDirectory.address
    ]);
    const ticketBooth = await this.deployMockLocalContract("TicketBooth", [
      projects.address,
      operatorStore.address,
      terminalDirectory.address
    ]);
    const modStore = await this.deployMockLocalContract("ModStore", [
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

    this.targetContract = await this.deployContract(contractName, [
      projects.address,
      fundingCycles.address,
      ticketBooth.address,
      operatorStore.address,
      modStore.address,
      prices.address,
      terminalDirectory.address,
      governance.address
    ]);
  });

  // Test each function.
  // describe("appointGovernance(...)", shouldBehaveLike.appointGovernance);
  // describe("acceptGovernance(...)", shouldBehaveLike.acceptGovernance);
  // describe("setFee(...)", shouldBehaveLike.setFee);
  // describe("setYielder(...)", shouldBehaveLike.setYielder);
  // describe("setTargetLocalWei(...)", shouldBehaveLike.setTargetLocalWei);
  // describe("allowMigration(...)", shouldBehaveLike.allowMigration);
  // describe("addToBalance(...)", shouldBehaveLike.addToBalance);
  // describe("migrate(...)", shouldBehaveLike.migrate);
  // describe("deposit(...)", shouldBehaveLike.deposit);
  // describe("deploy(...)", shouldBehaveLike.deploy);
  // describe("configure(...)", shouldBehaveLike.configure);
  // describe("pay(...)", shouldBehaveLike.pay);
  // describe("printTickets(...)", shouldBehaveLike.printTickets);
  describe("redeem(...)", shouldBehaveLike.redeem);
};
