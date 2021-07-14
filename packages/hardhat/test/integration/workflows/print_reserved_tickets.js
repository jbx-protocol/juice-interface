/**
 Projects that have configured a reserve rate will be reserved tickets each time 
 a payment is made to it.

 These reserved tickets can be printed at any time.

 Any configured ticket mods will get sent some of the printing reserved tickets at this time.
*/

// The currency will be 0, which corresponds to ETH, preventing the need for currency price conversion.
const currency = 0;

module.exports = [
  {
    description: "Create a project",
    fn: async ({
      randomSignerFn,
      contracts,
      executeFn,
      randomBytesFn,
      randomStringFn,
      incrementProjectIdFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();

      // The owner of the project that will migrate.
      const owner = randomSignerFn();

      await executeFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "create",
        args: [
          owner.address,
          randomBytesFn({
            // Make sure its unique by prepending the id.
            prepend: expectedProjectId.toString()
          }),
          randomStringFn(),
          // Set the terminalV1 to the terminal.
          contracts.terminalV1.address
        ]
      });

      return { expectedProjectId, owner };
    }
  },
  {
    description:
      "Make a payment to the project. This shouldn't create any reserved tickets since a configuration hasn't yet been made for the project",
    fn: async ({
      randomSignerFn,
      contracts,
      executeFn,
      randomBigNumberFn,
      randomBoolFn,
      randomStringFn,
      getBalanceFn,
      BigNumber,
      local: { expectedProjectId, owner }
    }) => {
      // An account that will be used to make payments.
      const payer = randomSignerFn();

      // Three payments will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue1 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      // An account that will be distributed tickets in the preconfig payment.
      const preconfigTicketBeneficiary = randomSignerFn({
        exclude: [owner.address]
      });

      await executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          preconfigTicketBeneficiary.address,
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue1
      });

      return { payer, paymentValue1, preconfigTicketBeneficiary };
    }
  },
  {
    description:
      "The preconfig ticket beneficiary should have tickets from the payment",
    fn: async ({
      constants,
      contracts,
      checkFn,
      randomSignerFn,
      local: { expectedProjectId, paymentValue1, preconfigTicketBeneficiary }
    }) => {
      // The expected number of tickets to expect from the first payment.
      const expectedPreminedPaidTicketAmount = paymentValue1.mul(
        constants.InitialWeightMultiplier
      );

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [preconfigTicketBeneficiary.address, expectedProjectId],
        expect: expectedPreminedPaidTicketAmount
      });

      return { expectedPreminedPaidTicketAmount };
    }
  },
  {
    description: "Print some premined tickets to a beneficiary",
    fn: async ({
      contracts,
      executeFn,
      randomBigNumberFn,
      randomBoolFn,
      randomStringFn,
      BigNumber,
      local: { expectedProjectId, owner, preconfigTicketBeneficiary }
    }) => {
      // The first amount of premined tickets to print. The amount is currency-denominated, based on the weight of the first funding cycle.
      const preminePrintAmount = randomBigNumberFn({
        min: BigNumber.from(1),
        // Use an arbitrary large big number that can be added to other large big numbers without risk of running into uint256 boundaries.
        max: BigNumber.from(10).pow(30)
      });

      await executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "printPreminedTickets",
        args: [
          expectedProjectId,
          preminePrintAmount,
          currency,
          preconfigTicketBeneficiary.address,
          randomStringFn(),
          randomBoolFn()
        ]
      });

      return { preminePrintAmount };
    }
  },
  {
    description: "There shouldn't be any reserved tickets",
    fn: ({
      constants,
      contracts,
      checkFn,
      randomBigNumberFn,
      randomSignerFn,
      local: { expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "reservedTicketBalanceOf",
        args: [
          expectedProjectId,
          randomBigNumberFn({ max: constants.MaxPercent })
        ],
        expect: 0
      })
  },
  {
    description:
      "The preconfig ticket beneficiary should now also have tickets from the premine",
    fn: async ({
      constants,
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        preconfigTicketBeneficiary,
        preminePrintAmount,
        expectedPreminedPaidTicketAmount
      }
    }) => {
      // The ticket amount is based on the initial funding cycle's weight.
      const expectedPreminedPrintedTicketAmount = preminePrintAmount.mul(
        constants.InitialWeightMultiplier
      );

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [preconfigTicketBeneficiary.address, expectedProjectId],
        expect: expectedPreminedPaidTicketAmount.add(
          expectedPreminedPrintedTicketAmount
        )
      });
    }
  },
  {
    description: "Configure the projects funding cycle",
    fn: async ({
      constants,
      contracts,
      BigNumber,
      executeFn,
      getBalanceFn,
      randomBigNumberFn,
      randomBoolFn,
      randomSignerFn,
      incrementFundingCycleIdFn,
      local: { expectedProjectId, owner, payer, preconfigTicketBeneficiary }
    }) => {
      // Burn the unused funding cycle ID id.
      incrementFundingCycleIdFn();

      const paymentValue2 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });
      const paymentValue3 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      const target = randomBigNumberFn({
        max: paymentValue2.add(paymentValue3)
      });

      // Make recurring.
      const duration = randomBigNumberFn({
        min: BigNumber.from(1),
        max: constants.MaxUint16
      });

      // An account that will be distributed tickets in mod1.
      // Simplify the test by disallowing the owner or the preconfig ticket beneficiary.
      const mod1Beneficiary = randomSignerFn({
        exclude: [owner.address, preconfigTicketBeneficiary.address]
      });

      // The mod percents should add up to <= constants.MaxPercent.
      const percent1 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: constants.MaxModPercent.sub(2)
      });
      const percent2 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: constants.MaxModPercent.sub(percent1).sub(1)
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

      // An account that will be distributed tickets in mod2.
      // Simplify the test by disallowing the owner, the preconfig ticket beneficiary, or the first mod beneficiary.
      const mod2Beneficiary = randomSignerFn({
        exclude: [
          owner.address,
          preconfigTicketBeneficiary.address,
          mod1Beneficiary.address
        ]
      });

      const mod2 = {
        preferUnstaked,
        percent: percent2.toNumber(),
        lockedUntil: 0,
        beneficiary: mod2Beneficiary.address
      };

      // Set a random percentage of tickets to reserve for the project owner.
      const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });

      await executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            target,
            currency,
            duration,
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
          [mod1, mod2]
        ]
      });

      return {
        paymentValue2,
        paymentValue3,
        mod1Beneficiary,
        mod2Beneficiary,
        percent1,
        percent2,
        preferUnstaked,
        reservedRate
      };
    }
  },
  {
    description: "The owner should not have any tickets initially",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { expectedProjectId, owner }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [owner.address, expectedProjectId],
        expect: 0
      })
  },
  {
    description:
      "Printing reserved before anything has been done shouldn't do anything",
    fn: ({ contracts, executeFn, local: { expectedProjectId, owner } }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "printReservedTickets",
        args: [expectedProjectId]
      })
  },
  {
    description: "The owner should still not have any tickets",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { expectedProjectId, owner }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [owner.address, expectedProjectId],
        expect: 0
      })
  },
  {
    description: "Make a payment to the project",
    fn: async ({
      contracts,
      executeFn,
      randomBoolFn,
      randomStringFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        payer,
        paymentValue2,
        owner,
        mod1Beneficiary,
        mod2Beneficiary
      }
    }) => {
      // An account that will be distributed tickets in the second payment.
      // Simplify the test by disallowing the owner or either mod beneficiary.
      const ticketBeneficiary1 = randomSignerFn({
        exclude: [
          owner.address,
          mod1Beneficiary.address,
          mod2Beneficiary.address
        ]
      });

      await executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          ticketBeneficiary1.address,
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue2
      });

      return { ticketBeneficiary1 };
    }
  },
  {
    description: "The owner should now have printable reserved tickets",
    fn: async ({
      constants,
      contracts,
      checkFn,
      randomSignerFn,
      local: { expectedProjectId, reservedRate, paymentValue2 }
    }) => {
      // The expected number of reserved tickets to expect from the first payment.
      const expectedReservedTicketAmount2 = paymentValue2
        .mul(constants.InitialWeightMultiplier)
        .mul(reservedRate)
        .div(constants.MaxPercent);

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "reservedTicketBalanceOf",
        args: [expectedProjectId, reservedRate],
        expect: expectedReservedTicketAmount2,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10000
        }
      });

      return { expectedReservedTicketAmount2 };
    }
  },
  {
    description: "The owner should still not have any tickets",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { expectedProjectId, owner }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [owner.address, expectedProjectId],
        expect: 0
      })
  },
  {
    description:
      "Issue the project's tickets so that the unstaked preference can be checked",
    fn: ({
      contracts,
      executeFn,
      randomStringFn,
      local: { expectedProjectId, owner }
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
    description: "Print the reserved tickets",
    fn: ({
      contracts,
      executeFn,
      local: { expectedProjectId, owner, reservedRate }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "printReservedTickets",
        args: [expectedProjectId],
        expect: reservedRate.eq(0) && "TicketBooth::print: NO_OP"
      })
  },
  {
    description:
      "The owner should now have the correct amount of tickets, accounting for any ticket mods",
    fn: ({
      constants,
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        owner,
        expectedReservedTicketAmount2,
        percent1,
        percent2
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [owner.address, expectedProjectId],
        expect: expectedReservedTicketAmount2
          .mul(constants.MaxModPercent.sub(percent1).sub(percent2))
          .div(constants.MaxModPercent),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10000
        }
      })
  },
  {
    description:
      "The beneficiary of mod1 should now have the correct amount of tickets",
    fn: ({
      constants,
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedReservedTicketAmount2,
        mod1Beneficiary,
        percent1
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [mod1Beneficiary.address, expectedProjectId],
        expect: expectedReservedTicketAmount2
          .mul(percent1)
          .div(constants.MaxModPercent),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10000
        }
      })
  },
  {
    description: "Check for the correct number of staked tickets",
    fn: ({
      constants,
      contracts,
      BigNumber,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedReservedTicketAmount2,
        mod1Beneficiary,
        preferUnstaked,
        percent1
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [mod1Beneficiary.address, expectedProjectId],
        expect: preferUnstaked
          ? BigNumber.from(0)
          : expectedReservedTicketAmount2
              .mul(percent1)
              .div(constants.MaxModPercent),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10000
        }
      })
  },
  {
    description:
      "The beneficiary of mod2 should now have the correct amount of tickets",
    fn: ({
      constants,
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedReservedTicketAmount2,
        mod2Beneficiary,
        percent2
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [mod2Beneficiary.address, expectedProjectId],
        expect: expectedReservedTicketAmount2
          .mul(percent2)
          .div(constants.MaxModPercent),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10000
        }
      })
  },
  {
    description: "Check for the correct number of staked tickets",
    fn: ({
      constants,
      contracts,
      BigNumber,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        expectedReservedTicketAmount2,
        mod2Beneficiary,
        preferUnstaked,
        percent2
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [mod2Beneficiary.address, expectedProjectId],
        expect: preferUnstaked
          ? BigNumber.from(0)
          : expectedReservedTicketAmount2
              .mul(percent2)
              .div(constants.MaxModPercent),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10000
        }
      })
  },
  {
    description: "There should no longer be reserved tickets",
    fn: ({
      contracts,
      checkFn,
      local: { expectedProjectId, owner, reservedRate }
    }) =>
      checkFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "reservedTicketBalanceOf",
        args: [expectedProjectId, reservedRate],
        expect: 0
      })
  },
  {
    description: "Make another payment to the project",
    fn: async ({
      contracts,
      executeFn,
      randomBoolFn,
      randomStringFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        payer,
        paymentValue3,
        owner,
        mod1Beneficiary,
        mod2Beneficiary,
        ticketBeneficiary1
      }
    }) => {
      // An account that will be distributed tickets in the third payment.
      // Simplify the test by disallowing the owner or either mod beneficiary.
      const ticketBeneficiary2 = randomSignerFn({
        exclude: [
          owner.address,
          mod1Beneficiary.address,
          mod2Beneficiary.address,
          ticketBeneficiary1.address
        ]
      });
      await executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          ticketBeneficiary2.address,
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue3
      });

      return { ticketBeneficiary2 };
    }
  },
  {
    description: "The owner should now have printable reserved tickets again",
    fn: async ({
      constants,
      contracts,
      checkFn,
      randomSignerFn,
      local: { expectedProjectId, reservedRate, paymentValue3 }
    }) => {
      // The expected number of reserved tickets to expect from the second payment.
      const expectedReservedTicketAmount3 = paymentValue3
        .mul(constants.InitialWeightMultiplier)
        .mul(reservedRate)
        .div(constants.MaxPercent);

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "reservedTicketBalanceOf",
        args: [expectedProjectId, reservedRate],
        expect: expectedReservedTicketAmount3,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10000
        }
      });
      return { expectedReservedTicketAmount3 };
    }
  },
  {
    description: "Redeem tickets from the beneficiary of the first payment",
    fn: async ({
      contracts,
      executeFn,
      randomAddressFn,
      randomBoolFn,
      local: { expectedProjectId, ticketBeneficiary1, owner }
    }) => {
      const ticketAmount = await contracts.ticketBooth.balanceOf(
        ticketBeneficiary1.address,
        expectedProjectId
      );
      const claimable = await contracts.terminalV1.claimableOverflowOf(
        ticketBeneficiary1.address,
        expectedProjectId,
        ticketAmount
      );
      await executeFn({
        caller: ticketBeneficiary1,
        contract: contracts.terminalV1,
        fn: "redeem",
        args: [
          ticketBeneficiary1.address,
          expectedProjectId,
          ticketAmount,
          claimable,
          randomAddressFn({ exclude: [owner.address] }),
          randomBoolFn()
        ],
        revert:
          (ticketAmount.eq(0) || claimable.eq(0)) && "TerminalV1::redeem: NO_OP"
      });
    }
  },
  {
    description:
      "The owner should still have the same number of printable reserved tickets",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { expectedProjectId, reservedRate, expectedReservedTicketAmount3 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "reservedTicketBalanceOf",
        args: [expectedProjectId, reservedRate],
        expect: expectedReservedTicketAmount3,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10000
        }
      })
  },
  {
    description: "Redeem tickets from the beneficiary of the second payment",
    fn: async ({
      contracts,
      executeFn,
      randomAddressFn,
      randomBoolFn,
      local: { expectedProjectId, ticketBeneficiary2 }
    }) => {
      const ticketAmount = await contracts.ticketBooth.balanceOf(
        ticketBeneficiary2.address,
        expectedProjectId
      );
      const claimable = await contracts.terminalV1.claimableOverflowOf(
        ticketBeneficiary2.address,
        expectedProjectId,
        ticketAmount
      );
      await executeFn({
        caller: ticketBeneficiary2,
        contract: contracts.terminalV1,
        fn: "redeem",
        // Redeem all available tickets.
        args: [
          ticketBeneficiary2.address,
          expectedProjectId,
          ticketAmount,
          claimable,
          randomAddressFn(),
          randomBoolFn()
        ],
        revert:
          (ticketAmount.eq(0) || claimable.eq(0)) && "TerminalV1::redeem: NO_OP"
      });
    }
  },
  {
    description:
      "The owner should still have the same number of printable reserved tickets",
    fn: ({
      contracts,
      checkFn,
      local: {
        expectedProjectId,
        owner,
        reservedRate,
        expectedReservedTicketAmount3
      }
    }) =>
      checkFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "reservedTicketBalanceOf",
        args: [expectedProjectId, reservedRate],
        expect: expectedReservedTicketAmount3,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10000
        }
      })
  },
  {
    description: "Print the reserved tickets",
    fn: ({ contracts, executeFn, local: { expectedProjectId, owner } }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "printReservedTickets",
        args: [expectedProjectId]
      })
  },
  {
    description: "There should no longer be reserved tickets",
    fn: ({
      contracts,
      checkFn,
      local: { expectedProjectId, owner, reservedRate }
    }) =>
      checkFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "reservedTicketBalanceOf",
        args: [expectedProjectId, reservedRate],
        expect: 0
      })
  }
];
