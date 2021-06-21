const shouldBehaveLike = require("./behaviors");

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    const operatorStore = await this.deployContract("OperatorStore");
    const projects = await this.deployContract("Projects", [
      operatorStore.address
    ]);
    const prices = await this.deployContract("Prices");
    const terminalDirectory = await this.deployContract("TerminalDirectory", [
      projects.address
    ]);
    const fundingCycles = await this.deployContract("FundingCycles", [
      terminalDirectory.address
    ]);

    const ticketBooth = await this.deployContract("TicketBooth", [
      projects.address,
      operatorStore.address,
      terminalDirectory.address
    ]);

    const modStore = await this.deployContract("ModStore", [
      projects.address,
      operatorStore.address,
      terminalDirectory.address
    ]);

    const governance = await this.deployContract("Governance", [1]);

    const juicer = await this.deployContract("Juicer", [
      projects.address,
      fundingCycles.address,
      ticketBooth.address,
      operatorStore.address,
      modStore.address,
      prices.address,
      terminalDirectory.address,
      governance.address
    ]);

    this.contracts = {
      governance,
      terminalDirectory,
      prices,
      operatorStore,
      ticketBooth,
      fundingCycles,
      projects,
      modStore,
      juicer
    };
  });

  // Test each function.
  // describe("appointGovernance(...)", shouldBehaveLike.appointGovernance);
  // describe("acceptGovernance(...)", shouldBehaveLike.acceptGovernance);
  // describe("setFee(...)", shouldBehaveLike.setFee);
  // describe("allowMigration(...)", shouldBehaveLike.allowMigration);
  // describe("addToBalance(...)", shouldBehaveLike.addToBalance);
  // describe("migrate(...)", shouldBehaveLike.migrate);
  // describe("deploy(...)", shouldBehaveLike.deploy);
  describe("simpleDeploy(...)", shouldBehaveLike.simpleDeploy);
  describe("migrate(...)", shouldBehaveLike.migrate);
};
