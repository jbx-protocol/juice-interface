/** 
  Projects that are relying on a terminal to receive payments and manage their funds 
  can migrate to new terminals, according to the following rules:

   - Governance must first allow migration to the new terminal.
   - The old terminal can no longer receive funds or print tickets.
   - All funds will migrate to the new terminal for users to tap and redeem tickets on.
*/

// The currency will be 0, which corresponds to ETH, preventing the need for currency price conversion.
const currency = 0;

module.exports = [
  {
    description: "Deploy a project for the owner",
    fn: async ({
      constants,
      contracts,
      BigNumber,
      executeFn,
      randomBigNumberFn,
      randomBytesFn,
      getBalanceFn,
      randomSignerFn,
      incrementProjectIdFn,
      incrementFundingCycleIdFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();
      // Burn the unused funding cycle ID id.
      incrementFundingCycleIdFn();

      // The owner of the project that will migrate.
      const owner = randomSignerFn();

      // An account that will be used to make payments.
      const payer = randomSignerFn();

      // Two payments will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      // Also make sure the first payment is well positive to make the test cases cleaner.
      const paymentValue1 = randomBigNumberFn({
        min: BigNumber.from(1000),
        max: (await getBalanceFn(payer.address)).div(100)
      });
      const paymentValue2 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      // The project's funding cycle target will be less than the payment value.
      const target = randomBigNumberFn({
        min: BigNumber.from(1),
        // Arbitrarily divide by two so there will be plenty of overflow.
        max: paymentValue1.div(2)
      });

      // Set a random percentage of tickets to reserve for the project owner.
      // Arbitrarily it to under 50% to make sure funds aren't not all reserved.
      const reservedRate = randomBigNumberFn({
        max: constants.MaxPercent.div(2)
      });

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
          "",
          {
            target,
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

      return {
        expectedProjectId,
        owner,
        payer,
        target,
        paymentValue1,
        paymentValue2,
        reservedRate
      };
    }
  },
  {
    description: "Check that the terminal got set",
    fn: ({
      contracts,
      checkFn,
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
    description: "Make a payment to the project",
    fn: async ({
      executeFn,
      randomStringFn,
      randomSignerFn,
      randomBoolFn,
      getBalanceFn,
      contracts,
      local: { payer, paymentValue1, expectedProjectId }
    }) => {
      // An account that will be distributed tickets in the first terminal, that will redeem in the second terminal.
      const ticketBeneficiary = randomSignerFn();

      // Get the initial balance of the jucier.
      const initialTerminalV1Balance = await getBalanceFn(
        contracts.terminalV1.address
      );

      await executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          ticketBeneficiary.address,
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue1
      });

      return { ticketBeneficiary, initialTerminalV1Balance };
    }
  },
  {
    description: "The terminal's balance should match the payment just made",
    fn: ({
      contracts,
      verifyBalanceFn,
      local: { paymentValue1, initialTerminalV1Balance }
    }) =>
      verifyBalanceFn({
        address: contracts.terminalV1.address,
        expect: initialTerminalV1Balance.add(paymentValue1)
      })
  },
  {
    description:
      "Make sure tickets can be redeemed successfully in this TerminalV1",
    fn: async ({
      deployer,
      contracts,
      executeFn,
      randomBigNumberFn,
      randomAddressFn,
      getBalanceFn,
      randomBoolFn,
      BigNumber,
      local: { ticketBeneficiary, expectedProjectId, owner }
    }) => {
      // Get the total amount of tickets received by the ticket beneficiary.
      const redeemableTicketsOfTicketBeneficiary = await contracts.ticketBooth.balanceOf(
        ticketBeneficiary.address,
        expectedProjectId
      );

      // Redeem a portion of the total.
      const portionOfRedeemableTicketsOfTicketBeneficiary = redeemableTicketsOfTicketBeneficiary.div(
        randomBigNumberFn({ min: BigNumber.from(2), max: BigNumber.from(5) })
      );

      // An address that will be the beneficiary of funds when redeeming tickets.
      // Exclude the ticket beneficiary, owner, and deployer to make test cases cleaner. These accounts need to spend gas still.
      const redeemBeneficiary = randomAddressFn({
        exclude: [ticketBeneficiary.address, owner.address, deployer.address]
      });

      const initialBalanceOfRedeemBeneficiary = await getBalanceFn(
        redeemBeneficiary
      );

      await executeFn({
        caller: ticketBeneficiary,
        contract: contracts.terminalV1,
        fn: "redeem",
        // Redeem half as many tickets as are available. The rest will be redeemed later.
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          portionOfRedeemableTicketsOfTicketBeneficiary,
          0, // must be lower than the expected amount of ETH that is being claimed.
          redeemBeneficiary,
          randomBoolFn()
        ]
      });

      return {
        leftoverRedeemableTicketsOfTicketBeneficiary: redeemableTicketsOfTicketBeneficiary.sub(
          portionOfRedeemableTicketsOfTicketBeneficiary
        ),
        redeemBeneficiary,
        initialBalanceOfRedeemBeneficiary
      };
    }
  },
  {
    description:
      "Make sure funds can be tapped successfully in this TerminalV1",
    fn: async ({
      contracts,
      BigNumber,
      executeFn,
      randomBigNumberFn,
      randomSignerFn,
      local: { expectedProjectId, target, redeemBeneficiary }
    }) => {
      // Initially tap a portion of the funding cycle's target.
      const amountToTap1 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: target.sub(1)
      });

      await executeFn({
        // Exclude the redeem beneficiary to not spend gas from that account.
        caller: randomSignerFn({ exclude: [redeemBeneficiary] }),
        contract: contracts.terminalV1,
        fn: "tap",
        args: [expectedProjectId, amountToTap1, currency, amountToTap1]
      });

      return { amountToTap1 };
    }
  },
  {
    description:
      "Migrating to a new terminalV1 shouldn't work because it hasn't been allowed yet",
    fn: async ({
      contracts,
      executeFn,
      deployContractFn,
      local: { owner, expectedProjectId }
    }) => {
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
        caller: owner,
        contract: contracts.terminalV1,
        fn: "migrate",
        args: [expectedProjectId, secondTerminalV1.address],
        revert: "TerminalV1::migrate: NOT_ALLOWED"
      });

      return { secondTerminalV1 };
    }
  },
  {
    description: "Allow a migration to the new terminalV1",
    fn: ({ deployer, contracts, executeFn, local: { secondTerminalV1 } }) =>
      executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "allowMigration",
        args: [contracts.terminalV1.address, secondTerminalV1.address]
      })
  },
  {
    description:
      "Migrating to the new terminalV1 called by a different address shouldn't be allowed",
    fn: ({
      contracts,
      executeFn,
      randomSignerFn,
      local: { owner, expectedProjectId, secondTerminalV1, redeemBeneficiary }
    }) =>
      executeFn({
        // Also exlude the redeemBeneficary to not spend gas from that account.
        caller: randomSignerFn({
          exclude: [owner.address, redeemBeneficiary]
        }),
        contract: contracts.terminalV1,
        fn: "migrate",
        args: [expectedProjectId, secondTerminalV1.address],
        revert: "Operatable: UNAUTHORIZED"
      })
  },
  {
    description:
      "Migrate to the new terminalV1, which should automatically print reserved tickets for the owner",
    fn: async ({
      contracts,
      executeFn,
      local: { owner, expectedProjectId, secondTerminalV1, reservedRate }
    }) => {
      // Before migrating, save a reference to the amount of reserved tickets available.
      const reservedTicketAmount = await contracts.terminalV1.reservedTicketBalanceOf(
        expectedProjectId,
        reservedRate
      );
      await executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "migrate",
        args: [expectedProjectId, secondTerminalV1.address]
      });

      return { reservedTicketAmount };
    }
  },
  {
    description:
      "The only balance that should be left in the old terminalV1 is the admin fee incurred while tapping",
    fn: async ({
      constants,
      contracts,
      verifyBalanceFn,
      local: { amountToTap1, initialTerminalV1Balance }
    }) => {
      // The percent, out of `constants.MaxPercent`, that will be charged as a fee.
      const fee = await contracts.terminalV1.fee();

      await verifyBalanceFn({
        address: contracts.terminalV1.address,
        // Take the fee from the amount that was tapped.
        expect: initialTerminalV1Balance
          .add(amountToTap1)
          .sub(
            amountToTap1
              .mul(constants.MaxPercent)
              .div(constants.MaxPercent.add(fee))
          )
      });
    }
  },
  {
    description:
      "The rest of the balance should be entirely in the new TerminalV1",
    fn: async ({
      verifyBalanceFn,
      getBalanceFn,
      local: {
        paymentValue1,
        redeemBeneficiary,
        amountToTap1,
        secondTerminalV1,
        initialBalanceOfRedeemBeneficiary
      }
    }) =>
      verifyBalanceFn({
        address: secondTerminalV1.address,
        // The balance should be the amount paid minus the amount tapped and the amount claimed from redeeming tickets.
        expect: paymentValue1
          .sub(amountToTap1)
          .sub(
            (await getBalanceFn(redeemBeneficiary)).sub(
              initialBalanceOfRedeemBeneficiary
            )
          )
      })
  },
  {
    description:
      "The terminal should have been updated to the new terminalV1 in the directory",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { expectedProjectId, secondTerminalV1 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: secondTerminalV1.address
      })
  },
  {
    description: "Payments to the old TerminalV1 should no longer be accepted",
    fn: ({
      contracts,
      executeFn,
      randomAddressFn,
      randomBoolFn,
      randomStringFn,
      local: { payer, paymentValue2, expectedProjectId }
    }) =>
      executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue2,
        revert: "TerminalUtility: UNAUTHORIZED"
      })
  },
  {
    description:
      "Make sure funds can be tapped successfully in the new TerminalV1",
    fn: ({
      executeFn,
      randomSignerFn,
      local: { target, expectedProjectId, amountToTap1, secondTerminalV1 }
    }) =>
      executeFn({
        caller: randomSignerFn(),
        contract: secondTerminalV1,
        fn: "tap",
        args: [
          expectedProjectId,
          target.sub(amountToTap1),
          currency,
          target.sub(amountToTap1)
        ]
      })
  },
  {
    description:
      "Make sure tickets can be redeemed successfully in the new TerminalV1",
    fn: ({
      executeFn,
      randomAddressFn,
      randomBoolFn,
      local: {
        leftoverRedeemableTicketsOfTicketBeneficiary,
        ticketBeneficiary,
        expectedProjectId,
        secondTerminalV1
      }
    }) =>
      executeFn({
        caller: ticketBeneficiary,
        contract: secondTerminalV1,
        fn: "redeem",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          leftoverRedeemableTicketsOfTicketBeneficiary,
          0, // must be lower than the expected amount of ETH that is being claimed.
          randomAddressFn(),
          randomBoolFn()
        ]
      })
  },
  {
    description: "Make sure the owner can also redeem their tickets",
    fn: ({
      executeFn,
      randomAddressFn,
      randomBoolFn,
      local: {
        reservedTicketAmount,
        owner,
        reservedRate,
        expectedProjectId,
        secondTerminalV1
      }
    }) =>
      executeFn({
        caller: owner,
        contract: secondTerminalV1,
        fn: "redeem",
        args: [
          owner.address,
          expectedProjectId,
          reservedTicketAmount,
          0, // must be lower than the expected amount of ETH that is being claimed.
          randomAddressFn(),
          randomBoolFn()
        ],
        revert: reservedRate.eq(0) && "TerminalV1::redeem: NO_OP"
      })
  },
  {
    description: "Payments to the new TerminalV1 should be accepted",
    fn: ({
      executeFn,
      randomAddressFn,
      randomBoolFn,
      randomStringFn,
      local: { payer, paymentValue2, expectedProjectId, secondTerminalV1 }
    }) =>
      executeFn({
        caller: payer,
        contract: secondTerminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue2
      })
  }
];
