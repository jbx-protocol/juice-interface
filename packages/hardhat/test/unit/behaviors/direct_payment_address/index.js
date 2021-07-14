const shouldBehaveLike = require("./behaviors");

const contractName = "DirectPaymentAddress";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.terminalV1 = await this.deployMockLocalContractFn("TerminalV1");
    this.terminalDirectory = await this.deployMockLocalContractFn(
      "TerminalDirectory"
    );
    this.projectId = 1;
    this.memo = "some-memo";

    // Deploy the contract.
    this.contract = await this.deployContractFn(contractName, [
      this.terminalDirectory.address,
      this.projectId,
      this.memo
    ]);
  });

  // Test each function.
  describe("receiver(...)", shouldBehaveLike.receive);
};
