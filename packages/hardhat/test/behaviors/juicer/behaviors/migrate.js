const {
  ethers: { BigNumber }
} = require("hardhat");

const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "migrate with no yielder, no preset balance",
      fn: async ({
        deployer,
        deployMockLocalContract,
        projects,
        prices,
        fundingCycles,
        ticketBooth,
        operatorStore,
        modStore,
        terminalDirectory,
        governance
      }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        governance,
        projectId: 1,
        terminal: await deployMockLocalContract("Juicer", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address,
          governance.address
        ]),
        setup: {}
      })
    },
    {
      description: "migrate with no yielder, with preset balance",
      fn: async ({
        deployer,
        deployMockLocalContract,
        projects,
        prices,
        fundingCycles,
        ticketBooth,
        operatorStore,
        modStore,
        terminalDirectory,
        governance
      }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        governance,
        projectId: 1,
        terminal: await deployMockLocalContract("Juicer", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address,
          governance.address
        ]),
        setup: {
          addToBalance: BigNumber.from(72)
        }
      })
    },
    {
      description: "migrate with yielder",
      fn: async ({
        deployer,
        deployMockLocalContract,
        projects,
        prices,
        fundingCycles,
        ticketBooth,
        operatorStore,
        modStore,
        terminalDirectory,
        governance
      }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        governance,
        projectId: 1,
        terminal: await deployMockLocalContract("Juicer", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address,
          governance.address
        ]),
        setup: {
          addYielder: true
        }
      })
    },
    {
      description: "migrate with operator",
      fn: async ({
        deployer,
        addrs,
        deployMockLocalContract,
        projects,
        prices,
        fundingCycles,
        ticketBooth,
        operatorStore,
        modStore,
        terminalDirectory,
        governance
      }) => ({
        caller: deployer,
        projectOwner: addrs[0].address,
        governance,
        projectId: 1,
        terminal: await deployMockLocalContract("Juicer", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address,
          governance.address
        ]),
        setup: {
          permissionFlag: true
        }
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: async ({
        deployer,
        deployMockLocalContract,
        projects,
        prices,
        fundingCycles,
        ticketBooth,
        operatorStore,
        modStore,
        terminalDirectory,
        governance,
        contract,
        addrs
      }) => {
        return {
          caller: deployer,
          projectOwner: addrs[0].address,
          governance,
          projectId: 1,
          terminal: await deployMockLocalContract("Juicer", [
            projects.address,
            fundingCycles.address,
            ticketBooth.address,
            operatorStore.address,
            modStore.address,
            prices.address,
            terminalDirectory.address,
            governance.address
          ]),
          setup: {
            allowMigration: false,
            currentTerminal: contract
          },
          revert: "Operatable: UNAUTHORIZED"
        };
      }
    },
    {
      description: "unauthorized terminal",
      fn: async ({
        deployer,
        deployMockLocalContract,
        projects,
        prices,
        fundingCycles,
        ticketBooth,
        operatorStore,
        modStore,
        terminalDirectory,
        governance
      }) => {
        return {
          caller: deployer,
          projectOwner: deployer.address,
          governance,
          projectId: 1,
          terminal: await deployMockLocalContract("Juicer", [
            projects.address,
            fundingCycles.address,
            ticketBooth.address,
            operatorStore.address,
            modStore.address,
            prices.address,
            terminalDirectory.address,
            governance.address
          ]),
          setup: {
            allowMigration: false,
            currentTerminal: await deployMockLocalContract("Juicer", [
              projects.address,
              fundingCycles.address,
              ticketBooth.address,
              operatorStore.address,
              modStore.address,
              prices.address,
              terminalDirectory.address,
              governance.address
            ])
          },
          revert: "Juicer::migrate: UNAUTHORIZED"
        };
      }
    },
    {
      description: "not allowed",
      fn: async ({
        deployer,
        deployMockLocalContract,
        projects,
        prices,
        fundingCycles,
        ticketBooth,
        operatorStore,
        modStore,
        terminalDirectory,
        governance,
        contract
      }) => {
        return {
          caller: deployer,
          projectOwner: deployer.address,
          governance,
          projectId: 1,
          terminal: await deployMockLocalContract("Juicer", [
            projects.address,
            fundingCycles.address,
            ticketBooth.address,
            operatorStore.address,
            modStore.address,
            prices.address,
            terminalDirectory.address,
            governance.address
          ]),
          setup: {
            allowMigration: false,
            currentTerminal: contract
          },
          revert: "Juicer::migrate: NOT_ALLOWED"
        };
      }
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const {
          caller,
          projectOwner,
          governance,
          projectId,
          terminal,
          setup: { addYielder, addToBalance = 0, permissionFlag } = {},
          expectation: { withdraw } = {}
        } = await successTest.fn(this);

        // Mock the Operator store permissions.
        const permissionIndex = 4;
        // Mock the caller to be the project's controller.
        await this.operatorStore.mock.hasPermission
          .withArgs(caller.address, projectOwner, projectId, permissionIndex)
          .returns(permissionFlag || false);

        // If there's a yielder, add it and set appropriate mocks.
        if (addYielder) {
          const yielder = await this.deployMockLocalContract("ExampleYielder");
          await this.contract.connect(governance).setYielder(yielder.address);
          if (withdraw) {
            await yielder.mock.withdraw
              .withArgs(withdraw, this.contract.address)
              .returns();
          }
          await yielder.mock.deposited.returns(0);
          await yielder.mock.getCurrentBalance.returns(0);
        }

        // Allow migration to the given terminal.
        await this.contract
          .connect(governance)
          .allowMigration(terminal.address);

        // Add to balance if needed.
        if (addToBalance)
          await this.contract.addToBalance(projectId, { value: addToBalance });

        // Mock the ability to add a balance to the terminal.
        await terminal.mock.addToBalance.withArgs(projectId).returns();

        // Mock the terminal directory setting process.
        await this.terminalDirectory.mock.setTerminal
          .withArgs(projectId, terminal.address)
          .returns();
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(this.contract.address);

        // Set the project owner.
        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .migrate(projectId, terminal.address);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Migrate")
          .withArgs(projectId, terminal.address, addToBalance, caller.address);

        // Get the stored target value.
        const storedBalance = await this.contract.balanceOf(projectId);

        // Expect the stored value to equal whats expected.
        expect(storedBalance).to.equal(0);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          projectOwner,
          governance,
          projectId,
          terminal,
          setup: {
            allowMigration,
            currentTerminal,
            addYielder,
            permissionFlag
          } = {},
          revert
        } = await failureTest.fn(this);

        // Mock the Operator store permissions.
        const permissionIndex = 4;

        // Mock the caller to be the project's controller.
        await this.operatorStore.mock.hasPermission
          .withArgs(caller.address, projectOwner, projectId, permissionIndex)
          .returns(permissionFlag || false);

        // If there's a yielder, add it and set appropriate mocks.
        if (addYielder) {
          const yielder = await this.deployMockLocalContract("ExampleYielder");
          await this.contract.connect(governance).setYielder(yielder.address);
        }

        if (allowMigration)
          // Allow migration to the given terminal.
          await this.contract
            .connect(governance)
            .allowMigration(terminal.address);

        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(currentTerminal.address);

        // Set the project owner.
        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).migrate(projectId, terminal.address)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
