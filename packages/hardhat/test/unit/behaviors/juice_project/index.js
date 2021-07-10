const shouldBehaveLike = require("./behaviors");

const contractName = "ExampleJuiceboxProject";

module.exports = function() {
  // Before the tests, deploy the contract.
  before(async function() {
    this.projectId = 1;

    this.terminalDirectory = await this.deployMockLocalContractFn(
      "TerminalDirectory"
    );

    // Deploy the contract.
    this.contract = await this.deployContractFn(contractName, [
      this.projectId,
      this.terminalDirectory.address
    ]);
  });

  // Test each function.
  describe("setOperator(...)", shouldBehaveLike.setOperator);
  describe("setOperators(...)", shouldBehaveLike.setOperators);
  describe(
    "transferProjectOwnership(...)",
    shouldBehaveLike.transferProjectOwnership
  );
  describe("pay(...)", shouldBehaveLike.pay);
  describe("takeFee(...)", shouldBehaveLike.takeFee);
  describe("setProjectId(...)", shouldBehaveLike.setProjectId);
  describe("withdraw(...)", shouldBehaveLike.withdraw);
};
