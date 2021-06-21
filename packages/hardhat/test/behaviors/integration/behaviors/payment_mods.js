const { BigNumber, constants, utils } = require("ethers");

module.exports = async function() {
  const owner = this.deployer.address;
  const handle = "some-handle";
  const uri = "some-uri";
  const percent = 100;
  const lockedUntil = 0;
  const projectId = BigNumber.from(0);
  const beneficiary = this.addrs[1].address;
  const paymentMods = [
    {
      preferUnstaked: false,
      percent,
      lockedUntil,
      beneficiary,
      allocator: constants.AddressZero,
      projectId
    }
  ];
  const ticketMods = [];

  const target = BigNumber.from(10)
    .pow(18)
    .mul(1000);
  const currency = BigNumber.from(0);
  const duration = BigNumber.from(10000);
  const discountRate = BigNumber.from(180);
  const ballot = constants.AddressZero;

  const reservedRate = 0;
  const bondingCurveRate = 0;
  const reconfigurationBondingCurveRate = 0;

  const paymentValue = BigNumber.from(10)
    .pow(18)
    .mul(200);

  const amountToTap = paymentValue;

  //   let packedMetadata = BigNumber.from(0);
  //   packedMetadata = packedMetadata.add(reconfigurationBondingCurveRate);
  //   packedMetadata = packedMetadata.shl(8);
  //   packedMetadata = packedMetadata.add(bondingCurveRate);
  //   packedMetadata = packedMetadata.shl(8);
  //   packedMetadata = packedMetadata.add(reservedRate);
  //   packedMetadata = packedMetadata.shl(8);

  return [
    /** 
      Tap funds for the project with payment mod.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.governance,
      fn: "setTerminal",
      args: [this.contracts.juicer.address]
    }),
    /** 
      Deploy a funding cycle with a payment mod. Expect the project's ID to be 1.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "deploy",
      args: [
        owner,
        utils.formatBytes32String(handle),
        uri,
        {
          target,
          currency,
          duration,
          discountRate,
          ballot
        },
        {
          reservedRate,
          bondingCurveRate,
          reconfigurationBondingCurveRate
        },
        paymentMods,
        ticketMods
      ]
    }),
    /** 
      Check that the payment mod got set.
    */
    this.check({
      contract: this.contracts.modStore,
      fn: "paymentModsOf",
      args: [1, (await this.getTimestamp()).add(2)],
      value: [
        [
          false,
          percent,
          lockedUntil,
          this.addrs[1].address,
          constants.AddressZero,
          projectId
        ]
      ]
    }),
    /** 
      Make a payment to the project.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "pay",
      args: [1, this.addrs[2].address, "", false],
      value: paymentValue
    }),
    /** 
      Tap funds for the project with payment mod.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "tap",
      args: [1, amountToTap, currency, amountToTap]
    }),
    /** 
      Check that payment mod beneficiary has expected funds.
    */
    this.check({
      contract: this.deployer.provider,
      fn: "getBalance",
      args: [beneficiary],
      value: (await this.deployer.provider.getBalance(beneficiary)).add(
        amountToTap.mul(percent).div(200)
      )
    })
    // /**
    //   Check that the uri got set.
    // */
    // this.check({
    //   contract: this.contracts.projects,
    //   fn: "uriOf",
    //   args: [1],
    //   value: uri
    // }),
    // /**
    //   Check that the terminal got set.
    // */
    // this.check({
    //   contract: this.contracts.terminalDirectory,
    //   fn: "terminalOf",
    //   args: [1],
    //   value: this.contracts.juicer.address
    // }),
    // /**
    //   Check that the funding cycle got set.
    // */
    // this.check({
    //   contract: this.contracts.fundingCycles,
    //   fn: "get",
    //   args: [1],
    //   value: [
    //     BigNumber.from(1),
    //     BigNumber.from(1),
    //     BigNumber.from(1),
    //     BigNumber.from(0),
    //     (await this.getTimestamp()).add(1),
    //     BigNumber.from(10).pow(19),
    //     constants.AddressZero,
    //     (await this.getTimestamp()).add(1),
    //     duration,
    //     target,
    //     currency,
    //     BigNumber.from(10),
    //     discountRate,
    //     BigNumber.from(0),
    //     packedMetadata
    //   ]
    // }),
    // /**
    //   Make a payment to the project.
    // */
    // this.executeFn({
    //   caller: this.deployer,
    //   contract: this.contracts.juicer,
    //   fn: "pay",
    //   args: [1, this.addrs[2].address, "", false],
    //   value: paymentValue
    // }),
    // /**
    //   The project's balance should match the payment just made.
    // */
    // this.check({
    //   contract: this.deployer.provider,
    //   fn: "getBalance",
    //   args: [this.contracts.juicer.address],
    //   value: paymentValue
    // }),
    // /**
    //   Migrating to a new juicer shouldn't work because it hasn't been allowed yet.
    // */
    // this.executeFn({
    //   caller: this.deployer,
    //   contract: this.contracts.juicer,
    //   fn: "migrate",
    //   args: [1, secondJuicer.address],
    //   revert: "Juicer::migrate: NOT_ALLOWED"
    // }),
    // /**
    //   Allow a migration to the new juicer.
    // */
    // this.executeFn({
    //   caller: this.deployer,
    //   contract: this.contracts.governance,
    //   fn: "allowMigration",
    //   args: [this.contracts.juicer.address, secondJuicer.address]
    // }),
    // /**
    //   Migrate to the new juicer.
    // */
    // this.executeFn({
    //   caller: this.deployer,
    //   contract: this.contracts.juicer,
    //   fn: "migrate",
    //   args: [1, secondJuicer.address]
    // }),
    // /**
    //   There should no longer be a balance in the old juicer.
    // */
    // this.check({
    //   contract: this.deployer.provider,
    //   fn: "getBalance",
    //   args: [this.contracts.juicer.address],
    //   value: 0
    // }),
    // /**
    //   The balance should be entirely in the new Juicer.
    // */
    // this.check({
    //   contract: this.deployer.provider,
    //   fn: "getBalance",
    //   args: [secondJuicer.address],
    //   value: paymentValue
    // }),
    // /**
    //   The terminal should be updated to the new juicer in the directory.
    // */
    // this.check({
    //   contract: this.contracts.terminalDirectory,
    //   fn: "terminalOf",
    //   args: [1],
    //   value: secondJuicer.address
    // }),
    // /**
    //   Payments to the old Juicer should no longer be accepter.
    // */
    // this.executeFn({
    //   caller: this.deployer,
    //   contract: this.contracts.juicer,
    //   fn: "pay",
    //   args: [1, this.addrs[2].address, "", false],
    //   value: paymentValue,
    //   revert: "TerminalUtility: UNAUTHORIZED"
    // }),
    // /**
    //   Payments to the new Juicer should be accepted.
    // */
    // this.executeFn({
    //   caller: this.deployer,
    //   contract: secondJuicer,
    //   fn: "pay",
    //   args: [1, this.addrs[2].address, "", false],
    //   value: paymentValue
    // })
  ];
};
