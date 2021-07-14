const { expect } = require("chai");
const { constants } = require("ethers");

const tests = {
  success: [
    {
      description: "set a new terminal",
      fn: async ({ governance, deployMockLocalContractFn, mockContracts }) => ({
        caller: governance,
        terminal: (
          await deployMockLocalContractFn("TerminalV1", [
            mockContracts.projects.address,
            mockContracts.fundingCycles.address,
            mockContracts.ticketBooth.address,
            mockContracts.operatorStore.address,
            mockContracts.modStore.address,
            mockContracts.prices.address,
            mockContracts.terminalDirectory.address,
            governance.address
          ])
        ).address
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer, targetContract }) => ({
        caller: deployer,
        terminal: targetContract.address,
        revert: "TerminalV1: UNAUTHORIZED"
      })
    },
    {
      description: "zero address",
      fn: ({ governance }) => ({
        caller: governance,
        terminal: constants.AddressZero,
        revert: "TerminalV1::allowMigration: ZERO_ADDRESS"
      })
    },
    {
      description: "same as current",
      fn: ({ governance, targetContract }) => ({
        caller: governance,
        terminal: targetContract.address,
        revert: "TerminalV1::allowMigration: NO_OP"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, terminal } = await successTest.fn(this);

        // Execute the transaction.
        const tx = await this.targetContract
          .connect(caller)
          .allowMigration(terminal);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.targetContract, "AllowMigration")
          .withArgs(terminal);

        // Get the stored allowed value.
        const storedAllowedValue = await this.targetContract.migrationIsAllowed(
          terminal
        );

        // Expect the stored value to equal whats expected.
        expect(storedAllowedValue).to.equal(true);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, terminal, revert } = failureTest.fn(this);

        await expect(
          this.targetContract.connect(caller).allowMigration(terminal)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
