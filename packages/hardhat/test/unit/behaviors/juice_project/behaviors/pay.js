const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "sets preferences",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        beneficiary: addrs[0].address,
        memo: "some-memo",
        preferUnstakedTickets: true
      })
    }
  ],
  failure: [
    {
      description: "zero project",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        beneficiary: addrs[0].address,
        memo: "some-memo",
        preferUnstakedTickets: true,
        setup: { setTerminal: false, zeroProject: true },
        revert: "JuiceProject::pay: PROJECT_NOT_FOUND"
      })
    },
    {
      description: "zero terminal",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        beneficiary: addrs[0].address,
        memo: "some-memo",
        preferUnstakedTickets: true,
        setup: { setTerminal: false },
        revert: "JuiceProject::pay: TERMINAL_NOT_FOUND"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const {
          caller,
          beneficiary,
          memo,
          preferUnstakedTickets
        } = successTest.fn(this);

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

        await this.contract.connect(caller).setTerminal(juicer.address);

        await juicer.mock.pay
          .withArgs(this.projectId, beneficiary, memo, preferUnstakedTickets)
          .returns(0);

        // Execute the transaction.
        await this.contract
          .connect(caller)
          .pay(beneficiary, memo, preferUnstakedTickets, {
            value: 1234
          });
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          beneficiary,
          memo,
          preferUnstakedTickets,
          setup: { setTerminal = true, zeroProject = false } = {},
          revert
        } = failureTest.fn(this);

        if (setTerminal) {
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
          const ticketBooth = await this.deployMockLocalContract(
            "TicketBooth",
            [projects.address, operatorStore.address, terminalDirectory.address]
          );
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

          await this.contract.connect(caller).setTerminal(juicer.address);
          await juicer.mock.pay
            .withArgs(this.projectId, beneficiary, memo, preferUnstakedTickets)
            .returns(0);
        }

        if (zeroProject) {
          await this.contract.connect(caller).setProjectId(0);
        }

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .pay(beneficiary, memo, preferUnstakedTickets, {
              value: 1234
            })
        ).to.be.revertedWith(revert);
      });
    });
  });
};
