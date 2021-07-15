const shouldBehaveLike = require("./behaviors");

const contractName = "ModStore";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.projects = await this.deployMockLocalContractFn("Projects");
    this.operatorStore = await this.deployMockLocalContractFn("OperatorStore");
    this.terminalDirectory = await this.deployMockLocalContractFn(
      "TerminalDirectory"
    );
    this.modAllocator = await this.deployMockLocalContractFn(
      "ExampleModAllocator"
    );

    // Deploy the contract.
    this.contract = await this.deployContractFn(contractName, [
      this.projects.address,
      this.operatorStore.address,
      this.terminalDirectory.address
    ]);
  });

  // Test each function.
  describe("setPayoutMods(...)", shouldBehaveLike.setPayoutMods);
  describe("setTicketMods(...)", shouldBehaveLike.setTicketMods);
};
