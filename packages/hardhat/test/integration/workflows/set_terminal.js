/** 
  A project can be created without specifying a payment terminal. 
  The project will have to set a terminal before it can print tickets or configure its funding cycles.
*/
module.exports = async ({
  addrs,
  constants,
  contracts,
  executeFn,
  randomBigNumberFn,
  BigNumber,
  getBalanceFn,
  randomStringFn,
  stringToBytesFn,
  randomAddressFn,
  randomBoolFn,
  checkFn
}) => {
  // The owner of the project that will reconfigure.
  const owner = addrs[0];

  // An account that will be used to make payments.
  const payer = addrs[1];

  // Use the 0 currency so no price feed is needed.
  const currency = 0;

  // One payments will be made. Cant pay entire balance because some is needed for gas.
  // So, arbitrarily find a number less than a half so that all payments can be made successfully.
  const paymentValue = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(2)
  });

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = BigNumber.from(2);

  return [
    /**
      Create a project with no payment terminal.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "create",
        args: [
          owner.address,
          stringToBytesFn("some-unique-handle"),
          randomStringFn(),
          constants.AddressZero
        ]
      }),
    /**
      Make sure the terminal was not set in the directory.
    */
    () =>
      checkFn({
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: constants.AddressZero
      }),
    /**
      Shouldn't be able to print premined tickets.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "printPreminedTickets",
        args: [
          expectedProjectId,
          // some big number not close to the limit.
          randomBigNumberFn({ max: BigNumber.from(10).pow(30) }),
          currency,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ],
        revert: "TerminalUtility: UNAUTHORIZED"
      }),
    /**
      Shouldn't be able to configure.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
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
            reservedRate: randomBigNumberFn({ max: constants.MaxPercent }),
            bondingCurveRate: randomBigNumberFn({ max: constants.MaxPercent }),
            reconfigurationBondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            })
          },
          [],
          []
        ],
        revert: "TerminalUtility: UNAUTHORIZED"
      }),
    /**
      Shouldn't be able to pay.
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
        value: paymentValue,
        revert: "TerminalUtility: UNAUTHORIZED"
      }),
    /**
      Set a payment terminal.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.terminalDirectory,
        fn: "setTerminal",
        args: [expectedProjectId, contracts.juicer.address]
      }),
    /**
      Should now be able to print premined tickets.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "printPreminedTickets",
        args: [
          expectedProjectId,
          // some big number not close to the limit.
          randomBigNumberFn({ max: BigNumber.from(10).pow(30) }),
          currency,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ]
      }),
    /**
      Should now be able to configure.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            target: randomBigNumberFn(),
            currency,
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
            reservedRate: randomBigNumberFn({ max: constants.MaxPercent }),
            bondingCurveRate: randomBigNumberFn({ max: constants.MaxPercent }),
            reconfigurationBondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            })
          },
          [],
          []
        ]
      }),
    /**
      Should now be able to pay.
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
      })
  ];
};
