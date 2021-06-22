const { BigNumber, constants, utils } = require("ethers");

module.exports = async function() {
  const owner = this.deployer.address;
  const handle = "some-handle";
  const uri = "some-uri";
  const mod1 = {
    preferUnstaked: false,
    percent: 100,
    lockedUntil: 0,
    beneficiary: this.addrs[1].address,
    allocator: constants.AddressZero,
    projectId: BigNumber.from(0)
  };
  const mod2 = {
    preferUnstaked: false,
    percent: 50,
    lockedUntil: 0,
    beneficiary: this.addrs[1].address,
    allocator: constants.AddressZero,
    projectId: BigNumber.from(2)
  };
  const allocator = await this.deployContract("ExampleModAllocator");
  const mod3 = {
    preferUnstaked: false,
    percent: 25,
    lockedUntil: 0,
    beneficiary: this.addrs[1].address,
    allocator: allocator.address,
    projectId: BigNumber.from(0)
  };
  const paymentMods = [mod1, mod2, mod3];
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
  const expectedAmountToTap = amountToTap
    .mul(200)
    .div((await this.contracts.juicer.fee()).add(200));

  const weightMultiplier = (
    await this.contracts.fundingCycles.BASE_WEIGHT()
  ).div(BigNumber.from(10).pow(18));

  //   let packedMetadata = BigNumber.from(0);
  //   packedMetadata = packedMetadata.add(reconfigurationBondingCurveRate);
  //   packedMetadata = packedMetadata.shl(8);
  //   packedMetadata = packedMetadata.add(bondingCurveRate);
  //   packedMetadata = packedMetadata.shl(8);
  //   packedMetadata = packedMetadata.add(reservedRate);
  //   packedMetadata = packedMetadata.shl(8);

  return [
    /** 
      Set terminal.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.governance,
      fn: "setTerminal",
      args: [this.contracts.juicer.address]
    }),
    /** 
      Deploy first project with a payment mod. Expect the project's ID to be 1.
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
          mod1.preferUnstaked,
          mod1.percent,
          mod1.lockedUntil,
          mod1.beneficiary,
          mod1.allocator,
          mod1.projectId
        ],
        [
          mod2.preferUnstaked,
          mod2.percent,
          mod2.lockedUntil,
          mod2.beneficiary,
          mod2.allocator,
          mod2.projectId
        ],
        [
          mod3.preferUnstaked,
          mod3.percent,
          mod3.lockedUntil,
          mod3.beneficiary,
          mod3.allocator,
          mod3.projectId
        ]
      ]
    }),
    /** 
      Deploy second project with a payment mod. Expect the project's ID to be 2.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "deploy",
      args: [
        owner,
        utils.formatBytes32String(handle + "2"),
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
        [],
        []
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
      Check that second project has no balance.
    */
    this.check({
      contract: this.contracts.juicer,
      fn: "balanceOf",
      args: [2],
      value: BigNumber.from(0)
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
      args: [mod1.beneficiary],
      value: (await this.deployer.provider.getBalance(mod1.beneficiary)).add(
        expectedAmountToTap.mul(mod1.percent).div(200)
      )
    }),
    /** 
      Check that second project now has a balance.
    */
    this.check({
      contract: this.contracts.juicer,
      fn: "balanceOf",
      args: [2],
      value: expectedAmountToTap.mul(mod2.percent).div(200)
    }),
    /** 
      Check that beneficiary of the mod got tickets of project with ID 2. 
    */
    this.check({
      contract: this.contracts.ticketBooth,
      fn: "balanceOf",
      args: [mod2.beneficiary, 2],
      value: expectedAmountToTap
        .mul(mod2.percent)
        .div(200)
        .mul(weightMultiplier)
    }),
    /** 
      Check that mod's allocator got paid.
    */
    this.check({
      contract: this.deployer.provider,
      fn: "getBalance",
      args: [mod3.allocator],
      value: (await this.deployer.provider.getBalance(mod3.allocator)).add(
        expectedAmountToTap.mul(mod3.percent).div(200)
      )
    })
  ];
};
