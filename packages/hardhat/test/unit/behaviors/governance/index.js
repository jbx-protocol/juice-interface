const shouldBehaveLike = require("./behaviors");

const contractName = "Governance";

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
  describe("allowMigration(...)", shouldBehaveLike.allowMigration);
  describe("addPriceFeed(...)", shouldBehaveLike.addPriceFeed);
  describe("setFee(...)", shouldBehaveLike.setFee);
  describe("appointGovernance(...)", shouldBehaveLike.appointGovernance);
};
