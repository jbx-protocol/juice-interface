const {
  ethers: { constants }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "appoint",
      fn: ({ addrs, governance }) => ({
        caller: governance,
        governance: addrs[0].address
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer }) => ({
        caller: deployer,
        governance: constants.AddressZero,
        revert: "TerminalV1: UNAUTHORIZED"
      })
    },
    {
      description: "zero address",
      fn: ({ governance }) => ({
        caller: governance,
        governance: constants.AddressZero,
        revert: "TerminalV1::appointGovernance: ZERO_ADDRESS"
      })
    },
    {
      description: "same as current",
      fn: ({ governance }) => ({
        caller: governance,
        governance: governance.address,
        revert: "TerminalV1::appointGovernance: NO_OP"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, governance } = successTest.fn(this);

        // Execute the transaction.
        const tx = await this.targetContract
          .connect(caller)
          .appointGovernance(governance);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.targetContract, "AppointGovernance")
          .withArgs(governance);

        // Get the stored pending governance value.
        const storedPendingGovernance = await this.targetContract.pendingGovernance();

        // Expect the stored value to equal whats expected.
        expect(storedPendingGovernance).to.equal(governance);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, governance, revert } = failureTest.fn(this);

        await expect(
          this.targetContract.connect(caller).appointGovernance(governance)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
