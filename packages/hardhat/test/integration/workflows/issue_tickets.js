/** 
 Projects can issue ERC-20 tickets that can be unstaked from the Juice contracts
 and used throughout Web3.
*/
module.exports = async ({
  deployer,
  addrs,
  constants,
  contracts,
  BigNumber,
  executeFn,
  checkFn,
  getBalanceFn,
  randomBigNumberFn,
  stringToBytesFn,
  randomAddressFn,
  randomBoolFn,
  randomStringFn
}) => {
  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = 2;

  // The owner of the project that will migrate.
  const owner = addrs[0];

  // An account that will be used to make payments.
  const payer = addrs[1];

  // An account that will be distributed tickets in the first payment.
  const ticketBeneficiary = addrs[2];

  // Two payments will be made. Cant pay entire balance because some is needed for gas.
  // So, arbitrarily find a number less than a third so that all payments can be made successfully.
  const paymentValue1 = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(3)
  });
  const paymentValue2 = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(3)
  });

  // The project's funding cycle target will at most be a fourth of the payment value. Leaving plenty of overflow.
  const target = randomBigNumberFn({
    max: paymentValue1.add(paymentValue2).div(4)
  });

  // The currency will be 0, which corresponds to ETH.
  const currency = 0;

  // Set a random percentage of tickets to reserve for the project owner.
  const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });

  // The amount of tickets that will be expected to be staked after the first payment.
  const expectedStakedBalance = paymentValue1
    .mul(constants.InitialWeightMultiplier)
    .mul(constants.MaxPercent.sub(reservedRate))
    .div(constants.MaxPercent);

  // Total amount of tickets that will be expected to be both staked and unstaked after the second payment.
  const expectedTotalTicketBalance = paymentValue1
    .add(paymentValue2)
    .mul(constants.InitialWeightMultiplier)
    .mul(constants.MaxPercent.sub(reservedRate))
    .div(constants.MaxPercent);

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
      }),
    /**
      The owner should not have issued tickets initially.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "ticketsOf",
        args: [expectedProjectId],
        expect: constants.AddressZero
      }),
    /**
      Make a payment to the project without first issueing tickets should print staked tickets.
    */
    () =>
      executeFn({
        caller: payer,
        contract: contracts.juicer,
        fn: "pay",
        args: [
          expectedProjectId,
          ticketBeneficiary.address,
          randomStringFn(),
          true // prefer unstaked
        ],
        value: paymentValue1
      }),
    /**
      The ticket beneficiary should have tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance,
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      The ticket beneficiary's tickets should all be staked.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance,
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
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
      Make another payment to the project now that tickets have been issued.
    */
    () =>
      executeFn({
        caller: payer,
        contract: contracts.juicer,
        fn: "pay",
        args: [
          expectedProjectId,
          ticketBeneficiary.address,
          randomStringFn(),
          true // prefer unstaked
        ],
        value: paymentValue2
      }),
    /**
      The ticket beneficiary should have both unstaked and staked tickets.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedTotalTicketBalance,
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      The ticket beneficiary's tickets staked tickets should still be staked.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance,
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      Redeem some of the staked tickets.
    */
    async () => {
      const redeemedPortionOfStakedBalance = expectedStakedBalance.sub(
        randomBigNumberFn({
          min: BigNumber.from(1),
          max: expectedStakedBalance.sub(1)
        })
      );
      await executeFn({
        caller: ticketBeneficiary,
        contract: contracts.juicer,
        fn: "redeem",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          redeemedPortionOfStakedBalance,
          0,
          randomAddressFn(),
          false // prefer staked
        ]
      });

      return { redeemedPortionOfStakedBalance };
    },
    /**
      The staked balance should have the redeemed portion removed.
    */
    ({ local: { redeemedPortionOfStakedBalance } }) =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance.sub(redeemedPortionOfStakedBalance),
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      The total balance should have the redeemed portion removed.
    */
    ({ local: { redeemedPortionOfStakedBalance } }) =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedTotalTicketBalance.sub(redeemedPortionOfStakedBalance),
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      Redeem some of the unstaked tickets.
    */
    async () => {
      const expectedUnstakedBalance = expectedTotalTicketBalance.sub(
        expectedStakedBalance
      );
      const redeemedPortionOfUnstakedBalance = expectedUnstakedBalance.sub(
        randomBigNumberFn({
          min: BigNumber.from(1),
          max: expectedUnstakedBalance.sub(1)
        })
      );
      await executeFn({
        caller: ticketBeneficiary,
        contract: contracts.juicer,
        fn: "redeem",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          redeemedPortionOfUnstakedBalance,
          0,
          randomAddressFn(),
          true // prefer unstaked
        ]
      });

      return { redeemedPortionOfUnstakedBalance };
    },
    /**
      The staked balance should be the same as it was.
    */
    ({ local: { redeemedPortionOfStakedBalance } }) =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance.sub(redeemedPortionOfStakedBalance),
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      The total balance should have both redeemed portions removed.
    */
    ({
      local: {
        redeemedPortionOfStakedBalance,
        redeemedPortionOfUnstakedBalance
      }
    }) =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedTotalTicketBalance
          .sub(redeemedPortionOfStakedBalance)
          .sub(redeemedPortionOfUnstakedBalance),
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      Redeem the rest of the tickets.
    */
    async () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.juicer,
        fn: "redeem",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          // Redeem the rest of the tickets.
          await contracts.ticketBooth.balanceOf(
            ticketBeneficiary.address,
            expectedProjectId
          ),
          0,
          randomAddressFn(),
          randomBoolFn()
        ]
      }),
    /**
      The ticket balance of the project should now be zero.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: 0
      }),
    /**
      The staked ticket balance of the project should now be zero.
    */
    () =>
      checkFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: 0
      })
  ];
};
