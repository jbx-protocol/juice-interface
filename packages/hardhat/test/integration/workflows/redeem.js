/** 
  Ticket holders of a project should be able to redeem their tickets for a portion of the
  project's overflow proportional to a bonding curve formula.

  The bonding curve rate that tunes the bonding curve formula gets configured by the project.

  If a project has an active reconfiguration ballot, the reconfiguration bonding curve should be used,
  instead of the regular bonding curve.
*/

// The currency will be 0, which corresponds to ETH, preventing the need for currency price conversion.
const currency = 0;

module.exports = [
  {
    description: "Deploy a project for the owner",
    fn: async ({
      executeFn,
      randomSignerFn,
      deployer,
      BigNumber,
      randomBytesFn,
      randomStringFn,
      getBalanceFn,
      randomBigNumberFn,
      constants,
      contracts,
      incrementProjectIdFn,
      incrementFundingCycleIdFn,
      deployContractFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();

      // Burn the unused funding cycle ID id.
      incrementFundingCycleIdFn();

      // The owner of the project that will migrate.
      const owner = randomSignerFn();

      // An account that will be used to make payments.
      const payer = randomSignerFn();

      // Three payments will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue1 = randomBigNumberFn({
        min: BigNumber.from(10),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      const paymentValue2 = randomBigNumberFn({
        min: BigNumber.from(10),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      const paymentValue3 = randomBigNumberFn({
        min: BigNumber.from(10),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      // The project's funding cycle target will at most be the sum of all payments.
      const target = randomBigNumberFn({
        max: paymentValue1.add(paymentValue2).add(paymentValue3)
      });

      // Set a random percentage of tickets to reserve for the project owner.
      const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });

      // Set a random discount rate. Don't allow non-recurring cycles.
      const discountRate = randomBigNumberFn({
        max: constants.MaxPercent
      });

      // Set a random bonding curve rate.
      const bondingCurveRate = randomBigNumberFn({
        max: constants.MaxPercent
      });

      // Set a random reconfiguration bonding curve rate.
      const reconfigurationBondingCurveRate = randomBigNumberFn({
        max: constants.MaxPercent
      });

      // Use a ballot that has a fixed approval time.
      const ballot = await deployContractFn("Active14DaysFundingCycleBallot");

      // The duration of the ballot, after which it is approved.
      const ballotDurationInDays = (await ballot.duration()).div(86400);

      // The duration of the funding cycle should be at least one day longer than the ballot.
      const minDuration = randomBigNumberFn({
        min: ballotDurationInDays.add(1),
        max: constants.MaxUint16
      });

      await executeFn({
        caller: deployer,
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
              min: minDuration,
              max: constants.MaxUint16
            }),
            cycleLimit: randomBigNumberFn({ max: constants.MaxCycleLimit }),
            discountRate,
            ballot: ballot.address
          },
          {
            reservedRate,
            bondingCurveRate,
            reconfigurationBondingCurveRate
          },
          [],
          []
        ]
      });

      return {
        expectedProjectId,
        owner,
        target,
        reservedRate,
        bondingCurveRate,
        reconfigurationBondingCurveRate,
        payer,
        paymentValue1,
        paymentValue2,
        paymentValue3,
        initialContractBalance: await getBalanceFn(contracts.terminalV1.address),
        ballot
      };
    }
  },
  {
    description: "Make a payment to the project",
    fn: async ({
      executeFn,
      randomBoolFn,
      randomStringFn,
      randomSignerFn,
      contracts,
      local: { expectedProjectId, payer, paymentValue1, owner }
    }) => {
      // An account that will be distributed tickets in the first payment.
      const ticketBeneficiary1 = randomSignerFn({
        exclude: [owner.address]
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
        value: paymentValue1
      });

      return { payer, ticketBeneficiary1, paymentValue1 };
    }
  },
  {
    description: "Can't redeem with no overflow",
    fn: async ({
      executeFn,
      randomBoolFn,
      randomAddressFn,
      contracts,
      BigNumber,
      constants,
      local: {
        expectedProjectId,
        ticketBeneficiary1,
        reservedRate,
        paymentValue1
      }
    }) => {
      const expectedTotalTicketsFromPayment1 = paymentValue1.mul(
        constants.InitialWeightMultiplier
      );

      const expectedRedeemableTicketsOfTicketBeneficiary1 = expectedTotalTicketsFromPayment1
        .mul(constants.MaxPercent.sub(reservedRate))
        .div(constants.MaxPercent);

      await executeFn({
        caller: ticketBeneficiary1,
        contract: contracts.terminalV1,
        fn: "redeem",
        args: [
          ticketBeneficiary1.address,
          expectedProjectId,
          BigNumber.from(1),
          0,
          randomAddressFn(),
          randomBoolFn()
        ],
        revert: expectedRedeemableTicketsOfTicketBeneficiary1.eq(0)
          ? "TerminalV1::claimableOverflow: INSUFFICIENT_TICKETS"
          : "TerminalV1::redeem: NO_OP"
      });

      return {
        expectedTotalTicketsFromPayment1,
        expectedRedeemableTicketsOfTicketBeneficiary1
      };
    }
  },
  {
    description:
      "Make another payment to the project, sending tickets to a different beneficiary",
    fn: async ({
      randomSignerFn,
      executeFn,
      contracts,
      randomStringFn,
      randomBoolFn,
      local: {
        payer,
        expectedProjectId,
        paymentValue2,
        owner,
        ticketBeneficiary1
      }
    }) => {
      // An account that will be distributed tickets in the second payment.
      const ticketBeneficiary2 = randomSignerFn({
        exclude: [owner.address, ticketBeneficiary1.address]
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
        value: paymentValue2
      });
      return { ticketBeneficiary2 };
    }
  },
  {
    description:
      "Make a third payment to the project, sending tickets to a different beneficiary",
    fn: async ({
      executeFn,
      randomBoolFn,
      randomStringFn,
      randomSignerFn,
      contracts,
      local: {
        payer,
        expectedProjectId,
        paymentValue3,
        owner,
        ticketBeneficiary1,
        ticketBeneficiary2
      }
    }) => {
      // An account that will be distributed tickets in the third payment.
      const ticketBeneficiary3 = randomSignerFn({
        exclude: [
          owner.address,
          ticketBeneficiary1.address,
          ticketBeneficiary2.address
        ]
      });

      await executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          ticketBeneficiary3.address,
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue3
      });

      return { ticketBeneficiary3 };
    }
  },
  {
    description: "The project's balance should match the payments just made",
    fn: ({
      checkFn,
      contracts,
      randomAddressFn,
      local: { expectedProjectId, paymentValue1, paymentValue2, paymentValue3 }
    }) =>
      checkFn({
        caller: randomAddressFn(),
        contract: contracts.terminalV1,
        fn: "balanceOf",
        args: [expectedProjectId],
        expect: paymentValue1.add(paymentValue2).add(paymentValue3)
      })
  },
  {
    description: "The terminalV1 should have the funds from the payments",
    fn: ({
      contracts,
      verifyBalanceFn,
      local: {
        paymentValue1,
        paymentValue2,
        paymentValue3,
        initialContractBalance
      }
    }) =>
      verifyBalanceFn({
        address: contracts.terminalV1.address,
        expect: initialContractBalance.add(
          paymentValue1.add(paymentValue2).add(paymentValue3)
        )
      })
  },
  {
    description:
      "The first ticket beneficiary received the expected amount of tickets",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        ticketBeneficiary1,
        expectedRedeemableTicketsOfTicketBeneficiary1
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary1.address, expectedProjectId],
        expect: expectedRedeemableTicketsOfTicketBeneficiary1
      })
  },
  {
    description:
      "The first ticket beneficiary has the expected amount of claimable funds",
    fn: async ({
      contracts,
      bondingCurveFn,
      checkFn,
      randomSignerFn,
      constants,
      local: {
        expectedProjectId,
        ticketBeneficiary1,
        paymentValue1,
        paymentValue2,
        paymentValue3,
        target,
        bondingCurveRate,
        expectedTotalTicketsFromPayment1,
        expectedRedeemableTicketsOfTicketBeneficiary1
      }
    }) => {
      const expectedTotalTicketsFromPayment2 = paymentValue2.mul(
        constants.InitialWeightMultiplier
      );

      const expectedTotalTicketsFromPayment3 = paymentValue3.mul(
        constants.InitialWeightMultiplier
      );

      const expectedTotalTickets = expectedTotalTicketsFromPayment1
        .add(expectedTotalTicketsFromPayment2)
        .add(expectedTotalTicketsFromPayment3);

      // Get the stored ticket amount.
      const redeemableTicketsOfTicketBeneficiary1 = await contracts.ticketBooth.balanceOf(
        ticketBeneficiary1.address,
        expectedProjectId
      );

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "claimableOverflowOf",
        args: [
          ticketBeneficiary1.address,
          expectedProjectId,
          redeemableTicketsOfTicketBeneficiary1
        ],
        expect: bondingCurveFn({
          rate: bondingCurveRate,
          count: expectedRedeemableTicketsOfTicketBeneficiary1,
          total: expectedTotalTickets,
          overflow: paymentValue1
            .add(paymentValue2)
            .add(paymentValue3)
            .sub(target)
        }),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      });

      return {
        redeemableTicketsOfTicketBeneficiary1,
        expectedTotalTicketsFromPayment2,
        expectedTotalTicketsFromPayment3,
        expectedTotalTickets
      };
    }
  },
  {
    description:
      "The first ticket beneficiary tickets can be redeemed successfully",
    fn: async ({
      randomBoolFn,
      contracts,
      executeFn,
      getBalanceFn,
      randomAddressFn,
      BigNumber,
      local: {
        redeemableTicketsOfTicketBeneficiary1,
        expectedProjectId,
        ticketBeneficiary1
      }
    }) => {
      // An address that will be the beneficiary of funds when redeeming the first set of tickets.
      const redeemBeneficiary1 = randomAddressFn({
        // Can't be the ticket beneficiary because this account will spend on gas before the desired calculation is made.
        exclude: [ticketBeneficiary1.address]
      });

      const initialBalanceOfRedeemBeneficiary1 = await getBalanceFn(
        redeemBeneficiary1
      );

      // Get the stored claimable amount.
      const redeemableAmountOfTicketBeneficiary1 = await contracts.terminalV1.claimableOverflowOf(
        ticketBeneficiary1.address,
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary1
      );

      const expectNoOp = redeemableAmountOfTicketBeneficiary1.eq(0);

      await executeFn({
        caller: ticketBeneficiary1,
        contract: contracts.terminalV1,
        fn: "redeem",
        args: [
          ticketBeneficiary1.address,
          expectedProjectId,
          redeemableTicketsOfTicketBeneficiary1,
          redeemableAmountOfTicketBeneficiary1,
          redeemBeneficiary1,
          randomBoolFn()
        ],
        revert: expectNoOp && "TerminalV1::redeem: NO_OP"
      });

      // If the requested reverted with no op, the tickets wont be redeemed.
      const leftoverTicketsOfTicketBeneficiary1 = expectNoOp
        ? redeemableTicketsOfTicketBeneficiary1
        : BigNumber.from(0);

      return {
        redeemBeneficiary1,
        redeemableAmountOfTicketBeneficiary1,
        initialBalanceOfRedeemBeneficiary1,
        leftoverTicketsOfTicketBeneficiary1
      };
    }
  },
  {
    description:
      "The first redeem beneficiary received the correct amount of funds",
    fn: ({
      verifyBalanceFn,
      local: {
        redeemableAmountOfTicketBeneficiary1,
        redeemBeneficiary1,
        initialBalanceOfRedeemBeneficiary1
      }
    }) =>
      verifyBalanceFn({
        address: redeemBeneficiary1,
        expect: initialBalanceOfRedeemBeneficiary1.add(
          redeemableAmountOfTicketBeneficiary1
        )
      })
  },
  {
    description: "The first ticket beneficiary has no tickets left",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        ticketBeneficiary1,
        leftoverTicketsOfTicketBeneficiary1
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary1.address, expectedProjectId],
        expect: leftoverTicketsOfTicketBeneficiary1
      })
  },
  {
    description:
      "The terminalV1 should no longer have the funds sent to the first redeem beneificiary",
    fn: ({
      contracts,
      verifyBalanceFn,
      local: {
        paymentValue1,
        paymentValue2,
        paymentValue3,
        initialContractBalance,
        redeemableAmountOfTicketBeneficiary1
      }
    }) =>
      verifyBalanceFn({
        address: contracts.terminalV1.address,
        expect: initialContractBalance
          .add(paymentValue1.add(paymentValue2).add(paymentValue3))
          .sub(redeemableAmountOfTicketBeneficiary1)
      })
  },
  {
    description:
      "The second ticket beneficiary received the expected amount of tickets",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      constants,
      local: {
        reservedRate,
        expectedProjectId,
        ticketBeneficiary2,
        expectedTotalTicketsFromPayment2
      }
    }) => {
      const expectedRedeemableTicketsOfTicketBeneficiary2 = expectedTotalTicketsFromPayment2
        .mul(constants.MaxPercent.sub(reservedRate))
        .div(constants.MaxPercent);

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary2.address, expectedProjectId],
        expect: expectedRedeemableTicketsOfTicketBeneficiary2
      });

      return { expectedRedeemableTicketsOfTicketBeneficiary2 };
    }
  },
  {
    description:
      "A reconfiguration should activate the reconfiguration bonding curve",
    fn: async ({
      executeFn,
      randomBigNumberFn,
      contracts,
      constants,
      BigNumber,
      incrementFundingCycleIdFn,
      local: { owner, expectedProjectId }
    }) => {
      // Burn the unused funding cycle ID ID.
      incrementFundingCycleIdFn();
      await executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            target: randomBigNumberFn(),
            currency: randomBigNumberFn({ max: constants.MaxUint8 }),
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
            reservedRate: randomBigNumberFn({
              max: constants.MaxPercent
            }),
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
    }
  },
  {
    description:
      "The second ticket beneficiary has the expected amount of claimable funds using the reconfiguration bonding curve rate",
    fn: async ({
      contracts,
      bondingCurveFn,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        ticketBeneficiary2,
        paymentValue1,
        paymentValue2,
        paymentValue3,
        target,
        reconfigurationBondingCurveRate,
        redeemableTicketsOfTicketBeneficiary1,
        redeemableAmountOfTicketBeneficiary1,
        leftoverTicketsOfTicketBeneficiary1,
        expectedTotalTickets
      }
    }) => {
      // Get the stored ticket amount.
      const redeemableTicketsOfTicketBeneficiary2 = await contracts.ticketBooth.balanceOf(
        ticketBeneficiary2.address,
        expectedProjectId
      );

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "claimableOverflowOf",
        args: [
          ticketBeneficiary2.address,
          expectedProjectId,
          redeemableTicketsOfTicketBeneficiary2
        ],
        expect: bondingCurveFn({
          rate: reconfigurationBondingCurveRate,
          count: redeemableTicketsOfTicketBeneficiary2,
          total: expectedTotalTickets
            .sub(redeemableTicketsOfTicketBeneficiary1)
            .add(leftoverTicketsOfTicketBeneficiary1),
          overflow: paymentValue1
            .add(paymentValue2)
            .add(paymentValue3)
            .sub(target)
            .sub(redeemableAmountOfTicketBeneficiary1)
        }),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      });

      return {
        redeemableTicketsOfTicketBeneficiary2
      };
    }
  },
  {
    description:
      "The second ticket beneficiary tickets can be redeemed successfully",
    fn: async ({
      randomBoolFn,
      contracts,
      executeFn,
      getBalanceFn,
      randomAddressFn,
      BigNumber,
      local: {
        redeemableTicketsOfTicketBeneficiary2,
        expectedProjectId,
        ticketBeneficiary2
      }
    }) => {
      // An address that will be the beneficiary of funds when redeeming the first set of tickets.
      const redeemBeneficiary2 = randomAddressFn({
        // Can't be the ticket beneficiary because this account will spend on gas before the desired calculation is made.
        exclude: [ticketBeneficiary2.address]
      });

      const initialBalanceOfRedeemBeneficiary2 = await getBalanceFn(
        redeemBeneficiary2
      );

      // Get the stored claimable amount.
      const redeemableAmountOfTicketBeneficiary2 = await contracts.terminalV1.claimableOverflowOf(
        ticketBeneficiary2.address,
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary2
      );

      const expectNoOp = redeemableAmountOfTicketBeneficiary2.eq(0);

      await executeFn({
        caller: ticketBeneficiary2,
        contract: contracts.terminalV1,
        fn: "redeem",
        args: [
          ticketBeneficiary2.address,
          expectedProjectId,
          redeemableTicketsOfTicketBeneficiary2,
          redeemableAmountOfTicketBeneficiary2,
          redeemBeneficiary2,
          randomBoolFn()
        ],
        revert: expectNoOp && "TerminalV1::redeem: NO_OP"
      });

      // If the requested reverted with no op, the tickets wont be redeemed.
      const leftoverTicketsOfTicketBeneficiary2 = expectNoOp
        ? redeemableTicketsOfTicketBeneficiary2
        : BigNumber.from(0);

      return {
        redeemBeneficiary2,
        redeemableAmountOfTicketBeneficiary2,
        initialBalanceOfRedeemBeneficiary2,
        leftoverTicketsOfTicketBeneficiary2
      };
    }
  },
  {
    description:
      "The second redeem beneficiary received the correct amount of funds",
    fn: ({
      verifyBalanceFn,
      local: {
        redeemableAmountOfTicketBeneficiary2,
        redeemBeneficiary2,
        initialBalanceOfRedeemBeneficiary2
      }
    }) =>
      verifyBalanceFn({
        address: redeemBeneficiary2,
        expect: initialBalanceOfRedeemBeneficiary2.add(
          redeemableAmountOfTicketBeneficiary2
        )
      })
  },
  {
    description: "The second ticket beneficiary has no tickets left",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        ticketBeneficiary2,
        leftoverTicketsOfTicketBeneficiary2
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary2.address, expectedProjectId],
        expect: leftoverTicketsOfTicketBeneficiary2
      })
  },
  {
    description:
      "The terminalV1 should no longer have the funds sent to the second redeem beneificiary",
    fn: ({
      contracts,
      verifyBalanceFn,
      local: {
        paymentValue1,
        paymentValue2,
        paymentValue3,
        initialContractBalance,
        redeemableAmountOfTicketBeneficiary1,
        redeemableAmountOfTicketBeneficiary2
      }
    }) =>
      verifyBalanceFn({
        address: contracts.terminalV1.address,
        expect: initialContractBalance
          .add(paymentValue1.add(paymentValue2).add(paymentValue3))
          .sub(redeemableAmountOfTicketBeneficiary1)
          .sub(redeemableAmountOfTicketBeneficiary2)
      })
  },
  {
    description:
      "The third ticket beneficiary received the expected amount of tickets",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      constants,
      local: {
        reservedRate,
        expectedProjectId,
        ticketBeneficiary3,
        expectedTotalTicketsFromPayment3
      }
    }) => {
      const expectedRedeemableTicketsOfTicketBeneficiary3 = expectedTotalTicketsFromPayment3
        .mul(constants.MaxPercent.sub(reservedRate))
        .div(constants.MaxPercent);

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary3.address, expectedProjectId],
        expect: expectedRedeemableTicketsOfTicketBeneficiary3
      });

      return { expectedRedeemableTicketsOfTicketBeneficiary3 };
    }
  },
  {
    description: "Fast forward past to the ballot duration",
    fn: async ({ fastforwardFn, local: { ballot } }) =>
      fastforwardFn((await ballot.duration()).add(1))
  },
  {
    description:
      "The third ticket beneficiary has the expected amount of claimable funds",
    fn: async ({
      contracts,
      bondingCurveFn,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        ticketBeneficiary3,
        paymentValue1,
        paymentValue2,
        paymentValue3,
        target,
        bondingCurveRate,
        redeemableTicketsOfTicketBeneficiary1,
        redeemableTicketsOfTicketBeneficiary2,
        redeemableAmountOfTicketBeneficiary1,
        redeemableAmountOfTicketBeneficiary2,
        leftoverTicketsOfTicketBeneficiary1,
        leftoverTicketsOfTicketBeneficiary2,
        expectedTotalTickets
      }
    }) => {
      // Get the stored ticket amount.
      const redeemableTicketsOfTicketBeneficiary3 = await contracts.ticketBooth.balanceOf(
        ticketBeneficiary3.address,
        expectedProjectId
      );

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "claimableOverflowOf",
        args: [
          ticketBeneficiary3.address,
          expectedProjectId,
          redeemableTicketsOfTicketBeneficiary3
        ],
        expect: bondingCurveFn({
          rate: bondingCurveRate,
          count: redeemableTicketsOfTicketBeneficiary3,
          total: expectedTotalTickets
            .sub(redeemableTicketsOfTicketBeneficiary1)
            .add(leftoverTicketsOfTicketBeneficiary1)
            .sub(redeemableTicketsOfTicketBeneficiary2)
            .add(leftoverTicketsOfTicketBeneficiary2),
          overflow: paymentValue1
            .add(paymentValue2)
            .add(paymentValue3)
            .sub(target)
            .sub(redeemableAmountOfTicketBeneficiary1)
            .sub(redeemableAmountOfTicketBeneficiary2)
        }),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      });

      return {
        redeemableTicketsOfTicketBeneficiary3
      };
    }
  },
  {
    description:
      "The third ticket beneficiary tickets can be redeemed successfully",
    fn: async ({
      randomBoolFn,
      contracts,
      executeFn,
      getBalanceFn,
      randomAddressFn,
      BigNumber,
      local: {
        redeemableTicketsOfTicketBeneficiary3,
        expectedProjectId,
        ticketBeneficiary3
      }
    }) => {
      // An address that will be the beneficiary of funds when redeeming the first set of tickets.
      const redeemBeneficiary3 = randomAddressFn({
        // Can't be the ticket beneficiary because this account will spend on gas before the desired calculation is made.
        exclude: [ticketBeneficiary3.address]
      });

      const initialBalanceOfRedeemBeneficiary3 = await getBalanceFn(
        redeemBeneficiary3
      );

      // Get the stored claimable amount.
      const redeemableAmountOfTicketBeneficiary3 = await contracts.terminalV1.claimableOverflowOf(
        ticketBeneficiary3.address,
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary3
      );

      const expectNoOp = redeemableAmountOfTicketBeneficiary3.eq(0);

      await executeFn({
        caller: ticketBeneficiary3,
        contract: contracts.terminalV1,
        fn: "redeem",
        args: [
          ticketBeneficiary3.address,
          expectedProjectId,
          redeemableTicketsOfTicketBeneficiary3,
          redeemableAmountOfTicketBeneficiary3,
          redeemBeneficiary3,
          randomBoolFn()
        ],
        revert: expectNoOp && "TerminalV1::redeem: NO_OP"
      });

      // If the requested reverted with no op, the tickets wont be redeemed.
      const leftoverTicketsOfTicketBeneficiary3 = expectNoOp
        ? redeemableTicketsOfTicketBeneficiary3
        : BigNumber.from(0);

      return {
        redeemBeneficiary3,
        redeemableAmountOfTicketBeneficiary3,
        initialBalanceOfRedeemBeneficiary3,
        leftoverTicketsOfTicketBeneficiary3
      };
    }
  },
  {
    description:
      "The third redeem beneficiary received the correct amount of funds",
    fn: ({
      verifyBalanceFn,
      local: {
        redeemableAmountOfTicketBeneficiary3,
        redeemBeneficiary3,
        initialBalanceOfRedeemBeneficiary3
      }
    }) =>
      verifyBalanceFn({
        address: redeemBeneficiary3,
        expect: initialBalanceOfRedeemBeneficiary3.add(
          redeemableAmountOfTicketBeneficiary3
        )
      })
  },
  {
    description: "The first ticket beneficiary has no tickets left",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        ticketBeneficiary3,
        leftoverTicketsOfTicketBeneficiary3
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary3.address, expectedProjectId],
        expect: leftoverTicketsOfTicketBeneficiary3
      })
  },
  {
    description:
      "The terminalV1 should no longer have the funds sent to the second redeem beneificiary",
    fn: ({
      contracts,
      verifyBalanceFn,
      local: {
        paymentValue1,
        paymentValue2,
        paymentValue3,
        initialContractBalance,
        redeemableAmountOfTicketBeneficiary1,
        redeemableAmountOfTicketBeneficiary2,
        redeemableAmountOfTicketBeneficiary3
      }
    }) =>
      verifyBalanceFn({
        address: contracts.terminalV1.address,
        expect: initialContractBalance
          .add(paymentValue1.add(paymentValue2).add(paymentValue3))
          .sub(redeemableAmountOfTicketBeneficiary1)
          .sub(redeemableAmountOfTicketBeneficiary2)
          .sub(redeemableAmountOfTicketBeneficiary3)
      })
  },
  {
    description: "Print the reserved tickets for the owner of the project",
    fn: ({
      executeFn,
      randomSignerFn,
      contracts,
      local: { expectedProjectId }
    }) =>
      executeFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "printReservedTickets",
        args: [expectedProjectId]
      })
  },
  {
    description: "The owner has the correct ticket balance",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedTotalTickets,
        expectedRedeemableTicketsOfTicketBeneficiary1,
        expectedRedeemableTicketsOfTicketBeneficiary2,
        expectedRedeemableTicketsOfTicketBeneficiary3,
        expectedProjectId,
        owner
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [owner.address, expectedProjectId],
        expect: expectedTotalTickets
          .sub(expectedRedeemableTicketsOfTicketBeneficiary1)
          .sub(expectedRedeemableTicketsOfTicketBeneficiary2)
          .sub(expectedRedeemableTicketsOfTicketBeneficiary3),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100000
        }
      })
  },
  {
    description: "The owners' balance is the expected total ticket balance",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedTotalTickets,
        redeemableTicketsOfTicketBeneficiary1,
        redeemableTicketsOfTicketBeneficiary2,
        redeemableTicketsOfTicketBeneficiary3,
        leftoverTicketsOfTicketBeneficiary1,
        leftoverTicketsOfTicketBeneficiary2,
        leftoverTicketsOfTicketBeneficiary3,
        expectedProjectId
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "totalSupplyOf",
        args: [expectedProjectId],
        expect: expectedTotalTickets
          .sub(redeemableTicketsOfTicketBeneficiary1)
          .add(leftoverTicketsOfTicketBeneficiary1)
          .sub(redeemableTicketsOfTicketBeneficiary2)
          .add(leftoverTicketsOfTicketBeneficiary2)
          .sub(redeemableTicketsOfTicketBeneficiary3)
          .add(leftoverTicketsOfTicketBeneficiary3),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100000
        }
      })
  },
  {
    description: "The remaining overflow should be correct",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        paymentValue1,
        paymentValue2,
        paymentValue3,
        redeemableAmountOfTicketBeneficiary1,
        redeemableAmountOfTicketBeneficiary2,
        redeemableAmountOfTicketBeneficiary3,
        target,
        expectedProjectId
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "currentOverflowOf",
        args: [expectedProjectId],
        expect: paymentValue1
          .add(paymentValue2)
          .add(paymentValue3)
          .sub(target)
          .sub(redeemableAmountOfTicketBeneficiary1)
          .sub(redeemableAmountOfTicketBeneficiary2)
          .sub(redeemableAmountOfTicketBeneficiary3),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      })
  },
  {
    description:
      "The expected redeem amount for the owner's portion should match the claimable overflow for all its tickets",
    // "The expected redeem amount for the owner's portion should match the remainder of overflow",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      bondingCurveFn,
      local: { expectedProjectId, owner, bondingCurveRate }
    }) => {
      const reservedTicketBalance = await contracts.ticketBooth.balanceOf(
        owner.address,
        expectedProjectId
      );

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "claimableOverflowOf",
        args: [owner.address, expectedProjectId, reservedTicketBalance],
        expect: bondingCurveFn({
          rate: bondingCurveRate,
          count: reservedTicketBalance,
          total: await contracts.ticketBooth.totalSupplyOf(expectedProjectId),
          overflow: await contracts.terminalV1.currentOverflowOf(expectedProjectId)
        }),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      });

      return { reservedTicketBalance };
    }
  },
  {
    description: "The owner can redeem successfully",
    fn: async ({
      executeFn,
      contracts,
      randomBoolFn,
      getBalanceFn,
      randomAddressFn,
      BigNumber,
      local: { expectedProjectId, owner, reservedTicketBalance }
    }) => {
      // An address that will be the beneficiary of funds when redeeming the reserved set of tickets.
      const redeemBeneficiary4 = randomAddressFn({
        // Can't be the ticket beneficiary because this account will spend on gas before the desired calculation is made.
        exclude: [owner.address]
      });

      const initialBalanceOfRedeemBeneficiary4 = await getBalanceFn(
        redeemBeneficiary4
      );

      const claimableOverflow = await contracts.terminalV1.claimableOverflowOf(
        owner.address,
        expectedProjectId,
        reservedTicketBalance
      );

      const expectNoOp = reservedTicketBalance.eq(0) || claimableOverflow.eq(0);

      await executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "redeem",
        args: [
          owner.address,
          expectedProjectId,
          reservedTicketBalance,
          claimableOverflow,
          redeemBeneficiary4,
          randomBoolFn()
        ],
        revert: expectNoOp && "TerminalV1::redeem: NO_OP"
      });

      // If the requested reverted with no op, the tickets wont be redeemed.
      const leftoverReservedTickets = expectNoOp
        ? reservedTicketBalance
        : BigNumber.from(0);
      return {
        redeemBeneficiary4,
        initialBalanceOfRedeemBeneficiary4,
        claimableOverflow,
        leftoverReservedTickets
      };
    }
  },
  {
    description: "The beneficiary received the correct amount of funds",
    fn: ({
      verifyBalanceFn,
      local: {
        redeemBeneficiary4,
        claimableOverflow,
        initialBalanceOfRedeemBeneficiary4
      }
    }) =>
      verifyBalanceFn({
        address: redeemBeneficiary4,
        expect: initialBalanceOfRedeemBeneficiary4.add(claimableOverflow)
      })
  },
  {
    description: "There should only be the expected leftover tickets left",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        expectedProjectId,
        leftoverTicketsOfTicketBeneficiary1,
        leftoverTicketsOfTicketBeneficiary2,
        leftoverTicketsOfTicketBeneficiary3,
        leftoverReservedTickets
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "totalSupplyOf",
        args: [expectedProjectId],
        expect: leftoverTicketsOfTicketBeneficiary1
          .add(leftoverTicketsOfTicketBeneficiary2)
          .add(leftoverTicketsOfTicketBeneficiary3)
          .add(leftoverReservedTickets)
      })
  }
];
