/** 
  A funding cycle configuration can have a limit, after which the projects reverts to the previous configuration.
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
  randomBoolFn,
  fastforwardFn
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

  const cycleLimit1 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxCycleLimit
  });

  // dont allow non recurring.
  const discountRate1 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxPercent
  });
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
  const cycleLimit2 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxCycleLimit
  });
  // dont allow non recurring.
  const discountRate2 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxPercent
  });
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

      Setting a limit on the first funding cycle shouldnt do anything.
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
          // Cycle limit should be 0 for the first funding cycle.
          cycleLimit1,
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
      Make a payment to the project to lock it in.
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
      Fastforward to just before the limit.
    */
    () =>
      fastforwardFn(
        cycleLimit1
          .mul(duration1)
          .mul(86400)
          .sub(2)
      ),
    /**
      Make sure the same funding cycle is current.
    */
    async ({ local: { originalTimeMark } }) =>
      checkFn({
        contract: contracts.fundingCycles,
        fn: "getCurrentOf",
        args: [expectedProjectId],
        expect: [
          cycleLimit1.eq(1) ? expectedFundingCycleId1 : BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber1.add(cycleLimit1.sub(1)),
          cycleLimit1.eq(1) ? BigNumber.from(0) : expectedFundingCycleId1,
          originalTimeMark,
          // There should be one cycle limit left
          BigNumber.from(1),
          weight
            .mul(discountRate1.pow(cycleLimit1.sub(1)))
            .div(constants.MaxPercent.pow(cycleLimit1.sub(1))),
          ballot1,
          originalTimeMark.add(
            cycleLimit1
              .sub(1)
              .mul(duration1)
              .mul(86400)
          ),
          duration1,
          target1,
          currency1,
          fee,
          discountRate1,
          expectedTapped,
          expectedPackedMetadata1
        ]
      }),
    /**
      Fastforward to past the limit.
    */
    () => fastforwardFn(BigNumber.from(3)),
    /**
      Make sure the same funding cycle is current.
    */
    ({ local: { originalTimeMark } }) =>
      checkFn({
        contract: contracts.fundingCycles,
        fn: "getCurrentOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber1.add(cycleLimit1),
          expectedFundingCycleId1,
          originalTimeMark,
          // Cycle limit should be 0 for the first funding cycle.
          BigNumber.from(0),
          weight
            .mul(discountRate1.pow(cycleLimit1))
            .div(constants.MaxPercent.pow(cycleLimit1)),
          ballot1,
          originalTimeMark.add(cycleLimit1.mul(duration1).mul(86400)),
          duration1,
          target1,
          currency1,
          fee,
          discountRate1,
          expectedTapped,
          expectedPackedMetadata1
        ]
      }),
    /**
      Reconfigure the project to have a limit.
    */
    async () =>
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
      }),
    /**
      Fastforward to just before the reconfiguration.
    */
    async ({ timeMark }) => {
      await fastforwardFn(duration1.mul(86400).sub(10));
      return { configurationTimeMark: timeMark };
    },
    /**
      Make sure the same funding cycle is current.
    */
    ({ local: { originalTimeMark } }) =>
      checkFn({
        contract: contracts.fundingCycles,
        fn: "getCurrentOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber1.add(cycleLimit1),
          expectedFundingCycleId1,
          originalTimeMark,
          // Cycle limit should be 0 for the first funding cycle.
          BigNumber.from(0),
          weight
            .mul(discountRate1.pow(cycleLimit1))
            .div(constants.MaxPercent.pow(cycleLimit1)),
          ballot1,
          originalTimeMark.add(cycleLimit1.mul(duration1).mul(86400)),
          duration1,
          target1,
          currency1,
          fee,
          discountRate1,
          expectedTapped,
          expectedPackedMetadata1
        ]
      }),
    /**
      Fastforward to the reconfiguration.
    */
    () => fastforwardFn(BigNumber.from(20)),
    /**
      Make sure the configuration changed.
    */
    ({ local: { originalTimeMark, configurationTimeMark } }) =>
      checkFn({
        contract: contracts.fundingCycles,
        fn: "getCurrentOf",
        args: [expectedProjectId],
        expect: [
          expectedFundingCycleId2,
          expectedProjectId,
          expectedFundingCycleNumber1.add(cycleLimit1).add(1),
          expectedFundingCycleId1,
          configurationTimeMark,
          cycleLimit2,
          weight
            .mul(discountRate1.pow(cycleLimit1))
            .div(constants.MaxPercent.pow(cycleLimit1))
            .mul(discountRate1)
            .div(constants.MaxPercent),
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
          fee,
          discountRate2,
          expectedTapped,
          expectedPackedMetadata2
        ]
      }),
    /**
      Fastforward to next funding cycle in the limit.
     */
    () => fastforwardFn(duration2.mul(86400)),
    ...(cycleLimit2 > 1
      ? [
          /**
            Make sure the limited configuration is still active.
          */
          ({ local: { originalTimeMark, configurationTimeMark } }) =>
            checkFn({
              contract: contracts.fundingCycles,
              fn: "getCurrentOf",
              args: [expectedProjectId],
              expect: [
                BigNumber.from(0),
                expectedProjectId,
                expectedFundingCycleNumber1.add(cycleLimit1).add(2),
                expectedFundingCycleId2,
                configurationTimeMark,
                cycleLimit2.sub(1),
                weight
                  .mul(discountRate1.pow(cycleLimit1))
                  .div(constants.MaxPercent.pow(cycleLimit1))
                  .mul(discountRate1)
                  .div(constants.MaxPercent)
                  .mul(discountRate2)
                  .div(constants.MaxPercent),
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
                fee,
                discountRate2,
                expectedTapped,
                expectedPackedMetadata2
              ]
            }),
          /**
            Fastforward to after the limit.
          */
          () =>
            fastforwardFn(
              cycleLimit2
                .sub(1)
                .mul(duration2)
                .mul(86400)
            )
        ]
      : []),
    /**
      Make sure the permanent funding cycle is back to being the current.
    */
    ({ local: { originalTimeMark } }) =>
      checkFn({
        contract: contracts.fundingCycles,
        fn: "getCurrentOf",
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
          weight
            .mul(discountRate1.pow(cycleLimit1))
            .div(constants.MaxPercent.pow(cycleLimit1))
            .mul(discountRate1)
            .div(constants.MaxPercent)
            .mul(discountRate2.pow(cycleLimit2))
            .div(constants.MaxPercent.pow(cycleLimit2)),
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
          currency1,
          fee,
          discountRate1,
          expectedTapped,
          expectedPackedMetadata1
        ]
      })
  ];
};
