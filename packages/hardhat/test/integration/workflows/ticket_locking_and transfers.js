/** 
  Tickets can be locked, which prevent them from being redeemed, unstaked, or transfered.
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

  // An account that will be transfered tickets from the beneficiary.
  const ticketTransferRecipient = addrs[3];

  // Two payments will be made. Cant pay entire balance because some is needed for gas.
  // So, arbitrarily find a number less than a third so that all payments can be made successfully.
  const paymentValue = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(3)
  });

  // The project's funding cycle target will at most be a fourth of the payment value. Leaving plenty of overflow.
  const target = randomBigNumberFn({
    max: paymentValue.div(4)
  });

  // The currency will be 0, which corresponds to ETH.
  const currency = 0;

  // Set a random percentage of tickets to reserve for the project owner.
  const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });

  // The amount of tickets that will be expected to be staked after the first payment.
  const expectedStakedBalance = paymentValue
    .mul(constants.InitialWeightMultiplier)
    .mul(constants.MaxPercent.sub(reservedRate))
    .div(constants.MaxPercent);

  // Unstake a portion of the staked balance.
  const amountToUnstake = randomBigNumberFn({
    min: BigNumber.from(1),
    max: expectedStakedBalance
  });

  // Transfer some of the staked tickets.
  const amountToTransfer = randomBigNumberFn({
    min: BigNumber.from(1),
    max: expectedStakedBalance.sub(amountToUnstake)
  });

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
      Make a payment to the project to get some staked tickets.
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
          false // prefer staked
        ],
        value: paymentValue
      }),
    /**
      The ticket beneficiary should have tickets.
    */
    () =>
      checkFn({
        caller: deployer,
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
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance,
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      Lock the staked tickets that wont be unstaked or transferd.
    */
    () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "lock",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          expectedStakedBalance.sub(amountToUnstake).sub(amountToTransfer)
        ]
      }),
    /**
      Unstake some of the staked tickets. 
    */
    () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "unstake",
        args: [ticketBeneficiary.address, expectedProjectId, amountToUnstake]
      }),
    /**
      The balance shouldn't have changed.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance,
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      The staked balance should be updated.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance.sub(amountToUnstake),
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      Transfer some staked tickets to another address.
    */
    () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "transfer",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          amountToTransfer,
          ticketTransferRecipient.address
        ]
      }),
    /**
      The balance should be updated to reflect the transfer.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance.sub(amountToTransfer),
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      The staked balance should be updated to reflect the transfer.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance
          .sub(amountToUnstake)
          .sub(amountToTransfer),
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      The balance of the recipient should be updated to reflect the transfer.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketTransferRecipient.address, expectedProjectId],
        expect: amountToTransfer,
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      The staked balance of the recipient should be updated to reflect the transfer.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketTransferRecipient.address, expectedProjectId],
        expect: amountToTransfer,
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      Can't unstake any more because of the lock.
    */
    () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "unstake",
        args: [ticketBeneficiary.address, expectedProjectId, BigNumber.from(1)],
        revert: "Tickets::unstake: INSUFFICIENT_FUNDS"
      }),
    /**
      Can't transfer any more because of the lock.
    */
    () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "transfer",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          BigNumber.from(1),
          ticketTransferRecipient.address
        ],
        revert: "Tickets::transfer: INSUFFICIENT_FUNDS"
      }),
    /**
      Stake the unstaked tickets. 
    */
    () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "stake",
        args: [ticketBeneficiary.address, expectedProjectId, amountToUnstake]
      }),
    /**
      Can't redeem because of the lock.
    */
    () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.juicer,
        fn: "redeem",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          // Try redeeming everything except what was transfered away.
          expectedStakedBalance.sub(amountToTransfer),
          0,
          randomAddressFn(),
          randomBoolFn()
        ],
        revert: "Tickets::redeem: INSUFFICIENT_FUNDS"
      }),
    /**
      Other operators can't unlock what was locked by the beneficiary.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.ticketBooth,
        fn: "unlock",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          expectedStakedBalance.sub(amountToUnstake).sub(amountToTransfer)
        ],
        revert: "Tickets::unlock: INSUFFICIENT_FUNDS"
      }),
    /**
      Unlocks the locked funds.
    */
    () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "unlock",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          expectedStakedBalance.sub(amountToUnstake).sub(amountToTransfer)
        ]
      }),
    /**
      Redeems correctly.
    */
    () =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.juicer,
        fn: "redeem",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          // Try redeeming everything except what was transfered away.
          expectedStakedBalance.sub(amountToTransfer),
          0,
          randomAddressFn(),
          randomBoolFn()
        ]
      }),
    /**
      The balance should be 0.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: BigNumber.from(0),
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      }),
    /**
      The staked balance should be zero.
    */
    () =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: BigNumber.from(0),
        // Allow the least significant digit to fluctuate due to division precision errors.
        plusMinus: 10
      })
  ];
};
