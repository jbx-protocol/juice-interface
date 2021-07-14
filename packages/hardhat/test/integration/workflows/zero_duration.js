/** 
  A funding cycle configuration can have a duration of 0. This makes the cycle last forever, and allows it to be reconfigurable at any time.
*/

// The currency will be 0, which corresponds to ETH, preventing the need for currency price conversion.
const currency = 0;

// Expect the first funding cycle to be based on the 0th funding cycle.
const expectedInitialBasedOn = 0;

module.exports = [
  {
    description: "Deploy a project with 0 duration",
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
      const expectedFundingCycleId1 = incrementFundingCycleIdFn();
      const expectedProjectId = incrementProjectIdFn();

      // It should be the project's first budget.
      const expectedFundingCycleNumber1 = BigNumber.from(1);

      // The owner of the project that will reconfigure.
      const owner = randomSignerFn();

      // At the end of the tests, this amount will be attempted to be tapped.
      const amountToTap = BigNumber.from(1);

      // Make sure the target is arbitrarily larger than the amount that will be tapped, included fees that will be incurred.
      const target1 = randomBigNumberFn({ min: amountToTap.mul(2) });

      const duration1 = BigNumber.from(0);

      const cycleLimit1 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: constants.MaxCycleLimit
      });

      // dont allow non recurring.
      const discountRate1 = randomBigNumberFn({
        max: constants.MaxPercent
      });
      const ballot1 = constants.AddressZero;

      const reservedRate1 = randomBigNumberFn({ max: constants.MaxPercent });
      const bondingCurveRate1 = randomBigNumberFn({
        max: constants.MaxPercent
      });
      const reconfigurationBondingCurveRate1 = randomBigNumberFn({
        max: constants.MaxPercent
      });
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
            target: target1,
            currency,
            duration: duration1,
            cycleLimit: cycleLimit1,
            discountRate: discountRate1,
            ballot: ballot1
          },
          {
            reservedRate: reservedRate1,
            bondingCurveRate: bondingCurveRate1,
            reconfigurationBondingCurveRate: reconfigurationBondingCurveRate1
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
        target1,
        cycleLimit1,
        ballot1,
        duration1,
        discountRate1,
        reconfigurationBondingCurveRate1,
        bondingCurveRate1,
        reservedRate1,
        amountToTap
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
        target1,
        cycleLimit1,
        ballot1,
        duration1,
        discountRate1,
        reconfigurationBondingCurveRate1,
        bondingCurveRate1,
        reservedRate1
      }
    }) => {
      // Pack the metadata as expected.
      let expectedPackedMetadata1 = BigNumber.from(0);
      expectedPackedMetadata1 = expectedPackedMetadata1.add(
        reconfigurationBondingCurveRate1
      );
      expectedPackedMetadata1 = expectedPackedMetadata1.shl(8);
      expectedPackedMetadata1 = expectedPackedMetadata1.add(bondingCurveRate1);
      expectedPackedMetadata1 = expectedPackedMetadata1.shl(8);
      expectedPackedMetadata1 = expectedPackedMetadata1.add(reservedRate1);
      expectedPackedMetadata1 = expectedPackedMetadata1.shl(8);

      // Expect the funding cycle's weight to be the base weight.
      const expectedInitialWeight = await contracts.fundingCycles.BASE_WEIGHT();

      // Expect the funding cycle's fee to be the terminalV1's fee.
      const expectedFee = await contracts.terminalV1.fee();

      // Expect nothing to have been tapped yet from the funding cycle.
      const expectedInitialTapped = BigNumber.from(0);

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "get",
        args: [expectedFundingCycleId1],
        expect: [
          expectedFundingCycleId1,
          expectedProjectId,
          expectedFundingCycleNumber1,
          BigNumber.from(expectedInitialBasedOn),
          timeMark,
          // Cycle limit should be 0 for the first funding cycle.
          cycleLimit1,
          expectedInitialWeight,
          ballot1,
          timeMark,
          duration1,
          target1,
          BigNumber.from(currency),
          expectedFee,
          discountRate1,
          expectedInitialTapped,
          expectedPackedMetadata1
        ]
      });
      return {
        originalTimeMark: timeMark,
        expectedPackedMetadata1,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped
      };
    }
  },
  {
    description: "The funding cycle should be current",
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
        target1,
        cycleLimit1,
        ballot1,
        duration1,
        discountRate1,
        expectedPackedMetadata1,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "currentOf",
        args: [expectedProjectId],
        expect: [
          expectedFundingCycleId1,
          expectedProjectId,
          expectedFundingCycleNumber1,
          BigNumber.from(expectedInitialBasedOn),
          timeMark,
          // Cycle limit should be 0 for the first funding cycle.
          cycleLimit1,
          expectedInitialWeight,
          ballot1,
          timeMark,
          duration1,
          target1,
          BigNumber.from(currency),
          expectedFee,
          discountRate1,
          expectedInitialTapped,
          expectedPackedMetadata1
        ]
      })
  },
  {
    description: "There should be no queued cycle",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      BigNumber,
      constants,
      local: { expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "queuedOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          constants.AddressZero,
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0)
        ]
      })
  },
  {
    description: "Make a payment to the project to lock it in",
    fn: async ({
      contracts,
      executeFn,
      randomBigNumberFn,
      BigNumber,
      getBalanceFn,
      randomStringFn,
      randomAddressFn,
      randomBoolFn,
      randomSignerFn,
      local: { expectedProjectId }
    }) => {
      // An account that will be used to make payments.
      const payer = randomSignerFn();

      // One payment will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      await executeFn({
        caller: payer,
        contract: contracts.terminalV1,
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
    description: "Fastforward an arbitrary amount",
    fn: async ({ fastforwardFn, randomBigNumberFn, BigNumber }) =>
      fastforwardFn(
        randomBigNumberFn({
          min: BigNumber.from(1),
          max: BigNumber.from(9999999999)
        })
      )
  },
  {
    description: "The funding cycle should be still current",
    fn: async ({
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleNumber1,
        target1,
        cycleLimit1,
        ballot1,
        duration1,
        discountRate1,
        expectedPackedMetadata1,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped,
        originalTimeMark
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "currentOf",
        args: [expectedProjectId],
        expect: [
          expectedFundingCycleId1,
          expectedProjectId,
          expectedFundingCycleNumber1,
          BigNumber.from(expectedInitialBasedOn),
          originalTimeMark,
          // Cycle limit should be 0 for the first funding cycle.
          cycleLimit1,
          expectedInitialWeight,
          ballot1,
          originalTimeMark,
          duration1,
          target1,
          BigNumber.from(currency),
          expectedFee,
          discountRate1,
          expectedInitialTapped,
          expectedPackedMetadata1
        ]
      })
  },
  {
    description: "There should still be no queued cycle",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      BigNumber,
      constants,
      local: { expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "queuedOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          constants.AddressZero,
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0)
        ]
      })
  },
  {
    description: "Reconfigure the project",
    fn: async ({
      constants,
      contracts,
      executeFn,
      randomBigNumberFn,
      BigNumber,
      incrementFundingCycleIdFn,
      local: { owner, expectedProjectId }
    }) => {
      const expectedFundingCycleId2 = incrementFundingCycleIdFn();

      const target2 = randomBigNumberFn();

      const currency2 = randomBigNumberFn({ max: constants.MaxUint8 });
      const duration2 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: constants.MaxUint16
      });
      const cycleLimit2 = randomBigNumberFn({
        min: BigNumber.from(0),
        max: constants.MaxCycleLimit
      });

      // Non recurring.
      const discountRate2 = randomBigNumberFn({
        max: constants.MaxPercent
      });
      const ballot2 = constants.AddressZero;

      const reservedRate2 = randomBigNumberFn({ max: constants.MaxPercent });
      const bondingCurveRate2 = randomBigNumberFn({
        max: constants.MaxPercent
      });
      const reconfigurationBondingCurveRate2 = randomBigNumberFn({
        max: constants.MaxPercent
      });

      await executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            target: target2,
            currency: currency2,
            duration: duration2,
            cycleLimit: cycleLimit2,
            discountRate: discountRate2,
            ballot: ballot2
          },
          {
            reservedRate: reservedRate2,
            bondingCurveRate: bondingCurveRate2,
            reconfigurationBondingCurveRate: reconfigurationBondingCurveRate2
          },
          [],
          []
        ]
      });
      return {
        expectedFundingCycleId2,
        cycleLimit2,
        ballot2,
        duration2,
        target2,
        currency2,
        discountRate2,
        reconfigurationBondingCurveRate2,
        bondingCurveRate2,
        reservedRate2
      };
    }
  },
  {
    description: "Make sure the current configuration changed",
    fn: async ({
      constants,
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      timeMark,
      local: {
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleId2,
        expectedFundingCycleNumber1,
        discountRate1,
        cycleLimit2,
        ballot2,
        duration2,
        target2,
        currency2,
        discountRate2,
        reconfigurationBondingCurveRate2,
        bondingCurveRate2,
        reservedRate2,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped
      }
    }) => {
      let expectedPackedMetadata2 = BigNumber.from(0);
      expectedPackedMetadata2 = expectedPackedMetadata2.add(
        reconfigurationBondingCurveRate2
      );
      expectedPackedMetadata2 = expectedPackedMetadata2.shl(8);
      expectedPackedMetadata2 = expectedPackedMetadata2.add(bondingCurveRate2);
      expectedPackedMetadata2 = expectedPackedMetadata2.shl(8);
      expectedPackedMetadata2 = expectedPackedMetadata2.add(reservedRate2);
      expectedPackedMetadata2 = expectedPackedMetadata2.shl(8);

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "currentOf",
        args: [expectedProjectId],
        expect: [
          expectedFundingCycleId2,
          expectedProjectId,
          expectedFundingCycleNumber1.add(1),
          expectedFundingCycleId1,
          timeMark,
          cycleLimit2,
          expectedInitialWeight
            .mul(constants.DiscountRatePercentDenominator.sub(discountRate1))
            .div(constants.DiscountRatePercentDenominator),
          ballot2,
          timeMark,
          duration2,
          target2,
          currency2,
          expectedFee,
          discountRate2,
          expectedInitialTapped,
          expectedPackedMetadata2
        ]
      });

      return { expectedPackedMetadata2, expectedFundingCycleId2 };
    }
  },
  {
    description: "Make sure the queued configuration changed",
    fn: ({
      constants,
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      timeMark,
      local: {
        expectedProjectId,
        expectedFundingCycleId2,
        expectedFundingCycleNumber1,
        discountRate1,
        cycleLimit2,
        ballot2,
        duration2,
        target2,
        currency2,
        discountRate2,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped,
        expectedPackedMetadata2,
        expectedFundingCycleId1,
        originalTimeMark,
        ballot1,
        duration1,
        target1,
        expectedPackedMetadata1
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "queuedOf",
        args: [expectedProjectId],
        expect: !cycleLimit2.eq(1)
          ? [
              BigNumber.from(0),
              expectedProjectId,
              expectedFundingCycleNumber1.add(2),
              expectedFundingCycleId2,
              timeMark,
              cycleLimit2.eq(0) ? BigNumber.from(0) : cycleLimit2.sub(1),
              expectedInitialWeight
                .mul(
                  constants.DiscountRatePercentDenominator.sub(discountRate1)
                )
                .div(constants.DiscountRatePercentDenominator)
                .mul(
                  constants.DiscountRatePercentDenominator.sub(discountRate2)
                )
                .div(constants.DiscountRatePercentDenominator),
              ballot2,
              timeMark.add(duration2.mul(86400)),
              duration2,
              target2,
              currency2,
              expectedFee,
              discountRate2,
              expectedInitialTapped,
              expectedPackedMetadata2
            ]
          : [
              BigNumber.from(0),
              expectedProjectId,
              expectedFundingCycleNumber1.add(2),
              expectedFundingCycleId1,
              originalTimeMark,
              BigNumber.from(0),
              expectedInitialWeight
                .mul(
                  constants.DiscountRatePercentDenominator.sub(discountRate1)
                )
                .div(constants.DiscountRatePercentDenominator)
                .mul(
                  constants.DiscountRatePercentDenominator.sub(discountRate2)
                )
                .div(constants.DiscountRatePercentDenominator),
              ballot1,
              timeMark.add(duration2.mul(86400)),
              duration1,
              target1,
              BigNumber.from(currency),
              expectedFee,
              discountRate1,
              expectedInitialTapped,
              expectedPackedMetadata1
            ]
      })
  }
];
