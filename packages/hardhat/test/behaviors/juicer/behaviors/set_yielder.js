const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "new yielder",
      fn: async ({ governance, deployMockLocalContract }) => ({
        caller: governance,
        yielder: await deployMockLocalContract("ExampleYielder")
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: async ({ deployer, deployMockLocalContract }) => ({
        caller: deployer,
        yielder: await deployMockLocalContract("ExampleYielder"),
        revert: "Juicer: UNAUTHORIZED"
      })
    },
    {
      description: "already set",
      fn: async ({ governance, deployMockLocalContract }) => ({
        caller: governance,
        yielder: await deployMockLocalContract("ExampleYielder"),
        setup: {
          preset: {
            yielder: await deployMockLocalContract("ExampleYielder")
          }
        },
        revert: "Juicer::setYielder: ALREADY_SET"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, yielder } = await successTest.fn(this);

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .setYielder(yielder.address);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "SetYielder")
          .withArgs(yielder.address);

        // Get the stored yielder value.
        const storedYielder = await this.contract.yielder();

        // Expect the stored value to equal whats expected.
        expect(storedYielder).to.equal(yielder.address);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          yielder,
          setup: { preset } = {},
          revert
        } = await failureTest.fn(this);

        if (preset)
          await this.contract
            .connect(caller)
            .setYielder(preset.yielder.address);

        await expect(
          this.contract.connect(caller).setYielder(yielder.address)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
