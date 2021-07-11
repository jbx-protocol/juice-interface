const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "add feed, 18 decimals",
      fn: ({ deployer }) => ({
        caller: deployer,
        currency: 1,
        decimals: 18
      })
    },
    {
      description: "add feed, 0 decimals",
      fn: ({ deployer }) => ({
        caller: deployer,
        currency: 1,
        decimals: 0
      })
    }
  ],
  failure: [
    {
      description: "not owner",
      fn: ({ addrs }) => ({
        caller: addrs[0],
        currency: 1,
        decimals: 18,
        revert: "Ownable: caller is not the owner"
      })
    },
    {
      description: "reserved currency",
      fn: ({ deployer }) => ({
        caller: deployer,
        currency: 0,
        decimals: 18,
        revert: "Prices::addFeed: RESERVED"
      })
    },
    {
      description: "already exists",
      fn: ({ deployer }) => ({
        caller: deployer,
        currency: 1,
        decimals: 18,
        setup: { preset: true },
        revert: "Prices::addFeed: ALREADY_EXISTS"
      })
    },
    {
      description: "over 18 decimals",
      fn: ({ deployer }) => ({
        caller: deployer,
        currency: 1,
        decimals: 19,
        revert: "Prices::addFeed: BAD_DECIMALS"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, currency, decimals } = successTest.fn(this);

        // Set the mock to the return the specified number of decimals.
        await this.aggregatorV3Contract.mock.decimals.returns(decimals);

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .addFeed(this.aggregatorV3Contract.address, currency);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "AddFeed")
          .withArgs(currency, this.aggregatorV3Contract.address);

        // Get a reference to the target number of decimals.
        const targetDecimals = await this.contract.targetDecimals();

        // Get the stored decimal adjuster value.
        const storedFeedDecimalAdjuster = await this.contract.feedDecimalAdjuster(
          currency
        );

        // Get a reference to the expected adjuster value.
        const expectedFeedDecimalAdjuster = ethers.BigNumber.from(10).pow(
          targetDecimals - decimals
        );
        // Expect the stored value to match the expected value.
        expect(storedFeedDecimalAdjuster).to.equal(expectedFeedDecimalAdjuster);

        // Get the stored feed.
        const storedFeed = await this.contract.feedFor(currency);

        // Expect the stored feed values to match.
        expect(storedFeed).to.equal(this.aggregatorV3Contract.address);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          currency,
          decimals,
          revert,
          setup: { preset } = {}
        } = failureTest.fn(this);

        await this.aggregatorV3Contract.mock.decimals.returns(decimals);

        if (preset) {
          await this.contract
            .connect(caller)
            .addFeed(this.aggregatorV3Contract.address, currency);
        }

        await expect(
          this.contract
            .connect(caller)
            .addFeed(this.aggregatorV3Contract.address, currency)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
