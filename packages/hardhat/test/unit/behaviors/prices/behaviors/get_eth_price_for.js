const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "check ETH price, non-zero currency, 18 decimals",
      fn: ({ deployer }) => ({
        caller: deployer,
        currency: 1,
        decimals: 18,
        price: 400
      })
    },
    {
      description: "check ETH price, non-zero currency, 0 decimals",
      fn: ({ deployer }) => ({
        caller: deployer,
        currency: 1,
        decimals: 0,
        price: 400
      })
    },
    {
      description: "check ETH price, zero currency",
      fn: ({ deployer }) => ({
        caller: deployer,
        currency: 0,
        price: 1
      })
    }
  ],
  failure: [
    {
      description: "currency feed not found",
      fn: ({ deployer }) => ({
        caller: deployer,
        currency: 1,
        decimals: 18,
        price: 400,
        revert: "Prices::getETHPrice: NOT_FOUND"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, currency, decimals, price } = successTest.fn(this);

        // If the currency is 0, mocks or a feed aren't needed.
        if (currency > 0) {
          // Set the mock to the return the specified number of decimals.
          await this.aggregatorV3Contract.mock.decimals.returns(decimals);
          // Set the mock to return the specified price.
          await this.aggregatorV3Contract.mock.latestRoundData.returns(
            0,
            price,
            0,
            0,
            0
          );

          // Add price feed.
          await this.contract
            .connect(caller)
            .addFeed(this.aggregatorV3Contract.address, currency);
        }

        // Check for the price.
        const resultingPrice = await this.contract
          .connect(caller)
          .getETHPriceFor(currency);

        // Get a reference to the target number of decimals.
        const targetDecimals = await this.contract.targetDecimals();

        // Get a reference to the expected price value.
        const expectedPrice = ethers.BigNumber.from(price).mul(
          ethers.BigNumber.from(10).pow(
            currency === 0 ? targetDecimals : targetDecimals - decimals
          )
        );

        // Expect the stored price value to match the expected value.
        expect(resultingPrice).to.equal(expectedPrice);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, currency, price, revert } = failureTest.fn(this);

        await this.aggregatorV3Contract.mock.latestRoundData.returns(
          0,
          price,
          0,
          0,
          0
        );

        await expect(
          this.contract.connect(caller).getETHPriceFor(currency)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
