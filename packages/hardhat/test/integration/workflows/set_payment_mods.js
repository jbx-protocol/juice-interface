/** 
  Project's can set payment mods, which allow payouts to automatically be
  sent to either an address, another project on Juice, or a contract that inherits from IModAllocator.

  A payout mod can be locked until a specified timestamp, which prevents it from being removed while
  the current funding cycle configuration is active. 

  If a project reconfigures its funding cycle, new mods can be set that override any locked payout mods.
  These new mods will take effect once the reconfigured funding cycle becomes active.
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
  getTimestampFn,
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

  // Payment mods can be locked.
  // Make a locked mods.
  const lockedAddressMod = {
    preferUnstaked: randomBoolFn(),
    percent: normalizedPercentFn(50).toNumber(),
    // Lock at least until the end of the tests.
    lockedUntil: (await getTimestampFn())
      .add(
        randomBigNumberFn({
          min: BigNumber.from(1000),
          max: BigNumber.from(100000000)
        })
      )
      .toNumber(),
    beneficiary: randomAddressFn(),
    allocator: constants.AddressZero,
    projectId: BigNumber.from(0)
  };
  // Make two unlocked mods.
  const unlockedProjectMod = {
    preferUnstaked: randomBoolFn(),
    percent: normalizedPercentFn(25).toNumber(),
    lockedUntil: 0,
    beneficiary: randomAddressFn(),
    allocator: constants.AddressZero,
    projectId: BigNumber.from(expectedIdOfModProject)
  };
  const unlockedAllocatorMod = {
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

  return [
    /** 
      Deploy first project with at least a locked payment mod.
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
            duration: randomBigNumberFn({
              min: BigNumber.from(1),
              max: constants.MaxUint16
            }),
            cycleLimit: randomBigNumberFn({
              max: constants.MaxCycleLimit
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
          [lockedAddressMod, unlockedProjectMod],
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
            lockedAddressMod.preferUnstaked,
            lockedAddressMod.percent,
            lockedAddressMod.lockedUntil,
            lockedAddressMod.beneficiary,
            lockedAddressMod.allocator,
            lockedAddressMod.projectId
          ],
          [
            unlockedProjectMod.preferUnstaked,
            unlockedProjectMod.percent,
            unlockedProjectMod.lockedUntil,
            unlockedProjectMod.beneficiary,
            unlockedProjectMod.allocator,
            unlockedProjectMod.projectId
          ]
        ]
      }),
    /** 
      Overriding a locked mod shouldn't work when setting payment mods.
    */
    ({ timeMark }) =>
      executeFn({
        caller: owner,
        contract: contracts.modStore,
        fn: "setPaymentMods",
        args: [
          expectedIdOfBaseProject,
          timeMark,
          [unlockedProjectMod, unlockedAllocatorMod]
        ],
        revert: "ModStore::setPaymentMods: SOME_LOCKED"
      }),
    /**
      Overriding a locked mod with a shorter locked date shouldn't work when setting payment mods.
    */
    ({ timeMark }) =>
      executeFn({
        caller: owner,
        contract: contracts.modStore,
        fn: "setPaymentMods",
        args: [
          expectedIdOfBaseProject,
          timeMark,
          [
            {
              ...lockedAddressMod,
              lockedUntil: lockedAddressMod.lockedUntil - 1
            },
            unlockedProjectMod,
            unlockedAllocatorMod
          ]
        ],
        revert: "ModStore::setPaymentMods: SOME_LOCKED"
      }),
    /**
      Set new payment mods, making sure to include any locked mods.

      Locked mods can have their locked date extended.
    */
    ({ timeMark }) =>
      executeFn({
        caller: owner,
        contract: contracts.modStore,
        fn: "setPaymentMods",
        args: [
          expectedIdOfBaseProject,
          timeMark,
          [
            {
              ...lockedAddressMod,
              lockedUntil: lockedAddressMod.lockedUntil + 1
            },
            unlockedAllocatorMod
          ]
        ]
      }),
    /**
        Check that the new payment mods got set correctly.
      */
    ({ timeMark }) =>
      checkFn({
        contract: contracts.modStore,
        fn: "paymentModsOf",
        // Subtract 1 from timeMark to get the time of the configuration execution.
        args: [expectedIdOfBaseProject, timeMark.sub(1)],
        expect: [
          [
            lockedAddressMod.preferUnstaked,
            lockedAddressMod.percent,
            lockedAddressMod.lockedUntil + 1,
            lockedAddressMod.beneficiary,
            lockedAddressMod.allocator,
            lockedAddressMod.projectId
          ],
          [
            unlockedAllocatorMod.preferUnstaked,
            unlockedAllocatorMod.percent,
            unlockedAllocatorMod.lockedUntil,
            unlockedAllocatorMod.beneficiary,
            unlockedAllocatorMod.allocator,
            unlockedAllocatorMod.projectId
          ]
        ]
      }),
    /**
      Configuring a project should allow overriding locked mods for the new configuration.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "configure",
        args: [
          expectedIdOfBaseProject,
          {
            target,
            currency,
            duration: randomBigNumberFn({
              min: BigNumber.from(1),
              max: constants.MaxUint16
            }),
            cycleLimit: randomBigNumberFn({
              max: constants.MaxCycleLimit
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
          [unlockedProjectMod],
          []
        ]
      }),
    /**
        Check that the old configuration still has its mods.
      */
    ({ timeMark }) =>
      checkFn({
        contract: contracts.modStore,
        fn: "paymentModsOf",
        // Subtract 2 from timeMark to get the time of the configuration execution.
        args: [expectedIdOfBaseProject, timeMark.sub(2)],
        expect: [
          [
            lockedAddressMod.preferUnstaked,
            lockedAddressMod.percent,
            lockedAddressMod.lockedUntil + 1,
            lockedAddressMod.beneficiary,
            lockedAddressMod.allocator,
            lockedAddressMod.projectId
          ],
          [
            unlockedAllocatorMod.preferUnstaked,
            unlockedAllocatorMod.percent,
            unlockedAllocatorMod.lockedUntil,
            unlockedAllocatorMod.beneficiary,
            unlockedAllocatorMod.allocator,
            unlockedAllocatorMod.projectId
          ]
        ]
      }),
    /**
        Check that the new configuration has its mods.
      */
    ({ timeMark }) =>
      checkFn({
        contract: contracts.modStore,
        fn: "paymentModsOf",
        args: [expectedIdOfBaseProject, timeMark],
        expect: [
          [
            unlockedProjectMod.preferUnstaked,
            unlockedProjectMod.percent,
            unlockedProjectMod.lockedUntil,
            unlockedProjectMod.beneficiary,
            unlockedProjectMod.allocator,
            unlockedProjectMod.projectId
          ]
        ]
      })
  ];
};
