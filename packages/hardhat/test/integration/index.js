const { BigNumber, constants, utils } = require("ethers");
const workflows = require("./workflows");

const run = function(ops) {
  return async function() {
    // Bind this.
    this.ops = ops;
    const resolvedOps = await this.ops();
    // eslint-disable-next-line no-restricted-syntax
    for (const op of resolvedOps) {
      // eslint-disable-next-line no-await-in-loop
      await op();
    }
  };
};

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    const operatorStore = await this.deployContract("OperatorStore");
    const projects = await this.deployContract("Projects", [
      operatorStore.address
    ]);
    const prices = await this.deployContract("Prices");
    const terminalDirectory = await this.deployContract("TerminalDirectory", [
      projects.address
    ]);
    const fundingCycles = await this.deployContract("FundingCycles", [
      terminalDirectory.address
    ]);

    const ticketBooth = await this.deployContract("TicketBooth", [
      projects.address,
      operatorStore.address,
      terminalDirectory.address
    ]);

    const modStore = await this.deployContract("ModStore", [
      projects.address,
      operatorStore.address,
      terminalDirectory.address
    ]);

    const governance = await this.deployContract("Governance", [
      1,
      terminalDirectory.address
    ]);

    const juicer = await this.deployContract("Juicer", [
      projects.address,
      fundingCycles.address,
      ticketBooth.address,
      operatorStore.address,
      modStore.address,
      prices.address,
      terminalDirectory.address,
      governance.address
    ]);

    /** 
      Deploy the governance contract's project.
    */
    await this.executeFn({
      caller: this.deployer,
      contract: juicer,
      fn: "deploy",
      args: [
        this.deployer.address,
        utils.formatBytes32String("juice"),
        "",
        {
          target: 0,
          currency: 0,
          duration: BigNumber.from(10000),
          discountRate: BigNumber.from(180),
          ballot: constants.AddressZero
        },
        {
          reservedRate: 0,
          bondingCurveRate: 0,
          reconfigurationBondingCurveRate: 0
        },
        [],
        []
      ]
    })();

    this.contracts = {
      governance,
      terminalDirectory,
      prices,
      operatorStore,
      ticketBooth,
      fundingCycles,
      projects,
      modStore,
      juicer
    };
  });

  it("Simple deployment of a project", run(workflows.simpleDeploy));
  it("Migrate from one Terminal to another", run(workflows.migrate));
  it("Payout to payout mods", run(workflows.payoutToPaymentMods));
  // it("Print reserved tickets", run(workflows.printReservedTickets));
};
