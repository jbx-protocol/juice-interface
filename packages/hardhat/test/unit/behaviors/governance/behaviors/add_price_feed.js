const { expect } = require("chai");
const AggregatorV3Interface = require("@chainlink/contracts/abi/v0.6/AggregatorV3Interface.json");

const tests = {
  success: [
    {
      description: "adds price feed",
      fn: ({ deployer }) => ({
        caller: deployer
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ addrs }) => ({
        caller: addrs[0].address,
        revert: "Ownable: caller is not the owner"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller } = successTest.fn(this);

        const prices = await this.deployMockLocalContractFn("Prices");
        // Deploy a mock of the price feed oracle contract.
        const priceFeed = await this.deployMockContractFn(
          AggregatorV3Interface.compilerOutput.abi
        );

        const currency = 1;

        await prices.mock.addFeed
          .withArgs(priceFeed.address, currency)
          .returns();

        // Execute the transaction.
        await this.contract
          .connect(caller)
          .addPriceFeed(prices.address, priceFeed.address, currency);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, revert } = failureTest.fn(this);

        const prices = await this.deployMockLocalContractFn("Prices");
        // Deploy a mock of the price feed oracle contract.
        const priceFeed = await this.deployMockContractFn(
          AggregatorV3Interface.compilerOutput.abi
        );

        const currency = 1;

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .addPriceFeed(prices.address, priceFeed.address, currency)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
