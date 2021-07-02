/** 
  Funding cycles can use currencies other than ETH that Governance has added price feeds for.

  Funds are always paid in ETH, but a funding cycle target can be denominated in another currencency.
  This means that the the amount of ETH that a project can withdraw will change over time as the price
  of ETH changes compared to their funding cycle's denominated currency.

  This test makes sure the conversion rates are honored.
*/
module.exports = async ({
  deployer,
  addrs,
  constants,
  contracts,
  executeFn,
  checkFn,
  BigNumber,
  deployContractFn,
  randomBigNumberFn,
  stringToBytesFn,
  getBalanceFn,
  verifyBalanceFn,
  randomBoolFn,
  randomStringFn
}) => {
  // The owner of the project with mods.
  const owner = addrs[0];

  // An account that will be used to make a payment.
  const payer = addrs[1];

  // An account that will receive tickets for the premine.
  const premineTicketBeneficiary = addrs[2];

  // An account that will receive tickets for the payment.
  const paymentTicketBeneficiary = addrs[3];

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedIdOfProject = 2;

  // The reserve rate to configure.
  const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });

  // An example price feed.
  const priceFeed = await deployContractFn("ExampleETHUSDPriceFeed");
  const [, rate] = await priceFeed.latestRoundData();

  // The currency number that will store the price feed. Can't be 0, which is reserve for ETH.
  const currency = randomBigNumberFn({
    min: BigNumber.from(1),
    max: constants.MaxUint8
  });

  // The amount of decimals the price should be adjusted for.
  const decimals = await priceFeed.decimals();

  // One payment will be made.
  // Cant pay entire balance because some is needed for gas.
  const paymentValueInWei = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(2)
  });

  // The target must be at most the payment value.
  const targetDenominatedInWei = randomBigNumberFn({
    min: BigNumber.from(1),
    max: paymentValueInWei
  });

  const targetDenominatedInCurrency = targetDenominatedInWei.mul(
    rate.div(BigNumber.from(10).pow(decimals))
  );

  // Tap a portion of the target.
  const amountToTapInWei = targetDenominatedInWei.sub(
    randomBigNumberFn({ min: BigNumber.from(1), max: targetDenominatedInWei })
  );

  // An amount up to the amount paid can be tapped.
  const amountToTapInCurrency = amountToTapInWei.mul(
    rate.div(BigNumber.from(10).pow(decimals))
  );

  // The amount tapped takes into account any fees paid.
  const expectedTappedAmountInWei = amountToTapInWei
    .mul(constants.MaxPercent)
    .div((await contracts.juicer.fee()).add(constants.MaxPercent));

  // The expected number of tickets to receive during the payment.
  const expectedPaymentTickets = paymentValueInWei
    .mul(constants.MaxPercent.sub(reservedRate))
    .div(constants.MaxPercent)
    .mul(constants.InitialWeightMultiplier);

  const premineValueInWei = randomBigNumberFn({
    // Some big number that isn't close to the limit.
    max: BigNumber.from(10).pow(22)
  });

  // Convert the premine value to the currency.
  const premineValueInCurrency = premineValueInWei.mul(
    rate.div(BigNumber.from(10).pow(decimals))
  );

  // The expected number of tickets to receive during the premine.
  const expectedPremineTickets = premineValueInWei.mul(
    constants.InitialWeightMultiplier
  );

  return [
    /** 
      Add the price feed to the prices contract.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "addPriceFeed",
        args: [contracts.prices.address, priceFeed.address, currency]
      }),
    /**
      Deploy first project with a payment mod.
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
            target: targetDenominatedInCurrency,
            currency,
            duration: randomBigNumberFn({
              min: BigNumber.from(1),
              max: constants.MaxUint16
            }),
            cycleLimit: randomBigNumberFn({ max: constants.MaxCycleLimit }),
            discountRate: randomBigNumberFn({ max: constants.MaxPercent }),
            ballot: constants.AddressZero
          },
          {
            reservedRate,
            bondingCurveRate: randomBigNumberFn({ max: constants.MaxPercent }),
            reconfigurationBondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            })
          },
          [],
          []
        ]
      }),
    /*
      Print premined tickets. The argument is denominated in `currency`.
      */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "printPreminedTickets",
        args: [
          expectedIdOfProject,
          premineValueInCurrency,
          currency,
          premineTicketBeneficiary.address,
          randomStringFn(),
          randomBoolFn()
        ]
      }),
    /**
      Check that the beneficiary of the premine got the correct amount of tickets.
      */
    () =>
      checkFn({
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [premineTicketBeneficiary.address, expectedIdOfProject],
        expect: expectedPremineTickets
      }),
    /*
        Make a payment to the project.
        This is denominated in `currency`.
      */
    () =>
      executeFn({
        caller: payer,
        contract: contracts.juicer,
        fn: "pay",
        args: [
          expectedIdOfProject,
          paymentTicketBeneficiary.address,
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValueInWei
      }),
    /**
      Check that the beneficiary of the payment got the correct amount of tickets.
      */
    () =>
      checkFn({
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [paymentTicketBeneficiary.address, expectedIdOfProject],
        expect: expectedPaymentTickets,
        // Allow the last two significant digit to fluctuate due to division precision errors.
        plusMinus: 100
      }),
    /**
      Check that the overflow amount is being converted correctly.
      */
    () =>
      checkFn({
        contract: contracts.juicer,
        fn: "currentOverflowOf",
        args: [expectedIdOfProject],
        expect: paymentValueInWei.sub(targetDenominatedInWei)
      }),
    /*
        Tap the full amount from the project.
      */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "tap",
        args: [
          expectedIdOfProject,
          amountToTapInCurrency,
          currency,
          amountToTapInWei
        ]
      }),
    /**
      The tapped funds should be in the owners balance.
      */
    () =>
      verifyBalanceFn({
        address: owner.address,
        expect: expectedTappedAmountInWei
      }),
    /**
      Check that the overflow amount is still being converted correctly after tapping.
      */
    () =>
      checkFn({
        contract: contracts.juicer,
        fn: "currentOverflowOf",
        args: [expectedIdOfProject],
        expect: paymentValueInWei.sub(targetDenominatedInWei)
      })
  ];
};
