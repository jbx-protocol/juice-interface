/** 
  Project's can set payment mods, which allow payouts to automatically
  sent to either an address, another project on Juice, or a contract that inherits from IModAllocator.
*/
module.exports = async ({
  deployer,
  addrs,
  constants,
  contracts,
  executeFn,
  checkFn,
  BigNumber,
  deployContractFn,
  randomBigNumberFn,
  stringToBytesFn,
  normalizedPercentFn,
  getBalanceFn,
  verifyBalanceFn,
  randomBoolFn,
  randomStringFn,
  randomAddressFn
}) => {
  // The owner of the project with mods.
  const owner = addrs[0];

  // An account that will be used to make a payment.
  const payer = addrs[1];

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedIdOfBaseProject = 2;
  // The second project created will have ID 3, and will be used to route Mod payouts to.
  const expectedIdOfModProject = 3;

  // There are three types of mods.
  // Address mods route payout directly to an address.
  const addressMod = {
    preferUnstaked: randomBoolFn(),
    percent: normalizedPercentFn(50).toNumber(),
    lockedUntil: 0,
    beneficiary: randomAddressFn(),
    allocator: constants.AddressZero,
    projectId: BigNumber.from(0)
  };
  // Project mods route payout directly to another project on Juicer.
  const projectMod = {
    preferUnstaked: randomBoolFn(),
    percent: normalizedPercentFn(25).toNumber(),
    lockedUntil: 0,
    beneficiary: randomAddressFn(),
    allocator: constants.AddressZero,
    projectId: BigNumber.from(expectedIdOfModProject)
  };
  // Allocator mods route payments directly to the specified contract that inherits from IModAllocator.
  const allocatorMod = {
    preferUnstaked: randomBoolFn(),
    percent: normalizedPercentFn(20).toNumber(),
    lockedUntil: 0,
    beneficiary: randomAddressFn(),
    allocator: (await deployContractFn("ExampleModAllocator")).address,
    projectId: BigNumber.from(0)
  };

  // The currency will be 0, which corresponds to ETH.
  const currency = 0;

  // Cant pay entire balance because some is needed for gas.
  const paymentValue = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(2)
  });

  // An amount up to the amount paid can be tapped.
  const amountToTap = randomBigNumberFn({ max: paymentValue });

  // The target must be at least the amount to tap.
  const target = randomBigNumberFn({ min: amountToTap });

  // The amount tapped takes into account any fees paid.
  const expectedAmountTapped = amountToTap
    .mul(constants.MaxPercent)
    .div((await contracts.juicer.fee()).add(constants.MaxPercent));

  return [
    /** 
      Deploy first project with a payment mod.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "deploy",
        args: [
          owner.address,
          stringToBytesFn("some-unique-handle"),
          randomStringFn(),
          {
            target,
            currency,
            duration: randomBigNumberFn({ min: 10, max: constants.MaxUint24 }),
            discountRate: randomBigNumberFn({ max: constants.MaxPercent }),
            ballot: constants.AddressZero
          },
          {
            reservedRate: BigNumber.from(0),
            bondingCurveRate: randomBigNumberFn({ max: constants.MaxPercent }),
            reconfigurationBondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            })
          },
          [addressMod, projectMod, allocatorMod],
          []
        ]
      }),
    /**
        Check that the payment mod got set.
      */
    ({ timeMark }) =>
      checkFn({
        contract: contracts.modStore,
        fn: "paymentModsOf",
        args: [expectedIdOfBaseProject, timeMark],
        expect: [
          [
            addressMod.preferUnstaked,
            addressMod.percent,
            addressMod.lockedUntil,
            addressMod.beneficiary,
            addressMod.allocator,
            addressMod.projectId
          ],
          [
            projectMod.preferUnstaked,
            projectMod.percent,
            projectMod.lockedUntil,
            projectMod.beneficiary,
            projectMod.allocator,
            projectMod.projectId
          ],
          [
            allocatorMod.preferUnstaked,
            allocatorMod.percent,
            allocatorMod.lockedUntil,
            allocatorMod.beneficiary,
            allocatorMod.allocator,
            allocatorMod.projectId
          ]
        ]
      }),
    /**
        Deploy second project that'll be sent funds my your
        configured project prayment mod.
      */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "deploy",
        args: [
          randomAddressFn(),
          stringToBytesFn("stringToBytesFn"),
          randomStringFn(),
          {
            target: randomBigNumberFn(),
            currency: randomBigNumberFn({ max: constants.MaxUint8 }),
            duration: randomBigNumberFn({ min: 1, max: constants.MaxUint24 }),
            discountRate: randomBigNumberFn({ max: constants.MaxPercent }),
            ballot: constants.AddressZero
          },
          {
            reservedRate: BigNumber.from(0),
            bondingCurveRate: randomBigNumberFn({ max: constants.MaxPercent }),
            reconfigurationBondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            })
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
        caller: payer,
        contract: contracts.juicer,
        fn: "pay",
        args: [
          expectedIdOfBaseProject,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue
      }),
    /**
        Check that second project has no balance.
      */
    () =>
      checkFn({
        contract: contracts.juicer,
        fn: "balanceOf",
        args: [expectedIdOfModProject],
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
        args: [expectedIdOfBaseProject, amountToTap, currency, amountToTap]
      }),
    /**
        Check that payment mod beneficiary has expected funds.
      */
    () =>
      verifyBalanceFn({
        address: addressMod.beneficiary,
        expect: expectedAmountTapped
          .mul(addressMod.percent)
          .div(constants.MaxPercent)
      }),
    /**
        Check that second project now has a balance.
      */
    () =>
      checkFn({
        contract: contracts.juicer,
        fn: "balanceOf",
        args: [expectedIdOfModProject],
        expect: expectedAmountTapped
          .mul(projectMod.percent)
          .div(constants.MaxPercent)
      }),
    /**
        Check that beneficiary of the mod got tickets of project with ID 3.
      */
    () =>
      checkFn({
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [projectMod.beneficiary, expectedIdOfModProject],
        expect: expectedAmountTapped
          .mul(projectMod.percent)
          .div(constants.MaxPercent)
          .mul(constants.InitialWeightMultiplier)
      }),
    /**
        Check that mod's allocator got paid.
      */
    () =>
      verifyBalanceFn({
        address: allocatorMod.allocator,
        expect: expectedAmountTapped
          .mul(allocatorMod.percent)
          .div(constants.MaxPercent)
      }),
    /**
        Check that the project owner got any leftovers.
      */
    () =>
      verifyBalanceFn({
        address: owner.address,
        expect: expectedAmountTapped
          .mul(
            constants.MaxPercent.sub(allocatorMod.percent)
              .sub(projectMod.percent)
              .sub(addressMod.percent)
          )
          .div(constants.MaxPercent)
      })
  ];
};
