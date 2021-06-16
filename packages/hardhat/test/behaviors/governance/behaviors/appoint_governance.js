const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "appoints governance",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        newGovernance: addrs[0].address
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ addrs }) => ({
        caller: addrs[0].address,
        newGovernance: addrs[0].address,
        revert: "Ownable: caller is not the owner"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, newGovernance } = successTest.fn(this);

        const operatorStore = await this.deployMockLocalContract(
          "OperatorStore"
        );
        const projects = await this.deployMockLocalContract("Projects", [
          operatorStore.address
        ]);
        const prices = await this.deployMockLocalContract("Prices");
        const terminalDirectory = await this.deployMockLocalContract(
          "TerminalDirectory",
          [projects.address]
        );
        const fundingCycles = await this.deployMockLocalContract(
          "FundingCycles",
          [terminalDirectory.address]
        );
        const ticketBooth = await this.deployMockLocalContract("TicketBooth", [
          projects.address,
          operatorStore.address,
          terminalDirectory.address
        ]);
        const modStore = await this.deployMockLocalContract("ModStore", [
          projects.address,
          operatorStore.address
        ]);

        // Deploy mock dependency contracts.
        const juicer = await this.deployMockLocalContract("Juicer", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address
        ]);

        await juicer.mock.appointGovernance.withArgs(newGovernance).returns();

        // Execute the transaction.
        await this.contract
          .connect(caller)
          .appointGovernance(juicer.address, newGovernance);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, newGovernance, revert } = failureTest.fn(this);

        const operatorStore = await this.deployMockLocalContract(
          "OperatorStore"
        );
        const projects = await this.deployMockLocalContract("Projects", [
          operatorStore.address
        ]);
        const prices = await this.deployMockLocalContract("Prices");
        const terminalDirectory = await this.deployMockLocalContract(
          "TerminalDirectory",
          [projects.address]
        );
        const fundingCycles = await this.deployMockLocalContract(
          "FundingCycles",
          [terminalDirectory.address]
        );
        const ticketBooth = await this.deployMockLocalContract("TicketBooth", [
          projects.address,
          operatorStore.address,
          terminalDirectory.address
        ]);
        const modStore = await this.deployMockLocalContract("ModStore", [
          projects.address,
          operatorStore.address
        ]);

        // Deploy mock dependency contracts.
        const juicer = await this.deployMockLocalContract("Juicer", [
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
          this.contract
            .connect(caller)
            .appointGovernance(juicer.address, newGovernance)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
