/** 
  Tickets can be locked, which prevent them from being redeemed, unstaked, or transfered.
*/

module.exports = [
  {
    description: "Deploy a project for the owner",
    fn: async ({
      randomBigNumberFn,
      getBalanceFn,
      incrementProjectIdFn,
      incrementFundingCycleIdFn,
      randomSignerFn,
      deployer,
      constants,
      contracts,
      BigNumber,
      executeFn,
      randomBytesFn,
      randomStringFn
    }) => {
      // Get the next project ID.
      const expectedProjectId = incrementProjectIdFn();

      // Burn the unused funding cycle ID id.
      incrementFundingCycleIdFn();

      // The owner of the project that will migrate.
      const owner = randomSignerFn();

      // An account that will be used to make payments.
      const payer = randomSignerFn();

      // Two payments will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      // The project's funding cycle target will at most be a fourth of the payment value. Leaving plenty of overflow.
      const target = randomBigNumberFn({
        max: paymentValue.div(4)
      });

      // The currency will be 0, which corresponds to ETH.
      const currency = 0;

      // Set a random percentage of tickets to reserve for the project owner.
      const reservedRate = randomBigNumberFn({ max: constants.MaxPercent });

      // Set a random bonding curve rate.
      const bondingCurveRate = randomBigNumberFn({ max: constants.MaxPercent });

      await executeFn({
        caller: deployer,
        contract: contracts.terminalV1,
        fn: "deploy",
        args: [
          owner.address,
          randomBytesFn({ prepend: expectedProjectId.toString() }),
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
        payer,
        paymentValue,
        reservedRate,
        bondingCurveRate,
        target
      };
    }
  },
  {
    description: "Issue tickets",
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
    description: "Make a payment to the project to get some staked tickets",
    fn: async ({
      executeFn,
      contracts,
      randomStringFn,
      randomSignerFn,
      getBalanceFn,
      local: { expectedProjectId, payer, paymentValue }
    }) => {
      // An account that will be distributed tickets in the first payment.
      const ticketBeneficiary = randomSignerFn();

      const initialBalanceOfTicketBeneficiary = await getBalanceFn(
        ticketBeneficiary.address
      );

      await executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          ticketBeneficiary.address,
          randomStringFn(),
          false // prefer staked
        ],
        value: paymentValue
      });

      return { ticketBeneficiary, initialBalanceOfTicketBeneficiary };
    }
  },
  {
    description: "The ticket beneficiary should have tickets",
    fn: async ({
      constants,
      checkFn,
      randomSignerFn,
      contracts,
      local: {
        expectedProjectId,
        ticketBeneficiary,
        paymentValue,
        reservedRate
      }
    }) => {
      const expectedTotalTicketBalance = paymentValue.mul(
        constants.InitialWeightMultiplier
      );

      // The amount of tickets that will be expected to be staked after the first payment.
      const expectedStakedBalance = paymentValue
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
          amount: 100
        }
      });

      return { expectedStakedBalance, expectedTotalTicketBalance };
    }
  },
  {
    description: "The ticket beneficiary's tickets should all be staked",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      local: { expectedProjectId, ticketBeneficiary, expectedStakedBalance }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      })
  },
  {
    description: "Lock the staked tickets that wont be unstaked or transfered",
    fn: async ({
      randomBigNumberFn,
      BigNumber,
      executeFn,
      contracts,
      local: { expectedProjectId, ticketBeneficiary, expectedStakedBalance }
    }) => {
      // Unstake a portion of the staked balance.
      const amountToUnstake = expectedStakedBalance.eq(0)
        ? BigNumber.from(0)
        : randomBigNumberFn({
            min: BigNumber.from(1),
            max: expectedStakedBalance
          });

      // Transfer some of the staked tickets.
      const amountToTransfer = expectedStakedBalance.gt(amountToUnstake)
        ? randomBigNumberFn({
            min: BigNumber.from(1),
            max: expectedStakedBalance.sub(amountToUnstake)
          })
        : BigNumber.from(0);

      // Lock any staked balance leftover.
      const amountToLock = expectedStakedBalance
        .sub(amountToUnstake)
        .sub(amountToTransfer);

      await executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "lock",
        args: [ticketBeneficiary.address, expectedProjectId, amountToLock],
        revert: amountToLock.eq(0) && "TicketBooth::lock: NO_OP"
      });

      return { amountToUnstake, amountToTransfer, amountToLock };
    }
  },
  {
    description: "Unstake some of the staked tickets",
    fn: ({
      executeFn,
      contracts,
      local: { expectedProjectId, ticketBeneficiary, amountToUnstake }
    }) =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "unstake",
        args: [ticketBeneficiary.address, expectedProjectId, amountToUnstake]
      })
  },
  {
    description: "The balance shouldn't have changed",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      local: { expectedProjectId, ticketBeneficiary, expectedStakedBalance }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      })
  },
  {
    description: "The staked balance should be updated",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      local: {
        expectedProjectId,
        ticketBeneficiary,
        expectedStakedBalance,
        amountToUnstake
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance.sub(amountToUnstake),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      })
  },
  {
    description: "Transfer some staked tickets to another address",
    fn: async ({
      executeFn,
      contracts,
      randomSignerFn,
      local: { expectedProjectId, ticketBeneficiary, amountToTransfer }
    }) => {
      // An account that will be transfered tickets from the beneficiary.
      const ticketTransferRecipient = randomSignerFn();

      await executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "transfer",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          amountToTransfer,
          ticketTransferRecipient.address
        ],
        revert:
          ticketBeneficiary.address === ticketTransferRecipient.address
            ? "TicketBooth::transfer: IDENTITY"
            : amountToTransfer.eq(0) && "TicketBooth::transfer: NO_OP"
      });

      return { ticketTransferRecipient };
    }
  },
  {
    description: "The balance should be updated to reflect the transfer",
    fn: ({
      checkFn,
      contracts,
      BigNumber,
      randomSignerFn,
      local: {
        expectedProjectId,
        ticketBeneficiary,
        expectedStakedBalance,
        amountToTransfer,
        ticketTransferRecipient
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance.sub(
          ticketBeneficiary.address !== ticketTransferRecipient.address
            ? amountToTransfer
            : BigNumber.from(0)
        ),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      })
  },
  {
    description: "The staked balance should be updated to reflect the transfer",
    fn: ({
      checkFn,
      contracts,
      BigNumber,
      randomSignerFn,
      local: {
        expectedProjectId,
        ticketBeneficiary,
        expectedStakedBalance,
        amountToUnstake,
        amountToTransfer,
        ticketTransferRecipient
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: expectedStakedBalance
          .sub(amountToUnstake)
          .sub(
            ticketBeneficiary.address !== ticketTransferRecipient.address
              ? amountToTransfer
              : BigNumber.from(0)
          ),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      })
  },
  {
    description:
      "The balance of the recipient should be updated to reflect the transfer",
    fn: ({
      checkFn,
      contracts,
      randomSignerFn,
      local: {
        expectedProjectId,
        ticketTransferRecipient,
        ticketBeneficiary,
        expectedStakedBalance,
        amountToTransfer
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketTransferRecipient.address, expectedProjectId],
        expect:
          ticketBeneficiary.address === ticketTransferRecipient.address
            ? expectedStakedBalance
            : amountToTransfer,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      })
  },
  {
    description:
      "The staked balance of the recipient should be updated to reflect the transfer",
    fn: ({
      checkFn,
      deployer,
      contracts,
      local: {
        expectedProjectId,
        ticketTransferRecipient,
        ticketBeneficiary,
        amountToUnstake,
        expectedStakedBalance,
        amountToTransfer
      }
    }) =>
      checkFn({
        caller: deployer,
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketTransferRecipient.address, expectedProjectId],
        expect:
          ticketBeneficiary.address === ticketTransferRecipient.address
            ? expectedStakedBalance.sub(amountToUnstake)
            : amountToTransfer,
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 100
        }
      })
  },
  {
    description: "Can't unstake any more because of the lock",
    fn: ({
      executeFn,
      contracts,
      BigNumber,
      local: {
        amountToTransfer,
        expectedProjectId,
        ticketBeneficiary,
        ticketTransferRecipient
      }
    }) =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "unstake",
        args: [ticketBeneficiary.address, expectedProjectId, BigNumber.from(1)],
        revert:
          (amountToTransfer.eq(0) ||
            ticketBeneficiary.address !== ticketTransferRecipient.address) &&
          "TicketBooth::unstake: INSUFFICIENT_FUNDS"
      })
  },
  {
    description: "Can't transfer any more because of the lock",
    fn: ({
      executeFn,
      contracts,
      BigNumber,
      local: { expectedProjectId, ticketBeneficiary, ticketTransferRecipient }
    }) =>
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
        revert:
          ticketBeneficiary.address === ticketTransferRecipient.address
            ? "TicketBooth::transfer: IDENTITY"
            : "TicketBooth::transfer: INSUFFICIENT_FUNDS"
      })
  },
  {
    description: "Stake the unstaked tickets",
    fn: ({
      executeFn,
      contracts,
      local: { expectedProjectId, ticketBeneficiary, amountToUnstake }
    }) =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "stake",
        args: [ticketBeneficiary.address, expectedProjectId, amountToUnstake]
      })
  },
  {
    description: "Can't redeem because of the lock",
    fn: async ({
      executeFn,
      contracts,
      randomAddressFn,
      randomBoolFn,
      local: { expectedProjectId, ticketBeneficiary, amountToLock }
    }) => {
      // Try redeeming everything except what was transfered away.
      const ticketsToRedeem = await contracts.ticketBooth.balanceOf(
        ticketBeneficiary.address,
        expectedProjectId
      );

      // If the amount expected to be claimed is zero.
      const expectedClaimedAmountIsZero = (
        await contracts.terminalV1.claimableOverflowOf(
          ticketBeneficiary.address,
          expectedProjectId,
          ticketsToRedeem
        )
      ).eq(0);

      await executeFn({
        caller: ticketBeneficiary,
        contract: contracts.terminalV1,
        fn: "redeem",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          ticketsToRedeem,
          0,
          randomAddressFn(),
          randomBoolFn()
        ],
        revert:
          // No op if no tickets are being redeemed, or if there's no amount to claim.
          ticketsToRedeem.eq(0) || expectedClaimedAmountIsZero
            ? "TerminalV1::redeem: NO_OP"
            : amountToLock.gt(0) && "TicketBooth::redeem: INSUFFICIENT_FUNDS"
      });

      return { ticketsToRedeem, expectedClaimedAmountIsZero };
    }
  },
  {
    description:
      "Other operators can't unlock what was locked by the beneficiary",
    fn: async ({
      executeFn,
      contracts,
      randomSignerFn,
      local: { expectedProjectId, ticketBeneficiary, amountToLock }
    }) => {
      const randomOtherSigner = randomSignerFn({
        exclude: [ticketBeneficiary.address]
      });

      await executeFn({
        caller: randomOtherSigner,
        contract: contracts.ticketBooth,
        fn: "unlock",
        args: [ticketBeneficiary.address, expectedProjectId, amountToLock],
        revert: amountToLock.eq(0)
          ? "TicketBooth::unlock: NO_OP"
          : "TicketBooth::unlock: INSUFFICIENT_FUNDS"
      });
    }
  },
  {
    description: "Unlocks the locked funds if they already arent unlocked",
    fn: ({
      executeFn,
      contracts,
      local: { expectedProjectId, ticketBeneficiary, amountToLock }
    }) =>
      executeFn({
        caller: ticketBeneficiary,
        contract: contracts.ticketBooth,
        fn: "unlock",
        args: [ticketBeneficiary.address, expectedProjectId, amountToLock],
        // If there were no locked funds, no op.
        revert: amountToLock.eq(0) && "TicketBooth::unlock: NO_OP"
      })
  },
  {
    description:
      "Redeems correctly if the tickets haven't already been redeemed",
    fn: async ({
      executeFn,
      contracts,
      randomAddressFn,
      randomBoolFn,
      local: {
        expectedProjectId,
        ticketBeneficiary,
        ticketsToRedeem,
        amountToLock,
        expectedClaimedAmountIsZero
      }
    }) => {
      await executeFn({
        caller: ticketBeneficiary,
        contract: contracts.terminalV1,
        fn: "redeem",
        args: [
          ticketBeneficiary.address,
          expectedProjectId,
          ticketsToRedeem,
          0,
          randomAddressFn(),
          randomBoolFn()
        ],
        revert:
          ticketsToRedeem.eq(0) || expectedClaimedAmountIsZero
            ? "TerminalV1::redeem: NO_OP"
            : // If the locked amount is zero, the tickets have already been redeemed.
              amountToLock.eq(0) &&
              "TerminalV1::claimableOverflow: INSUFFICIENT_TICKETS"
      });
    }
  },
  {
    description: "The balance should be 0",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      BigNumber,
      local: { expectedProjectId, ticketBeneficiary }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: BigNumber.from(0),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10000000
        }
      })
  },
  {
    description:
      "The staked balance should be zero, or with a small margin of error caused by division rounding",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      BigNumber,
      local: { expectedProjectId, ticketBeneficiary }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [ticketBeneficiary.address, expectedProjectId],
        expect: BigNumber.from(0),
        // Allow some wiggle room due to possible division precision errors.
        plusMinus: {
          amount: 10000000
        }
      })
  }
];
