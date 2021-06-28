const shouldBehaveLike = require("./behaviors");

const contractName = "TerminalDirectory";

module.exports = function() {
  // Before the tests, deploy the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.projects = await this.deployMockLocalContractFn("Projects");
    this.operatorStore = await this.deployMockLocalContractFn("OperatorStore");

    // Deploy the contract.
    this.contract = await this.deployContractFn(contractName, [
      this.projects.address,
      this.operatorStore.address
    ]);
  });

  // Test each function.
  describe("deployAddress(...)", shouldBehaveLike.deployAddress);
  describe("setTerminal(...)", shouldBehaveLike.setTerminal);
  describe("setPayerPreferences(...)", shouldBehaveLike.setPayerPreferences);
};
