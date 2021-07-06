/** 
  Governance can set a new fee for future configurations in the Juicer.

  All current configurations will not be affected, and will keep the old fee until a new configuration is approved.
*/
module.exports = [
  {
    description: "Deploy a project",
    fn: async ({
      constants,
      contracts,
      executeFn,
      randomBigNumberFn,
      BigNumber,
      randomBytesFn,
      randomStringFn,
      randomSignerFn,
      incrementFundingCycleIdFn,
      incrementProjectIdFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();
      const expectedFundingCycleId1 = incrementFundingCycleIdFn();

      // It should be the project's first budget.
      const expectedFundingCycleNumber1 = BigNumber.from(1);

      // The owner of the project that will reconfigure.
      const owner = randomSignerFn();

      const target = randomBigNumberFn();

      const currency = randomBigNumberFn({ max: constants.MaxUint8 });
      const duration = randomBigNumberFn({
        min: BigNumber.from(1),
        max: BigNumber.from(10000)
      });
      const cycleLimit = randomBigNumberFn({
        max: constants.MaxCycleLimit
      });

      // dont use non recurring.
      const discountRate = randomBigNumberFn({
        min: BigNumber.from(1),
        max: constants.MaxPercent
      });
      const ballot = constants.AddressZero;

      // Set the reserved rate to 0 to make test cases cleaner.
      const reservedRate = BigNumber.from(0);

      const bondingCurveRate = randomBigNumberFn({
        max: constants.MaxPercent
      });
      const reconfigurationBondingCurveRate = randomBigNumberFn({
        max: constants.MaxPercent
      });

      await executeFn({
        caller: randomSignerFn(),
        contract: contracts.juicer,
        fn: "deploy",
        args: [
          owner.address,
          randomBytesFn({
            // Make sure its unique by prepending the id.
            prepend: expectedProjectId.toString()
          }),
          randomStringFn(),
          {
            target,
            currency,
            duration,
            cycleLimit,
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
      });
      return {
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleNumber1,
        owner,
        reconfigurationBondingCurveRate,
        bondingCurveRate,
        reservedRate,
        cycleLimit,
        ballot,
        duration,
        target,
        currency,
        discountRate
      };
    }
  },
  {
    description: "Make sure the funding cycle got saved correctly",
    fn: async ({
      contracts,
      checkFn,
      BigNumber,
      timeMark,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleNumber1,
        reconfigurationBondingCurveRate,
        bondingCurveRate,
        reservedRate,
        cycleLimit,
        ballot,
        duration,
        target,
        currency,
        discountRate
      }
    }) => {
      // Pack the metadata as expected.
      let expectedPackedMetadata = BigNumber.from(0);
      expectedPackedMetadata = expectedPackedMetadata.add(
        reconfigurationBondingCurveRate
      );
      expectedPackedMetadata = expectedPackedMetadata.shl(8);
      expectedPackedMetadata = expectedPackedMetadata.add(bondingCurveRate);
      expectedPackedMetadata = expectedPackedMetadata.shl(8);
      expectedPackedMetadata = expectedPackedMetadata.add(reservedRate);
      expectedPackedMetadata = expectedPackedMetadata.shl(8);

      // Expect the funding cycle to be based on the 0th funding cycle.
      const expectedBasedOn = BigNumber.from(0);

      // Expect the funding cycle's weight to be the base weight.
      const expectedInitialWeight = await contracts.fundingCycles.BASE_WEIGHT();

      // Expect the funding cycle's fee to be the juicer's fee.
      const expectedFee = await contracts.juicer.fee();

      // Expect nothing to have been tapped yet from the funding cycle.
      const expectedTapped = BigNumber.from(0);

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "get",
        args: [expectedFundingCycleId1],
        expect: [
          expectedFundingCycleId1,
          expectedProjectId,
          expectedFundingCycleNumber1,
          expectedBasedOn,
          timeMark,
          cycleLimit,
          expectedInitialWeight,
          ballot,
          timeMark,
          duration,
          target,
          currency,
          expectedFee,
          discountRate,
          expectedTapped,
          expectedPackedMetadata
        ]
      });
      return {
        originalTimeMark: timeMark,
        expectedPackedMetadata,
        expectedInitialWeight,
        expectedFee,
        expectedTapped
      };
    }
  },
  {
    description: "Set a new fee",
    fn: async ({
      randomBigNumberFn,
      constants,
      executeFn,
      deployer,
      contracts
    }) => {
      const newFee = randomBigNumberFn({ max: constants.MaxPercent });
      await executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "setFee",
        args: [contracts.juicer.address, newFee]
      });
      return { newFee };
    }
  },
  {
    description:
      "Fast forward to the next funding cycle that uses the same configuration",
    fn: ({
      randomBigNumberFn,
      fastforwardFn,
      BigNumber,
      local: { duration }
    }) =>
      fastforwardFn(
        // An arbitrary day after the duration is within the next cycle.
        duration.mul(86400).add(
          randomBigNumberFn({
            min: BigNumber.from(5),
            max: BigNumber.from(86390)
          })
        )
      )
  },
  {
    description: "The funding cycle should still have the original fee",
    fn: async ({
      constants,
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleNumber1,
        originalTimeMark,
        cycleLimit,
        ballot,
        discountRate,
        duration,
        target,
        currency,
        expectedPackedMetadata,
        expectedInitialWeight,
        expectedFee,
        expectedTapped
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "getCurrentOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber1.add(1),
          expectedFundingCycleId1,
          originalTimeMark,
          cycleLimit.eq(0) ? BigNumber.from(0) : cycleLimit.sub(1),
          expectedInitialWeight.mul(discountRate).div(constants.MaxPercent),
          ballot,
          originalTimeMark.add(duration.mul(86400)),
          duration,
          target,
          currency,
          expectedFee,
          discountRate,
          expectedTapped,
          expectedPackedMetadata
        ]
      })
  },
  {
    description: "Make a payment to lock in the first configuration",
    fn: async ({
      contracts,
      executeFn,
      randomBigNumberFn,
      getBalanceFn,
      randomStringFn,
      randomAddressFn,
      randomBoolFn,
      randomSignerFn,
      BigNumber,
      local: { expectedProjectId }
    }) => {
      // An account that will be used to make payments.
      const payer = randomSignerFn();

      // One payment will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue = randomBigNumberFn({
        // The min should be some decently meaningful number.
        // Otherwise its possible that the weight amount of the payment is 0, which means no tickets will be printed,
        // which means the configuration in this test will configure the active cycle and not expect it.
        min: BigNumber.from(100),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      await executeFn({
        caller: payer,
        contract: contracts.juicer,
        fn: "pay",
        args: [
          expectedProjectId,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue
      });
    }
  },
  {
    description:
      "Reconfiguring a project after a new fee has been set should affect future funding cycles",
    fn: async ({
      contracts,
      executeFn,
      incrementFundingCycleIdFn,
      local: {
        expectedProjectId,
        owner,
        target,
        currency,
        duration,
        cycleLimit,
        discountRate,
        ballot,
        reservedRate,
        bondingCurveRate,
        reconfigurationBondingCurveRate
      }
    }) => {
      const expectedFundingCycleId2 = incrementFundingCycleIdFn();
      await executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            target,
            currency,
            duration,
            cycleLimit,
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
      });
      return { expectedFundingCycleId2 };
    }
  },
  {
    description: "The queued funding cycle should use the new fee",
    fn: async ({
      constants,
      contracts,
      checkFn,
      timeMark,
      randomSignerFn,
      local: {
        expectedFundingCycleId1,
        expectedFundingCycleNumber1,
        originalTimeMark,
        newFee,
        target,
        cycleLimit,
        ballot,
        discountRate,
        duration,
        currency,
        expectedPackedMetadata,
        expectedFundingCycleId2,
        expectedProjectId,
        expectedInitialWeight,
        expectedTapped
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "getQueuedOf",
        args: [expectedProjectId],
        expect: [
          expectedFundingCycleId2,
          expectedProjectId,
          expectedFundingCycleNumber1.add(2),
          expectedFundingCycleId1,
          timeMark,
          cycleLimit,
          expectedInitialWeight
            .mul(discountRate)
            .mul(discountRate)
            .div(constants.MaxPercent)
            .div(constants.MaxPercent),
          ballot,
          originalTimeMark.add(duration.mul(86400).mul(2)),
          duration,
          target,
          currency,
          newFee,
          discountRate,
          expectedTapped,
          expectedPackedMetadata
        ]
      })
  },
  {
    description: "The current shouldn't be affected",
    fn: async ({
      constants,
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleNumber1,
        originalTimeMark,
        cycleLimit,
        ballot,
        discountRate,
        duration,
        target,
        currency,
        expectedPackedMetadata,
        expectedInitialWeight,
        expectedFee,
        expectedTapped
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "getCurrentOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber1.add(1),
          expectedFundingCycleId1,
          originalTimeMark,
          cycleLimit.eq(0) ? BigNumber.from(0) : cycleLimit.sub(1),
          expectedInitialWeight.mul(discountRate).div(constants.MaxPercent),
          ballot,
          originalTimeMark.add(duration.mul(86400)),
          duration,
          target,
          currency,
          expectedFee,
          discountRate,
          expectedTapped,
          expectedPackedMetadata
        ]
      })
  }
];
