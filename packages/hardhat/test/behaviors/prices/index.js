const AggregatorV3Interface = require("@chainlink/contracts/abi/v0.6/AggregatorV3Interface.json");

const shouldBehaveLike = require("./behaviors");

const contractName = "Prices";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy a mock of the price feed oracle contract.
    this.aggregatorV3Contract = await this.deployMockContract(
      AggregatorV3Interface.compilerOutput.abi
    );

    // Deploy the contract.
    this.contract = await this.deployContract(contractName);
  });

  // Test each function.
  describe("addFeed(...)", shouldBehaveLike.addFeed);
  describe("getETHPrice(...)", shouldBehaveLike.getETHPrice);
};
