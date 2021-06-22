const { utils } = require("ethers");

module.exports = async ({
  deployer,
  addrs,
  constants,
  contracts,
  executeFn,
  checkFn,
  deployContractFn,
  randomBigNumberFn,
  randomAddressFn,
  getBalanceFn
}) => {
  // The owner of the project that will migrate.
  const owner = addrs[0];

  // An account that will be used to make payments.
  const payer = addrs[1];

  // Cant pay entire balance because some is needed for gas.
  const paymentValue = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(2)
  });

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
      Deploy a project for the owner. Expect the project's ID to be 2.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "deploy",
        args: [
          owner.address,
          utils.formatBytes32String("some-handle"),
          "",
          {
            target: randomBigNumberFn(),
            currency: randomBigNumberFn({ max: constants.MaxUint8 }),
            duration: randomBigNumberFn({ max: constants.MaxUint24 }),
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
      Check that the terminal got set.
    */
    () =>
      checkFn({
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [2],
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
        args: [2, randomAddressFn(), "", false],
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
      Migrating to a new juicer shouldn't work because it hasn't been allowed yet.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "migrate",
        args: [2, secondJuicer.address],
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
        args: [2, secondJuicer.address],
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
        args: [2, secondJuicer.address]
      }),
    /**
      There should no longer be a balance in the old juicer.
    */
    () =>
      checkFn({
        contract: deployer.provider,
        fn: "getBalance",
        args: [contracts.juicer.address],
        expect: 0
      }),
    /**
      The balance should be entirely in the new Juicer.
    */
    () =>
      checkFn({
        contract: deployer.provider,
        fn: "getBalance",
        args: [secondJuicer.address],
        expect: paymentValue
      }),
    /**
      The terminal should have been updated to the new juicer in the directory.
    */
    () =>
      checkFn({
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [2],
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
        args: [2, randomAddressFn(), "", false],
        value: paymentValue,
        revert: "TerminalUtility: UNAUTHORIZED"
      }),
    /**
      Payments to the new Juicer should be accepted.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: secondJuicer,
        fn: "pay",
        args: [2, randomAddressFn(), "", false],
        value: paymentValue
      })
  ];
};
