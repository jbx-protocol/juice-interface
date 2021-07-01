/** 
  A project can print premined tickets before a payment has been sent to it.
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
  randomStringFn,
  stringToBytesFn,
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

  // The currency will be 0, which corresponds to ETH.
  const currency = 0;

  const firstPreminePrintedTicketBeneficiary = addrs[0];
  const secondPreminePrintedTicketBeneficiary = addrs[1];

  // The first amount of premined tickets to print. The amount is currency denominated, based on the weight of the first funding cycle.
  const firstPreminePrintAmount = randomBigNumberFn({
    min: BigNumber.from(1),
    // So arbitrary large number thats not close to the boundary
    max: BigNumber.from(2).pow(22)
  });
  const secondPreminePrintAmount = randomBigNumberFn({
    min: BigNumber.from(1),
    // So arbitrary large number thats not close to the boundary
    max: BigNumber.from(2).pow(22)
  });

  // The ticket amount is based on the initial funding cycle's weight.
  const expectedFirstPreminedPrintedTicketAmount = firstPreminePrintAmount.mul(
    constants.InitialWeightMultiplier
  );

  const expectedSecondPreminedPrintedTicketAmount = secondPreminePrintAmount.mul(
    constants.InitialWeightMultiplier
  );

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = BigNumber.from(2);

  // The unsrtaked preference to use.
  const preferUnstakedTickets = randomBoolFn();

  return [
    /**
      Create a project.
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
          contracts.juicer.address
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
          firstPreminePrintAmount,
          currency,
          firstPreminePrintedTicketBeneficiary.address,
          randomStringFn(),
          preferUnstakedTickets
        ]
      }),
    /**
      The beneficiary should have gotten the correct amount of tickets.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [firstPreminePrintedTicketBeneficiary.address, expectedProjectId],
        expect: expectedFirstPreminedPrintedTicketAmount
      }),
    /**
      All the tickets should be staked.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [firstPreminePrintedTicketBeneficiary.address, expectedProjectId],
        expect: expectedFirstPreminedPrintedTicketAmount
      }),
    /**
      Issue the project's tickets so that the unstaked preference can be checked.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "issue",
        args: [expectedProjectId, randomStringFn(), randomStringFn()]
      }),
    /**
      Configuring a funding cycle. This shouldn't affect the ability for project to keep printing premined tickets.
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
        ]
      }),
    /**
      Print some more premined tickets to a different beneficiary.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "printPreminedTickets",
        args: [
          expectedProjectId,
          secondPreminePrintAmount,
          currency,
          secondPreminePrintedTicketBeneficiary.address,
          randomStringFn(),
          preferUnstakedTickets
        ]
      }),
    /**
      The second beneficiary should have gotten the correct amount of tickets.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [
          secondPreminePrintedTicketBeneficiary.address,
          expectedProjectId
        ],
        expect: expectedSecondPreminedPrintedTicketAmount
      }),
    /**
      Check for the correct number of staked tickets.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [
          secondPreminePrintedTicketBeneficiary.address,
          expectedProjectId
        ],
        expect: preferUnstakedTickets
          ? BigNumber.from(0)
          : expectedSecondPreminedPrintedTicketAmount
      }),
    /**
      The total supply of tickets for the project should equal the total of the premined printed amounts.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "totalSupplyOf",
        args: [expectedProjectId],
        expect: expectedFirstPreminedPrintedTicketAmount.add(
          expectedSecondPreminedPrintedTicketAmount
        )
      }),
    /**
      Make a payment to lock in the premined amount.
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
      Printing tickets is no longer allowed.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "printPreminedTickets",
        args: [
          expectedProjectId,
          randomBigNumberFn(),
          currency,
          randomAddressFn(),
          randomStringFn(),
          preferUnstakedTickets
        ],
        revert: "Juicer::printTickets: ALREADY_ACTIVE"
      })
  ];
};
