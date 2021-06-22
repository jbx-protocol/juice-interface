const { expect } = require("chai");
const { constants } = require("ethers");

const tests = {
  success: [
    {
      description: "set a new terminal",
      fn: async ({
        governance,
        deployMockLocalContract,
        projects,
        prices,
        fundingCycles,
        ticketBooth,
        operatorStore,
        modStore,
        terminalDirectory
      }) => ({
        caller: governance,
        terminal: (
          await deployMockLocalContract("Juicer", [
            projects.address,
            fundingCycles.address,
            ticketBooth.address,
            operatorStore.address,
            modStore.address,
            prices.address,
            terminalDirectory.address,
            governance.address
          ])
        ).address
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer, contract }) => ({
        caller: deployer,
        terminal: contract.address,
        revert: "Juicer: UNAUTHORIZED"
      })
    },
    {
      description: "zero address",
      fn: ({ governance }) => ({
        caller: governance,
        terminal: constants.AddressZero,
        revert: "Juicer::allowMigration: ZERO_ADDRESS"
      })
    },
    {
      description: "same as current",
      fn: ({ governance, contract }) => ({
        caller: governance,
        terminal: contract.address,
        revert: "Juicer::allowMigration: NO_OP"
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
        const tx = await this.contract.connect(caller).allowMigration(terminal);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "AllowMigration")
          .withArgs(terminal);

        // Get the stored allowed value.
        const storedAllowedValue = await this.contract.migrationIsAllowed(
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
          this.contract.connect(caller).allowMigration(terminal)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
