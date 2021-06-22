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

  const paymentValue = BigNumber.from(10)
    .pow(18)
    .mul(200);

  const amountToTap = paymentValue;
  const expectedAmountToTap = amountToTap
    .mul(200)
    .div((await this.contracts.juicer.fee()).add(200));

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
          duration: BigNumber.from(10000),
          discountRate: BigNumber.from(180),
          ballot: constants.AddressZero
        },
        {
          reservedRate: 0,
          bondingCurveRate: 0,
          reconfigurationBondingCurveRate: 0
        },
        paymentMods,
        ticketMods
      ]
    }),
    /** 
      Check that the payment mod got set.
    */
    this.checkFn({
      contract: this.contracts.modStore,
      fn: "paymentModsOf",
      args: [1, (await this.getTimestamp()).add(2)],
      expect: [
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
    this.verifyBalanceFn({
      address: beneficiary,
      expect: expectedAmountToTap.mul(percent).div(200)
    })
  ];
};
