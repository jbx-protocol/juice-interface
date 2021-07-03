/** 
  Ticket holders of a project should be able to redeem their tickets for a portion of the
  project's overflow propertional to a bonding curve formula.

  The bonding curve rate that tunes the bonding curve formula gets configured by the project.
*/

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
      incrementFundingCycleIdFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();

      // Burn a funding cycle id.
      incrementFundingCycleIdFn();

      // The owner of the project that will migrate.
      const owner = randomSignerFn();

      // An account that will be used to make payments.
      const payer = randomSignerFn();

      // Three payments will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue1 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      const paymentValue2 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      const paymentValue3 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      // The project's funding cycle target will at most be the sum of all payments.
      const target = randomBigNumberFn({
        max: paymentValue1.add(paymentValue2).add(paymentValue3)
      });

      // The currency will be 0, which corresponds to ETH.
      const currency = 0;

      // The discount rate of the project can be random.
      const discountRate = randomBigNumberFn({ max: constants.MaxPercent });

      // Set a random percentage of tickets to reserve for the project owner.
      const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });

      // Set a random bonding curve rate if there is a discount rate. Otherwise it should be 100%.
      const bondingCurveRate = BigNumber.from(0);
      // discountRate.eq(0)
      //   ? BigNumber.from(constants.MaxPercent)
      //   : randomBigNumberFn({
      //       max: constants.MaxPercent
      //     });

      console.log({
        paymentValue1,
        paymentValue2,
        paymentValue3,
        reservedRate,
        bondingCurveRate
      });
      await executeFn({
        caller: deployer,
        contract: contracts.juicer,
        fn: "deploy",
        args: [
          owner.address,
          randomBytesFn({
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
            cycleLimit: randomBigNumberFn({ max: constants.MaxCycleLimit }),
            discountRate,
            ballot: constants.AddressZero
          },
          {
            reservedRate,
            bondingCurveRate,
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
        target,
        reservedRate,
        bondingCurveRate,
        payer,
        paymentValue1,
        paymentValue2,
        paymentValue3,
        initialContractBalance: await getBalanceFn(contracts.juicer.address)
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
      const ticketBeneficiary1 = randomSignerFn({ exclude: [owner.address] });

      await executeFn({
        caller: payer,
        contract: contracts.juicer,
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

      console.log({
        expectedRedeemableTicketsOfTicketBeneficiary1
      });
      await executeFn({
        caller: ticketBeneficiary1,
        contract: contracts.juicer,
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
          ? "Juicer::claimableOverflow: INSUFFICIENT_TICKETS"
          : "Juicer::redeem: NO_OP"
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
        contract: contracts.juicer,
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
        contract: contracts.juicer,
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
    description: "The project's balance should match the payment just made",
    fn: ({
      checkFn,
      contracts,
      randomAddressFn,
      local: { expectedProjectId, paymentValue1, paymentValue2, paymentValue3 }
    }) =>
      checkFn({
        caller: randomAddressFn(),
        contract: contracts.juicer,
        fn: "balanceOf",
        args: [expectedProjectId],
        expect: paymentValue1.add(paymentValue2).add(paymentValue3)
      })
  },
  {
    description: "The juicer should have the funds from the payments",
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
        address: contracts.juicer.address,
        expect: initialContractBalance.add(
          paymentValue1.add(paymentValue2).add(paymentValue3)
        )
      })
  },
  {
    description:
      "Make sure the first ticket beneficiary tickets can be redeemed successfully",
    fn: async ({
      randomBoolFn,
      contracts,
      executeFn,
      bondingCurveFn,
      getBalanceFn,
      randomAddressFn,
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
      // An address that will be the beneficiary of funds when redeeming the first set of tickets.
      const redeemBeneficiary1 = randomAddressFn({
        // Can't be the ticket beneficiary because this account will spend on gas before the desired calculation is made.
        exclude: [ticketBeneficiary1.address]
      });

      console.log({
        redeemBeneficiary1,
        ticketBeneficiary1: ticketBeneficiary1.address
      });
      const initialBalanceOfRedeemBeneficiary1 = await getBalanceFn(
        redeemBeneficiary1
      );

      const expectedTotalTicketsFromPayment2 = paymentValue2.mul(
        constants.InitialWeightMultiplier
      );

      const expectedTotalTicketsFromPayment3 = paymentValue3.mul(
        constants.InitialWeightMultiplier
      );

      const expectedTotalTickets = expectedTotalTicketsFromPayment1
        .add(expectedTotalTicketsFromPayment2)
        .add(expectedTotalTicketsFromPayment3);

      console.log("asdf", {
        rate: bondingCurveRate,
        count: expectedRedeemableTicketsOfTicketBeneficiary1,
        total: expectedTotalTickets,
        overflow: paymentValue1
          .add(paymentValue2)
          .add(paymentValue3)
          .sub(target)
      });
      const expectedRedeemableAmountOfTicketBeneficiary1 = bondingCurveFn({
        rate: bondingCurveRate,
        count: expectedRedeemableTicketsOfTicketBeneficiary1,
        total: expectedTotalTickets,
        overflow: paymentValue1
          .add(paymentValue2)
          .add(paymentValue3)
          .sub(target)
      });

      await executeFn({
        caller: ticketBeneficiary1,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem all available tickets.
        args: [
          ticketBeneficiary1.address,
          expectedProjectId,
          expectedRedeemableTicketsOfTicketBeneficiary1,
          expectedRedeemableAmountOfTicketBeneficiary1,
          redeemBeneficiary1,
          randomBoolFn()
        ],
        revert:
          expectedRedeemableAmountOfTicketBeneficiary1.eq(0) &&
          "Juicer::redeem: NO_OP"
      });

      return {
        redeemBeneficiary1,
        expectedRedeemableAmountOfTicketBeneficiary1,
        expectedRedeemableTicketsOfTicketBeneficiary1,
        initialBalanceOfRedeemBeneficiary1,
        expectedTotalTicketsFromPayment2,
        expectedTotalTicketsFromPayment3,
        expectedTotalTickets
      };
    }
  },
  {
    description:
      "Make sure the first redeem beneficiary received the correct amount of funds",
    fn: ({
      verifyBalanceFn,
      local: {
        expectedRedeemableAmountOfTicketBeneficiary1,
        redeemBeneficiary1,
        initialBalanceOfRedeemBeneficiary1
      }
    }) =>
      verifyBalanceFn({
        address: redeemBeneficiary1,
        expect: initialBalanceOfRedeemBeneficiary1.add(
          expectedRedeemableAmountOfTicketBeneficiary1
        ),
        plusMinus: {
          accuracy: 999999999999999,
          precision: 1000000000000000
        }
      })
  },
  {
    description:
      "Make sure the second ticket beneficiary tickets can be redeemed successfully",
    fn: async ({
      executeFn,
      contracts,
      randomBoolFn,
      bondingCurveFn,
      getBalanceFn,
      randomAddressFn,
      constants,
      local: {
        bondingCurveRate,
        reservedRate,
        expectedProjectId,
        ticketBeneficiary2,
        expectedTotalTicketsFromPayment2,
        expectedTotalTickets,
        paymentValue1,
        paymentValue2,
        paymentValue3,
        target,
        expectedRedeemableAmountOfTicketBeneficiary1,
        expectedRedeemableTicketsOfTicketBeneficiary1
      }
    }) => {
      // An address that will be the beneficiary of funds when redeeming the second set of tickets.
      const redeemBeneficiary2 = randomAddressFn({
        // Can't be the ticket beneficiary because this account will spend on gas before the desired calculation is made.
        exclude: [ticketBeneficiary2.address]
      });

      console.log({
        redeemBeneficiary2,
        ticketBeneficiary1: ticketBeneficiary2.address
      });
      const initialBalanceOfRedeemBeneficiary2 = await getBalanceFn(
        redeemBeneficiary2
      );

      const expectedRedeemableTicketsOfTicketBeneficiary2 = expectedTotalTicketsFromPayment2
        .mul(constants.MaxPercent.sub(reservedRate))
        .div(constants.MaxPercent);

      console.log({
        expectedRedeemableTicketsOfTicketBeneficiary2
      });
      const expectedRedeemableAmountOfTicketBeneficiary2 = bondingCurveFn({
        rate: bondingCurveRate,
        count: expectedRedeemableTicketsOfTicketBeneficiary2,
        total: expectedTotalTickets.sub(
          expectedRedeemableTicketsOfTicketBeneficiary1
        ),
        overflow: paymentValue1
          .add(paymentValue2)
          .add(paymentValue3)
          .sub(target)
          .sub(expectedRedeemableAmountOfTicketBeneficiary1)
      });
      console.log({
        meep: expectedRedeemableAmountOfTicketBeneficiary2,
        moop: await contracts.juicer.claimableOverflowOf(
          ticketBeneficiary2.address,
          expectedProjectId,
          await contracts.ticketBooth.balanceOf(
            ticketBeneficiary2.address,
            expectedProjectId
          )
        )
      });
      await executeFn({
        caller: ticketBeneficiary2,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem all available tickets.
        args: [
          ticketBeneficiary2.address,
          expectedProjectId,
          expectedRedeemableTicketsOfTicketBeneficiary2,
          expectedRedeemableAmountOfTicketBeneficiary2
            .mul(999999999999999)
            .div(1000000000000000),
          redeemBeneficiary2,
          randomBoolFn()
        ],
        revert:
          expectedRedeemableAmountOfTicketBeneficiary2.eq(0) &&
          "Juicer::redeem: NO_OP"
      });

      return {
        redeemBeneficiary2,
        initialBalanceOfRedeemBeneficiary2,
        expectedRedeemableAmountOfTicketBeneficiary2,
        expectedRedeemableTicketsOfTicketBeneficiary2
      };
    }
  },
  {
    description:
      "Make sure the second redeem beneficiary received the correct amount of funds",
    fn: ({
      verifyBalanceFn,
      local: {
        expectedRedeemableAmountOfTicketBeneficiary2,
        redeemBeneficiary2,
        initialBalanceOfRedeemBeneficiary2
      }
    }) =>
      verifyBalanceFn({
        address: redeemBeneficiary2,
        expect: initialBalanceOfRedeemBeneficiary2.add(
          expectedRedeemableAmountOfTicketBeneficiary2
        ),
        plusMinus: {
          accuracy: 999999,
          precision: 1000000
        }
      })
  },
  {
    description:
      "Make sure the third ticket beneficiary tickets can be redeemed successfully",
    fn: async ({
      executeFn,
      randomBoolFn,
      getBalanceFn,
      bondingCurveFn,
      randomAddressFn,
      contracts,
      constants,
      local: {
        reservedRate,
        bondingCurveRate,
        expectedProjectId,
        ticketBeneficiary3,
        expectedTotalTicketsFromPayment3,
        expectedRedeemableTicketsOfTicketBeneficiary1,
        expectedRedeemableTicketsOfTicketBeneficiary2,
        expectedTotalTickets,
        paymentValue1,
        paymentValue2,
        paymentValue3,
        target,
        expectedRedeemableAmountOfTicketBeneficiary1,
        expectedRedeemableAmountOfTicketBeneficiary2
      }
    }) => {
      // An address that will be the beneficiary of funds when redeeming the third set of tickets.
      const redeemBeneficiary3 = randomAddressFn({
        // Can't be the ticket beneficiary because this account will spend on gas before the desired calculation is made.
        exclude: [ticketBeneficiary3.address]
      });

      const initialBalanceOfRedeemBeneficiary3 = await getBalanceFn(
        redeemBeneficiary3
      );

      const expectedRedeemableTicketsOfTicketBeneficiary3 = expectedTotalTicketsFromPayment3
        .mul(constants.MaxPercent.sub(reservedRate))
        .div(constants.MaxPercent);

      const expectedRedeemableAmountOfTicketBeneficiary3 = bondingCurveFn({
        rate: bondingCurveRate,
        count: expectedRedeemableTicketsOfTicketBeneficiary3,
        total: expectedTotalTickets
          .sub(expectedRedeemableTicketsOfTicketBeneficiary1)
          .sub(expectedRedeemableTicketsOfTicketBeneficiary2),
        overflow: paymentValue1
          .add(paymentValue2)
          .add(paymentValue3)
          .sub(target)
          .sub(expectedRedeemableAmountOfTicketBeneficiary1)
          .sub(expectedRedeemableAmountOfTicketBeneficiary2)
      });
      console.log({
        expectedRedeemableTicketsOfTicketBeneficiary3,
        expectedRedeemableAmountOfTicketBeneficiary3,
        muldiv: expectedRedeemableAmountOfTicketBeneficiary3
          .mul(999999999999999)
          .div(1000000000000000)
      });

      const minimumAmountReturned = expectedRedeemableAmountOfTicketBeneficiary3
        .mul(999999999999999)
        .div(1000000000000000);

      await executeFn({
        caller: ticketBeneficiary3,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem all available tickets.
        args: [
          ticketBeneficiary3.address,
          expectedProjectId,
          expectedRedeemableTicketsOfTicketBeneficiary3,
          minimumAmountReturned,
          redeemBeneficiary3,
          randomBoolFn()
        ],
        revert:
          (expectedRedeemableAmountOfTicketBeneficiary3.eq(0) ||
            minimumAmountReturned.eq(0)) &&
          "Juicer::redeem: NO_OP"
      });

      return {
        redeemBeneficiary3,
        initialBalanceOfRedeemBeneficiary3,
        expectedRedeemableAmountOfTicketBeneficiary3,
        expectedRedeemableTicketsOfTicketBeneficiary3
      };
    }
  },
  {
    description:
      "Make sure the third redeem beneficiary received the correct amount of funds",
    fn: ({
      verifyBalanceFn,
      local: {
        initialBalanceOfRedeemBeneficiary3,
        redeemBeneficiary3,
        expectedRedeemableAmountOfTicketBeneficiary3
      }
    }) =>
      verifyBalanceFn({
        address: redeemBeneficiary3,
        expect: initialBalanceOfRedeemBeneficiary3.add(
          expectedRedeemableAmountOfTicketBeneficiary3
        ),
        plusMinus: {
          accuracy: 999999999999999,
          precision: 1000000000000000
        }
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
        contract: contracts.juicer,
        fn: "printReservedTickets",
        args: [expectedProjectId]
      })
  },
  {
    description: "Make sure the owner has the correct ticket balance",
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
        // Tolerate a small difference.
        plusMinus: {
          accuracy: 999999999999999,
          precision: 1000000000000000
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
      local: {
        expectedProjectId,
        owner,
        paymentValue1,
        paymentValue2,
        paymentValue3,
        target,
        expectedRedeemableAmountOfTicketBeneficiary1,
        expectedRedeemableAmountOfTicketBeneficiary2,
        expectedRedeemableAmountOfTicketBeneficiary3,
        bondingCurveRate,
        reservedRate
      }
    }) => {
      const expectedReservedAmount = paymentValue1
        .add(paymentValue2)
        .add(paymentValue3)
        .sub(target)
        .sub(expectedRedeemableAmountOfTicketBeneficiary1)
        .sub(expectedRedeemableAmountOfTicketBeneficiary2)
        .sub(expectedRedeemableAmountOfTicketBeneficiary3);

      console.log({
        paymentValue1,
        paymentValue2,
        paymentValue3,
        target,
        expectedRedeemableAmountOfTicketBeneficiary1,
        expectedRedeemableAmountOfTicketBeneficiary2,
        expectedRedeemableAmountOfTicketBeneficiary3,
        bondingCurveRate,
        reservedRate,
        expected: expectedReservedAmount,
        actual: await contracts.juicer.claimableOverflowOf(
          owner.address,
          expectedProjectId,
          await contracts.ticketBooth.balanceOf(
            owner.address,
            expectedProjectId
          )
        )
      });

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.juicer,
        fn: "claimableOverflowOf",
        args: [
          owner.address,
          expectedProjectId,
          await contracts.ticketBooth.balanceOf(
            owner.address,
            expectedProjectId
          )
        ],
        expect: expectedReservedAmount,
        // Tolerate a small difference.
        plusMinus: {
          accuracy: 999999999999999,
          precision: 1000000000000000
        }
      });
    }
  },
  {
    description: "Make sure the owner can redeem successfully",
    fn: async ({
      executeFn,
      contracts,
      randomBoolFn,
      getBalanceFn,
      randomAddressFn,
      local: { expectedProjectId, owner }
    }) => {
      // An address that will be the beneficiary of funds when redeeming the reserved set of tickets.
      const redeemBeneficiary4 = randomAddressFn({
        // Can't be the ticket beneficiary because this account will spend on gas before the desired calculation is made.
        exclude: [owner.address]
      });

      const initialBalanceOfRedeemBeneficiary4 = await getBalanceFn(
        redeemBeneficiary4
      );

      const ticketBalance = await contracts.ticketBooth.balanceOf(
        owner.address,
        expectedProjectId
      );
      const claimableOverflow = await contracts.juicer.claimableOverflowOf(
        owner.address,
        expectedProjectId,
        await contracts.ticketBooth.balanceOf(owner.address, expectedProjectId)
      );
      console.log({
        ticketBalance,
        claimableOverflow,
        totalO: await contracts.juicer.currentOverflowOf(expectedProjectId),
        owner: owner.address,
        redeemBeneficiary4,
        totalSupply: await contracts.ticketBooth.totalSupplyOf(
          expectedProjectId
        )
      });
      await executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "redeem",
        args: [
          owner.address,
          expectedProjectId,
          ticketBalance,
          claimableOverflow,
          redeemBeneficiary4,
          randomBoolFn()
        ],
        revert:
          (ticketBalance.eq(0) || claimableOverflow.eq(0)) &&
          "Juicer::redeem: NO_OP"
      });
      return {
        redeemBeneficiary4,
        initialBalanceOfRedeemBeneficiary4,
        claimableOverflow
      };
    }
  },
  {
    description:
      "Make sure the beneficiary received the correct amount of funds",
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
    description: "The contract should just have the target funds in it left",
    fn: async ({
      verifyBalanceFn,
      contracts,
      getBalanceFn,
      local: { target, initialContractBalance }
    }) => {
      console.log({
        exp: initialContractBalance.add(target),
        act: await getBalanceFn(contracts.juicer.address)
      });
      await verifyBalanceFn({
        address: contracts.juicer.address,
        expect: initialContractBalance.add(target),
        // Tolerate a small difference.
        plusMinus: {
          accuracy: 999999999999990, // if the expected value is 0, tolerate up to 10 plus or minus.
          precision: 1000000000000000
        }
      });
    }
  }
];
