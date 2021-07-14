/** 
 Projects can issue ERC-20 tickets that can be unstaked from the Juicebox contracts
 and used throughout Web3.
*/

// The currency will be 0, which corresponds to ETH, preventing the need for currency price conversion.
const currency = 0;

module.exports = [
  {
    description: "Deploy a project for the owner",
    fn: async ({
      executeFn,
      randomBigNumberFn,
      randomSignerFn,
      randomStringFn,
      BigNumber,
      getBalanceFn,
      randomBytesFn,
      incrementProjectIdFn,
      incrementFundingCycleIdFn,
      constants,
      contracts
    }) => {
      const expectedProjectId = incrementProjectIdFn();

      // Burn the unused funding cycle ID id.
      incrementFundingCycleIdFn();

      // The owner of the project that will migrate.
      const owner = randomSignerFn();

      // An account that will be used to make payments.
      const payer = randomSignerFn();

      // Two payments will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily find a number less than a third so that all payments can be made successfully.
      const paymentValue1 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });
      const paymentValue2 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      // The project's funding cycle target will at most be a fourth of the payment value. Leaving plenty of overflow.
      const target = randomBigNumberFn({
        max: paymentValue1.add(paymentValue2).div(4)
      });

      // Set a random percentage of tickets to reserve for the project owner.
      const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });

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
            target,
            currency,
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
        paymentValue1,
        paymentValue2,
        reservedRate
      };
    }
  },
  {
    description: "The owner should not have issued tickets initially",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      constants,
      local: { expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "ticketsOf",
        args: [expectedProjectId],
        expect: constants.AddressZero
      })
  },
  {
    description:
      "Make a payment to the project without first issueing tickets should print staked tickets",
    fn: async ({
      randomSignerFn,
      executeFn,
      contracts,
      randomStringFn,
      randomBoolFn,
      local: { expectedProjectId, payer, paymentValue1 }
    }) => {
      // An account that will be distributed tickets in the first payment.
      const ticketBeneficiary = randomSignerFn();

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

      return { ticketBeneficiary };
    }
  },
  {
    description: "The ticket beneficiary should have tickets",
    fn: async ({
      checkFn,
      constants,
      randomSignerFn,
      contracts,
      local: {
        paymentValue1,
        reservedRate,
        ticketBeneficiary,
        expectedProjectId
      }
    }) => {
      // The amount of tickets that will be expected to be staked after the first payment.
      const expectedStakedBalance = paymentValue1
        .mul(constants.InitialWeightMultiplier)
        .mul(constants.MaxPercent.sub(reservedRate))
        .div(constants.MaxPercent);

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10
        }
      });

      return { expectedStakedBalance };
    }
  },
  {
    description: "The ticket beneficiary's tickets should all be staked",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      local: { ticketBeneficiary, expectedProjectId, expectedStakedBalance }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10
        }
      })
  },
  {
    description: "Issue tickets",
    fn: ({
      executeFn,
      contracts,
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
    description:
      "Make another payment to the project now that tickets have been issued. Prefer unstaked tickets from the payment.",
    fn: ({
      executeFn,
      contracts,
      randomStringFn,
      local: { payer, expectedProjectId, ticketBeneficiary, paymentValue2 }
    }) =>
      executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          ticketBeneficiary.address,
          randomStringFn(),
          true // prefer unstaked
        ],
        value: paymentValue2
      })
  },
  {
    description:
      "The ticket beneficiary should have both unstaked and staked tickets",
    fn: async ({
      randomSignerFn,
      checkFn,
      constants,
      contracts,
      local: {
        paymentValue1,
        paymentValue2,
        reservedRate,
        expectedProjectId,
        ticketBeneficiary
      }
    }) => {
      // Total amount of tickets that will be expected to be both staked and unstaked after the second payment.
      const expectedTotalTicketBalance = paymentValue1
        .add(paymentValue2)
        .mul(constants.InitialWeightMultiplier)
        .mul(constants.MaxPercent.sub(reservedRate))
        .div(constants.MaxPercent);

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedTotalTicketBalance,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10
        }
      });

      return { expectedTotalTicketBalance };
    }
  },
  {
    description:
      "The ticket beneficiary's tickets staked tickets should still be staked",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      local: { ticketBeneficiary, expectedProjectId, expectedStakedBalance }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10
        }
      })
  },
  {
    description: "Redeem some of the staked tickets",
    fn: async ({
      randomBigNumberFn,
      executeFn,
      BigNumber,
      contracts,
      randomAddressFn,
      local: { expectedStakedBalance, ticketBeneficiary, expectedProjectId }
    }) => {
      // Get a subset of the staked tickets.
      const redeemedPortionOfStakedBalance = expectedStakedBalance.eq(0)
        ? BigNumber.from(0)
        : expectedStakedBalance.sub(
            randomBigNumberFn({
              min: BigNumber.from(1),
              max: expectedStakedBalance.sub(1)
            })
          );

      // Find how much the subset is redeemable for.
      const claimableAmount = await contracts.terminalV1.claimableOverflowOf(
        ticketBeneficiary.address,
        expectedProjectId,
        redeemedPortionOfStakedBalance
      );

      const expectNoOp =
        redeemedPortionOfStakedBalance.eq(0) || claimableAmount.eq(0);

      await executeFn({
        caller: ticketBeneficiary,
        contract: contracts.terminalV1,
        fn: "redeem",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          redeemedPortionOfStakedBalance,
          claimableAmount,
          randomAddressFn(),
          false // prefer staked
        ],
        revert: expectNoOp && "TerminalV1::redeem: NO_OP"
      });

      return {
        redeemedPortionOfStakedBalance: expectNoOp
          ? BigNumber.from(0)
          : redeemedPortionOfStakedBalance
      };
    }
  },
  {
    description: "The staked balance should have the redeemed portion removed",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      local: {
        ticketBeneficiary,
        expectedProjectId,
        expectedStakedBalance,
        redeemedPortionOfStakedBalance
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance.sub(redeemedPortionOfStakedBalance),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10
        }
      })
  },
  {
    description: "The total balance should have the redeemed portion removed",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      local: {
        redeemedPortionOfStakedBalance,
        ticketBeneficiary,
        expectedProjectId,
        expectedTotalTicketBalance
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedTotalTicketBalance.sub(redeemedPortionOfStakedBalance),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10
        }
      })
  },
  {
    description: "Redeem some of the unstaked tickets",
    fn: async ({
      executeFn,
      randomBigNumberFn,
      BigNumber,
      contracts,
      randomAddressFn,
      local: {
        expectedTotalTicketBalance,
        expectedStakedBalance,
        ticketBeneficiary,
        expectedProjectId
      }
    }) => {
      const expectedUnstakedBalance = expectedTotalTicketBalance.sub(
        expectedStakedBalance
      );
      const redeemedPortionOfUnstakedBalance = expectedUnstakedBalance.eq(0)
        ? BigNumber.from(0)
        : expectedUnstakedBalance.sub(
            randomBigNumberFn({
              min: BigNumber.from(1),
              max: expectedUnstakedBalance.sub(1)
            })
          );

      // Find how much the subset is redeemable for.
      const claimableAmount = await contracts.terminalV1.claimableOverflowOf(
        ticketBeneficiary.address,
        expectedProjectId,
        redeemedPortionOfUnstakedBalance
      );

      const expectNoOp =
        redeemedPortionOfUnstakedBalance.eq(0) || claimableAmount.eq(0);

      await executeFn({
        caller: ticketBeneficiary,
        contract: contracts.terminalV1,
        fn: "redeem",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          redeemedPortionOfUnstakedBalance,
          0,
          randomAddressFn(),
          true // prefer unstaked
        ],
        revert: expectNoOp && "TerminalV1::redeem: NO_OP"
      });

      return {
        redeemedPortionOfUnstakedBalance: expectNoOp
          ? BigNumber.from(0)
          : redeemedPortionOfUnstakedBalance
      };
    }
  },
  {
    description: "The staked balance should be the same as it was",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      local: {
        redeemedPortionOfStakedBalance,
        ticketBeneficiary,
        expectedProjectId,
        expectedStakedBalance
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance.sub(redeemedPortionOfStakedBalance),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10
        }
      })
  },
  {
    description: "The total balance should have both redeemed portions removed",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      local: {
        redeemedPortionOfStakedBalance,
        redeemedPortionOfUnstakedBalance,
        expectedProjectId,
        ticketBeneficiary,
        expectedTotalTicketBalance
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedTotalTicketBalance
          .sub(redeemedPortionOfStakedBalance)
          .sub(redeemedPortionOfUnstakedBalance),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10
        }
      })
  },
  {
    description: "Redeem the rest of the tickets",
    fn: async ({
      executeFn,
      randomAddressFn,
      randomBoolFn,
      contracts,
      BigNumber,
      local: { ticketBeneficiary, expectedProjectId }
    }) => {
      const balance = await contracts.ticketBooth.balanceOf(
        ticketBeneficiary.address,
        expectedProjectId
      );

      const stakedBalance = await contracts.ticketBooth.stakedBalanceOf(
        ticketBeneficiary.address,
        expectedProjectId
      );

      // Find how much the balance is redeemable for.
      const claimableAmount = await contracts.terminalV1.claimableOverflowOf(
        ticketBeneficiary.address,
        expectedProjectId,
        balance
      );

      const expectNoOp = balance.eq(0) || claimableAmount.eq(0);

      await executeFn({
        caller: ticketBeneficiary,
        contract: contracts.terminalV1,
        fn: "redeem",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          balance,
          claimableAmount,
          randomAddressFn(),
          randomBoolFn()
        ],
        revert: expectNoOp && "TerminalV1::redeem: NO_OP"
      });

      return {
        leftoverTickets: expectNoOp ? balance : BigNumber.from(0),
        stakedBalance
      };
    }
  },
  {
    description: "The ticket balance of the project should now be zero",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      local: { ticketBeneficiary, expectedProjectId, leftoverTickets }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: leftoverTickets
      })
  },
  {
    description: "The staked ticket balance of the project should now be zero",
    fn: async ({
      checkFn,
      randomSignerFn,
      contracts,
      local: {
        ticketBeneficiary,
        expectedProjectId,
        leftoverTickets,
        stakedBalance
      }
    }) => {
      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        // eslint-disable-next-line
        expect:  leftoverTickets.eq(0) ? 0 : stakedBalance
      });
    }
  }
];
