const { BigNumber, constants, utils } = require("ethers");

module.exports = async function() {
  const owner = this.deployer.address;

  const paymentMods = [];
  const ticketMods = [];

  const target = BigNumber.from(10)
    .pow(18)
    .mul(1000);

  const paymentValue = BigNumber.from(10)
    .pow(18)
    .mul(200);

  const secondJuicer = await this.deployContract("Juicer", [
    this.contracts.projects.address,
    this.contracts.fundingCycles.address,
    this.contracts.ticketBooth.address,
    this.contracts.operatorStore.address,
    this.contracts.modStore.address,
    this.contracts.prices.address,
    this.contracts.terminalDirectory.address,
    this.contracts.governance.address
  ]);

  return [
    /** 
      Deploy a project. Expect the project's ID to be 2.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "deploy",
      args: [
        owner,
        utils.formatBytes32String("some-handle"),
        "some-uri",
        {
          target,
          currency: BigNumber.from(1),
          duration: BigNumber.from(10000),
          discountRate: BigNumber.from(180),
          ballot: constants.AddressZero
        },
        {
          reservedRate: 20,
          bondingCurveRate: 140,
          reconfigurationBondingCurveRate: 140
        },
        paymentMods,
        ticketMods
      ]
    }),
    /**
      Check that the terminal got set.
    */
    this.checkFn({
      contract: this.contracts.terminalDirectory,
      fn: "terminalOf",
      args: [2],
      expect: this.contracts.juicer.address
    }),
    /**
      Make a payment to the project.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "pay",
      args: [2, this.addrs[2].address, "", false],
      value: paymentValue
    }),
    /**
      The project's balance should match the payment just made.
    */
    this.checkFn({
      contract: this.deployer.provider,
      fn: "getBalance",
      args: [this.contracts.juicer.address],
      expect: paymentValue
    }),
    /**
      Migrating to a new juicer shouldn't work because it hasn't been allowed yet.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "migrate",
      args: [2, secondJuicer.address],
      revert: "Juicer::migrate: NOT_ALLOWED"
    }),
    /**
      Allow a migration to the new juicer.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.governance,
      fn: "allowMigration",
      args: [this.contracts.juicer.address, secondJuicer.address]
    }),
    /**
      Migrate to the new juicer.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "migrate",
      args: [2, secondJuicer.address]
    }),
    /**
      There should no longer be a balance in the old juicer.
    */
    this.checkFn({
      contract: this.deployer.provider,
      fn: "getBalance",
      args: [this.contracts.juicer.address],
      expect: 0
    }),
    /**
      The balance should be entirely in the new Juicer.
    */
    this.checkFn({
      contract: this.deployer.provider,
      fn: "getBalance",
      args: [secondJuicer.address],
      expect: paymentValue
    }),
    /**
      The terminal should be updated to the new juicer in the directory.
    */
    this.checkFn({
      contract: this.contracts.terminalDirectory,
      fn: "terminalOf",
      args: [2],
      expect: secondJuicer.address
    }),
    /**
      Payments to the old Juicer should no longer be accepter.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "pay",
      args: [2, this.addrs[2].address, "", false],
      value: paymentValue,
      revert: "TerminalUtility: UNAUTHORIZED"
    }),
    /**
      Payments to the new Juicer should be accepted.
    */
    this.executeFn({
      caller: this.deployer,
      contract: secondJuicer,
      fn: "pay",
      args: [2, this.addrs[2].address, "", false],
      value: paymentValue
    })
  ];
};
