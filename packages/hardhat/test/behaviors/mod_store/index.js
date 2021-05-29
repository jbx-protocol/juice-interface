const shouldBehaveLike = require("./behaviors");

const contractName = "ModStore";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.projects = await this.deployMockLocalContract("Projects");
    this.operatorStore = await this.deployMockLocalContract("OperatorStore");
    this.modAllocator = await this.deployMockLocalContract("ModAllocator");

    // Deploy the contract.
    this.contract = await this.deployContract(contractName, [
      this.projects.address,
      this.operatorStore.address
    ]);
  });

  // Test each function.
  describe("setPaymentMods(...)", shouldBehaveLike.setPaymentMods);
  describe("setTicketMods(...)", shouldBehaveLike.setTicketMods);
};
