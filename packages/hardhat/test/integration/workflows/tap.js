/** 
  Anyone can tap funds on behalf of a project.

  When a project is tapped, it will issue the appropriate payouts to its mods, and will send
  any leftover funds to the project owner.

  Payment mods allow payouts to automatically be sent to either an address, another project on Juice, or a contract that inherits from IModAllocator.
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
  getBalanceFn,
  verifyBalanceFn,
  randomBoolFn,
  fastforwardFn,
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

  // The mod percents should add up to <= constants.MaxPercent.
  const percent1 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxPercent.sub(2)
  });
  const percent2 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxPercent.sub(percent1).sub(1)
  });
  const percent3 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxPercent.sub(percent1).sub(percent2)
  });

  // There are three types of mods.
  // Address mods route payout directly to an address.
  const addressMod = {
    preferUnstaked: randomBoolFn(),
    percent: percent1.toNumber(),
    lockedUntil: 0,
    // Make sure the beneficiary isnt the owner or the payer.
    beneficiary: randomAddressFn({ exclude: [owner.address, payer.address] }),
    allocator: constants.AddressZero,
    projectId: BigNumber.from(0)
  };
  // Project mods route payout directly to another project on Juicer.
  const projectMod = {
    preferUnstaked: randomBoolFn(),
    percent: percent2.toNumber(),
    lockedUntil: 0,
    beneficiary: randomAddressFn(),
    allocator: constants.AddressZero,
    projectId: BigNumber.from(expectedIdOfModProject)
  };
  // Allocator mods route payments directly to the specified contract that inherits from IModAllocator.
  const allocatorMod = {
    preferUnstaked: randomBoolFn(),
    percent: percent3.toNumber(),
    lockedUntil: 0,
    beneficiary: randomAddressFn(),
    allocator: (await deployContractFn("ExampleModAllocator")).address,
    projectId: BigNumber.from(0)
  };

  // The currency will be 0, which corresponds to ETH.
  const currency = 0;

  // Two payments will be made.
  // Cant pay entire balance because some is needed for gas.
  const paymentValue1 = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(3)
  });

  // The target must be at least the amount to tap, and at most the payment value.
  const target = randomBigNumberFn({
    min: BigNumber.from(1),
    max: paymentValue1
  });

  // An amount up to the amount paid can be tapped.
  const amountToTap = target;

  // The second amount should cause overflow.
  const paymentValue2 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: target
  });

  // The amount tapped takes into account any fees paid.
  const expectedAmountTapped = amountToTap
    .mul(constants.MaxPercent)
    .div((await contracts.juicer.fee()).add(constants.MaxPercent));

  const duration = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxUint16
  });

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
            duration,
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
            duration: randomBigNumberFn({
              min: duration.div(2),
              max: constants.MaxUint16
            }),
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
        value: paymentValue1
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
        Check that beneficiary of the mod got tickets.
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
          .sub(
            expectedAmountTapped
              .mul(addressMod.percent)
              .div(constants.MaxPercent)
          )
          .sub(
            expectedAmountTapped
              .mul(projectMod.percent)
              .div(constants.MaxPercent)
          )
          .sub(
            expectedAmountTapped
              .mul(allocatorMod.percent)
              .div(constants.MaxPercent)
          )
      }),
    /**
        Make another payment to the project to make sure it's got overflow.
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
        value: paymentValue2
      }),
    /**
        Shouldn't be able to tap excessive funds during the current funding cycle.
      */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "tap",
        args: [expectedIdOfBaseProject, paymentValue2, currency, paymentValue2],
        revert: "FundingCycles::tap: INSUFFICIENT_FUNDS"
      }),
    /**
      Fast forward to the next funding cycle.
    */
    () => fastforwardFn(duration.mul(86400)),
    /**
        Tap the full target.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "tap",
        args: [expectedIdOfBaseProject, paymentValue2, currency, paymentValue2]
      })
  ];
};
