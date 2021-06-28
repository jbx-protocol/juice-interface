const shouldBehaveLike = require("./behaviors");

const contractName = "OperatorStore";

module.exports = function() {
  // Before the tests, deploy the contract.
  before(async function() {
    // Deploy the contract.
    this.contract = await this.deployContractFn(contractName);
  });

  // Test each function.
  describe("setOperator(...)", shouldBehaveLike.setOperator);
  describe("setOperators(...)", shouldBehaveLike.setOperators);
  describe("hasPermission(...)", shouldBehaveLike.hasPermission);
  describe("hasPermissions(...)", shouldBehaveLike.hasPermissions);
};
