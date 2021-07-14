const {
  ethers: { BigNumber }
} = require("hardhat");

const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "no preset balance",
      fn: async ({
        deployer,
        deployMockLocalContractFn,
        mockContracts,
        governance
      }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        governance,
        projectId: 1,
        terminal: await deployMockLocalContractFn("TerminalV1", [
          mockContracts.projects.address,
          mockContracts.fundingCycles.address,
          mockContracts.ticketBooth.address,
          mockContracts.operatorStore.address,
          mockContracts.modStore.address,
          mockContracts.prices.address,
          mockContracts.terminalDirectory.address,
          governance.address
        ]),
        setup: {}
      })
    },
    {
      description: "with preset balance",
      fn: async ({
        deployer,
        deployMockLocalContractFn,
        mockContracts,
        governance
      }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        governance,
        projectId: 1,
        terminal: await deployMockLocalContractFn("TerminalV1", [
          mockContracts.projects.address,
          mockContracts.fundingCycles.address,
          mockContracts.ticketBooth.address,
          mockContracts.operatorStore.address,
          mockContracts.modStore.address,
          mockContracts.prices.address,
          mockContracts.terminalDirectory.address,
          governance.address
        ]),
        setup: {
          addToBalance: BigNumber.from(72)
        }
      })
    },
    {
      description: "with unprinted reserved tickets",
      fn: async ({
        deployer,
        deployMockLocalContractFn,
        mockContracts,
        governance
      }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        governance,
        projectId: 1,
        terminal: await deployMockLocalContractFn("TerminalV1", [
          mockContracts.projects.address,
          mockContracts.fundingCycles.address,
          mockContracts.ticketBooth.address,
          mockContracts.operatorStore.address,
          mockContracts.modStore.address,
          mockContracts.prices.address,
          mockContracts.terminalDirectory.address,
          governance.address
        ]),
        setup: {
          unprintedReservedTicketAmount: BigNumber.from(1)
        }
      })
    },
    {
      description: "with operator",
      fn: async ({
        deployer,
        addrs,
        deployMockLocalContractFn,
        mockContracts,
        governance
      }) => ({
        caller: deployer,
        projectOwner: addrs[0].address,
        governance,
        projectId: 1,
        terminal: await deployMockLocalContractFn("TerminalV1", [
          mockContracts.projects.address,
          mockContracts.fundingCycles.address,
          mockContracts.ticketBooth.address,
          mockContracts.operatorStore.address,
          mockContracts.modStore.address,
          mockContracts.prices.address,
          mockContracts.terminalDirectory.address,
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
        deployMockLocalContractFn,
        mockContracts,
        governance,
        targetContract,
        addrs
      }) => {
        return {
          caller: deployer,
          projectOwner: addrs[0].address,
          governance,
          projectId: 1,
          terminal: await deployMockLocalContractFn("TerminalV1", [
            mockContracts.projects.address,
            mockContracts.fundingCycles.address,
            mockContracts.ticketBooth.address,
            mockContracts.operatorStore.address,
            mockContracts.modStore.address,
            mockContracts.prices.address,
            mockContracts.terminalDirectory.address,
            governance.address
          ]),
          setup: {
            allowMigration: false,
            currentTerminal: targetContract
          },
          revert: "Operatable: UNAUTHORIZED"
        };
      }
    },
    {
      description: "unauthorized terminal",
      fn: async ({
        deployer,
        deployMockLocalContractFn,
        mockContracts,
        governance
      }) => {
        return {
          caller: deployer,
          projectOwner: deployer.address,
          governance,
          projectId: 1,
          terminal: await deployMockLocalContractFn("TerminalV1", [
            mockContracts.projects.address,
            mockContracts.fundingCycles.address,
            mockContracts.ticketBooth.address,
            mockContracts.operatorStore.address,
            mockContracts.modStore.address,
            mockContracts.prices.address,
            mockContracts.terminalDirectory.address,
            governance.address
          ]),
          setup: {
            allowMigration: false,
            currentTerminal: await deployMockLocalContractFn("TerminalV1", [
              mockContracts.projects.address,
              mockContracts.fundingCycles.address,
              mockContracts.ticketBooth.address,
              mockContracts.operatorStore.address,
              mockContracts.modStore.address,
              mockContracts.prices.address,
              mockContracts.terminalDirectory.address,
              governance.address
            ])
          },
          revert: "TerminalV1::migrate: UNAUTHORIZED"
        };
      }
    },
    {
      description: "not allowed",
      fn: async ({
        deployer,
        deployMockLocalContractFn,
        mockContracts,
        governance,
        targetContract
      }) => {
        return {
          caller: deployer,
          projectOwner: deployer.address,
          governance,
          projectId: 1,
          terminal: await deployMockLocalContractFn("TerminalV1", [
            mockContracts.projects.address,
            mockContracts.fundingCycles.address,
            mockContracts.ticketBooth.address,
            mockContracts.operatorStore.address,
            mockContracts.modStore.address,
            mockContracts.prices.address,
            mockContracts.terminalDirectory.address,
            governance.address
          ]),
          setup: {
            allowMigration: false,
            currentTerminal: targetContract
          },
          revert: "TerminalV1::migrate: NOT_ALLOWED"
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
          setup: {
            unprintedReservedTicketAmount = BigNumber.from(0),
            permissionFlag,
            addToBalance = 0
          } = {}
        } = await successTest.fn(this);

        // Mock the Operator store permissions.
        const permissionIndex = 4;
        // Mock the caller to be the project's controller.
        await this.mockContracts.operatorStore.mock.hasPermission
          .withArgs(caller.address, projectOwner, projectId, permissionIndex)
          .returns(permissionFlag || false);

        // Allow migration to the given terminal.
        await this.targetContract
          .connect(governance)
          .allowMigration(terminal.address);

        await this.mockFn({
          mockContract: this.mockContracts.ticketBooth,
          fn: "totalSupplyOf",
          args: [projectId],
          returns: [unprintedReservedTicketAmount]
        });

        // Add to balance if needed.
        if (addToBalance) {
          await this.targetContract.addToBalance(projectId, {
            value: addToBalance
          });
          // Mock the ability to add a balance to the terminal.
          await terminal.mock.addToBalance.withArgs(projectId).returns();
        }

        // Mock the terminal directory setting process.
        await this.mockContracts.terminalDirectory.mock.setTerminal
          .withArgs(projectId, terminal.address)
          .returns();
        await this.mockContracts.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(this.targetContract.address);

        // Set the project owner.
        await this.mockContracts.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        if (unprintedReservedTicketAmount.gt(0))
          await this.mockFn({
            mockContract: this.mockContracts.fundingCycles,
            fn: "currentOf",
            args: [projectId],
            returns: [
              {
                configured: 0,
                cycleLimit: 0,
                id: 0,
                projectId,
                number: 0,
                basedOn: 0,
                weight: 0,
                ballot: this.constants.AddressZero,
                start: 0,
                duration: 0,
                target: 0,
                currency: 0,
                fee: 0,
                discountRate: 0,
                tapped: 0,
                metadata: 0
              }
            ]
          });

        // Execute the transaction.
        const tx = await this.targetContract
          .connect(caller)
          .migrate(projectId, terminal.address);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.targetContract, "Migrate")
          .withArgs(projectId, terminal.address, addToBalance, caller.address);

        // Get the stored target value.
        const storedBalance = await this.targetContract.balanceOf(projectId);

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
          setup: { allowMigration, currentTerminal, permissionFlag } = {},
          revert
        } = await failureTest.fn(this);

        // Mock the Operator store permissions.
        const permissionIndex = 4;

        // Mock the caller to be the project's controller.
        await this.mockContracts.operatorStore.mock.hasPermission
          .withArgs(caller.address, projectOwner, projectId, permissionIndex)
          .returns(permissionFlag || false);

        if (allowMigration)
          // Allow migration to the given terminal.
          await this.targetContract
            .connect(governance)
            .allowMigration(terminal.address);

        await this.mockContracts.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(currentTerminal.address);

        // Set the project owner.
        await this.mockContracts.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // Execute the transaction.
        await expect(
          this.targetContract
            .connect(caller)
            .migrate(projectId, terminal.address)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
