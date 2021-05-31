const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "initialize, with caller as controller",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1
      })
    },
    {
      description: "initialize, with other controller",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: addrs[0].address,
        projectId: 1
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        setup: { setOwner: false },
        revert: "Administrated: UNAUTHORIZED"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, controller, projectId } = successTest.fn(this);

        // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .initialize(controller, projectId);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Initialize")
          .withArgs(controller, projectId, caller.address);

        const storedIsController = await this.contract
          .connect(caller)
          .isController(projectId, controller);

        expect(storedIsController).to.equal(true);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          controller,
          projectId,
          setup: { setOwner },
          revert
        } = failureTest.fn(this);

        if (setOwner) {
          // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
          await this.contract.connect(caller).setOwnership(caller.address);
        }

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).initialize(controller, projectId)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
