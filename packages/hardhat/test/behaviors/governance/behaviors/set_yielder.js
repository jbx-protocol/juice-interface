const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "sets preferences",
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
        const tickets = await this.deployMockLocalContract("Tickets", [
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
          tickets.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address
        ]);
        const yielder = await this.deployMockLocalContract("YearnYielder");

        await juicer.mock.setYielder.withArgs(yielder.address).returns();

        // Execute the transaction.
        await this.contract
          .connect(caller)
          .setYielder(juicer.address, yielder.address);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, revert } = failureTest.fn(this);

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
        const tickets = await this.deployMockLocalContract("Tickets", [
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
          tickets.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address
        ]);
        const yielder = await this.deployMockLocalContract("YearnYielder");

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .setYielder(juicer.address, yielder.address)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
