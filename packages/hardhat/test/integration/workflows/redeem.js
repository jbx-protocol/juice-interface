/** 
  Ticket holders of a project should be able to redeem their tickets for a portion of the
  project's overflow propertional to a bonding curve formula.

  The bonding curve rate that tunes the bonding curve formula gets configured by the project.
*/
module.exports = async ({
  deployer,
  addrs,
  constants,
  contracts,
  executeFn,
  checkFn,
  BigNumber,
  randomBigNumberFn,
  stringToBytesFn,
  normalizedPercentFn,
  getBalanceFn,
  percentageFn,
  verifyBalanceFn,
  randomBoolFn,
  randomStringFn
}) => {
  // The owner of the project that will migrate.
  const owner = addrs[0];

  // An account that will be used to make payments.
  const payer = addrs[1];

  // An account that will be distributed tickets in the first payment.
  const ticketBeneficiary1 = addrs[2];

  // An account that will be distributed tickets in the second payment.
  const ticketBeneficiary2 = addrs[2];

  // An account that will be distributed tickets in the third payment.
  const ticketBeneficiary3 = addrs[3];

  // An address that will be the beneficiary of funds when redeeming the first set of tickets.
  const redeemBeneficiary1 = addrs[4];

  // An address that will be the beneficiary of funds when redeeming the second set of tickets.
  const redeemBeneficiary2 = addrs[5];

  // An address that will be the beneficiary of funds when redeeming the third set of tickets.
  const redeemBeneficiary3 = addrs[6];

  // An address that will be the beneficiary of funds when redeeming the reserved set of tickets.
  const redeemBeneficiary4 = addrs[7];

  // Three payments will be made. Cant pay entire balance because some is needed for gas.
  // 7 is arbitrary here, but it avoids off-by-one errors throughout the execution of the test.
  // For example, replacing 7 with 9 works also, but 8 does not.
  const paymentValue = (await getBalanceFn(payer.address)).div(7);

  // The project's funding cycle target will be a third of the payment value.
  const target = paymentValue.div(4);

  // The currency will be 0, which corresponds to ETH.
  const currency = 0;

  // Set a percentage of tickets to reserve for the project owner.
  const reservedRate = 40; // out of 100

  // Set a bonding curve of 70%.
  const bondingCurveRate = 70; // out of 100

  // The amount of tickets to expect in exchange of a payment of `paymentValue`.
  const expectedTicketAmount = paymentValue.mul(
    constants.InitialWeightMultiplier
  );

  // The amount of tickets that are expected to be reserved for the project owner during each payment.
  const expectedReservedTicketAmount = percentageFn({
    value: expectedTicketAmount,
    percent: reservedRate
  });

  // The amount of tickets that are expected to not be reserved.
  const expectedBeneficiaryTicketAmount = expectedTicketAmount.sub(
    expectedReservedTicketAmount
  );

  // The amount of tickets that can be redeemed at any time obides by a bonding curve.
  // The bonding curve formula is:
  // https://www.desmos.com/calculator/sp9ru6zbpk
  // where x is _count, o is _currentOverflow, s is _totalSupply, and r is _bondingCurveRate.

  // Three payments will be made.
  let overflow = paymentValue.mul(3).sub(target);

  // The first beneficiary got 20% of the tickets, which should be redeemable for 15.2% of the overflow.
  const expectedBeneficiary1RedeemAmount = overflow.mul(152).div(1000);

  overflow = overflow.sub(expectedBeneficiary1RedeemAmount);

  // The second beneficiary also got 20% of the original tickets.
  // After the first beneficiary redeems, these will equal 25% of the remaining tickets.
  // which are now should be redeemable for 19.375% of the remaining overflow.
  const expectedBeneficiary2RedeemAmount = overflow.mul(19375).div(100000);

  overflow = overflow.sub(expectedBeneficiary2RedeemAmount);

  // The third beneficiary also got 20% of the original tickets.
  // After the first two beneficiaries redeem, these will equal 33.3333% of the remaining tickets.
  // which are now should be redeemable for 26.664% of the remaining overflow.
  const remainingTicketAmount = expectedTicketAmount
    .mul(3)
    .sub(expectedBeneficiaryTicketAmount.mul(2));

  // Use the bonding curve formula to precisely derive the expected amount for the third redeem.
  const expectedBeneficiary3RedeemAmount = overflow
    .mul(expectedBeneficiaryTicketAmount)
    .div(remainingTicketAmount)
    .mul(
      BigNumber.from(bondingCurveRate).add(
        expectedBeneficiaryTicketAmount
          .mul(BigNumber.from(100).sub(bondingCurveRate))
          .div(remainingTicketAmount)
      )
    )
    .div(100);

  overflow = overflow.sub(expectedBeneficiary3RedeemAmount);

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = 2;

  return [
    /** 
      Deploy a project for the owner.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "deploy",
        args: [
          owner.address,
          stringToBytesFn("some-unique-handle"),
          "",
          {
            target,
            currency,
            duration: randomBigNumberFn({ min: 1, max: constants.MaxUint24 }),
            discountRate: randomBigNumberFn({ max: constants.MaxPercent }),
            ballot: constants.AddressZero
          },
          {
            reservedRate: normalizedPercentFn(reservedRate),
            bondingCurveRate: normalizedPercentFn(bondingCurveRate),
            reconfigurationBondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            })
          },
          [],
          []
        ]
      }),
    /**
      Make a payment to the project.
    */
    async () =>
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
        value: paymentValue
      }),
    /**
      Make another payment to the project, sending tickets to a different beneficiary.
    */
    async () =>
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
        value: paymentValue
      }),
    /**
      Make a third payment to the project, sending tickets to a different beneficiary.
    */
    async () =>
      executeFn({
        caller: payer,
        contract: contracts.juicer,
        fn: "pay",
        args: [
          expectedProjectId,
          ticketBeneficiary3.address,
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue
      }),
    /**
      The project's balance should match the payment just made.
    */
    () =>
      checkFn({
        contract: deployer.provider,
        fn: "getBalance",
        args: [contracts.juicer.address],
        expect: paymentValue.mul(3)
      }),
    /**
      Make sure the first ticket beneficiary tickets can be redeemed successfully.
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
          expectedBeneficiaryTicketAmount,
          expectedBeneficiary1RedeemAmount,
          redeemBeneficiary1.address,
          randomBoolFn()
        ]
      }),
    /**
      Make sure the redeem beneficiary received the correct amount of funds.
    */
    () =>
      verifyBalanceFn({
        address: redeemBeneficiary1.address,
        expect: expectedBeneficiary1RedeemAmount
      }),
    /**
      Make sure the second ticket beneficiary tickets can be redeemed successfully.
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
          expectedBeneficiaryTicketAmount,
          expectedBeneficiary2RedeemAmount,
          redeemBeneficiary2.address,
          randomBoolFn()
        ]
      }),
    /**
      Make sure the redeem beneficiary received the correct amount of funds.
    */
    () =>
      verifyBalanceFn({
        address: redeemBeneficiary2.address,
        expect: expectedBeneficiary2RedeemAmount
      }),
    /**
      Make sure the third ticket beneficiary tickets can be redeemed successfully.
    */
    async () =>
      executeFn({
        caller: ticketBeneficiary3,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem all available tickets.
        args: [
          ticketBeneficiary3.address,
          expectedProjectId,
          expectedBeneficiaryTicketAmount,
          expectedBeneficiary3RedeemAmount,
          redeemBeneficiary3.address,
          randomBoolFn()
        ]
      }),
    /**
      Make sure the redeem beneficiary received the correct amount of funds.
    */
    () =>
      verifyBalanceFn({
        address: redeemBeneficiary3.address,
        expect: expectedBeneficiary3RedeemAmount
      }),
    /**
      Print the reserved tickets for the owner of the project.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "printReservedTickets",
        args: [expectedProjectId]
      }),
    /**
      Make sure the owner can redeem successfully.
    */
    async () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem all available tickets. Expect the rest of the overflow to be claimed.
        args: [
          owner.address,
          expectedProjectId,
          expectedReservedTicketAmount.mul(3),
          overflow,
          redeemBeneficiary4.address,
          randomBoolFn()
        ]
      }),
    /**
      Make sure the beneficiary received the correct amount of funds.
    */
    () =>
      verifyBalanceFn({
        address: redeemBeneficiary4.address,
        expect: overflow
      }),
    /**
      The contract should just have the target funds in it left.
    */
    () =>
      verifyBalanceFn({
        address: contracts.juicer.address,
        expect: target
      })
  ];
};
