const { BigNumber, constants, utils } = require("ethers");

module.exports = async ({
  deployer,
  addrs,
  contracts,
  executeFn,
  checkFn,
  verifyBalanceFn,
  deployContract
}) => {
  const owner = deployer.address;
  const mod1 = {
    preferUnstaked: false,
    percent: 100,
    lockedUntil: 0,
    beneficiary: addrs[1].address,
    allocator: constants.AddressZero,
    projectId: BigNumber.from(0)
  };
  const mod2 = {
    preferUnstaked: false,
    percent: 50,
    lockedUntil: 0,
    beneficiary: addrs[1].address,
    allocator: constants.AddressZero,
    // Use project with ID 3, which will be created.
    projectId: BigNumber.from(3)
  };
  const allocator = await deployContract("ExampleModAllocator");
  const mod3 = {
    preferUnstaked: false,
    percent: 25,
    lockedUntil: 0,
    beneficiary: addrs[1].address,
    allocator: allocator.address,
    projectId: BigNumber.from(0)
  };
  const paymentMods = [mod1, mod2, mod3];
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
    .div((await contracts.juicer.fee()).add(200));

  const weightMultiplier = (await contracts.fundingCycles.BASE_WEIGHT()).div(
    BigNumber.from(10).pow(18)
  );

  return [
    /** 
      Deploy first project with a payment mod. Expect the project's ID to be 2.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "deploy",
        args: [
          owner,
          utils.formatBytes32String("some-handle"),
          "",
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
    ({ timeMark }) =>
      checkFn({
        contract: contracts.modStore,
        fn: "paymentModsOf",
        args: [2, timeMark],
        expect: [
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
      Deploy second project with a payment mod. Expect the project's ID to be 3.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "deploy",
        args: [
          owner,
          utils.formatBytes32String("some-other-handle"),
          "",
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
          [],
          []
        ]
      }),
    /** 
      Make a payment to the project.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "pay",
        args: [2, addrs[2].address, "", false],
        value: paymentValue
      }),
    /** 
      Check that second project has no balance.
    */
    () =>
      checkFn({
        contract: contracts.juicer,
        fn: "balanceOf",
        args: [3],
        expect: BigNumber.from(0)
      }),
    /** 
      Tap funds for the project with payment mod.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "tap",
        args: [2, amountToTap, currency, amountToTap]
      }),
    /** 
      Check that payment mod beneficiary has expected funds.
    */
    () =>
      verifyBalanceFn({
        address: mod1.beneficiary,
        expect: expectedAmountToTap.mul(mod1.percent).div(200)
      }),
    /**
      Check that second project now has a balance.
    */
    () =>
      checkFn({
        contract: contracts.juicer,
        fn: "balanceOf",
        args: [3],
        expect: expectedAmountToTap.mul(mod2.percent).div(200)
      }),
    /**
      Check that beneficiary of the mod got tickets of project with ID 3.
    */
    () =>
      checkFn({
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [mod2.beneficiary, 3],
        expect: expectedAmountToTap
          .mul(mod2.percent)
          .div(200)
          .mul(weightMultiplier)
      }),
    /**
      Check that mod's allocator got paid.
    */
    () =>
      verifyBalanceFn({
        address: mod3.allocator,
        expect: expectedAmountToTap.mul(mod3.percent).div(200)
      })
  ];
};
