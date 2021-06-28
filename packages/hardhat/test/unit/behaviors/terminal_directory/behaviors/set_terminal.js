const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "no terminal set yet, called by owner",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1
      })
    },
    {
      description: "no terminal set yet, called by operator",
      fn: ({ deployer, addrs }) => ({
        caller: addrs[0],
        projectOwner: deployer.address,
        projectId: 1,
        setup: { permissionFlag: true }
      })
    },
    {
      description: "set by previous terminal",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        setup: {
          preset: true,
          sameTerminal: true
        },
        expect: {
          noEvent: true
        }
      })
    }
  ],
  failure: [
    {
      description: "project not found",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        setup: { createProject: false, preset: false },
        revert: "TerminalDirectory::setTerminal: NOT_FOUND"
      })
    },
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: addrs[0],
        projectOwner: deployer.address,
        projectId: 1,
        setup: { createProject: true, preset: false },
        revert: "TerminalDirectory::setTerminal: UNAUTHORIZED"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const {
          projectOwner,
          caller,
          projectId,
          setup: { preset, permissionFlag } = {},
          expect: { noEvent = false } = {}
        } = successTest.fn(this);

        // Set the Projects mock to return the projectOwner.
        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // Mock the Operator store permissions.
        const permissionIndex = 15;
        // Mock the caller to be the project's controller.
        await this.operatorStore.mock.hasPermission
          .withArgs(caller.address, projectOwner, projectId, permissionIndex)
          .returns(permissionFlag || false);

        // The project should exist.
        await this.projects.mock.exists.withArgs(projectId).returns(true);

        const mockTerminalDirectory = await this.deployMockLocalContractFn(
          "TerminalDirectory",
          [this.projects.address]
        );

        if (preset) {
          await this.contract
            .connect(caller)
            .setTerminal(projectId, mockTerminalDirectory.address);
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .setTerminal(projectId, mockTerminalDirectory.address);

        if (noEvent) {
          const receipt = await tx.wait();
          expect(receipt.events.length).to.equal(0);
        } else {
          // Expect an event to have been emitted.
          await expect(tx)
            .to.emit(this.contract, "SetTerminal")
            .withArgs(projectId, mockTerminalDirectory.address, caller.address);
        }

        // Get the stored ticket for the project.
        const storedTerminal = await this.contract
          .connect(caller)
          .terminalOf(projectId);

        expect(storedTerminal).to.equal(mockTerminalDirectory.address);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          projectId,
          projectOwner,
          setup: { preset, createProject, permissionFlag } = {},
          revert
        } = failureTest.fn(this);

        // Set the Projects mock to return the projectOwner.
        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // Mock the Operator store permissions.
        const permissionIndex = 15;
        // Mock the caller to be the project's controller.
        await this.operatorStore.mock.hasPermission
          .withArgs(caller.address, projectOwner, projectId, permissionIndex)
          .returns(permissionFlag || false);

        // The project should exist.
        await this.projects.mock.exists
          .withArgs(projectId)
          .returns(createProject);

        if (preset) {
          const presetMockTerminalDirectory = await this.deployMockLocalContractFn(
            "TerminalDirectory",
            [this.projects.address]
          );
          await this.contract
            .connect(caller)
            .setTerminal(projectId, presetMockTerminalDirectory.address);
        }

        const mockTerminalDirectory = await this.deployMockLocalContractFn(
          "TerminalDirectory",
          [this.projects.address]
        );

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .setTerminal(projectId, mockTerminalDirectory.address)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
