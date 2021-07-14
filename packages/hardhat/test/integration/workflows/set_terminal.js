/** 
  A project can be created without specifying a payment terminal. 
  The project will have to set a terminal before it can print tickets or configure its funding cycles.
*/

// The currency will be 0, which corresponds to ETH, preventing the need for currency price conversion.
const currency = 0;

module.exports = [
  {
    description: "Create a project with no payment terminal",
    fn: async ({
      constants,
      contracts,
      executeFn,
      randomStringFn,
      randomSignerFn,
      incrementProjectIdFn,
      randomBytesFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();

      // The owner of the project that will reconfigure.
      const owner = randomSignerFn();

      executeFn({
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
          constants.AddressZero
        ]
      });
      return { owner, expectedProjectId };
    }
  },
  {
    description: "Make sure the terminal was not set in the directory",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      constants,
      local: { expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: constants.AddressZero
      })
  },
  {
    description: "Shouldn't be able to print premined tickets",
    fn: ({
      contracts,
      executeFn,
      randomBigNumberFn,
      BigNumber,
      randomStringFn,
      randomAddressFn,
      randomBoolFn,
      local: { expectedProjectId, owner }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "printPreminedTickets",
        args: [
          expectedProjectId,
          // Use an arbitrary large big number that can be added to other large big numbers without risk of running into uint256 boundaries.
          randomBigNumberFn({
            min: BigNumber.from(0),
            max: BigNumber.from(10).pow(30)
          }),
          currency,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ],
        revert: "TerminalUtility: UNAUTHORIZED"
      })
  },
  {
    description: "Shouldn't be able to configure",
    fn: ({
      constants,
      contracts,
      executeFn,
      randomBigNumberFn,
      BigNumber,
      local: { expectedProjectId, owner }
    }) =>
      executeFn({
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
        ],
        revert: "TerminalUtility: UNAUTHORIZED"
      })
  },
  {
    description: "Shouldn't be able to pay",
    fn: async ({
      contracts,
      randomBigNumberFn,
      getBalanceFn,
      executeFn,
      randomStringFn,
      randomBoolFn,
      randomAddressFn,
      randomSignerFn,
      BigNumber,
      local: { expectedProjectId }
    }) => {
      // An account that will be used to make payments.
      const payer = randomSignerFn();
      // One payment will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue = randomBigNumberFn({
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
        value: paymentValue,
        revert: "TerminalUtility: UNAUTHORIZED"
      });
      return { payer, paymentValue };
    }
  },
  {
    description: "Set a payment terminal",
    fn: ({ executeFn, contracts, local: { expectedProjectId, owner } }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalDirectory,
        fn: "setTerminal",
        args: [expectedProjectId, contracts.terminalV1.address]
      })
  },
  {
    description: "Should now be able to print premined tickets",
    fn: ({
      contracts,
      executeFn,
      randomBigNumberFn,
      BigNumber,
      randomStringFn,
      randomAddressFn,
      randomBoolFn,

      local: { expectedProjectId, owner }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "printPreminedTickets",
        args: [
          expectedProjectId,
          // Use an arbitrary large big number that can be added to other large big numbers without risk of running into uint256 boundaries.
          randomBigNumberFn({
            min: BigNumber.from(1),
            max: BigNumber.from(10).pow(30)
          }),
          currency,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ]
      })
  },
  {
    description: "Should now be able to configure",
    fn: async ({
      constants,
      contracts,
      executeFn,
      randomBigNumberFn,
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
    description: "Should now be able to pay",
    fn: ({
      executeFn,
      contracts,
      randomAddressFn,
      randomStringFn,
      randomBoolFn,
      local: { expectedProjectId, payer, paymentValue }
    }) =>
      executeFn({
        caller: payer,
        contract: contracts.terminalV1,
        fn: "pay",
        args: [
          expectedProjectId,
          randomAddressFn(),
          randomStringFn(),
          randomBoolFn()
        ],
        value: paymentValue
      })
  },
  {
    description:
      "Setting a new terminal before migration to it has been allowed shouldnt be allowed",
    fn: async ({
      executeFn,
      contracts,
      deployContractFn,
      local: { expectedProjectId, owner }
    }) => {
      // The terminalV1 that will be migrated to.
      const secondTerminalV1 = await deployContractFn("TerminalV1", [
        contracts.projects.address,
        contracts.fundingCycles.address,
        contracts.ticketBooth.address,
        contracts.operatorStore.address,
        contracts.modStore.address,
        contracts.prices.address,
        contracts.terminalDirectory.address,
        contracts.governance.address
      ]);
      await executeFn({
        caller: owner,
        contract: contracts.terminalDirectory,
        fn: "setTerminal",
        args: [expectedProjectId, secondTerminalV1.address],
        revert: "TerminalDirectory::setTerminal: UNAUTHORIZED"
      });

      return { secondTerminalV1 };
    }
  },
  // Allow migration to a new terminal.
  {
    description: "Allow a migration to a new terminalV1",
    fn: ({ deployer, contracts, executeFn, local: { secondTerminalV1 } }) =>
      executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "allowMigration",
        args: [contracts.terminalV1.address, secondTerminalV1.address]
      })
  },
  {
    description:
      "Set a terminal that can be migrated to from the current terminal should be allowed",
    fn: ({
      executeFn,
      contracts,
      local: { expectedProjectId, owner, secondTerminalV1 }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.terminalDirectory,
        fn: "setTerminal",
        args: [expectedProjectId, secondTerminalV1.address]
      })
  },
  {
    description: "The new terminal should be set",
    fn: ({
      checkFn,
      randomSignerFn,
      contracts,
      local: { expectedProjectId, secondTerminalV1 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: secondTerminalV1.address
      })
  }
];
