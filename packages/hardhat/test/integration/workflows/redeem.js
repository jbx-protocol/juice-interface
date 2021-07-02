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
      addrs,
      deployer,
      BigNumber,
      stringToBytesFn,
      randomStringFn,
      getBalanceFn,
      randomBigNumberFn,
      constants,
      contracts,
      incrementProjectIdFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();

      // The owner of the project that will migrate.
      const owner = addrs[0];

      // An account that will be used to make payments.
      const payer = addrs[1];

      // Three payments will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily find a number less than a fourth so that all payments can be made successfully.
      const paymentValue1 = randomBigNumberFn({
        max: (await getBalanceFn(payer.address)).div(4)
      });

      const paymentValue2 = randomBigNumberFn({
        max: (await getBalanceFn(payer.address)).div(4)
      });

      const paymentValue3 = randomBigNumberFn({
        max: (await getBalanceFn(payer.address)).div(4)
      });

      // The project's funding cycle target will at least by the first payment value,
      // and at most be the minimum plus 1/4 of the value of the second and third payments. Leaving plenty of overflow.
      // The minimum will be used to test redeeming with no overflow.
      const target = randomBigNumberFn({
        min: paymentValue1,
        max: paymentValue1.add(paymentValue2.add(paymentValue3).div(4))
      });

      // The currency will be 0, which corresponds to ETH.
      const currency = 0;

      // The discount rate of the project can be random.
      const discountRate = randomBigNumberFn({ max: constants.MaxPercent });

      // Set a random percentage of tickets to reserve for the project owner.
      const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });

      // Set a random bonding curve rate if there is a discount rate. Otherwise it should be 100%.
      const bondingCurveRate = discountRate.eq(0)
        ? BigNumber.from(constants.MaxPercent)
        : randomBigNumberFn({
            max: constants.MaxPercent
          });

      await executeFn({
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
        paymentValue1
      };
    }
  },
  {
    description: "Make a payment to the project",
    fn: async ({
      executeFn,
      randomBoolFn,
      randomStringFn,
      addrs,
      contracts,
      local: { expectedProjectId, payer, paymentValue1 }
    }) => {
      // An account that will be distributed tickets in the first payment.
      const ticketBeneficiary1 = addrs[2];
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
      contracts,
      addrs,
      local: { expectedProjectId, ticketBeneficiary1 }
    }) => {
      // An address that will be the beneficiary of funds when redeeming the reserved set of tickets.
      const redeemBeneficiary4 = addrs[8];

      await executeFn({
        caller: ticketBeneficiary1,
        contract: contracts.juicer,
        fn: "redeem",
        args: [
          ticketBeneficiary1.address,
          expectedProjectId,
          1,
          0,
          redeemBeneficiary4.address,
          randomBoolFn()
        ],
        revert: "Juicer::redeem: NO_OP"
      });

      return { redeemBeneficiary4 };
    }
  },
  {
    description:
      "Make another payment to the project, sending tickets to a different beneficiary",
    fn: async ({
      addrs,
      executeFn,
      contracts,
      randomStringFn,
      randomBoolFn,
      local: { payer, expectedProjectId, paymentValue2 }
    }) => {
      // An account that will be distributed tickets in the second payment.
      const ticketBeneficiary2 = addrs[3];

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
      addrs,
      contracts,
      local: { payer, expectedProjectId, paymentValue3 }
    }) => {
      // An account that will be distributed tickets in the third payment.
      const ticketBeneficiary3 = addrs[4];

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
      deployer,
      contracts,
      local: { paymentValue1, paymentValue2, paymentValue3 }
    }) =>
      checkFn({
        contract: deployer.provider,
        fn: "getBalance",
        args: [contracts.juicer.address],
        expect: paymentValue1.add(paymentValue2).add(paymentValue3)
      })
  },
  {
    description:
      "Pass along a references to the amount of tickets the beneficiaries received",
    fn: async ({
      contracts,
      local: {
        expectedProjectId,
        ticketBeneficiary1,
        ticketBeneficiary2,
        ticketBeneficiary3
      }
    }) => ({
      redeemableTicketsOfTicketBeneficiary1: await contracts.ticketBooth.balanceOf(
        ticketBeneficiary1.address,
        expectedProjectId
      ),
      redeemableTicketsOfTicketBeneficiary2: await contracts.ticketBooth.balanceOf(
        ticketBeneficiary2.address,
        expectedProjectId
      ),
      redeemableTicketsOfTicketBeneficiary3: await contracts.ticketBooth.balanceOf(
        ticketBeneficiary3.address,
        expectedProjectId
      )
    })
  },
  {
    description:
      "Pass along a reference to the claimable overflow of the first ticket beneficiary",
    fn: async ({
      contracts,
      local: {
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary1,
        ticketBeneficiary1
      }
    }) => ({
      claimableOverflowOfTicketBeneficiary1: await contracts.juicer.claimableOverflowOf(
        ticketBeneficiary1.address,
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary1
      )
    })
  },
  {
    description:
      "Pass along a reference to what would be the claimable overflow of the third ticket beneficiary",
    fn: async ({
      contracts,
      local: {
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary3,
        ticketBeneficiary3
      }
    }) => ({
      claimableOverflowOfTicketBeneficiary3: await contracts.juicer.claimableOverflowOf(
        ticketBeneficiary3.address,
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary3
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
      addrs,
      local: {
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary1,
        claimableOverflowOfTicketBeneficiary1,
        ticketBeneficiary1
      }
    }) => {
      // An address that will be the beneficiary of funds when redeeming the first set of tickets.
      const redeemBeneficiary1 = addrs[5];

      await executeFn({
        caller: ticketBeneficiary1,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem all available tickets.
        args: [
          ticketBeneficiary1.address,
          expectedProjectId,
          redeemableTicketsOfTicketBeneficiary1,
          // Don't allow subtraction from 0.
          claimableOverflowOfTicketBeneficiary1,
          redeemBeneficiary1.address,
          randomBoolFn()
        ]
      });

      return { redeemBeneficiary1 };
    }
  },
  {
    description:
      "Make sure the redeem beneficiary received the correct amount of funds",
    fn: ({
      verifyBalanceFn,
      local: { claimableOverflowOfTicketBeneficiary1, redeemBeneficiary1 }
    }) =>
      verifyBalanceFn({
        address: redeemBeneficiary1.address,
        expect: claimableOverflowOfTicketBeneficiary1
      })
  },
  {
    description:
      "Make sure the new claimable overflow is greater than what wouldve been claimable before the first beneficiary redeemed",
    fn: async ({
      constants,
      contracts,
      expectFn,
      local: {
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary3,
        claimableOverflowOfTicketBeneficiary3,
        ticketBeneficiary3,
        bondingCurveRate
      }
    }) => {
      const updatedClaimableOverflowOfTicketBeneficiary3 = await contracts.juicer.claimableOverflowOf(
        ticketBeneficiary3.address,
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary3
      );

      expectFn(
        bondingCurveRate.eq(constants.MaxPercent)
          ? // Allow off-by-one
            updatedClaimableOverflowOfTicketBeneficiary3.eq(
              claimableOverflowOfTicketBeneficiary3
            ) ||
              updatedClaimableOverflowOfTicketBeneficiary3.gt(
                claimableOverflowOfTicketBeneficiary3.sub(1)
              ) ||
              updatedClaimableOverflowOfTicketBeneficiary3.lt(
                claimableOverflowOfTicketBeneficiary3.add(1)
              )
          : updatedClaimableOverflowOfTicketBeneficiary3.gt(
              claimableOverflowOfTicketBeneficiary3
            )
      ).to.equal(true);

      return {
        claimableOverflowOfTicketBeneficiary3: updatedClaimableOverflowOfTicketBeneficiary3
      };
    }
  },
  {
    description:
      "Pass along a reference to the claimable overflow of the first ticket beneficiary",
    fn: async ({
      contracts,
      local: {
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary2,
        ticketBeneficiary2
      }
    }) => ({
      claimableOverflowOfTicketBeneficiary2: await contracts.juicer.claimableOverflowOf(
        ticketBeneficiary2.address,
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary2
      )
    })
  },
  {
    description:
      "Make sure the second ticket beneficiary tickets can be redeemed successfully",
    fn: async ({
      addrs,
      executeFn,
      contracts,
      randomBoolFn,
      local: {
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary2,
        claimableOverflowOfTicketBeneficiary2,
        ticketBeneficiary2
      }
    }) => {
      // An address that will be the beneficiary of funds when redeeming the second set of tickets.
      const redeemBeneficiary2 = addrs[6];

      await executeFn({
        caller: ticketBeneficiary2,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem all available tickets.
        args: [
          ticketBeneficiary2.address,
          expectedProjectId,
          redeemableTicketsOfTicketBeneficiary2,
          claimableOverflowOfTicketBeneficiary2,
          redeemBeneficiary2.address,
          randomBoolFn()
        ]
      });

      return { redeemBeneficiary2 };
    }
  },
  {
    description:
      "Make sure the redeem beneficiary received the correct amount of funds",
    fn: ({
      verifyBalanceFn,
      local: { claimableOverflowOfTicketBeneficiary2, redeemBeneficiary2 }
    }) =>
      verifyBalanceFn({
        address: redeemBeneficiary2.address,
        expect: claimableOverflowOfTicketBeneficiary2
      })
  },
  {
    description:
      "Make sure the new claimable overflow is greater than what wouldve been claimable before the first beneficiary redeemed",
    fn: async ({
      expectFn,
      contracts,
      constants,
      local: {
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary3,
        claimableOverflowOfTicketBeneficiary3,
        ticketBeneficiary3,
        bondingCurveRate
      }
    }) => {
      const updatedClaimableOverflowOfTicketBeneficiary3 = await contracts.juicer.claimableOverflowOf(
        ticketBeneficiary3.address,
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary3
      );

      expectFn(
        bondingCurveRate.eq(constants.MaxPercent)
          ? // Allow off-by-one
            updatedClaimableOverflowOfTicketBeneficiary3.eq(
              claimableOverflowOfTicketBeneficiary3
            ) ||
              updatedClaimableOverflowOfTicketBeneficiary3.gt(
                claimableOverflowOfTicketBeneficiary3.sub(1)
              ) ||
              updatedClaimableOverflowOfTicketBeneficiary3.lt(
                claimableOverflowOfTicketBeneficiary3.add(1)
              )
          : updatedClaimableOverflowOfTicketBeneficiary3.gt(
              claimableOverflowOfTicketBeneficiary3
            )
      ).to.equal(true);

      return {
        claimableOverflowOfTicketBeneficiary3: updatedClaimableOverflowOfTicketBeneficiary3
      };
    }
  },
  {
    description:
      "Make sure the third ticket beneficiary tickets can be redeemed successfully",
    fn: async ({
      executeFn,
      randomBoolFn,
      contracts,
      addrs,
      local: {
        expectedProjectId,
        redeemableTicketsOfTicketBeneficiary3,
        claimableOverflowOfTicketBeneficiary3,
        ticketBeneficiary3
      }
    }) => {
      // An address that will be the beneficiary of funds when redeeming the third set of tickets.
      const redeemBeneficiary3 = addrs[7];

      await executeFn({
        caller: ticketBeneficiary3,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem all available tickets.
        args: [
          ticketBeneficiary3.address,
          expectedProjectId,
          redeemableTicketsOfTicketBeneficiary3,
          claimableOverflowOfTicketBeneficiary3,
          redeemBeneficiary3.address,
          randomBoolFn()
        ]
      });

      return { redeemBeneficiary3 };
    }
  },
  {
    description:
      "Make sure the redeem beneficiary received the correct amount of funds",
    fn: ({
      verifyBalanceFn,
      local: { claimableOverflowOfTicketBeneficiary3, redeemBeneficiary3 }
    }) =>
      verifyBalanceFn({
        address: redeemBeneficiary3.address,
        expect: claimableOverflowOfTicketBeneficiary3
      })
  },
  {
    description:
      "Pass along the number of tickets reserved for the project owner",
    fn: async ({ contracts, local: { expectedProjectId, reservedRate } }) => ({
      reservedTicketAmount: await contracts.juicer.reservedTicketAmountOf(
        expectedProjectId,
        reservedRate
      )
    })
  },
  {
    description: "Print the reserved tickets for the owner of the project",
    fn: ({ executeFn, contracts, local: { expectedProjectId, owner } }) =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "printReservedTickets",
        args: [expectedProjectId]
      })
  },
  {
    description:
      "Pass along a reference to the claimable overflow of the owner",
    fn: async ({
      contracts,
      BigNumber,
      local: { expectedProjectId, reservedTicketAmount, owner, reservedRate }
    }) => ({
      claimableOverflowOfOwner: reservedRate.eq(BigNumber.from(0))
        ? BigNumber.from(0)
        : await contracts.juicer.claimableOverflowOf(
            owner.address,
            expectedProjectId,
            reservedTicketAmount
          )
    })
  },
  {
    description: "Make sure the owner can redeem successfully",
    fn: ({
      executeFn,
      contracts,
      randomBoolFn,
      BigNumber,
      local: {
        expectedProjectId,
        reservedTicketAmount,
        claimableOverflowOfOwner,
        owner,
        redeemBeneficiary4,
        reservedRate
      }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "redeem",
        // Redeem all available tickets. Expect the rest of the overflow to be claimed.
        args: [
          owner.address,
          expectedProjectId,
          reservedTicketAmount,
          claimableOverflowOfOwner,
          redeemBeneficiary4.address,
          randomBoolFn()
        ],
        revert: reservedRate.eq(BigNumber.from(0)) && "Juicer::redeem: NO_OP"
      })
  },
  {
    description:
      "Make sure the beneficiary received the correct amount of funds",
    fn: ({
      verifyBalanceFn,
      local: { claimableOverflowOfOwner, redeemBeneficiary4 }
    }) =>
      verifyBalanceFn({
        address: redeemBeneficiary4.address,
        expect: claimableOverflowOfOwner
      })
  },
  {
    description: "The contract should just have the target funds in it left",
    fn: ({ verifyBalanceFn, contracts, local: { target } }) =>
      verifyBalanceFn({
        address: contracts.juicer.address,
        expect: target
      })
  }
];
