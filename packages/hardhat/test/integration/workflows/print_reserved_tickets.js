/**
 Projects that have configured a reserve rate will be reserved tickets each time 
 a payment is made to it.

 These reserved tickets can be printed at any time.

 Any configured ticket mods will get sent some of the printing reserved tickets at this time.
*/
module.exports = async ({
  deployer,
  addrs,
  constants,
  contracts,
  BigNumber,
  executeFn,
  checkFn,
  getBalanceFn,
  randomBigNumberFn,
  stringToBytesFn,
  randomAddressFn,
  randomBoolFn,
  randomStringFn
}) => {
  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = 2;

  // The owner of the project that will migrate.
  const owner = addrs[0];

  // An account that will be used to make payments.
  const payer = addrs[1];

  // An account that will be distributed tickets in the preconfig payment.
  const preconfigTicketBeneficiary = addrs[2];

  // An account that will be distributed tickets in the first payment.
  const ticketBeneficiary1 = addrs[3];

  // An account that will be distributed tickets in the second payment.
  const ticketBeneficiary2 = addrs[4];

  // An account that will be distributed tickets in mod1.
  const mod1Beneficiary = addrs[5];

  // An account that will be distributed tickets in mod2.
  const mod2Beneficiary = addrs[6];

  // Three payments will be made. Cant pay entire balance because some is needed for gas.
  // So, arbitrarily find a number less than 1/4 so that all payments can be made successfully.
  const paymentValue1 = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(4)
  });
  const paymentValue2 = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(4)
  });
  const paymentValue3 = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(4)
  });

  // The project's funding cycle target will at most be a fourth of the payment value. Leaving plenty of overflow.
  const target = randomBigNumberFn({
    max: paymentValue2.add(paymentValue3).div(4)
  });

  // The mod percents should add up to <= constants.MaxPercent.
  const percent1 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxPercent.sub(2)
  });
  const percent2 = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxPercent.sub(percent1).sub(1)
  });

  // The preference for unstaked tickets.
  const preferUnstaked = randomBoolFn();

  // Add two ticket mods.
  const mod1 = {
    preferUnstaked,
    percent: percent1.toNumber(),
    lockedUntil: 0,
    beneficiary: mod1Beneficiary.address
  };
  const mod2 = {
    preferUnstaked,
    percent: percent2.toNumber(),
    lockedUntil: 0,
    beneficiary: mod2Beneficiary.address
  };

  // The currency will be 0, which corresponds to ETH.
  const currency = 0;

  // Set a random percentage of tickets to reserve for the project owner.
  const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });

  // The expected number of tickets to expect from the
  const expectedReservedTicketAmount1 = paymentValue1.mul(
    constants.InitialWeightMultiplier
  );

  // The expected number of reserved tickets to expect from the first payment.
  const expectedReservedTicketAmount2 = paymentValue2
    .mul(constants.InitialWeightMultiplier)
    .mul(reservedRate)
    .div(constants.MaxPercent);

  // The expected number of reserved tickets to expect from the second payment.
  const expectedReservedTicketAmount3 = paymentValue3
    .mul(constants.InitialWeightMultiplier)
    .mul(reservedRate)
    .div(constants.MaxPercent);

  return [
    /** 
      Create a project.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.projects,
        fn: "create",
        args: [
          owner.address,
          stringToBytesFn("some-unique-handle"),
          randomStringFn()
        ]
      }),
    /**
      Make a payment to the project. This shouldn't create any reserved tickets since a configuration hasn't yet been made for the project.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "pay",
        args: [
          expectedProjectId,
          preconfigTicketBeneficiary.address,
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue1
      }),
    /**
      A payment made towards a project before its been configured shouldn't have an effect
      on reserved tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "reservedTicketAmountOf",
        args: [expectedProjectId, reservedRate],
        expect: 0
      }),
    /**
      The preconfig payer should have tickets with expected a reserve rate of 0.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [preconfigTicketBeneficiary.address, expectedProjectId],
        expect: expectedReservedTicketAmount1
      }),
    /**
      Configure the projects funding cycle.
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
            duration: randomBigNumberFn({
              min: BigNumber.from(1),
              max: constants.MaxUint16
            }),
            discountRate: randomBigNumberFn({ max: constants.MaxPercent }),
            ballot: constants.AddressZero
          },
          {
            reservedRate,
            bondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            }),
            reconfigurationBondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            })
          },
          [],
          [mod1, mod2]
        ]
      }),
    /**
      The owner should not have any tickets initially.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [owner.address, expectedProjectId],
        expect: 0
      }),
    /**
      Printing reserved before anything has been done shouldn't do anything.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "printReservedTickets",
        args: [expectedProjectId]
      }),
    /**
      The owner should still not have any tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [owner.address, expectedProjectId],
        expect: 0
      }),
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
          ticketBeneficiary1.address,
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue2
      }),
    /**
      The owner should still not have any tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [owner.address, expectedProjectId],
        expect: 0
      }),
    /**
      The owner should now have printable reserved tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "reservedTicketAmountOf",
        args: [expectedProjectId, reservedRate],
        expect: expectedReservedTicketAmount2,
        // Allow the last two significant digit to fluctuate due to division precision errors.
        plusMinus: 100
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
      Print the reserved tickets.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "printReservedTickets",
        args: [expectedProjectId]
      }),
    /**
      The owner should now have the correct amount of tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [owner.address, expectedProjectId],
        expect: expectedReservedTicketAmount2
          .mul(constants.MaxPercent.sub(percent1).sub(percent2))
          .div(constants.MaxPercent),
        // Allow the last two significant digit to fluctuate due to division precision errors.
        plusMinus: 100
      }),
    /**
      The beneficiary of mod1 should now have the correct amount of tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [mod1Beneficiary.address, expectedProjectId],
        expect: expectedReservedTicketAmount2
          .mul(percent1)
          .div(constants.MaxPercent),
        // Allow the last two significant digit to fluctuate due to division precision errors.
        plusMinus: 100
      }),
    /**
      Check for the correct number of staked tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [mod1Beneficiary.address, expectedProjectId],
        expect: preferUnstaked
          ? BigNumber.from(0)
          : expectedReservedTicketAmount2
              .mul(percent1)
              .div(constants.MaxPercent),
        // Allow the last two significant digit to fluctuate due to division precision errors.
        plusMinus: 100
      }),
    /**
      The beneficiary of mod2 should now have the correct amount of tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [mod2Beneficiary.address, expectedProjectId],
        expect: expectedReservedTicketAmount2
          .mul(percent2)
          .div(constants.MaxPercent),
        // Allow the last two significant digit to fluctuate due to division precision errors.
        plusMinus: 100
      }),
    /**
      Check for the correct number of staked tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [mod2Beneficiary.address, expectedProjectId],
        expect: preferUnstaked
          ? BigNumber.from(0)
          : expectedReservedTicketAmount2
              .mul(percent2)
              .div(constants.MaxPercent),
        // Allow the last two significant digit to fluctuate due to division precision errors.
        plusMinus: 100
      }),
    /**
      There should no longer be reserved tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "reservedTicketAmountOf",
        args: [expectedProjectId, reservedRate],
        expect: 0
      }),
    /**
      Make another payment to the project.
    */
    () =>
      executeFn({
        caller: payer,
        contract: contracts.juicer,
        fn: "pay",
        args: [
          expectedProjectId,
          ticketBeneficiary2.address,
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue3
      }),
    /**
      The owner should now have printable reserved tickets again.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "reservedTicketAmountOf",
        args: [expectedProjectId, reservedRate],
        expect: expectedReservedTicketAmount3,
        // Allow the last two significant digit to fluctuate due to division precision errors.
        plusMinus: 100
      }),
    /**
      Redeem tickets from the beneficiary of the first payment.
    */
    async () =>
      executeFn({
        caller: ticketBeneficiary1,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem all available tickets.
        args: [
          ticketBeneficiary1.address,
          expectedProjectId,
          // Redeem all tickets.
          await contracts.ticketBooth.balanceOf(
            ticketBeneficiary1.address,
            expectedProjectId
          ),
          0,
          randomAddressFn(),
          randomBoolFn()
        ]
      }),
    /**
      The owner should still have the same number of printable reserved tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "reservedTicketAmountOf",
        args: [expectedProjectId, reservedRate],
        expect: expectedReservedTicketAmount3,
        // Allow the last two significant digit to fluctuate due to division precision errors.
        plusMinus: 100
      }),
    /**
      Redeem tickets from the beneficiary of the second payment.
    */
    async () =>
      executeFn({
        caller: ticketBeneficiary2,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem all available tickets.
        args: [
          ticketBeneficiary2.address,
          expectedProjectId,
          // Redeem all tickets.
          await contracts.ticketBooth.balanceOf(
            ticketBeneficiary2.address,
            expectedProjectId
          ),
          0,
          randomAddressFn(),
          randomBoolFn()
        ]
      }),
    /**
      The owner should still have the same number of printable reserved tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "reservedTicketAmountOf",
        args: [expectedProjectId, reservedRate],
        expect: expectedReservedTicketAmount3,
        // Allow the last two significant digit to fluctuate due to division precision errors.
        plusMinus: 100
      }),
    /**
      Print the reserved tickets.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "printReservedTickets",
        args: [expectedProjectId]
      }),
    /**
      There should no longer be reserved tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "reservedTicketAmountOf",
        args: [expectedProjectId, reservedRate],
        expect: 0
      })
  ];
};
