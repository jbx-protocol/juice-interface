/** 
  A funding cycle configuration can have a limit, after which the projects reverts to the previous configuration.
*/

// The currency will be 0, which corresponds to ETH, preventing the need for currency price conversion.
const currency = 0;

// Expect the first funding cycle to be based on the 0th funding cycle.
const expectedInitialBasedOn = 0;

module.exports = [
  {
    description:
      "Setting a limit on the first deployed funding cycle shouldnt do anything",
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

      const duration1 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: constants.MaxUint16
      });

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
    description: "Fastforward to just before the limit",
    fn: async ({
      fastforwardFn,
      BigNumber,
      randomBigNumberFn,
      local: { cycleLimit1, duration1 }
    }) => {
      // Can move within a day, with some room on the boundaries for time imprecision.
      const buffer = randomBigNumberFn({
        min: BigNumber.from(5),
        max: BigNumber.from(86395)
      });
      await fastforwardFn(
        cycleLimit1
          .mul(duration1)
          .mul(86400)
          .sub(buffer)
      );
      return { buffer };
    }
  },
  {
    description: "Make sure the same funding cycle is current",
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
        target1,
        cycleLimit1,
        discountRate1,
        ballot1,
        duration1,
        expectedPackedMetadata1,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped
      }
    }) => {
      let expectedWeight = expectedInitialWeight;
      for (let i = 0; i < cycleLimit1.sub(1); i += 1) {
        expectedWeight = expectedWeight
          .mul(constants.DiscountRatePercentDenominator.sub(discountRate1))
          .div(constants.DiscountRatePercentDenominator);
      }
      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "currentOf",
        args: [expectedProjectId],
        expect: [
          cycleLimit1.eq(1) ? expectedFundingCycleId1 : BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber1.add(cycleLimit1.sub(1)),
          cycleLimit1.eq(1) ? BigNumber.from(0) : expectedFundingCycleId1,
          originalTimeMark,
          // There should be one cycle limit left
          BigNumber.from(1),
          expectedWeight,
          ballot1,
          originalTimeMark.add(
            cycleLimit1
              .sub(1)
              .mul(duration1)
              .mul(86400)
          ),
          duration1,
          target1,
          BigNumber.from(currency),
          expectedFee,
          discountRate1,
          expectedInitialTapped,
          expectedPackedMetadata1
        ]
      });
    }
  },
  {
    description: "Fastforward to past the limit",
    fn: async ({ fastforwardFn, local: { buffer } }) => fastforwardFn(buffer)
  },
  {
    description: "Make sure the same funding cycle is current",
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
        target1,
        cycleLimit1,
        discountRate1,
        ballot1,
        duration1,
        expectedPackedMetadata1,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped
      }
    }) => {
      let expectedFullLimitWeight = expectedInitialWeight;
      for (let i = 0; i < cycleLimit1; i += 1) {
        expectedFullLimitWeight = expectedFullLimitWeight
          .mul(constants.DiscountRatePercentDenominator.sub(discountRate1))
          .div(constants.DiscountRatePercentDenominator);
      }
      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "currentOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber1.add(cycleLimit1),
          expectedFundingCycleId1,
          originalTimeMark,
          // Cycle limit should be 0 for the first funding cycle.
          BigNumber.from(0),
          expectedFullLimitWeight,
          ballot1,
          originalTimeMark.add(cycleLimit1.mul(duration1).mul(86400)),
          duration1,
          target1,
          BigNumber.from(currency),
          expectedFee,
          discountRate1,
          expectedInitialTapped,
          expectedPackedMetadata1
        ]
      });
      return { expectedFullLimitWeight };
    }
  },
  {
    description: "Reconfigure the project to have a limit",
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
        min: BigNumber.from(1),
        max: constants.MaxCycleLimit
      });
      // dont allow non recurring.
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
    description: "Fastforward to just before the reconfiguration",
    fn: async ({ fastforwardFn, timeMark, local: { duration1, buffer } }) => {
      await fastforwardFn(duration1.mul(86400).sub(buffer));
      return { configurationTimeMark: timeMark };
    }
  },
  {
    description: "Make sure the same funding cycle is current",
    fn: ({
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleNumber1,
        originalTimeMark,
        target1,
        cycleLimit1,
        discountRate1,
        ballot1,
        duration1,
        expectedPackedMetadata1,
        expectedFullLimitWeight,
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
          BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber1.add(cycleLimit1),
          expectedFundingCycleId1,
          originalTimeMark,
          // Cycle limit should be 0 for the first funding cycle.
          BigNumber.from(0),
          expectedFullLimitWeight,
          ballot1,
          originalTimeMark.add(cycleLimit1.mul(duration1).mul(86400)),
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
    description: "Fastforward to the reconfiguration",
    fn: async ({ fastforwardFn, local: { buffer } }) => fastforwardFn(buffer)
  },
  {
    description: "Make sure the configuration changed",
    fn: async ({
      constants,
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleId2,
        expectedFundingCycleNumber1,
        originalTimeMark,
        configurationTimeMark,
        cycleLimit1,
        discountRate1,
        duration1,
        cycleLimit2,
        ballot2,
        duration2,
        target2,
        currency2,
        discountRate2,
        reconfigurationBondingCurveRate2,
        bondingCurveRate2,
        reservedRate2,
        expectedFullLimitWeight,
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
          expectedFundingCycleNumber1.add(cycleLimit1).add(1),
          expectedFundingCycleId1,
          configurationTimeMark,
          cycleLimit2,
          expectedFullLimitWeight
            .mul(constants.DiscountRatePercentDenominator.sub(discountRate1))
            .div(constants.DiscountRatePercentDenominator),
          ballot2,
          originalTimeMark.add(
            cycleLimit1
              .add(1)
              .mul(duration1)
              .mul(86400)
          ),
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
    description: "Fastforward to next funding cycle in the limit",
    fn: async ({ fastforwardFn, local: { duration2 } }) =>
      fastforwardFn(duration2.mul(86400))
  },
  {
    description: "Make sure the limited configuration is still active",
    fn: async ({
      constants,
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedFundingCycleNumber1,
        originalTimeMark,
        configurationTimeMark,
        cycleLimit1,
        discountRate1,
        duration1,
        cycleLimit2,
        discountRate2,
        ballot2,
        duration2,
        target2,
        currency2,
        expectedPackedMetadata2,
        expectedFundingCycleId2,
        expectedFullLimitWeight,
        expectedFee,
        expectedInitialTapped
      }
    }) => {
      if (cycleLimit2.lte(1)) return;

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "currentOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber1.add(cycleLimit1).add(2),
          expectedFundingCycleId2,
          configurationTimeMark,
          cycleLimit2.sub(1),
          expectedFullLimitWeight
            .mul(constants.DiscountRatePercentDenominator.sub(discountRate1))
            .div(constants.DiscountRatePercentDenominator)
            .mul(constants.DiscountRatePercentDenominator.sub(discountRate2))
            .div(constants.DiscountRatePercentDenominator),
          ballot2,
          originalTimeMark
            .add(
              cycleLimit1
                .add(1)
                .mul(duration1)
                .mul(86400)
            )
            .add(duration2.mul(86400)),
          duration2,
          target2,
          currency2,
          expectedFee,
          discountRate2,
          expectedInitialTapped,
          expectedPackedMetadata2
        ]
      });
    }
  },
  {
    description: "Fastforward to after the limit",
    fn: async ({ fastforwardFn, local: { cycleLimit2, duration2 } }) => {
      if (cycleLimit2.lte(1)) return;

      await fastforwardFn(
        cycleLimit2
          .sub(1)
          .mul(duration2)
          .mul(86400)
      );
    }
  },
  {
    description:
      "Make sure the permanent funding cycle is back to being the current",
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
        target1,
        cycleLimit1,
        discountRate1,
        ballot1,
        duration1,
        cycleLimit2,
        discountRate2,
        duration2,
        expectedPackedMetadata1,
        expectedFullLimitWeight,
        expectedFee,
        expectedInitialTapped
      }
    }) => {
      let expectedFullLimitWeight2 = expectedFullLimitWeight
        .mul(constants.DiscountRatePercentDenominator.sub(discountRate1))
        .div(constants.DiscountRatePercentDenominator);
      for (let i = 0; i < cycleLimit2; i += 1) {
        expectedFullLimitWeight2 = expectedFullLimitWeight2
          .mul(constants.DiscountRatePercentDenominator.sub(discountRate2))
          .div(constants.DiscountRatePercentDenominator);
      }
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "currentOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber1
            .add(cycleLimit1)
            .add(cycleLimit2)
            .add(1),
          expectedFundingCycleId1,
          originalTimeMark,
          BigNumber.from(0),
          expectedFullLimitWeight2,
          ballot1,
          originalTimeMark
            .add(
              cycleLimit1
                .add(1)
                .mul(duration1)
                .mul(86400)
            )
            .add(cycleLimit2.mul(duration2).mul(86400)),
          duration1,
          target1,
          BigNumber.from(currency),
          expectedFee,
          discountRate1,
          expectedInitialTapped,
          expectedPackedMetadata1
        ]
      });
    }
  },
  {
    description: "Tap some of the current funding cycle",
    fn: async ({
      randomSignerFn,
      contracts,
      executeFn,
      incrementFundingCycleIdFn,
      local: { expectedProjectId, amountToTap }
    }) => {
      // Tapping at this point will create a new funding cycle.
      const expectedFundingCycleId3 = incrementFundingCycleIdFn();

      await executeFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "tap",
        args: [expectedProjectId, amountToTap, currency, 0]
      });

      return { expectedFundingCycleId3 };
    }
  },
  {
    description: "Make sure the tapped funding cycle is the current",
    fn: async ({
      constants,
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedFundingCycleId2,
        expectedFundingCycleId3,
        amountToTap,
        expectedFundingCycleNumber1,
        originalTimeMark,
        target1,
        cycleLimit1,
        discountRate1,
        ballot1,
        duration1,
        cycleLimit2,
        discountRate2,
        duration2,
        expectedPackedMetadata1,
        expectedFullLimitWeight,
        expectedFee
      }
    }) => {
      let expectedFullLimitWeight2 = expectedFullLimitWeight
        .mul(constants.DiscountRatePercentDenominator.sub(discountRate1))
        .div(constants.DiscountRatePercentDenominator);
      for (let i = 0; i < cycleLimit2; i += 1) {
        expectedFullLimitWeight2 = expectedFullLimitWeight2
          .mul(constants.DiscountRatePercentDenominator.sub(discountRate2))
          .div(constants.DiscountRatePercentDenominator);
      }
      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "currentOf",
        args: [expectedProjectId],
        expect: [
          expectedFundingCycleId3,
          expectedProjectId,
          expectedFundingCycleNumber1
            .add(cycleLimit1)
            .add(cycleLimit2)
            .add(1),
          expectedFundingCycleId2,
          originalTimeMark,
          BigNumber.from(0),
          expectedFullLimitWeight2,
          ballot1,
          originalTimeMark
            .add(
              cycleLimit1
                .add(1)
                .mul(duration1)
                .mul(86400)
            )
            .add(cycleLimit2.mul(duration2).mul(86400)),
          duration1,
          target1,
          BigNumber.from(currency),
          expectedFee,
          discountRate1,
          amountToTap,
          expectedPackedMetadata1
        ]
      });
    }
  }
];
