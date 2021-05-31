const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "remove controller",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
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
        revert: "Tickets::removeController: UNAUTHORIZED"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, controller, projectId } = successTest.fn(this);

        // Initialize the project's tickets to set the specified controller.
        // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);
        await this.contract
          .connect(caller)
          .initialize(caller.address, projectId);

        // Add the controller that will then be removed.
        await this.contract
          .connect(caller)
          .addController(controller, projectId);

        const tx = await this.contract
          .connect(caller)
          .removeController(controller, projectId);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "RemoveController")
          .withArgs(controller, projectId, caller.address);

        const storedIsController = await this.contract
          .connect(caller)
          .isController(projectId, controller);

        expect(storedIsController).to.equal(false);
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
          // Initialize the project's tickets to set the specified controller.
          // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
          await this.contract.connect(caller).setOwnership(caller.address);
          await this.contract
            .connect(caller)
            .initialize(caller.address, projectId);
        }

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).removeController(controller, projectId)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
