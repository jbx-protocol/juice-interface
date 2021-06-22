/** 
  Projects that are relying on a terminal to receive payments and manage their funds 
  can migrate to new terminals, according to the following rules:

   - Governance must first allow migration to the new terminal.
   - The old terminal can no longer receive funds or print tickets.
   - All funds will migrate to the new terminal for users to tap and redeem tickets on.
*/
module.exports = async ({
  deployer,
  addrs,
  constants,
  contracts,
  executeFn,
  checkFn,
  deployContractFn,
  randomBigNumberFn,
  stringToBytesFn,
  normalizedPercentFn,
  getBalanceFn,
  percentageFn,
  verifyBalanceFn,
  changeInBalanceFn,
  randomAddressFn
}) => {
  // The owner of the project that will migrate.
  const owner = addrs[0];

  // An account that will be used to make payments.
  const payer = addrs[1];

  // An account that will be distributed tickets in the first terminal, that will redeem in the second terminal.
  const ticketBeneficiary = addrs[2];

  // An address that will be the beneficiary of funds when redeeming tickets.
  const redeemBeneficiary = addrs[3];

  // Cant pay entire balance because some is needed for gas.
  const paymentValue = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(2)
  });

  // The project's funding cycle target will be half of the payment value.
  const target = paymentValue.div(2);

  // The currency will be 0, which corresponds to ETH.
  const currency = 0;

  // Set a percentage of tickets to reserve for the project owner.
  const reservedRate = 10;

  // The amount of tickets that are expected to be printed in exchange of a payment of `paymentValue`
  // that are not be reserved.
  const expectedBeneficiaryTicketAmount = percentageFn({
    value: paymentValue.mul(constants.InitialWeightMultiplier),
    percent: 100 - reservedRate
  });

  // The percent, out of `constants.MaxPercent`, that will be charged as a fee.
  const fee = await contracts.juicer.fee();

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = 2;

  // The juicer that will be migrated to.
  const secondJuicer = await deployContractFn("Juicer", [
    contracts.projects.address,
    contracts.fundingCycles.address,
    contracts.ticketBooth.address,
    contracts.operatorStore.address,
    contracts.modStore.address,
    contracts.prices.address,
    contracts.terminalDirectory.address,
    contracts.governance.address
  ]);

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
      Check that the terminal got set.
    */
    () =>
      checkFn({
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: contracts.juicer.address
      }),
    /**
      Make a payment to the project.
    */
    async () =>
      executeFn({
        caller: payer,
        contract: contracts.juicer,
        fn: "pay",
        args: [expectedProjectId, ticketBeneficiary.address, "", false],
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
        expect: paymentValue
      }),
    /**
      Make sure tickets can be redeemed successfully in this Juicer.
    */
    async () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem half as many tickets as are available. The rest will be redeemed later.
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          expectedBeneficiaryTicketAmount.div(2),
          0, // must be lower than the expected amount of ETH that is being claimed.
          redeemBeneficiary.address,
          false // doesnt matter
        ]
      }),
    /**
      Make sure funds can be tapped successfully in this Juicer.
    */
    async () =>
      executeFn({
        caller: payer,
        contract: contracts.juicer,
        fn: "tap",
        // Tap half as much as is available. The rest will be tapped later.
        args: [expectedProjectId, target.div(2), currency, target.div(2)]
      }),
    /**
      Migrating to a new juicer shouldn't work because it hasn't been allowed yet.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "migrate",
        args: [expectedProjectId, secondJuicer.address],
        revert: "Juicer::migrate: NOT_ALLOWED"
      }),
    /**
      Allow a migration to the new juicer.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "allowMigration",
        args: [contracts.juicer.address, secondJuicer.address]
      }),
    /**
      Migrating to the new juicer called by a different address shouldn't be allowed.
    */
    () =>
      executeFn({
        caller: addrs[2],
        contract: contracts.juicer,
        fn: "migrate",
        args: [expectedProjectId, secondJuicer.address],
        revert: "Operatable: UNAUTHORIZED"
      }),
    /**
      Migrate to the new juicer.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "migrate",
        args: [expectedProjectId, secondJuicer.address]
      }),
    /**
      The only balance that should be left in the old juicer is the admin fee
      incurred while tapping.
    */
    () =>
      verifyBalanceFn({
        address: contracts.juicer.address,
        // Take the fee from the amount that was tapped.
        expect: target
          .div(2)
          .mul(constants.MaxPercent)
          .div(constants.MaxPercent.add(fee))
      }),
    /**
      The rest of the balance should be entirely in the new Juicer.
    */
    async () =>
      checkFn({
        contract: deployer.provider,
        fn: "getBalance",
        args: [secondJuicer.address],
        // The balance should be the amount paid minute the amount tapped and the amount claimed from redeeming tickets.
        expect: paymentValue
          .sub(target.div(2))
          .sub(await changeInBalanceFn(redeemBeneficiary.address))
      }),
    /**
      The terminal should have been updated to the new juicer in the directory.
    */
    () =>
      checkFn({
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: secondJuicer.address
      }),
    /**
      Payments to the old Juicer should no longer be accepter.
    */
    () =>
      executeFn({
        caller: payer,
        contract: contracts.juicer,
        fn: "pay",
        args: [expectedProjectId, randomAddressFn(), "", false],
        value: paymentValue,
        revert: "TerminalUtility: UNAUTHORIZED"
      }),
    /**
      Make sure tickets can be redeemed successfully in the new Juicer.
    */
    async () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: secondJuicer,
        fn: "redeem",
        // Redeem half as many tickets as are available. The rest will be redeemed later.
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          expectedBeneficiaryTicketAmount.div(2),
          0, // must be lower than the expected amount of ETH that is being claimed.
          randomAddressFn(),
          false // doesnt matter
        ]
      }),
    /**
      Make sure funds can be tapped successfully in the new Juicer.
    */
    async () =>
      executeFn({
        caller: payer,
        contract: secondJuicer,
        fn: "tap",
        // Tap half as much as is available. The rest will be tapped later.
        args: [expectedProjectId, target.div(2), currency, target.div(2)]
      }),
    /**
      Payments to the new Juicer should be accepted.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: secondJuicer,
        fn: "pay",
        args: [expectedProjectId, randomAddressFn(), "", false],
        value: paymentValue
      })
  ];
};
