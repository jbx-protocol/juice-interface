const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "challenge successfully",
      fn: ({ deployer }) => ({
        caller: deployer,
        handle: ethers.utils.formatBytes32String("some-handle"),
        setup: {
          create: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-handle")
          }
        }
      })
    }
  ],
  failure: [
    {
      description: "handle not taken",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        handle: ethers.utils.formatBytes32String("some-handle"),
        setup: {
          create: {
            owner: addrs[0].address,
            handle: ethers.utils.formatBytes32String("some-other-handle")
          }
        },
        revert: "Projects::challenge: HANDLE_NOT_TAKEN"
      })
    },
    {
      description: "already being challenged",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        handle: ethers.utils.formatBytes32String("some-handle"),
        setup: {
          prechallenge: true,
          create: {
            owner: addrs[0].address,
            handle: ethers.utils.formatBytes32String("some-handle")
          }
        },
        revert: "Projects::challenge: HANDLE_ALREADY_BEING_CHALLENGED"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, handle, setup: { create } = {} } = successTest.fn(this);

        // Setup by creating a project.
        await this.contract
          .connect(caller)
          .create(create.owner, create.handle, "", this.constants.AddressZero);

        // Execute the transaction.
        const tx = await this.contract.connect(caller).challengeHandle(handle);

        const expectedChallengeExpiry = (
          await this.getTimestampFn(tx.blockNumber)
        ).add(31536000);

        // Expect an event to have been emitted.
        expect(tx)
          .to.emit(this.contract, "ChallengeHandle")
          .withArgs(create.handle, expectedChallengeExpiry, caller.address);

        // Get the stored reverse handle lookup value.
        const storedchallengeExpiryOf = await this.contract.challengeExpiryOf(
          create.handle
        );

        // Expect the stored value to be zero.
        expect(storedchallengeExpiryOf).to.equal(expectedChallengeExpiry);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          handle,
          setup: { create, prechallenge } = {},
          revert
        } = failureTest.fn(this);

        // Setup by creating a project.
        await this.contract
          .connect(caller)
          .create(create.owner, create.handle, "", this.constants.AddressZero);

        if (prechallenge) {
          // Challenge the handle.
          await this.contract.connect(caller).challengeHandle(handle);
        }

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).challengeHandle(handle)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
