const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "sets fee",
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
        const juicer = await this.deployMockLocalContractFn("Juicer", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address
        ]);
        const fee = 1;

        await juicer.mock.setFee.withArgs(fee).returns();

        // Execute the transaction.
        await this.contract.connect(caller).setFee(juicer.address, fee);
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
        const juicer = await this.deployMockLocalContractFn("Juicer", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address
        ]);
        const fee = 1;

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).setFee(juicer.address, fee)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
