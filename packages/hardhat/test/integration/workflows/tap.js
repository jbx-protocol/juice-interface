/** 
  Anyone can tap funds on behalf of a project.

  When a project is tapped, it will issue the appropriate payouts to its mods, and will send
  any leftover funds to the project owner.

  Payment mods allow payouts to automatically be sent to either an address, another project on Juicebox, or a contract that inherits from IModAllocator.
*/

// The currency will be 0, which corresponds to ETH, preventing the need for currency price conversion.
const currency = 0;

module.exports = [
  {
    description: "Deploy first project with a payout mod",
    fn: async ({
      constants,
      contracts,
      executeFn,
      BigNumber,
      deployContractFn,
      randomBigNumberFn,
      getBalanceFn,
      randomBoolFn,
      randomStringFn,
      randomAddressFn,
      incrementProjectIdFn,
      incrementFundingCycleIdFn,
      randomSignerFn,
      randomBytesFn
    }) => {
      const expectedIdOfBaseProject = incrementProjectIdFn();
      const expectedIdOfModProject = incrementProjectIdFn();

      // Burn the unused funding cycle ID id.
      incrementFundingCycleIdFn();

      // The owner of the project with mods.
      // Exclude the governance project's owner to make the test calculations cleaner.
      const owner = randomSignerFn({ exclude: [constants.GovenanceOwner] });

      // An account that will be used to make a payment.
      const payer = randomSignerFn();

      // Two payments will be made.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue1 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100)
      });

      // The target must at most be the payment value.
      const target = randomBigNumberFn({
        min: BigNumber.from(1),
        max: paymentValue1
      });

      const duration = randomBigNumberFn({
        min: BigNumber.from(1),
        max: constants.MaxUint16
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
      const percent3 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: constants.MaxModPercent.sub(percent1).sub(percent2)
      });

      // There are three types of mods.
      // Address mods route payout directly to an address.
      const addressMod = {
        preferUnstaked: randomBoolFn(),
        percent: percent1.toNumber(),
        lockedUntil: 0,
        // Make sure the beneficiary isnt the owner.
        beneficiary: randomAddressFn({
          exclude: [owner.address]
        }),
        allocator: constants.AddressZero,
        projectId: BigNumber.from(0)
      };
      // Project mods route payout directly to another project on TerminalV1.
      const projectMod = {
        preferUnstaked: randomBoolFn(),
        percent: percent2.toNumber(),
        lockedUntil: 0,
        beneficiary: randomAddressFn(),
        allocator: constants.AddressZero,
        projectId: expectedIdOfModProject
      };
      // Allocator mods route payments directly to the specified contract that inherits from IModAllocator.
      const allocatorMod = {
        preferUnstaked: randomBoolFn(),
        percent: percent3.toNumber(),
        lockedUntil: 0,
        beneficiary: randomAddressFn(),
        allocator: (await deployContractFn("ExampleModAllocator")).address,
        projectId: BigNumber.from(0)
      };

      await executeFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "deploy",
        args: [
          owner.address,
          randomBytesFn({
            // Make sure its unique by prepending the id.
            prepend: expectedIdOfBaseProject.toString()
          }),
          randomStringFn(),
          {
            target,
            currency,
            duration,
            cycleLimit: randomBigNumberFn({
              max: constants.MaxCycleLimit
            }),
            // Recurring.
            discountRate: randomBigNumberFn({
              max: constants.MaxPercent.sub(1)
            }),
            ballot: constants.AddressZero
          },
          {
            // Don't use a reserved rate to make the calculations a little simpler.
            reservedRate: BigNumber.from(0),
            bondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            }),
            reconfigurationBondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent
            })
          },
          [addressMod, projectMod, allocatorMod],
          []
        ]
      });
      return {
        owner,
        payer,
        paymentValue1,
        expectedIdOfBaseProject,
        expectedIdOfModProject,
        duration,
        target,
        addressMod,
        projectMod,
        allocatorMod
      };
    }
  },
  {
    description: "Check that the payout mods got set",
    fn: ({
      contracts,
      checkFn,
      timeMark,
      randomSignerFn,
      local: { expectedIdOfBaseProject, addressMod, projectMod, allocatorMod }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.modStore,
        fn: "payoutModsOf",
        args: [expectedIdOfBaseProject, timeMark],
        expect: [
          [
            addressMod.preferUnstaked,
            addressMod.percent,
            addressMod.lockedUntil,
            addressMod.beneficiary,
            addressMod.allocator,
            addressMod.projectId
          ],
          [
            projectMod.preferUnstaked,
            projectMod.percent,
            projectMod.lockedUntil,
            projectMod.beneficiary,
            projectMod.allocator,
            projectMod.projectId
          ],
          [
            allocatorMod.preferUnstaked,
            allocatorMod.percent,
            allocatorMod.lockedUntil,
            allocatorMod.beneficiary,
            allocatorMod.allocator,
            allocatorMod.projectId
          ]
        ]
      })
  },
  {
    description:
      "Deploy second project that'll be sent funds by the configured project payout mod",
    fn: async ({
      constants,
      contracts,
      executeFn,
      BigNumber,
      randomBytesFn,
      randomBigNumberFn,
      randomStringFn,
      randomSignerFn,
      incrementFundingCycleIdFn,
      local: { duration, expectedIdOfModProject, owner }
    }) => {
      // Burn the unused funding cycle ID id.
      incrementFundingCycleIdFn();

      // The owner of the mod project.
      // exlcude the owner address and the governance owner to make the test calculations cleaner.
      const modProjectOwner = randomSignerFn({
        exclude: [owner.address, constants.GovenanceOwner]
      });

      // If this funding cycle duration is too much smaller than
      // the base cycle's duration (< 1/30), the program could break because it
      // could have to apply the discount rate exponentially according to the factor in the worst case.
      // This worse case only happens when the smaller cycle isnt tapped or configured for a long while.
      const duration2 = randomBigNumberFn({
        min: duration < 500 ? BigNumber.from(1) : duration.div(500),
        max: constants.MaxUint16
      });

      await executeFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "deploy",
        args: [
          modProjectOwner.address,
          randomBytesFn({
            // Make sure its unique by prepending the id.
            prepend: expectedIdOfModProject.toString()
          }),
          randomStringFn(),
          {
            target: randomBigNumberFn(),
            currency: randomBigNumberFn({ max: constants.MaxUint8 }),
            duration: duration2,
            cycleLimit: randomBigNumberFn({
              max: constants.MaxCycleLimit
            }),
            // Make it recurring.
            discountRate: randomBigNumberFn({
              max: constants.MaxPercent.sub(1)
            }),
            ballot: constants.AddressZero
          },
          {
            // Don't use a reserved rate to make the calculations a little simpler.
            reservedRate: BigNumber.from(0),
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

      return { modProjectOwner };
    }
  },
  {
    description:
      "Issue the project's tickets so that the unstaked preference can be checked",
    fn: ({
      contracts,
      executeFn,
      randomStringFn,
      local: { modProjectOwner, expectedIdOfModProject }
    }) =>
      executeFn({
        caller: modProjectOwner,
        contract: contracts.ticketBooth,
        fn: "issue",
        args: [
          expectedIdOfModProject,
          randomStringFn({ canBeEmpty: false }),
          randomStringFn({ canBeEmpty: false })
        ]
      })
  },
  {
    description: "Make a payment to the project",
    fn: ({
      contracts,
      executeFn,
      randomBoolFn,
      randomStringFn,
      randomAddressFn,
      local: { payer, paymentValue1, expectedIdOfBaseProject }
    }) =>
      executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedIdOfBaseProject,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue1
      })
  },
  {
    description: "The second project should have no balance",
    fn: ({
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      local: { expectedIdOfModProject }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "balanceOf",
        args: [expectedIdOfModProject],
        expect: BigNumber.from(0)
      })
  },
  {
    description: "Tap funds for the project with payout mods",
    fn: async ({
      contracts,
      executeFn,
      randomSignerFn,
      getBalanceFn,
      constants,
      local: {
        target,
        owner,
        expectedIdOfBaseProject,
        addressMod,
        allocatorMod
      }
    }) => {
      // An amount up to the target can be tapped.
      const amountToTap = target;

      // Save the initial balances of the owner, address mod beneficiary, and the allocator mod contract.
      const ownerInitialBalance = await getBalanceFn(owner.address);

      const addressModBeneficiaryInitialBalance = await getBalanceFn(
        addressMod.beneficiary
      );
      const allocatorModContractInitialBalance = await getBalanceFn(
        allocatorMod.allocator
      );

      // Save the amount of governance project tickets the owner has owner initially has.
      const initialOwnerTicketBalanceOfGovernanceProject = await contracts.ticketBooth.balanceOf(
        owner.address,
        constants.GovernanceProjectId
      );

      await executeFn({
        // Dont use the owner or address mod beneficiary or else the gas spent will mess up the calculation.
        caller: randomSignerFn({
          exclude: [addressMod.beneficiary, owner.address]
        }),
        contract: contracts.terminalV1,
        fn: "tap",
        args: [expectedIdOfBaseProject, amountToTap, currency, amountToTap]
      });

      return {
        amountToTap,
        addressModBeneficiaryInitialBalance,
        allocatorModContractInitialBalance,
        ownerInitialBalance,
        initialOwnerTicketBalanceOfGovernanceProject
      };
    }
  },
  {
    description: "Check that payout mod beneficiary has expected funds",
    fn: async ({
      constants,
      contracts,
      verifyBalanceFn,
      local: { addressMod, amountToTap, addressModBeneficiaryInitialBalance }
    }) => {
      // The amount tapped takes into account any fees paid.
      const expectedAmountTapped = amountToTap
        .mul(constants.MaxPercent)
        .div((await contracts.terminalV1.fee()).add(constants.MaxPercent));

      await verifyBalanceFn({
        address: addressMod.beneficiary,
        expect: addressModBeneficiaryInitialBalance.add(
          expectedAmountTapped
            .mul(addressMod.percent)
            .div(constants.MaxModPercent)
        )
      });

      return { expectedAmountTapped };
    }
  },
  {
    description: "Check that the second project now has a balance",
    fn: ({
      constants,
      contracts,
      checkFn,
      randomSignerFn,
      local: { projectMod, expectedAmountTapped, expectedIdOfModProject }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "balanceOf",
        args: [expectedIdOfModProject],
        expect: expectedAmountTapped
          .mul(projectMod.percent)
          .div(constants.MaxModPercent)
      })
  },
  {
    description: "Check that the beneficiary of the project mod got tickets",
    fn: ({
      constants,
      contracts,
      checkFn,
      randomSignerFn,
      local: { expectedIdOfModProject, projectMod, expectedAmountTapped }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [projectMod.beneficiary, expectedIdOfModProject],
        expect: expectedAmountTapped
          .mul(projectMod.percent)
          .div(constants.MaxModPercent)
          .mul(constants.InitialWeightMultiplier)
      })
  },
  {
    description: "Check for the correct number of staked tickets",
    fn: ({
      constants,
      contracts,
      checkFn,
      BigNumber,
      randomSignerFn,
      local: { expectedIdOfModProject, projectMod, expectedAmountTapped }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "stakedBalanceOf",
        args: [projectMod.beneficiary, expectedIdOfModProject],
        expect: projectMod.preferUnstaked
          ? BigNumber.from(0)
          : expectedAmountTapped
              .mul(projectMod.percent)
              .div(constants.MaxModPercent)
              .mul(constants.InitialWeightMultiplier)
      })
  },
  {
    description: "Check that mod's allocator got paid",
    fn: ({
      constants,
      verifyBalanceFn,
      local: {
        allocatorMod,
        expectedAmountTapped,
        allocatorModContractInitialBalance
      }
    }) =>
      verifyBalanceFn({
        address: allocatorMod.allocator,
        expect: allocatorModContractInitialBalance.add(
          expectedAmountTapped
            .mul(allocatorMod.percent)
            .div(constants.MaxModPercent)
        )
      })
  },
  {
    description: "Check that the project owner got any leftovers",
    fn: ({
      verifyBalanceFn,
      constants,
      local: {
        owner,
        addressMod,
        projectMod,
        allocatorMod,
        expectedAmountTapped,
        ownerInitialBalance
      }
    }) =>
      verifyBalanceFn({
        address: owner.address,
        expect: ownerInitialBalance.add(
          expectedAmountTapped
            .sub(
              expectedAmountTapped
                .mul(addressMod.percent)
                .div(constants.MaxModPercent)
            )
            .sub(
              expectedAmountTapped
                .mul(projectMod.percent)
                .div(constants.MaxModPercent)
            )
            .sub(
              expectedAmountTapped
                .mul(allocatorMod.percent)
                .div(constants.MaxModPercent)
            )
        )
      })
  },
  {
    description: "Make sure the project owner got governance's project tickets",
    fn: ({
      constants,
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        owner,
        amountToTap,
        expectedAmountTapped,
        initialOwnerTicketBalanceOfGovernanceProject
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.ticketBooth,
        fn: "balanceOf",
        args: [owner.address, constants.GovernanceProjectId],
        expect: initialOwnerTicketBalanceOfGovernanceProject.add(
          amountToTap
            .sub(expectedAmountTapped)
            .mul(constants.InitialWeightMultiplier)
        )
      })
  },
  {
    description:
      "Make another payment to the project to make sure it's got overflow",
    fn: async ({
      contracts,
      executeFn,
      BigNumber,
      randomBigNumberFn,
      randomBoolFn,
      randomStringFn,
      randomAddressFn,
      local: { payer, expectedIdOfBaseProject, target }
    }) => {
      // The second amount should cause overflow.
      const paymentValue2 = randomBigNumberFn({
        min: BigNumber.from(1),
        max: target
      });
      await executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedIdOfBaseProject,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue2
      });

      return { paymentValue2 };
    }
  },
  {
    description:
      "Shouldn't be able to tap excessive funds during the current funding cycle",
    fn: ({
      contracts,
      executeFn,
      randomSignerFn,
      local: { expectedIdOfBaseProject, paymentValue2 }
    }) =>
      executeFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "tap",
        args: [expectedIdOfBaseProject, paymentValue2, currency, paymentValue2],
        revert: "FundingCycles::tap: INSUFFICIENT_FUNDS"
      })
  },
  {
    description: "Fast forward to the next funding cycle",
    fn: ({ fastforwardFn, local: { duration } }) =>
      fastforwardFn(duration.mul(86400).add(1))
  },
  {
    description: "Tap the full target",
    fn: async ({
      contracts,
      executeFn,
      randomSignerFn,
      incrementFundingCycleIdFn,
      local: { expectedIdOfBaseProject, paymentValue2 }
    }) => {
      // A new funding cycle will be created. Burn the unused funding cycle ID id.
      incrementFundingCycleIdFn();

      await executeFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "tap",
        args: [expectedIdOfBaseProject, paymentValue2, currency, paymentValue2]
      });
    }
  }
];
