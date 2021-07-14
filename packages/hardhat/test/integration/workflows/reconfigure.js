/** 
  A project can reconfigure its funding cycles. If no payments have been made, the current funding cycle should be configurable.
  Otherwise, a new configuration should be made that should take effect in the subsequent funding cycle.

  These tests use an empty ballot, so reconfigurations may take effect right after the current funding cycle expires.
*/

// The currency will be 0, which corresponds to ETH, preventing the need for currency price conversion.
const currency = 0;

// Expect the first funding cycle to be based on the 0th funding cycle.
const expectedInitialBasedOn = 0;

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
      incrementProjectIdFn,
      incrementFundingCycleIdFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();
      const expectedFundingCycleId1 = incrementFundingCycleIdFn();

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
        max: constants.MaxCycleLimit
      });
      // Make sure its recurring.
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
        reservedRate1,
        bondingCurveRate1,
        reconfigurationBondingCurveRate1,
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
      randomSignerFn,
      timeMark,
      local: {
        target1,
        cycleLimit1,
        ballot1,
        duration1,
        discountRate1,
        reconfigurationBondingCurveRate1,
        bondingCurveRate1,
        reservedRate1,
        expectedFundingCycleId1,
        expectedProjectId,
        expectedFundingCycleNumber1
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
    description: "Make sure the funding cycle is the current one",
    fn: async ({
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      timeMark,
      local: {
        target1,
        cycleLimit1,
        ballot1,
        duration1,
        discountRate1,
        expectedFundingCycleId1,
        expectedProjectId,
        expectedFundingCycleNumber1,
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
    description:
      "The queued cycle should be a generated one with incremented properties",
    fn: async ({
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      timeMark,
      constants,
      local: {
        cycleLimit1,
        target1,
        ballot1,
        duration1,
        discountRate1,
        expectedFundingCycleId1,
        expectedProjectId,
        expectedFundingCycleNumber1,
        expectedPackedMetadata1,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "queuedOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber1.add(1),
          expectedFundingCycleId1,
          timeMark,
          // Cycle limit should be 0 for the first funding cycle.
          cycleLimit1.eq(0) ? BigNumber.from(0) : cycleLimit1.sub(1),
          expectedInitialWeight
            .mul(constants.DiscountRatePercentDenominator.sub(discountRate1))
            .div(constants.DiscountRatePercentDenominator),
          ballot1,
          timeMark.add(duration1.mul(86400)),
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
    description:
      "Reconfiguring a project before a payment has been made should change the active funding cycle",
    fn: async ({
      constants,
      contracts,
      executeFn,
      randomBigNumberFn,
      BigNumber,
      local: { owner, expectedProjectId }
    }) => {
      const target2 = randomBigNumberFn();
      const currency2 = randomBigNumberFn({ max: constants.MaxUint8 });
      const duration2 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: constants.MaxUint16
      });
      const cycleLimit2 = randomBigNumberFn({
        max: constants.MaxCycleLimit
      });
      // Make sure its not recurring.
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
        cycleLimit2,
        ballot2,
        duration2,
        target2,
        currency2,
        discountRate2,
        reservedRate2,
        bondingCurveRate2,
        reconfigurationBondingCurveRate2
      };
    }
  },
  {
    description: "Make sure the first funding cycle got updated",
    fn: async ({
      contracts,
      checkFn,
      BigNumber,
      timeMark,
      randomSignerFn,
      local: {
        originalTimeMark,
        cycleLimit2,
        ballot2,
        duration2,
        target2,
        currency2,
        discountRate2,
        reconfigurationBondingCurveRate2,
        bondingCurveRate2,
        reservedRate2,
        expectedFundingCycleId1,
        expectedFundingCycleNumber1,
        expectedProjectId,
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
        fn: "get",
        args: [expectedFundingCycleId1],
        expect: [
          expectedFundingCycleId1,
          expectedProjectId,
          expectedFundingCycleNumber1,
          BigNumber.from(expectedInitialBasedOn),
          timeMark,
          cycleLimit2,
          expectedInitialWeight,
          ballot2,
          // The start time should stay the same.
          originalTimeMark,
          duration2,
          target2,
          currency2,
          expectedFee,
          discountRate2,
          expectedInitialTapped,
          expectedPackedMetadata2
        ]
      });

      return { expectedPackedMetadata2 };
    }
  },
  {
    description: "Print some premined tickets",
    fn: ({
      contracts,
      executeFn,
      randomBigNumberFn,
      BigNumber,
      randomStringFn,
      randomAddressFn,
      randomBoolFn,
      local: { owner, expectedProjectId }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "printPreminedTickets",
        args: [
          expectedProjectId,
          randomBigNumberFn({
            min: BigNumber.from(1),
            // Use an arbitrary large big number that can be added to other large big numbers without risk of running into uint256 boundaries.
            max: BigNumber.from(10).pow(30)
          }),
          currency,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ]
      })
  },
  {
    description:
      "Reconfiguring a project after initial tickets are printed, but before a payment has been made should change the active funding cycle",
    fn: ({
      contracts,
      executeFn,
      local: {
        owner,
        target1,
        duration1,
        cycleLimit1,
        discountRate1,
        ballot1,
        reservedRate1,
        bondingCurveRate1,
        reconfigurationBondingCurveRate1,
        expectedProjectId
      }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "configure",
        args: [
          expectedProjectId,
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
      })
  },
  {
    description: "Make sure the first funding cycle got updated",
    fn: async ({
      contracts,
      checkFn,
      timeMark,
      randomSignerFn,
      BigNumber,
      local: {
        originalTimeMark,
        target1,
        cycleLimit1,
        ballot1,
        duration1,
        discountRate1,
        expectedPackedMetadata1,
        expectedFundingCycleId1,
        expectedFundingCycleNumber1,
        expectedProjectId,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped
      }
    }) => {
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
          cycleLimit1,
          expectedInitialWeight,
          ballot1,
          // The start time should stay the same.
          originalTimeMark,
          duration1,
          target1,
          BigNumber.from(currency),
          BigNumber.from(expectedFee),
          discountRate1,
          expectedInitialTapped,
          expectedPackedMetadata1
        ]
      });

      return { configuredTimeMark: timeMark };
    }
  },
  {
    description: "Make a payment to the project",
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
    description: "Reconfiguring should create a new funding cycle",
    fn: async ({
      contracts,
      executeFn,
      incrementFundingCycleIdFn,
      BigNumber,
      local: {
        owner,
        target2,
        currency2,
        duration2,
        cycleLimit2,
        discountRate2,
        ballot2,
        reservedRate2,
        bondingCurveRate2,
        reconfigurationBondingCurveRate2,
        expectedProjectId
      }
    }) => {
      const expectedFundingCycleId2 = incrementFundingCycleIdFn();

      // The reconfigured funding cycle should be the second.
      const expectedFundingCycleNumber2 = BigNumber.from(2);

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
      return { expectedFundingCycleId2, expectedFundingCycleNumber2 };
    }
  },
  {
    description: "The second funding cycle should have been configured",
    fn: ({
      constants,
      contracts,
      checkFn,
      timeMark,
      randomSignerFn,
      BigNumber,
      local: {
        discountRate1,
        duration1,
        originalTimeMark,
        cycleLimit2,
        ballot2,
        duration2,
        target2,
        currency2,
        discountRate2,
        expectedPackedMetadata2,
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleId2,
        expectedFundingCycleNumber2,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "get",
        args: [expectedFundingCycleId2],
        expect: [
          expectedFundingCycleId2,
          expectedProjectId,
          expectedFundingCycleNumber2,
          expectedFundingCycleId1,
          timeMark,
          cycleLimit2,
          expectedInitialWeight
            .mul(constants.DiscountRatePercentDenominator.sub(discountRate1))
            .div(constants.DiscountRatePercentDenominator),
          ballot2,
          // The start time should be one duration after the initial start.
          originalTimeMark.add(duration1.mul(86400)),
          duration2,
          target2,
          BigNumber.from(currency2),
          expectedFee,
          discountRate2,
          expectedInitialTapped,
          expectedPackedMetadata2
        ]
      })
  },
  {
    description: "The first funding cycle should not have been configured",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      BigNumber,
      local: {
        originalTimeMark,
        configuredTimeMark,
        target1,
        cycleLimit1,
        ballot1,
        duration1,
        discountRate1,
        expectedPackedMetadata1,
        expectedFundingCycleId1,
        expectedProjectId,
        expectedFundingCycleNumber1,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "get",
        args: [expectedFundingCycleId1],
        expect: [
          expectedFundingCycleId1,
          expectedProjectId,
          expectedFundingCycleNumber1,
          BigNumber.from(expectedInitialBasedOn),
          configuredTimeMark,
          cycleLimit1,
          expectedInitialWeight,
          ballot1,
          // The start time should stay the same.
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
    description: "The second funding cycle should be queued",
    fn: ({
      constants,
      contracts,
      checkFn,
      timeMark,
      randomSignerFn,
      local: {
        originalTimeMark,
        discountRate1,
        duration1,
        cycleLimit2,
        ballot2,
        duration2,
        target2,
        currency2,
        discountRate2,
        expectedPackedMetadata2,
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleId2,
        expectedFundingCycleNumber2,
        expectedInitialWeight,
        expectedFee,
        expectedInitialTapped
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.fundingCycles,
        fn: "queuedOf",
        args: [expectedProjectId],
        expect: [
          expectedFundingCycleId2,
          expectedProjectId,
          expectedFundingCycleNumber2,
          expectedFundingCycleId1,
          timeMark,
          cycleLimit2,
          expectedInitialWeight
            .mul(constants.DiscountRatePercentDenominator.sub(discountRate1))
            .div(constants.DiscountRatePercentDenominator),
          ballot2,
          // The start time should be one duration after the initial start.
          originalTimeMark.add(duration1.mul(86400)),
          duration2,
          target2,
          currency2,
          expectedFee,
          discountRate2,
          expectedInitialTapped,
          expectedPackedMetadata2
        ]
      })
  },
  {
    description: "The first funding cycle should still be the current",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      BigNumber,
      local: {
        originalTimeMark,
        configuredTimeMark,
        target1,
        cycleLimit1,
        ballot1,
        duration1,
        discountRate1,
        expectedPackedMetadata1,
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleNumber1,
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
          configuredTimeMark,
          cycleLimit1,
          expectedInitialWeight,
          ballot1,
          // The start time should stay the same.
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
    description: "Tap some of the current funding cycle",
    fn: ({
      randomSignerFn,
      contracts,
      executeFn,
      local: { expectedProjectId, amountToTap }
    }) =>
      executeFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "tap",
        args: [expectedProjectId, amountToTap, currency, 0]
      })
  },
  {
    description: "The current should now have a tapped amount",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      BigNumber,
      local: {
        originalTimeMark,
        configuredTimeMark,
        target1,
        cycleLimit1,
        ballot1,
        duration1,
        discountRate1,
        expectedPackedMetadata1,
        expectedProjectId,
        expectedFundingCycleId1,
        expectedFundingCycleNumber1,
        expectedInitialWeight,
        expectedFee,
        amountToTap
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
          configuredTimeMark,
          cycleLimit1,
          expectedInitialWeight,
          ballot1,
          // The start time should stay the same.
          originalTimeMark,
          duration1,
          target1,
          BigNumber.from(currency),
          expectedFee,
          discountRate1,
          amountToTap,
          expectedPackedMetadata1
        ]
      })
  }
];
