/** 
  A project can reconfigure its funding cycles. If no payments have been made, the current funding cycle should be configurable.
  Otherwise, a new configuration should be made that should take effect in the subsequent funding cycle.

  These tests use an empty ballot, so reconfigurations may take effect right after the current funding cycle expires.
*/
module.exports = async ({
  deployer,
  addrs,
  constants,
  contracts,
  executeFn,
  checkFn,
  randomBigNumberFn,
  BigNumber,
  getBalanceFn,
  stringToBytesFn,
  randomStringFn,
  randomAddressFn,
  randomBoolFn
}) => {
  // The owner of the project that will reconfigure.
  const owner = addrs[0];

  // An account that will be used to make payments.
  const payer = addrs[1];

  // One payments will be made. Cant pay entire balance because some is needed for gas.
  // So, arbitrarily find a number less than a half so that all payments can be made successfully.
  const paymentValue = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(2)
  });

  const target1 = randomBigNumberFn();

  // The currency will be 0, which corresponds to ETH.
  const currency1 = BigNumber.from(0);

  const duration1 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: BigNumber.from(10000)
  });
  const discountRate1 = randomBigNumberFn({ max: constants.MaxPercent });
  const ballot1 = constants.AddressZero;

  const reservedRate1 = randomBigNumberFn({ max: constants.MaxPercent });
  const bondingCurveRate1 = randomBigNumberFn({ max: constants.MaxPercent });
  const reconfigurationBondingCurveRate1 = randomBigNumberFn({
    max: constants.MaxPercent
  });

  const target2 = randomBigNumberFn();

  const currency2 = randomBigNumberFn({ max: constants.MaxUint8 });
  const duration2 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxUint16
  });
  const discountRate2 = randomBigNumberFn({ max: constants.MaxPercent });
  const ballot2 = constants.AddressZero;

  const reservedRate2 = randomBigNumberFn({ max: constants.MaxPercent });
  const bondingCurveRate2 = randomBigNumberFn({ max: constants.MaxPercent });
  const reconfigurationBondingCurveRate2 = randomBigNumberFn({
    max: constants.MaxPercent
  });

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

  let expectedPackedMetadata2 = BigNumber.from(0);
  expectedPackedMetadata2 = expectedPackedMetadata2.add(
    reconfigurationBondingCurveRate2
  );
  expectedPackedMetadata2 = expectedPackedMetadata2.shl(8);
  expectedPackedMetadata2 = expectedPackedMetadata2.add(bondingCurveRate2);
  expectedPackedMetadata2 = expectedPackedMetadata2.shl(8);
  expectedPackedMetadata2 = expectedPackedMetadata2.add(reservedRate2);
  expectedPackedMetadata2 = expectedPackedMetadata2.shl(8);

  // Since the governance project was created before this test, the created funding cycle ID should be 2.
  const expectedFundingCycleId1 = BigNumber.from(2);

  // Since the second funding cycle should be one greater than the first.
  const expectedFundingCycleId2 = BigNumber.from(3);

  // The governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = BigNumber.from(2);

  // It should be the project's first budget.
  const expectedFundingCycleNumber1 = BigNumber.from(1);

  // The reconfigured funding cycle should be the second.
  const expectedFundingCycleNumber2 = BigNumber.from(2);

  // Expect the funding cycle to be based on the 0th funding cycle.
  const expectedBasedOn = BigNumber.from(0);

  // Expect the funding cycle's weight to be the base weight.
  const weight = await contracts.fundingCycles.BASE_WEIGHT();

  // Expect the funding cycle's fee to be the juicer's fee.
  const fee = await contracts.juicer.fee();

  // Expect nothing to have been tapped yet from the funding cycle.
  const expectedTapped = BigNumber.from(0);

  return [
    /**
      Deploy a project.
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
            target: target1,
            currency: currency1,
            duration: duration1,
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
      }),
    /**
      Make sure the funding cycle got saved correctly.
    */
    async ({ timeMark }) => {
      await checkFn({
        contract: contracts.fundingCycles,
        fn: "get",
        args: [expectedFundingCycleId1],
        expect: [
          expectedFundingCycleId1,
          expectedProjectId,
          expectedFundingCycleNumber1,
          expectedBasedOn,
          timeMark,
          weight,
          ballot1,
          timeMark,
          duration1,
          target1,
          currency1,
          fee,
          discountRate1,
          expectedTapped,
          expectedPackedMetadata1
        ]
      });
      return { originalTimeMark: timeMark };
    },
    /**
      Reconfiguring a project before a payment has been made should change the active funding cycle,
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            target: target2,
            currency: currency2,
            duration: duration2,
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
      }),
    /**
      Make sure the first funding cycle got updated.
    */
    ({ local: { originalTimeMark }, timeMark }) =>
      checkFn({
        contract: contracts.fundingCycles,
        fn: "get",
        args: [expectedFundingCycleId1],
        expect: [
          expectedFundingCycleId1,
          expectedProjectId,
          expectedFundingCycleNumber1,
          expectedBasedOn,
          timeMark,
          weight,
          ballot2,
          // The start time should stay the same.
          originalTimeMark,
          duration2,
          target2,
          currency2,
          fee,
          discountRate2,
          expectedTapped,
          expectedPackedMetadata2
        ]
      }),
    /**
      Print some premined tickets.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "printPreminedTickets",
        args: [
          expectedProjectId,
          randomBigNumberFn({
            min: BigNumber.from(1),
            max: BigNumber.from(2).pow(30)
          }),
          currency1,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ]
      }),
    /**
      Reconfiguring a project after initial tickets are printed, 
      but before a payment has been made should change the active funding cycle.

      This will configure back to original properties.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            target: target1,
            currency: currency1,
            duration: duration1,
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
      }),
    /**
      Make sure the first funding cycle got updated.
    */
    async ({ local: { originalTimeMark }, timeMark }) => {
      await checkFn({
        contract: contracts.fundingCycles,
        fn: "get",
        args: [expectedFundingCycleId1],
        expect: [
          expectedFundingCycleId1,
          expectedProjectId,
          expectedFundingCycleNumber1,
          expectedBasedOn,
          timeMark,
          weight,
          ballot1,
          // The start time should stay the same.
          originalTimeMark,
          duration1,
          target1,
          currency1,
          fee,
          discountRate1,
          expectedTapped,
          expectedPackedMetadata1
        ]
      });

      return { configuredTimeMark: timeMark };
    },
    /**
      Make a payment to the project.
    */
    () =>
      executeFn({
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
      }),
    /**
      Reconfiguring should create a new funding cycle,
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            target: target2,
            currency: currency2,
            duration: duration2,
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
      }),
    /**
      The second funding cycle should have been configured.
    */
    ({ local: { originalTimeMark }, timeMark }) =>
      checkFn({
        contract: contracts.fundingCycles,
        fn: "get",
        args: [expectedFundingCycleId2],
        expect: [
          expectedFundingCycleId2,
          expectedProjectId,
          expectedFundingCycleNumber2,
          expectedFundingCycleId1,
          timeMark,
          weight.mul(discountRate1).div(constants.MaxPercent),
          ballot2,
          // The start time should be one duration after the initial start.
          originalTimeMark.add(duration1.mul(86400)),
          duration2,
          target2,
          currency2,
          fee,
          discountRate2,
          expectedTapped,
          expectedPackedMetadata2
        ]
      }),
    /**
      The first funding cycle should not be.
    */
    ({ local: { originalTimeMark, configuredTimeMark } }) =>
      checkFn({
        contract: contracts.fundingCycles,
        fn: "get",
        args: [expectedFundingCycleId1],
        expect: [
          expectedFundingCycleId1,
          expectedProjectId,
          expectedFundingCycleNumber1,
          expectedBasedOn,
          configuredTimeMark,
          weight,
          ballot1,
          // The start time should stay the same.
          originalTimeMark,
          duration1,
          target1,
          currency1,
          fee,
          discountRate1,
          expectedTapped,
          expectedPackedMetadata1
        ]
      })
  ];
};
