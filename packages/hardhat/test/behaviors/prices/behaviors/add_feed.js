const { ethers } = require("hardhat");
const { expect } = require("chai");

const { deployMockContract } = require("@ethereum-waffle/mock-contract");
const AggregatorV3Interface = require("@chainlink/contracts/abi/v0.6/AggregatorV3Interface.json");

let mockAggregatorV3InterfaceContract;

const tests = {
  success: [
    {
      description: "add feed, 18 decimals",
      fn: ({ deployer }) => ({
        sender: deployer,
        currency: 1,
        decimals: 18
      })
    },
    {
      description: "add feed, 0 decimals",
      fn: ({ deployer }) => ({
        sender: deployer,
        currency: 1,
        decimals: 0
      })
    }
  ],
  failure: [
    {
      description: "not owner",
      fn: ({ addrs }) => ({
        sender: addrs[0],
        currency: 1,
        decimals: 18,
        revert: "Ownable: caller is not the owner"
      })
    },
    {
      description: "reserved currency",
      fn: ({ deployer }) => ({
        sender: deployer,
        currency: 0,
        decimals: 18,
        revert: "Prices::addFeed: RESERVED"
      })
    },
    {
      description: "over 18 decimals",
      fn: ({ deployer }) => ({
        sender: deployer,
        currency: 1,
        decimals: 19,
        revert: "Prices::addFeed: BAD_DECIMALS"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    before(async function() {
      mockAggregatorV3InterfaceContract = await deployMockContract(
        this.deployer,
        AggregatorV3Interface.compilerOutput.abi
      );
    });
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { sender, currency, decimals } = successTest.fn(this);

        await mockAggregatorV3InterfaceContract.mock.decimals.returns(decimals);

        await expect(
          this.contract
            .connect(sender)
            .addFeed(mockAggregatorV3InterfaceContract.address, currency)
        )
          .to.emit(this.contract, "AddFeed")
          .withArgs(currency, mockAggregatorV3InterfaceContract.address);

        const targetDecimals = await this.contract.decimals();

        // Get the stored decimal adjuster value.
        const storedFeedDecimalAdjuster = await this.contract.feedDecimalAdjuster(
          currency
        );

        // Expect the packed values to match.
        expect(storedFeedDecimalAdjuster).to.equal(
          ethers.BigNumber.from(10).pow(targetDecimals - decimals)
        );

        // Get the stored feed.
        const storedFeed = await this.contract.feeds(currency);

        // Expect the stored feed values to match.
        expect(storedFeed).to.equal(mockAggregatorV3InterfaceContract.address);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { sender, currency, decimals, revert } = failureTest.fn(this);

        await mockAggregatorV3InterfaceContract.mock.decimals.returns(decimals);

        await expect(
          this.contract
            .connect(sender)
            .addFeed(mockAggregatorV3InterfaceContract.address, currency)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
