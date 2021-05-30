const shouldBehaveLike = require("./behaviors");

const contractName = "Tickets";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.projects = await this.deployMockLocalContract("Projects");
    this.operatorStore = await this.deployMockLocalContract("OperatorStore");

    // Deploy the contract.
    this.contract = await this.deployContract(contractName, [
      this.projects.address,
      this.operatorStore.address
    ]);
  });

  // Test each function.
  describe("print(...)", shouldBehaveLike.print);
  // describe("setTicketMods(...)", shouldBehaveLike.setTicketMods);
};
