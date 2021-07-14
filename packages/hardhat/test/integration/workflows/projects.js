/** 
  Projects can be created independently from the TerminalV1 `deploy` mechanism.
  Each project can set a URI that should be a IPFS CID, and a unique handle.

  Unique handles can be transfered between accounts.

  A created project can make use all TerminalV1 functionality as normal.
*/
module.exports = [
  {
    description: "Create a project",
    fn: async ({
      deployer,
      contracts,
      executeFn,
      randomStringFn,
      randomSignerFn,
      randomBytesFn,
      incrementProjectIdFn
    }) => {
      // The address that will own a project.
      const owner = randomSignerFn();

      // Use the terminalV1 as the terminal.
      const terminal = contracts.terminalV1.address;

      const expectedProjectId = incrementProjectIdFn();

      // Make sure its unique by prepending the id.
      const handle = randomBytesFn({ prepend: expectedProjectId.toString() });

      const uri = randomStringFn();

      await executeFn({
        caller: deployer,
        contract: contracts.projects,
        fn: "create",
        args: [owner.address, handle, uri, terminal]
      });

      return { owner, terminal, handle, uri, expectedProjectId };
    }
  },
  {
    description: "Make sure the project's handle got saved",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { handle, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId],
        expect: handle
      })
  },
  {
    description: "Make sure the project was saved to the handle",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { handle, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect: expectedProjectId
      })
  },
  {
    description: "Make sure the project's uri got saved",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { uri, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "uriOf",
        args: [expectedProjectId],
        expect: uri
      })
  },
  {
    description: "Make sure the terminal was set in the directory",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { terminal, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: terminal
      })
  },
  {
    description:
      "Make sure someone else can't deploy a project with the same handle",
    fn: async ({
      contracts,
      constants,
      executeFn,
      randomStringFn,
      randomSignerFn,
      local: { handle }
    }) => {
      // The address that will own another project.
      const secondOwner = randomSignerFn();
      await executeFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "create",
        args: [
          secondOwner.address,
          handle,
          randomStringFn(),
          constants.AddressZero
        ],
        revert: "Projects::create: HANDLE_TAKEN"
      });

      return { secondOwner };
    }
  },
  {
    description: "Set a new URI",
    fn: async ({
      contracts,
      executeFn,
      randomStringFn,
      local: { owner, expectedProjectId }
    }) => {
      const secondUri = randomStringFn();
      await executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "setUri",
        args: [expectedProjectId, secondUri]
      });

      return { secondUri };
    }
  },
  {
    description: "Make sure the new uri got saved",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { secondUri, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "uriOf",
        args: [expectedProjectId],
        expect: secondUri
      })
  },
  {
    description: "Set a new handle.",
    fn: async ({
      contracts,
      executeFn,
      randomBytesFn,
      local: { owner, handle, expectedProjectId }
    }) => {
      const secondHandle = randomBytesFn({
        // Make sure its unique by prepending the id.
        prepend: expectedProjectId.toString(),
        exclude: [handle]
      });
      await executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "setHandle",
        args: [expectedProjectId, secondHandle]
      });

      return { secondHandle };
    }
  },
  {
    description: "Make sure the new handle got saved",
    fn: ({
      contracts,
      randomSignerFn,
      checkFn,
      local: { secondHandle, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId],
        expect: secondHandle
      })
  },
  {
    description: "Make sure the project was saved to the new handle",
    fn: ({
      contracts,
      randomSignerFn,
      checkFn,
      local: { secondHandle, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "projectFor",
        args: [secondHandle],
        expect: expectedProjectId
      })
  },
  {
    description:
      "Make sure the old handle isn't affiliated with a project any longer",
    fn: ({ contracts, randomSignerFn, checkFn, local: { handle } }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect: 0
      })
  },
  {
    description:
      "Create another project for a different owner using the old handle",
    fn: async ({
      contracts,
      constants,
      executeFn,
      randomStringFn,
      randomSignerFn,
      incrementProjectIdFn,
      local: { secondOwner, handle }
    }) => {
      const expectedSecondProjectId = incrementProjectIdFn();

      await executeFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "create",
        args: [
          secondOwner.address,
          handle,
          randomStringFn(),
          constants.AddressZero
        ]
      });
      return { expectedSecondProjectId };
    }
  },
  {
    description:
      "Make sure the other owner can't set its project's handle to the one currently in use",
    fn: ({
      contracts,
      executeFn,
      local: { secondOwner, secondHandle, expectedSecondProjectId }
    }) =>
      executeFn({
        caller: secondOwner,
        contract: contracts.projects,
        fn: "setHandle",
        args: [expectedSecondProjectId, secondHandle],
        revert: "Projects::setHandle: HANDLE_TAKEN"
      })
  },
  {
    description:
      "Don't allow a handle to be transfered if the replacement is taken",
    fn: ({
      contracts,
      executeFn,
      local: { owner, secondOwner, handle, expectedProjectId }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "transferHandle",
        args: [expectedProjectId, secondOwner.address, handle],
        revert: "Projects::transferHandle: HANDLE_TAKEN"
      })
  },
  {
    description: "Transfer a handle and replace it with a new one",
    fn: async ({
      contracts,
      executeFn,
      randomBytesFn,
      local: { owner, secondOwner, expectedProjectId, handle, secondHandle }
    }) => {
      const thirdHandle = randomBytesFn({
        // Make sure its unique by prepending the id.
        prepend: expectedProjectId.toString(),
        exclude: [handle, secondHandle]
      });
      await executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "transferHandle",
        args: [expectedProjectId, secondOwner.address, thirdHandle]
      });
      return { thirdHandle };
    }
  },
  {
    description: "Make sure the replacement handle got saved",
    fn: ({
      contracts,
      randomSignerFn,
      checkFn,
      local: { thirdHandle, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId],
        expect: thirdHandle
      })
  },
  {
    description: "Make sure the project was saved to the replacement handle",
    fn: ({
      contracts,
      randomSignerFn,
      checkFn,
      local: { thirdHandle, expectedProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "projectFor",
        args: [thirdHandle],
        expect: expectedProjectId
      })
  },
  {
    description:
      "Make sure there is no project associated with the transfered handle",
    fn: ({ contracts, randomSignerFn, checkFn, local: { secondHandle } }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "projectFor",
        args: [secondHandle],
        expect: 0
      })
  },
  {
    description:
      "Make sure a project can't be created with the transfered handle",
    fn: ({
      deployer,
      contracts,
      constants,
      executeFn,
      randomStringFn,
      local: { secondOwner, secondHandle }
    }) =>
      executeFn({
        caller: deployer,
        contract: contracts.projects,
        fn: "create",
        args: [
          secondOwner.address,
          secondHandle,
          randomStringFn(),
          constants.AddressZero
        ],
        revert: "Projects::create: HANDLE_TAKEN"
      })
  },
  {
    description:
      "Make sure a project can't set its handle to the transfered handle",
    fn: ({
      contracts,
      executeFn,
      local: { secondOwner, secondHandle, expectedSecondProjectId }
    }) =>
      executeFn({
        caller: secondOwner,
        contract: contracts.projects,
        fn: "setHandle",
        args: [expectedSecondProjectId, secondHandle],
        revert: "Projects::setHandle: HANDLE_TAKEN"
      })
  },
  {
    description:
      "Make sure no one else but the intended recipient can claim the transferd handle",
    fn: ({
      contracts,
      executeFn,
      local: { owner, secondOwner, secondHandle, expectedProjectId }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "claimHandle",
        args: [secondHandle, owner.address, expectedProjectId],
        revert:
          owner.address !== secondOwner.address &&
          "Projects::claimHandle: UNAUTHORIZED"
      })
  },
  {
    description:
      "Make sure a transfered handle can be claimed if it hasn't been already",
    fn: ({
      contracts,
      executeFn,
      local: { owner, secondOwner, secondHandle, expectedSecondProjectId }
    }) =>
      executeFn({
        caller: secondOwner,
        contract: contracts.projects,
        fn: "claimHandle",
        args: [secondHandle, secondOwner.address, expectedSecondProjectId],
        revert:
          owner.address === secondOwner.address &&
          "Projects::claimHandle: UNAUTHORIZED"
      })
  },
  {
    description: "Make sure the claimed handle got saved",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        owner,
        secondOwner,
        secondHandle,
        expectedProjectId,
        expectedSecondProjectId
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "handleOf",
        args: [
          owner.address === secondOwner.address
            ? expectedProjectId
            : expectedSecondProjectId
        ],
        expect: secondHandle
      })
  },
  {
    description: "Make sure the project was saved to the claimed handle",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: {
        owner,
        secondOwner,
        secondHandle,
        expectedProjectId,
        expectedSecondProjectId
      }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "projectFor",
        args: [secondHandle],
        expect:
          owner.address === secondOwner.address
            ? expectedProjectId
            : expectedSecondProjectId
      })
  },
  {
    description: "Check to see if the first handle is still set correctly",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { owner, secondOwner, handle, expectedSecondProjectId }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect:
          owner.address === secondOwner.address ? expectedSecondProjectId : 0
      })
  },
  {
    description: "Make a payment to the project",
    fn: async ({
      contracts,
      executeFn,
      BigNumber,
      randomBigNumberFn,
      randomStringFn,
      getBalanceFn,
      randomAddressFn,
      randomBoolFn,
      randomSignerFn,
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
        value: paymentValue
      });

      return { paymentValue };
    }
  },
  {
    description: "Configure the project's funding cycle",
    fn: async ({
      contracts,
      constants,
      executeFn,
      BigNumber,
      randomBigNumberFn,
      incrementFundingCycleIdFn,
      local: { owner, paymentValue, expectedProjectId }
    }) => {
      // Burn the unused funding cycle ID.
      incrementFundingCycleIdFn();

      // The currency will be 0, which corresponds to ETH.
      const currency = 0;
      await executeFn({
        caller: owner,
        contract: contracts.terminalV1,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            // Set a target amount thats at least the payment value so that the full payment value can be tapped.
            target: randomBigNumberFn({ min: paymentValue }),
            currency,
            duration: randomBigNumberFn({
              min: BigNumber.from(1),
              max: constants.MaxUint16
            }),
            cycleLimit: randomBigNumberFn({ max: constants.MaxCycleLimit }),
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
      return { currency };
    }
  },
  {
    description:
      "Anyone can tap the full payment value on the project's behalf",
    fn: ({
      contracts,
      executeFn,
      randomSignerFn,
      local: { paymentValue, currency, expectedProjectId }
    }) =>
      executeFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "tap",
        args: [expectedProjectId, paymentValue, currency, paymentValue]
      })
  }
];
