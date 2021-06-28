/** 
  Projects can deploy addresses that will forward funds received to the project's funding cycle.
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
  stringToBytesFn,
  randomStringFn,
  getBalanceFn,
  randomBoolFn,
  deployContractFn
}) => {
  const owner = addrs[0];

  // An account that will be used to make payments.
  const payer = addrs[1];

  // The beneficiary to give tickets to.
  const payerTicketBeneficiary = addrs[2];

  // The unstaked preference to set.
  const preferUnstakedTickets = randomBoolFn();

  // Two payments will be made. Cant pay entire balance because some is needed for gas.
  // So, arbitrarily find a number less than 1/3 so that all payments can be made successfully.
  const paymentValue = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(3)
  });

  const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });
  const expectedTicketAmount = paymentValue
    .mul(constants.InitialWeightMultiplier)
    .mul(constants.MaxPercent.sub(reservedRate))
    .div(constants.MaxPercent);

  const target = randomBigNumberFn();

  // The currency will be 0, which corresponds to ETH.
  const currency = 0;

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = BigNumber.from(2);

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
            duration: randomBigNumberFn({
              min: BigNumber.from(1),
              max: constants.MaxUint16
            }),
            cycleLimit: randomBigNumberFn({
              max: constants.MaxUint8
            }),
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
    /**
      Make sure the juicer got set as the project's current terminal.
    */
    () =>
      checkFn({
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: contracts.juicer.address
      }),
    /** 
      Deploy a direct payment address.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.terminalDirectory,
        fn: "deployAddress",
        args: [expectedProjectId, randomStringFn()]
      }),
    /** 
      Make a payment to the address.
    */
    async () => {
      const [address] = await contracts.terminalDirectory.addressesOf(
        expectedProjectId
      );
      await payer.sendTransaction({
        to: address,
        value: paymentValue
      });
    },
    /**
      There should now be a balance in the terminal.
    */
    () =>
      checkFn({
        contract: contracts.juicer,
        fn: "balanceOf",
        args: [expectedProjectId],
        expect: paymentValue
      }),
    /**
      The payer should have gotten tickets.
    */
    () =>
      checkFn({
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [payer.address, expectedProjectId],
        expect: expectedTicketAmount
      }),
    /** 
      Set a beneficiary address and staked ticket preference.
    */
    () =>
      executeFn({
        caller: payer,
        contract: contracts.terminalDirectory,
        fn: "setPayerPreferences",
        args: [payerTicketBeneficiary.address, preferUnstakedTickets]
      }),
    /**
      Issue tickets.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "issue",
        args: [expectedProjectId, randomStringFn(), randomStringFn()]
      }),
    /** 
      Deploy another direct payment address.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.terminalDirectory,
        fn: "deployAddress",
        args: [expectedProjectId, randomStringFn()]
      }),
    /** 
      Make another payment to the address.

      All addresses should work.
    */
    async () => {
      const [, secondAddress] = await contracts.terminalDirectory.addressesOf(
        expectedProjectId
      );
      await payer.sendTransaction({
        to: secondAddress,
        value: paymentValue
      });
    },
    /**
      There should now be a double the payment value balance in the terminal.
    */
    () =>
      checkFn({
        contract: contracts.juicer,
        fn: "balanceOf",
        args: [expectedProjectId],
        expect: paymentValue.mul(2)
      }),
    /**
      The beneficiary should have gotten tickets.
    */
    () =>
      checkFn({
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [payerTicketBeneficiary.address, expectedProjectId],
        expect: expectedTicketAmount
      }),
    /**
      If there was a preference for unstaked tickets, the tickets should be unstaked.
    */
    () =>
      checkFn({
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [payerTicketBeneficiary.address, expectedProjectId],
        expect: preferUnstakedTickets ? 0 : expectedTicketAmount
      }),
    /**
      Allow a migration to the new terminal.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "allowMigration",
        args: [contracts.juicer.address, secondJuicer.address]
      }),
    /**
      Migrate to the new terminal.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "migrate",
        args: [expectedProjectId, secondJuicer.address]
      }),
    /**
      Make another payment to the address. It should now have been routed to the new terminal.
    */
    async () => {
      const [address] = await contracts.terminalDirectory.addressesOf(
        expectedProjectId
      );
      await payer.sendTransaction({
        to: address,
        value: paymentValue
      });
    },
    /**
      There should now be a trip the payment value balance in the new terminal.
    */
    () =>
      checkFn({
        contract: secondJuicer,
        fn: "balanceOf",
        args: [expectedProjectId],
        expect: paymentValue.mul(3)
      }),
    /**
      The beneficiary should have gotten tickets.
    */
    () =>
      checkFn({
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [payerTicketBeneficiary.address, expectedProjectId],
        expect: expectedTicketAmount.mul(2)
      })
  ];
};
