/** 
  A project can print premined tickets up until the point when a payment is made to it after its configured its first funding cycle.
*/

// The currency will be 0, which corresponds to ETH.
const currency = 0;

module.exports = [
  {
    description: "Create a project",
    fn: async ({
      executeFn,
      randomStringFn,
      contracts,
      randomBytesFn,
      randomSignerFn,
      incrementProjectIdFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();

      // The owner of the project that will reconfigure.
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
          contracts.terminalV1.address
        ]
      });

      return { owner, expectedProjectId };
    }
  },
  {
    description: "The project should still be able to print premined tickets",
    fn: ({
      randomSignerFn,
      checkFn,
      contracts,
      local: { expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "canPrintPreminedTickets",
        args: [expectedProjectId],
        expect: true
      })
  },
  {
    description: "Print some premined tickets",
    fn: async ({
      randomSignerFn,
      randomBoolFn,
      randomBigNumberFn,
      BigNumber,
      executeFn,
      contracts,
      randomStringFn,
      local: { owner, expectedProjectId }
    }) => {
      // The address that will receive the first batch of preconfigure tickets.
      const preconfigureTicketBeneficiary1 = randomSignerFn();

      // The first amount of premined tickets to print.
      const preminePrintAmount1 = randomBigNumberFn({
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
          preminePrintAmount1,
          currency,
          preconfigureTicketBeneficiary1.address,
          randomStringFn(),
          randomBoolFn()
        ]
      });

      return {
        preconfigureTicketBeneficiary1,
        preminePrintAmount1
      };
    }
  },
  {
    description:
      "The beneficiary should have gotten the correct amount of tickets",
    fn: async ({
      randomSignerFn,
      constants,
      checkFn,
      contracts,
      local: {
        preconfigureTicketBeneficiary1,
        preminePrintAmount1,
        expectedProjectId
      }
    }) => {
      // The ticket amount is based on the initial funding cycle's weight.
      const expectedPreminedPrintedTicketAmount1 = preminePrintAmount1.mul(
        constants.InitialWeightMultiplier
      );
      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [preconfigureTicketBeneficiary1.address, expectedProjectId],
        expect: expectedPreminedPrintedTicketAmount1
      });

      return { expectedPreminedPrintedTicketAmount1 };
    }
  },
  {
    description: "All the tickets should be staked",
    fn: ({
      randomSignerFn,
      checkFn,
      contracts,
      local: {
        expectedProjectId,
        preconfigureTicketBeneficiary1,
        expectedPreminedPrintedTicketAmount1
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [preconfigureTicketBeneficiary1.address, expectedProjectId],
        expect: expectedPreminedPrintedTicketAmount1
      })
  },
  {
    description:
      "The project should still be allowed to print more premined tickets",
    fn: ({
      randomSignerFn,
      checkFn,
      contracts,
      local: { expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "canPrintPreminedTickets",
        args: [expectedProjectId],
        expect: true
      })
  },
  {
    description: "Make a payment before configuring a funding cycle",
    fn: async ({
      randomSignerFn,
      randomBigNumberFn,
      BigNumber,
      getBalanceFn,
      executeFn,
      contracts,
      randomStringFn,
      randomBoolFn,
      local: { expectedProjectId }
    }) => {
      // An account that will be used to make payments.
      const payer = randomSignerFn();

      // One payment will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue1 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      // The address that will receive the second batch of preconfigure tickets.
      const preconfigureTicketBeneficiary2 = randomSignerFn();

      await executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          preconfigureTicketBeneficiary2.address,
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue1
      });

      return {
        payer,
        paymentValue1,
        preconfigureTicketBeneficiary2
      };
    }
  },
  {
    description:
      "The payment beneficiary should have gotten the correct amount of tickets",
    fn: async ({
      randomSignerFn,
      checkFn,
      contracts,
      constants,
      local: {
        preconfigureTicketBeneficiary1,
        preconfigureTicketBeneficiary2,
        expectedPreminedPrintedTicketAmount1,
        expectedProjectId,
        paymentValue1
      }
    }) => {
      // The ticket amount is based on the initial funding cycle's weight.
      const expectedPaymentPrintedTicketAmount1 = paymentValue1.mul(
        constants.InitialWeightMultiplier
      );
      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [preconfigureTicketBeneficiary2.address, expectedProjectId],
        // If the beneficiaries receiving the first premine tickets and the first payment tickets are the same, add them up.
        expect: expectedPaymentPrintedTicketAmount1.add(
          preconfigureTicketBeneficiary2.address ===
            preconfigureTicketBeneficiary1.address
            ? expectedPreminedPrintedTicketAmount1
            : 0
        )
      });
      return { expectedPaymentPrintedTicketAmount1 };
    }
  },
  {
    description: "All the tickets should still be staked",
    fn: ({
      randomSignerFn,
      checkFn,
      contracts,
      local: {
        expectedProjectId,
        preconfigureTicketBeneficiary1,
        preconfigureTicketBeneficiary2,
        expectedPaymentPrintedTicketAmount1,
        expectedPreminedPrintedTicketAmount1
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [preconfigureTicketBeneficiary2.address, expectedProjectId],
        expect: expectedPaymentPrintedTicketAmount1.add(
          preconfigureTicketBeneficiary2.address ===
            preconfigureTicketBeneficiary1.address
            ? expectedPreminedPrintedTicketAmount1
            : 0
        )
      })
  },
  {
    description:
      "The project should still be able to print more premined tickets",
    fn: ({
      randomSignerFn,
      checkFn,
      contracts,
      local: { expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "canPrintPreminedTickets",
        args: [expectedProjectId],
        expect: true
      })
  },
  {
    description:
      "Issue the project's tickets so that the unstaked preference can be checked",
    fn: ({
      executeFn,
      contracts,
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
    description:
      "Configuring a funding cycle. This shouldn't affect the ability for project to keep printing premined tickets",
    fn: async ({
      executeFn,
      contracts,
      randomBigNumberFn,
      constants,
      BigNumber,
      incrementFundingCycleIdFn,
      local: { expectedProjectId, owner }
    }) => {
      // Burn the unused funding cycle ID id.
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
            reservedRate: randomBigNumberFn({ max: constants.MaxPercent }),
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
    description: "Print some more premined tickets to another beneficiary",
    fn: async ({
      randomBigNumberFn,
      executeFn,
      BigNumber,
      randomBoolFn,
      randomSignerFn,
      randomStringFn,
      contracts,
      local: { expectedProjectId, owner }
    }) => {
      // The address that will receive the second batch of premined tickets.
      const preconfigureTicketBeneficiary3 = randomSignerFn();

      const preminePrintAmount2 = randomBigNumberFn({
        min: BigNumber.from(1),
        // Use an arbitrary large big number that can be added to other large big numbers without risk of running into uint256 boundaries.
        max: BigNumber.from(10).pow(30)
      });

      // The unsrtaked preference to use.
      const preferUnstakedTickets = randomBoolFn();

      await executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "printPreminedTickets",
        args: [
          expectedProjectId,
          preminePrintAmount2,
          currency,
          preconfigureTicketBeneficiary3.address,
          randomStringFn(),
          preferUnstakedTickets
        ]
      });

      return {
        preconfigureTicketBeneficiary3,
        preminePrintAmount2,
        preferUnstakedTickets
      };
    }
  },
  {
    description:
      "The third beneficiary should have gotten the correct amount of tickets",
    fn: async ({
      randomSignerFn,
      constants,
      checkFn,
      contracts,
      local: {
        expectedProjectId,
        preconfigureTicketBeneficiary1,
        preconfigureTicketBeneficiary2,
        preconfigureTicketBeneficiary3,
        expectedPaymentPrintedTicketAmount1,
        expectedPreminedPrintedTicketAmount1,
        preminePrintAmount2
      }
    }) => {
      const expectedPreminedPrintedTicketAmount2 = preminePrintAmount2.mul(
        constants.InitialWeightMultiplier
      );

      let expect = expectedPreminedPrintedTicketAmount2;

      // If the beneficiary is the same as the one which received tickets from the first premine, add the amounts.
      if (
        preconfigureTicketBeneficiary3.address ===
        preconfigureTicketBeneficiary1.address
      )
        expect = expect.add(expectedPreminedPrintedTicketAmount1);

      // If the beneficiary is the same as the one which received tickets from the first payment, add the amounts.
      if (
        preconfigureTicketBeneficiary3.address ===
        preconfigureTicketBeneficiary2.address
      )
        expect = expect.add(expectedPaymentPrintedTicketAmount1);

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [preconfigureTicketBeneficiary3.address, expectedProjectId],
        expect
      });

      return { expectedPreminedPrintedTicketAmount2 };
    }
  },
  {
    description: "Check for the correct number of staked tickets",
    fn: async ({
      randomSignerFn,
      checkFn,
      contracts,
      BigNumber,
      local: {
        expectedProjectId,
        preconfigureTicketBeneficiary1,
        preconfigureTicketBeneficiary2,
        preconfigureTicketBeneficiary3,
        expectedPreminedPrintedTicketAmount1,
        expectedPreminedPrintedTicketAmount2,
        expectedPaymentPrintedTicketAmount1,
        preferUnstakedTickets
      }
    }) => {
      let expectedStaked = preferUnstakedTickets
        ? BigNumber.from(0)
        : expectedPreminedPrintedTicketAmount2;

      // If the beneficiary is the same as the one which received tickets from the first premine, add the amounts.
      if (
        preconfigureTicketBeneficiary3.address ===
        preconfigureTicketBeneficiary1.address
      )
        expectedStaked = expectedStaked.add(
          expectedPreminedPrintedTicketAmount1
        );

      // If the beneficiary is the same as the one which received tickets from the first payment, add the amounts.
      if (
        preconfigureTicketBeneficiary3.address ===
        preconfigureTicketBeneficiary2.address
      )
        expectedStaked = expectedStaked.add(
          expectedPaymentPrintedTicketAmount1
        );

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [preconfigureTicketBeneficiary3.address, expectedProjectId],
        expect: expectedStaked
      });
    }
  },
  {
    description:
      "The total supply of tickets for the project should equal the total of the premined printed amounts",
    fn: ({
      randomSignerFn,
      checkFn,
      contracts,
      local: {
        expectedProjectId,
        expectedPreminedPrintedTicketAmount1,
        expectedPreminedPrintedTicketAmount2,
        expectedPaymentPrintedTicketAmount1
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "totalSupplyOf",
        args: [expectedProjectId],
        expect: expectedPreminedPrintedTicketAmount1
          .add(expectedPreminedPrintedTicketAmount2)
          .add(expectedPaymentPrintedTicketAmount1)
      })
  },
  {
    description:
      "Make a second payment to lock in the premined amount now that there's a configured funding cycle",
    fn: async ({
      randomBigNumberFn,
      BigNumber,
      getBalanceFn,
      executeFn,
      contracts,
      randomAddressFn,
      randomStringFn,
      randomBoolFn,
      local: { expectedProjectId, payer }
    }) => {
      // One payment will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue2 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      await executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue2
      });
    }
  },
  {
    description: "Printing tickets should no longer allowed",
    fn: ({
      randomSignerFn,
      checkFn,
      contracts,
      local: { expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "canPrintPreminedTickets",
        args: [expectedProjectId],
        expect: false
      })
  },
  {
    description: "Confirm that printing tickets is no longer allowed",
    fn: async ({
      executeFn,
      contracts,
      randomBigNumberFn,
      randomStringFn,
      randomAddressFn,
      randomBoolFn,
      BigNumber,
      local: { owner, expectedProjectId }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "printPreminedTickets",
        args: [
          expectedProjectId,
          randomBigNumberFn({
            min: BigNumber.from(1),
            // Use an arbitrary large big number that can be added to other large big numbers without risk of running into uint256 boundaries.
            max: BigNumber.from(10).pow(30)
          }),
          currency,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ],
        revert: "TerminalV1::printTickets: ALREADY_ACTIVE"
      })
  }
];
