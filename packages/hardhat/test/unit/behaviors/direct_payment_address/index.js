const shouldBehaveLike = require("./behaviors");

const contractName = "DirectPaymentAddress";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.juicer = await this.deployMockLocalContract("Juicer");
    this.terminalDirectory = await this.deployMockLocalContract(
      "TerminalDirectory"
    );
    this.projectId = 1;
    this.memo = "some-memo";

    // Deploy the contract.
    this.contract = await this.deployContract(contractName, [
      this.terminalDirectory.address,
      this.projectId,
      this.memo
    ]);
  });

  // Test each function.
  describe("receiver(...)", shouldBehaveLike.receive);
};
