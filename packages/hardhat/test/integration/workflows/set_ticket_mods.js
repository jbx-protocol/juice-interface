/** 
  Project's can set ticket mods, which allow reserved tickets to be automatically sent to an address.

  A ticket mod can be locked until a specified timestamp, which prevents it from being removed while
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

  // Ticket mods can be locked.
  // Make a locked mods.
  const lockedMod = {
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
    beneficiary: randomAddressFn()
  };
  // Make two unlocked mods.
  const unlockedMod1 = {
    preferUnstaked: randomBoolFn(),
    percent: normalizedPercentFn(25).toNumber(),
    lockedUntil: 0,
    beneficiary: randomAddressFn()
  };
  const unlockedMod2 = {
    preferUnstaked: randomBoolFn(),
    percent: normalizedPercentFn(20).toNumber(),
    lockedUntil: 0,
    beneficiary: randomAddressFn()
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
      Deploy first project with at least a locked ticket mod.
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
              max: constants.MaxUint8
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
          [lockedMod, unlockedMod1]
        ]
      }),
    /**
        Check that the ticket mods got set.
      */
    ({ timeMark }) =>
      checkFn({
        contract: contracts.modStore,
        fn: "ticketModsOf",
        args: [expectedIdOfBaseProject, timeMark],
        expect: [
          [
            lockedMod.preferUnstaked,
            lockedMod.percent,
            lockedMod.lockedUntil,
            lockedMod.beneficiary
          ],
          [
            unlockedMod1.preferUnstaked,
            unlockedMod1.percent,
            unlockedMod1.lockedUntil,
            unlockedMod1.beneficiary
          ]
        ]
      }),
    /**
      Overriding a locked mod shouldn't work when setting ticket mods.
    */
    ({ timeMark }) =>
      executeFn({
        caller: owner,
        contract: contracts.modStore,
        fn: "setTicketMods",
        args: [expectedIdOfBaseProject, timeMark, [unlockedMod1, unlockedMod2]],
        revert: "ModStore::setTicketMods: SOME_LOCKED"
      }),
    /**
      Overriding a locked mod with a shorter locked date shouldn't work when setting ticket mods.
    */
    ({ timeMark }) =>
      executeFn({
        caller: owner,
        contract: contracts.modStore,
        fn: "setTicketMods",
        args: [
          expectedIdOfBaseProject,
          timeMark,
          [
            {
              ...lockedMod,
              lockedUntil: lockedMod.lockedUntil - 1
            },
            unlockedMod1,
            unlockedMod2
          ]
        ],
        revert: "ModStore::setTicketMods: SOME_LOCKED"
      }),
    /**
      Set new ticket mods, making sure to include any locked mods.

      Locked mods can have their locked date extended.
    */
    ({ timeMark }) =>
      executeFn({
        caller: owner,
        contract: contracts.modStore,
        fn: "setTicketMods",
        args: [
          expectedIdOfBaseProject,
          timeMark,
          [
            {
              ...lockedMod,
              lockedUntil: lockedMod.lockedUntil + 1
            },
            unlockedMod2
          ]
        ]
      }),
    /**
        Check that the new payment mods got set correctly.
      */
    ({ timeMark }) =>
      checkFn({
        contract: contracts.modStore,
        fn: "ticketModsOf",
        // Subtract 1 from timeMark to get the time of the configuration execution.
        args: [expectedIdOfBaseProject, timeMark.sub(1)],
        expect: [
          [
            lockedMod.preferUnstaked,
            lockedMod.percent,
            lockedMod.lockedUntil + 1,
            lockedMod.beneficiary
          ],
          [
            unlockedMod2.preferUnstaked,
            unlockedMod2.percent,
            unlockedMod2.lockedUntil,
            unlockedMod2.beneficiary
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
              max: constants.MaxUint8
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
          [unlockedMod1]
        ]
      }),
    /**
        Check that the old configuration still has its mods.
      */
    ({ timeMark }) =>
      checkFn({
        contract: contracts.modStore,
        fn: "ticketModsOf",
        // Subtract 2 from timeMark to get the time of the configuration execution.
        args: [expectedIdOfBaseProject, timeMark.sub(2)],
        expect: [
          [
            lockedMod.preferUnstaked,
            lockedMod.percent,
            lockedMod.lockedUntil + 1,
            lockedMod.beneficiary
          ],
          [
            unlockedMod2.preferUnstaked,
            unlockedMod2.percent,
            unlockedMod2.lockedUntil,
            unlockedMod2.beneficiary
          ]
        ]
      }),
    /**
        Check that the new configuration has its mods.
      */
    ({ timeMark }) =>
      checkFn({
        contract: contracts.modStore,
        fn: "ticketModsOf",
        args: [expectedIdOfBaseProject, timeMark],
        expect: [
          [
            unlockedMod1.preferUnstaked,
            unlockedMod1.percent,
            unlockedMod1.lockedUntil,
            unlockedMod1.beneficiary
          ]
        ]
      })
  ];
};
