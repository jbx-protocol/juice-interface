const shouldBehaveLike = require("./behaviors");

const contractName = "Projects";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.operatorStore = await this.deployMockLocalContractFn("OperatorStore");

    // Deploy the contract.
    this.contract = await this.deployContractFn(contractName, [
      this.operatorStore.address
    ]);
  });

  // Test each function.
  describe("create(...)", shouldBehaveLike.create);
  describe("setHandle(...)", shouldBehaveLike.setHandle);
  describe("setUri(...)", shouldBehaveLike.setUri);
  describe("transferHandle(...)", shouldBehaveLike.transferHandle);
  describe("claimHandle(...)", shouldBehaveLike.claimHandle);
  describe("renewHandle(...)", shouldBehaveLike.renewHandle);
  describe("challengeHandle(...)", shouldBehaveLike.challengeHandle);
};
