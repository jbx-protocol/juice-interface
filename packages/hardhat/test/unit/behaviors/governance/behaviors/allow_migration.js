const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "allow migration",
      fn: ({ deployer }) => ({
        caller: deployer
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ addrs }) => ({
        caller: addrs[0].address,
        revert: "Ownable: caller is not the owner"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller } = successTest.fn(this);

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
        const from = await this.deployMockLocalContractFn("TerminalV1", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address
        ]);
        const to = await this.deployMockLocalContractFn("TerminalV1", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address
        ]);

        await from.mock.allowMigration.withArgs(to.address).returns();

        // Execute the transaction.
        await this.contract
          .connect(caller)
          .allowMigration(from.address, to.address);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, revert } = failureTest.fn(this);

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
        const from = await this.deployMockLocalContractFn("TerminalV1", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address
        ]);
        const to = await this.deployMockLocalContractFn("TerminalV1", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address
        ]);

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).allowMigration(from.address, to.address)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
