/** 
  Governance can set a new fee for future configurations in the Juicer.

  All current configurations will not be affected, and will keep the old fee until a new configuration is approved.
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

  const target = randomBigNumberFn();

  const currency = randomBigNumberFn({ max: constants.MaxUint8 });
  const duration = randomBigNumberFn({
    min: BigNumber.from(1),
    max: BigNumber.from(10000)
  });
  const discountRate = randomBigNumberFn({ max: constants.MaxPercent });
  const ballot = constants.AddressZero;

  const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });
  const bondingCurveRate = randomBigNumberFn({ max: constants.MaxPercent });
  const reconfigurationBondingCurveRate = randomBigNumberFn({
    max: constants.MaxPercent
  });

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

  // Since the governance project was created before this test, the created funding cycle ID should be 2.
  const expectedFundingCycleId1 = BigNumber.from(2);

  // The second funding cycle should be one greater than the first.
  const expectedFundingCycleId2 = BigNumber.from(3);

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = BigNumber.from(2);

  // It should be the project's first budget.
  const expectedFundingCycleNumber1 = BigNumber.from(1);

  // The funding cycle after fast forwarding the first configuration should be the second.
  const expectedFundingCycleNumber2 = BigNumber.from(2);

  // The reconfigured funding cycle should be the third.
  const expectedFundingCycleNumber3 = BigNumber.from(3);

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
            target,
            currency,
            duration,
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
          ballot,
          timeMark,
          duration,
          target,
          currency,
          fee,
          discountRate,
          expectedTapped,
          expectedPackedMetadata
        ]
      });
      return { originalTimeMark: timeMark };
    },
    /**
      Set a new fee.
    */
    async () => {
      const newFee = randomBigNumberFn({ max: constants.MaxPercent });
      await executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "setFee",
        args: [contracts.juicer.address, newFee]
      });
      return { newFee };
    },
    /**
      Fast forward to the next funding cycle that uses the same configuration.
    */
    () => fastforwardFn(duration.mul(86400)),
    /**
      If there hasn't been a reconfiguration, funding cycles should still have the original fee.
    */
    async ({ local: { originalTimeMark } }) =>
      checkFn({
        contract: contracts.fundingCycles,
        fn: "getCurrentOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber2,
          expectedFundingCycleId1,
          originalTimeMark,
          weight.mul(discountRate).div(constants.MaxPercent),
          ballot,
          originalTimeMark.add(duration.mul(86400)),
          duration,
          target,
          currency,
          fee,
          discountRate,
          expectedTapped,
          expectedPackedMetadata
        ]
      }),
    /**
      Make a payment to lock in the first configuration.
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
      Reconfiguring a project after a new fee has been set should affect future funding cycles.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            target,
            currency,
            duration,
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
      }),
    /**
      The queued funding cycle should use the new fee.
    */
    async ({ local: { originalTimeMark, newFee }, timeMark }) =>
      checkFn({
        contract: contracts.fundingCycles,
        fn: "getQueuedOf",
        args: [expectedProjectId],
        expect: [
          BigNumber.from(0),
          expectedProjectId,
          expectedFundingCycleNumber3,
          expectedFundingCycleId2,
          timeMark,
          weight
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
  ];
};
