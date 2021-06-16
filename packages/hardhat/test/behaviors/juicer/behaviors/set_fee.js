const {
  ethers: { BigNumber }
} = require("hardhat");

const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "set to 100%",
      fn: ({ governance }) => ({
        caller: governance,
        fee: BigNumber.from(200)
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer }) => ({
        caller: deployer,
        fee: BigNumber.from(200),
        revert: "Juicer: UNAUTHORIZED"
      })
    },
    {
      description: "over 100%",
      fn: ({ governance }) => ({
        caller: governance,
        fee: BigNumber.from(201),
        revert: "Juicer::setFee: BAD_FEE"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, fee } = successTest.fn(this);

        // Execute the transaction.
        const tx = await this.contract.connect(caller).setFee(fee);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "SetFee")
          .withArgs(fee);

        // Get the stored fee value.
        const storedFee = await this.contract.fee();

        // Expect the stored value to equal whats expected.
        expect(storedFee).to.equal(fee);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, fee, revert } = failureTest.fn(this);

        await expect(
          this.contract.connect(caller).setFee(fee)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
