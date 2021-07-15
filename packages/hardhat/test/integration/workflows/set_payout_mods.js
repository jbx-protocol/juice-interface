/** 
  Project's can set payout mods, which allow payouts to automatically be
  sent to either an address, another project on Juicebox, or a contract that inherits from IModAllocator.

  A payout mod can be locked until a specified timestamp, which prevents it from being removed while
  the current funding cycle configuration is active. 

  If a project reconfigures its funding cycle, new mods can be set that override any locked payout mods.
  These new mods will take effect once the reconfigured funding cycle becomes active.
*/

module.exports = [
  {
    description: "Deploy first project with at least a locked payout mod",
    fn: async ({
      constants,
      contracts,
      executeFn,
      BigNumber,
      randomSignerFn,
      randomBigNumberFn,
      randomBytesFn,
      getTimestampFn,
      randomBoolFn,
      randomStringFn,
      randomAddressFn,
      incrementFundingCycleIdFn,
      incrementProjectIdFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();

      // Burn the unused funding cycle ID id.
      incrementFundingCycleIdFn();

      // The owner of the project with mods.
      const owner = randomSignerFn();

      // Payment mods can be locked.
      // Make a locked mods.
      const lockedMod1 = {
        preferUnstaked: randomBoolFn(),
        // Arbitrary percent that adds up to <= 100% across all mods.
        percent: randomBigNumberFn({
          min: BigNumber.from(1),
          max: constants.MaxModPercent.div(2)
        }).toNumber(),
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
      const unlockedMod1 = {
        preferUnstaked: randomBoolFn(),
        // Arbitrary percent that adds up to <= 100% across all mods.
        percent: randomBigNumberFn({
          min: BigNumber.from(1),
          max: constants.MaxModPercent.div(4)
        }).toNumber(),
        lockedUntil: 0,
        beneficiary: randomAddressFn(),
        allocator: constants.AddressZero,
        projectId: BigNumber.from(0)
      };

      await executeFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "deploy",
        args: [
          owner.address,
          randomBytesFn({
            // Make sure its unique by prepending the id.
            prepend: expectedProjectId.toString()
          }),
          randomStringFn(),
          {
            target: randomBigNumberFn(),
            currency: randomBigNumberFn({ max: constants.MaxUint8 }),
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
            bondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            }),
            reconfigurationBondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            })
          },
          [lockedMod1, unlockedMod1],
          []
        ]
      });

      return {
        owner,
        expectedProjectId,
        lockedMod1,
        unlockedMod1
      };
    }
  },
  {
    description: "Check that the payout mod got set",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      timeMark,
      local: { expectedProjectId, lockedMod1, unlockedMod1 }
    }) => {
      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.modStore,
        fn: "payoutModsOf",
        args: [expectedProjectId, timeMark],
        expect: [
          [
            lockedMod1.preferUnstaked,
            lockedMod1.percent,
            lockedMod1.lockedUntil,
            lockedMod1.beneficiary,
            lockedMod1.allocator,
            lockedMod1.projectId
          ],
          [
            unlockedMod1.preferUnstaked,
            unlockedMod1.percent,
            unlockedMod1.lockedUntil,
            unlockedMod1.beneficiary,
            unlockedMod1.allocator,
            unlockedMod1.projectId
          ]
        ]
      });
      return { configurationTimeMark: timeMark };
    }
  },
  {
    description:
      "Overriding a locked mod shouldn't work when setting payout mods",
    fn: async ({
      contracts,
      executeFn,
      BigNumber,
      deployContractFn,
      randomBoolFn,
      randomAddressFn,
      timeMark,
      constants,
      randomBigNumberFn,
      local: { owner, expectedProjectId, unlockedMod1 }
    }) => {
      const unlockedMod2 = {
        preferUnstaked: randomBoolFn(),
        // Arbitrary percent that adds up to <= 100% across all mods.
        percent: randomBigNumberFn({
          min: BigNumber.from(1),
          max: constants.MaxModPercent.div(5)
        }).toNumber(),
        lockedUntil: 0,
        beneficiary: randomAddressFn(),
        allocator: (await deployContractFn("ExampleModAllocator")).address,
        projectId: BigNumber.from(0)
      };
      await executeFn({
        caller: owner,
        contract: contracts.modStore,
        fn: "setPayoutMods",
        args: [expectedProjectId, timeMark, [unlockedMod1, unlockedMod2]],
        revert: "ModStore::setPayoutMods: SOME_LOCKED"
      });

      return { unlockedMod2 };
    }
  },
  {
    description:
      "Overriding a locked mod with a shorter locked date shouldn't work when setting payout mods",
    fn: ({
      contracts,
      executeFn,
      timeMark,
      local: {
        owner,
        expectedProjectId,
        lockedMod1,
        unlockedMod1,
        unlockedMod2
      }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.modStore,
        fn: "setPayoutMods",
        args: [
          expectedProjectId,
          timeMark,
          [
            {
              ...lockedMod1,
              lockedUntil: lockedMod1.lockedUntil - 1
            },
            unlockedMod1,
            unlockedMod2
          ]
        ],
        revert: "ModStore::setPayoutMods: SOME_LOCKED"
      })
  },
  {
    description: "Set new payout mods, making sure to include any locked mods",
    fn: ({
      contracts,
      executeFn,
      timeMark,
      local: { owner, expectedProjectId, unlockedMod2, lockedMod1 }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.modStore,
        fn: "setPayoutMods",
        args: [
          expectedProjectId,
          timeMark,
          [
            {
              ...lockedMod1,
              lockedUntil: lockedMod1.lockedUntil + 1
            },
            unlockedMod2
          ]
        ]
      })
  },
  {
    description: "Check that the new payout mods got set correctly",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        lockedMod1,
        unlockedMod2,
        configurationTimeMark
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.modStore,
        fn: "payoutModsOf",
        // Subtract 1 from timeMark to get the time of the configuration execution.
        args: [expectedProjectId, configurationTimeMark],
        expect: [
          [
            lockedMod1.preferUnstaked,
            lockedMod1.percent,
            lockedMod1.lockedUntil + 1,
            lockedMod1.beneficiary,
            lockedMod1.allocator,
            lockedMod1.projectId
          ],
          [
            unlockedMod2.preferUnstaked,
            unlockedMod2.percent,
            unlockedMod2.lockedUntil,
            unlockedMod2.beneficiary,
            unlockedMod2.allocator,
            unlockedMod2.projectId
          ]
        ]
      })
  },
  {
    description:
      "Configuring a project should allow overriding locked mods for the new configuration",
    fn: ({
      constants,
      contracts,
      executeFn,
      BigNumber,
      randomBigNumberFn,
      local: { owner, expectedProjectId, unlockedMod1 }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            target: randomBigNumberFn(),
            currency: randomBigNumberFn({ max: constants.MaxUint8 }),
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
            bondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            }),
            reconfigurationBondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            })
          },
          [unlockedMod1],
          []
        ]
      })
  },
  {
    description: "Check that the new configuration has its mods",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      timeMark,
      local: { expectedProjectId, unlockedMod1 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.modStore,
        fn: "payoutModsOf",
        args: [expectedProjectId, timeMark],
        expect: [
          [
            unlockedMod1.preferUnstaked,
            unlockedMod1.percent,
            unlockedMod1.lockedUntil,
            unlockedMod1.beneficiary,
            unlockedMod1.allocator,
            unlockedMod1.projectId
          ]
        ]
      })
  },
  {
    description: "Check that the old configuration still has its mods",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        lockedMod1,
        unlockedMod2,
        configurationTimeMark
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.modStore,
        fn: "payoutModsOf",
        // Subtract 2 from timeMark to get the time of the configuration execution.
        args: [expectedProjectId, configurationTimeMark],
        expect: [
          [
            lockedMod1.preferUnstaked,
            lockedMod1.percent,
            lockedMod1.lockedUntil + 1,
            lockedMod1.beneficiary,
            lockedMod1.allocator,
            lockedMod1.projectId
          ],
          [
            unlockedMod2.preferUnstaked,
            unlockedMod2.percent,
            unlockedMod2.lockedUntil,
            unlockedMod2.beneficiary,
            unlockedMod2.allocator,
            unlockedMod2.projectId
          ]
        ]
      })
  }
];
