const shouldBehaveLike = require("./behaviors");

const contractName = "FundingCycles";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.ballot = await this.deployMockLocalContract("FundingCycleBallot");

    // Deploy the contract.
    this.contract = await this.deployContract(contractName);
  });

  // Test each function.
  describe("configure(...)", shouldBehaveLike.configure);
};
