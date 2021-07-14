/** 
  Projects can deploy addresses that will forward funds received to the project's funding cycle.
*/

// The currency will be 0, which corresponds to ETH, preventing the need for currency price conversion.
const currency = 0;

module.exports = [
  {
    description: "Deploy a project",
    fn: async ({
      constants,
      contracts,
      executeFn,
      randomBigNumberFn,
      BigNumber,
      randomBytesFn,
      randomStringFn,
      randomSignerFn,
      incrementFundingCycleIdFn,
      incrementProjectIdFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();

      // Burn the unused funding cycle ID id.
      incrementFundingCycleIdFn();

      const owner = randomSignerFn();

      // Make the test case cleaner with a reserved rate of 0.
      const reservedRate = BigNumber.from(0);

      await executeFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "deploy",
        args: [
          owner.address,
          randomBytesFn({
            // Make sure its unique by prepending the id.
            prepend: expectedProjectId.toString()
          }),
          randomStringFn(),
          {
            target: randomBigNumberFn(),
            currency,
            duration: randomBigNumberFn({
              min: BigNumber.from(0),
              max: constants.MaxUint16
            }),
            cycleLimit: randomBigNumberFn({
              max: constants.MaxCycleLimit
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
          []
        ]
      });
      return { owner, reservedRate, expectedProjectId };
    }
  },
  {
    description:
      "Make sure the terminalV1 got set as the project's current terminal",
    fn: ({
      checkFn,
      contracts,
      randomSignerFn,
      local: { expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: contracts.terminalV1.address
      })
  },
  {
    description: "Deploy a direct payment address",
    fn: ({
      executeFn,
      deployer,
      contracts,
      randomStringFn,
      local: { expectedProjectId }
    }) =>
      executeFn({
        caller: deployer,
        contract: contracts.terminalDirectory,
        fn: "deployAddress",
        args: [expectedProjectId, randomStringFn()]
      })
  },
  {
    description: "Make a payment to the address",
    fn: async ({
      contracts,
      randomBigNumberFn,
      BigNumber,
      getBalanceFn,
      randomSignerFn,
      local: { expectedProjectId }
    }) => {
      const [address] = await contracts.terminalDirectory.addressesOf(
        expectedProjectId
      );
      // An account that will be used to make payments.
      const payer = randomSignerFn();

      // Three payments will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      await payer.sendTransaction({
        to: address,
        value: paymentValue
      });

      return { payer, paymentValue };
    }
  },
  {
    description: "There should now be a balance in the terminal",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { paymentValue, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "balanceOf",
        args: [expectedProjectId],
        expect: paymentValue
      })
  },
  {
    description: "The payer should have gotten tickets",
    fn: async ({
      randomSignerFn,
      constants,
      contracts,
      checkFn,
      local: { payer, paymentValue, reservedRate, expectedProjectId }
    }) => {
      const expectedTicketAmount = paymentValue
        .mul(constants.InitialWeightMultiplier)
        .mul(constants.MaxPercent.sub(reservedRate))
        .div(constants.MaxPercent);
      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [payer.address, expectedProjectId],
        expect: expectedTicketAmount
      });
      return { expectedTicketAmount };
    }
  },
  {
    description: "Set a beneficiary address and staked ticket preference",
    fn: async ({
      contracts,
      executeFn,
      randomBoolFn,
      randomAddressFn,
      local: { payer }
    }) => {
      // The beneficiary to give tickets to.
      // Exclude the payers address to make the test cases cleaner.
      const payerTicketBeneficiary = randomAddressFn({
        exclude: [payer.address]
      });
      // The unstaked preference to set.
      const preferUnstakedTickets = randomBoolFn();
      await executeFn({
        caller: payer,
        contract: contracts.terminalDirectory,
        fn: "setPayerPreferences",
        args: [payerTicketBeneficiary, preferUnstakedTickets]
      });
      return { payerTicketBeneficiary, preferUnstakedTickets };
    }
  },
  {
    description: "Issue tickets",
    fn: ({
      contracts,
      executeFn,
      randomStringFn,
      local: { owner, expectedProjectId }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "issue",
        args: [
          expectedProjectId,
          randomStringFn({ canBeEmpty: false }),
          randomStringFn({ canBeEmpty: false })
        ]
      })
  },
  {
    description: "Deploy another direct payment address",
    fn: ({
      deployer,
      contracts,
      executeFn,
      randomStringFn,
      local: { expectedProjectId }
    }) =>
      executeFn({
        caller: deployer,
        contract: contracts.terminalDirectory,
        fn: "deployAddress",
        args: [expectedProjectId, randomStringFn()]
      })
  },
  {
    description: "Make another payment to the address",
    fn: async ({
      contracts,
      local: { payer, paymentValue, expectedProjectId }
    }) => {
      const [, secondAddress] = await contracts.terminalDirectory.addressesOf(
        expectedProjectId
      );
      await payer.sendTransaction({
        to: secondAddress,
        value: paymentValue
      });
    }
  },
  {
    description:
      "There should now be a double the payment value balance in the terminal",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { paymentValue, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "balanceOf",
        args: [expectedProjectId],
        expect: paymentValue.mul(2)
      })
  },
  {
    description: "The beneficiary should have gotten tickets",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { payerTicketBeneficiary, expectedTicketAmount, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [payerTicketBeneficiary, expectedProjectId],
        expect: expectedTicketAmount
      })
  },
  {
    description:
      "If there was a preference for unstaked tickets, the tickets should be unstaked",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        payerTicketBeneficiary,
        expectedTicketAmount,
        preferUnstakedTickets,
        expectedProjectId
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [payerTicketBeneficiary, expectedProjectId],
        expect: preferUnstakedTickets ? 0 : expectedTicketAmount
      })
  },
  {
    description: "Allow a migration to the new terminal",
    fn: async ({ deployer, contracts, executeFn, deployContractFn }) => {
      // The terminalV1 that will be migrated to.
      const secondTerminalV1 = await deployContractFn("TerminalV1", [
        contracts.projects.address,
        contracts.fundingCycles.address,
        contracts.ticketBooth.address,
        contracts.operatorStore.address,
        contracts.modStore.address,
        contracts.prices.address,
        contracts.terminalDirectory.address,
        contracts.governance.address
      ]);
      await executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "allowMigration",
        args: [contracts.terminalV1.address, secondTerminalV1.address]
      });
      return { secondTerminalV1 };
    }
  },
  {
    description: "Migrate to the new terminal",
    fn: ({
      contracts,
      executeFn,
      local: { owner, expectedProjectId, secondTerminalV1 }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "migrate",
        args: [expectedProjectId, secondTerminalV1.address]
      })
  },
  {
    description:
      "Make another payment to the address. It should now have been routed to the new terminal",
    fn: async ({
      contracts,
      local: { payer, paymentValue, expectedProjectId }
    }) => {
      const [address] = await contracts.terminalDirectory.addressesOf(
        expectedProjectId
      );
      await payer.sendTransaction({
        to: address,
        value: paymentValue
      });
    }
  },
  {
    description:
      "There should now be triple the payment value balance in the new terminal",
    fn: ({
      checkFn,
      randomSignerFn,
      local: { paymentValue, expectedProjectId, secondTerminalV1 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: secondTerminalV1,
        fn: "balanceOf",
        args: [expectedProjectId],
        expect: paymentValue.mul(3)
      })
  },
  {
    description: "The beneficiary should have gotten tickets",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { payerTicketBeneficiary, expectedTicketAmount, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [payerTicketBeneficiary, expectedProjectId],
        expect: expectedTicketAmount.mul(2)
      })
  },
  {
    description: "Set a beneficiary address back to the paying address",
    fn: ({ contracts, executeFn, randomBoolFn, local: { payer } }) =>
      executeFn({
        caller: payer,
        contract: contracts.terminalDirectory,
        fn: "setPayerPreferences",
        args: [payer.address, randomBoolFn()]
      })
  }
];
