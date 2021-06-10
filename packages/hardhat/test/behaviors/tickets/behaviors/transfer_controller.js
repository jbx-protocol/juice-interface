const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "transfer controller",
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
        revert: "Tickets::transferController: UNAUTHORIZED"
      })
    },
    {
      description: "self transfer",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        setup: { setOwner: true },
        revert: "Tickets::transferController: NO_OP"
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

        // Mock the project to exist.
        await this.projects.mock.exists.withArgs(projectId).returns(true);

        await this.contract
          .connect(caller)
          .initialize(caller.address, projectId);

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .transferController(controller, projectId);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "TransferController")
          .withArgs(controller, projectId, caller.address);

        const storedController = await this.contract
          .connect(caller)
          .controllers(projectId);

        expect(storedController).to.equal(controller);
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

          // Mock the project to exist.
          await this.projects.mock.exists.withArgs(projectId).returns(true);
          await this.contract
            .connect(caller)
            .initialize(caller.address, projectId);
        }

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .transferController(controller, projectId)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
