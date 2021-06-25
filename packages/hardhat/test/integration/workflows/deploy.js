module.exports = async ({
  deployer,
  addrs,
  constants,
  contracts,
  executeFn,
  checkFn,
  randomBigNumberFn,
  BigNumber,
  stringToBytesFn,
  randomStringFn
}) => {
  const owner = addrs[0];

  const target = randomBigNumberFn();

  const handle = stringToBytesFn("some-unique-handle");
  const uri = randomStringFn();
  const currency = randomBigNumberFn({ max: constants.MaxUint8 });
  const duration = randomBigNumberFn({ min: 1, max: constants.MaxUint16 });
  const discountRate = randomBigNumberFn({ max: constants.MaxPercent });
  const ballot = constants.AddressZero;

  const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });
  const bondingCurveRate = randomBigNumberFn({ max: constants.MaxPercent });
  const reconfigurationBondingCurveRate = randomBigNumberFn({
    max: constants.MaxPercent
  });

  // These can be whatever.
  const paymentMods = [];
  const ticketMods = [];

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

  // Since the governance project was created before this test, the creaed funding cycle ID should be 2.
  const expectedFundingCycleId = BigNumber.from(2);

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = BigNumber.from(2);

  // It should be the project's first budget.
  const expectedFundingCycleNumber = BigNumber.from(1);

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
          handle,
          uri,
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
          paymentMods,
          ticketMods
        ]
      }),
    /** 
      Make sure the funding cycle got saved correctly.
    */
    ({ timeMark }) =>
      checkFn({
        contract: contracts.fundingCycles,
        fn: "get",
        args: [expectedFundingCycleId],
        expect: [
          expectedFundingCycleId,
          expectedProjectId,
          expectedFundingCycleNumber,
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
      }),
    /** 
      Make sure the project's handle got saved.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId],
        expect: handle
      }),
    /** 
      Make sure the project was saved to the handle.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect: expectedProjectId
      }),
    /** 
      Make sure the project's uri got saved.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "uriOf",
        args: [expectedProjectId],
        expect: uri
      }),
    /** 
      Make sure the juicer got set as the project's current terminal.
    */
    () =>
      checkFn({
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: contracts.juicer.address
      })
  ];
};
