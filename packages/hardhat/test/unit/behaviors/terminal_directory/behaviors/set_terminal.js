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
      description: "terminal set yet and is allowed, called by owner",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        setup: {
          preset: {
            allowMigration: true
          }
        }
      })
    },
    {
      description: "terminal set and is allowed, called by operator",
      fn: ({ deployer, addrs }) => ({
        caller: addrs[0],
        projectOwner: deployer.address,
        projectId: 1,
        setup: {
          permissionFlag: true,
          preset: {
            allowMigration: true
          }
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
    },
    {
      description: "terminal set yet and is not allowed, unauthorized",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        setup: {
          createProject: true,
          preset: {
            allowMigration: false
          }
        },
        revert: "TerminalDirectory::setTerminal: UNAUTHORIZED"
      })
    },
    {
      description: "terminal set and is not allowed, unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: addrs[0],
        projectOwner: deployer.address,
        projectId: 1,
        setup: {
          permissionFlag: true,
          createProject: true,
          preset: {
            allowMigration: false
          }
        },
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
          setup: { permissionFlag, preset } = {},
          expect: { noEvent = false } = {}
        } = successTest.fn(this);

        // Set the Projects mock to return the projectOwner.
        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // Mock the Operator store permissions.
        const permissionIndex = 16;
        // Mock the caller to be the project's controller.
        await this.operatorStore.mock.hasPermission
          .withArgs(caller.address, projectOwner, projectId, permissionIndex)
          .returns(permissionFlag || false);

        // The project should exist.
        await this.projects.mock.exists.withArgs(projectId).returns(true);

        const operatorStore = await this.deployMockLocalContractFn(
          "OperatorStore"
        );
        const projects = await this.deployMockLocalContractFn("Projects", [
          operatorStore.address
        ]);
        const prices = await this.deployMockLocalContractFn("Prices");
        const terminalDirectory = await this.deployMockLocalContractFn(
          "TerminalDirectory",
          [projects.address]
        );
        const fundingCycles = await this.deployMockLocalContractFn(
          "FundingCycles",
          [terminalDirectory.address]
        );
        const ticketBooth = await this.deployMockLocalContractFn(
          "TicketBooth",
          [projects.address, operatorStore.address, terminalDirectory.address]
        );
        const modStore = await this.deployMockLocalContractFn("ModStore", [
          projects.address,
          operatorStore.address
        ]);

        // Deploy mock dependency contracts.
        const mockTerminal = await this.deployMockLocalContractFn(
          "TerminalV1",
          [
            projects.address,
            fundingCycles.address,
            ticketBooth.address,
            operatorStore.address,
            modStore.address,
            prices.address,
            terminalDirectory.address
          ]
        );

        if (preset) {
          const presetMockTerminal = await this.deployMockLocalContractFn(
            "TerminalV1",
            [
              projects.address,
              fundingCycles.address,
              ticketBooth.address,
              operatorStore.address,
              modStore.address,
              prices.address,
              terminalDirectory.address
            ]
          );
          await presetMockTerminal.mock.migrationIsAllowed
            .withArgs(mockTerminal.address)
            .returns(preset.allowMigration);
          await this.contract
            .connect(caller)
            .setTerminal(projectId, presetMockTerminal.address);
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .setTerminal(projectId, mockTerminal.address);

        if (noEvent) {
          const receipt = await tx.wait();
          expect(receipt.events.length).to.equal(0);
        } else {
          // Expect an event to have been emitted.
          await expect(tx)
            .to.emit(this.contract, "SetTerminal")
            .withArgs(projectId, mockTerminal.address, caller.address);
        }

        // Get the stored ticket for the project.
        const storedTerminal = await this.contract
          .connect(caller)
          .terminalOf(projectId);

        expect(storedTerminal).to.equal(mockTerminal.address);
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
        const permissionIndex = 16;
        // Mock the caller to be the project's controller.
        await this.operatorStore.mock.hasPermission
          .withArgs(caller.address, projectOwner, projectId, permissionIndex)
          .returns(permissionFlag || false);

        // The project should exist.
        await this.projects.mock.exists
          .withArgs(projectId)
          .returns(createProject);

        const operatorStore = await this.deployMockLocalContractFn(
          "OperatorStore"
        );
        const projects = await this.deployMockLocalContractFn("Projects", [
          operatorStore.address
        ]);
        const prices = await this.deployMockLocalContractFn("Prices");
        const terminalDirectory = await this.deployMockLocalContractFn(
          "TerminalDirectory",
          [projects.address]
        );
        const fundingCycles = await this.deployMockLocalContractFn(
          "FundingCycles",
          [terminalDirectory.address]
        );
        const ticketBooth = await this.deployMockLocalContractFn(
          "TicketBooth",
          [projects.address, operatorStore.address, terminalDirectory.address]
        );
        const modStore = await this.deployMockLocalContractFn("ModStore", [
          projects.address,
          operatorStore.address
        ]);

        // Deploy mock dependency contracts.
        const mockTerminal = await this.deployMockLocalContractFn(
          "TerminalV1",
          [
            projects.address,
            fundingCycles.address,
            ticketBooth.address,
            operatorStore.address,
            modStore.address,
            prices.address,
            terminalDirectory.address
          ]
        );

        if (preset) {
          const presetMockTerminal = await this.deployMockLocalContractFn(
            "TerminalV1",
            [
              projects.address,
              fundingCycles.address,
              ticketBooth.address,
              operatorStore.address,
              modStore.address,
              prices.address,
              terminalDirectory.address
            ]
          );
          await presetMockTerminal.mock.migrationIsAllowed
            .withArgs(mockTerminal.address)
            .returns(preset.allowMigration);
          await this.contract
            .connect(caller)
            .setTerminal(projectId, presetMockTerminal.address);
        }

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .setTerminal(projectId, mockTerminal.address)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
