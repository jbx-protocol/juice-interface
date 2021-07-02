/** 
  Projects can be created independently from the Juicer `deploy` mechanism.
  Each project can set a URI that should be a IPFS CID, and a unique handle.

  Unique handles can be transfered between accounts.

  A created project can make use all Juicer functionality as normal.
*/
module.exports = [
  {
    description: "Create a project.",
    fn: async ({
      deployer,
      contracts,
      executeFn,
      BigNumber,
      randomStringFn,
      randomSignerFn,
      randomBytesFn
    }) => {
      // The address that will own a project.
      const owner = randomSignerFn();

      // Use the juicer as the terminal.
      const terminal = contracts.juicer.address;

      const handle = randomBytesFn();

      const uri = randomStringFn();

      // Since the governance project was created before this test, the created project ID should be 2.
      const expectedProjectId = BigNumber.from(2);

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
    description: "Make sure the project's handle got saved.",
    fn: async ({ contracts, checkFn, local: { handle, expectedProjectId } }) =>
      checkFn({
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId],
        expect: handle
      })
  },
  {
    description: "Make sure the project was saved to the handle.",
    fn: ({ contracts, checkFn, local: { handle, expectedProjectId } }) =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect: expectedProjectId
      })
  },
  {
    description: "Make sure the project's uri got saved.",
    fn: ({ contracts, checkFn, local: { uri, expectedProjectId } }) =>
      checkFn({
        contract: contracts.projects,
        fn: "uriOf",
        args: [expectedProjectId],
        expect: uri
      })
  },
  {
    description: "Make sure the terminal was set in the directory.",
    fn: ({ contracts, checkFn, local: { terminal, expectedProjectId } }) =>
      checkFn({
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: terminal
      })
  },
  {
    description:
      "Make sure someone else can't deploy a project with the same handle.",
    fn: async ({
      deployer,
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
        caller: deployer,
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
    description: "Set a new URI.",
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
    description: "Make sure the new uri got saved.",
    fn: ({ contracts, checkFn, local: { secondUri, expectedProjectId } }) =>
      checkFn({
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
      const secondHandle = randomBytesFn({ exclude: [handle] });
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
    description: "Make sure the new handle got saved.",
    fn: ({ contracts, checkFn, local: { secondHandle, expectedProjectId } }) =>
      checkFn({
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId],
        expect: secondHandle
      })
  },
  {
    description: "Make sure the project was saved to the new handle.",
    fn: ({ contracts, checkFn, local: { secondHandle, expectedProjectId } }) =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [secondHandle],
        expect: expectedProjectId
      })
  },
  {
    description:
      "Make sure the old handle isn't affiliated with a project any longer.",
    fn: ({ contracts, checkFn, local: { handle } }) =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect: 0
      })
  },
  {
    description:
      "Create another project for a different owner using the old handle.",
    fn: ({
      deployer,
      contracts,
      constants,
      executeFn,
      randomStringFn,
      local: { secondOwner, handle }
    }) =>
      executeFn({
        caller: deployer,
        contract: contracts.projects,
        fn: "create",
        args: [
          secondOwner.address,
          handle,
          randomStringFn(),
          constants.AddressZero
        ]
      })
  },
  {
    description:
      "Make sure the other owner can't set its project's handle to the one currently in use.",
    fn: async ({
      contracts,
      executeFn,
      BigNumber,
      local: { secondOwner, secondHandle }
    }) => {
      // The second project should have an incremented ID.
      const expectedSecondProjectId = BigNumber.from(3);

      await executeFn({
        caller: secondOwner,
        contract: contracts.projects,
        fn: "setHandle",
        args: [expectedSecondProjectId, secondHandle],
        revert: "Projects::setHandle: HANDLE_TAKEN"
      });

      return { expectedSecondProjectId };
    }
  },
  {
    description:
      "Don't allow a handle to be transfered if the replacement is taken.",
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
    description: "Transfer a handle and replace it with a new one.",
    fn: async ({
      contracts,
      executeFn,
      stringToBytesFn,
      randomBytesFn,
      local: { owner, secondOwner, expectedProjectId, handle, secondHandle }
    }) => {
      const thirdHandle = randomBytesFn({ exlucde: [handle, secondHandle] });
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
    description: "Make sure the replacement handle got saved.",
    fn: ({ contracts, checkFn, local: { thirdHandle, expectedProjectId } }) =>
      checkFn({
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId],
        expect: thirdHandle
      })
  },
  {
    description: "Make sure the project was saved to the replacement handle.",
    fn: ({ contracts, checkFn, local: { thirdHandle, expectedProjectId } }) =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [thirdHandle],
        expect: expectedProjectId
      })
  },
  {
    description:
      "Make sure there is no project associated with the transfered handle.",
    fn: ({ contracts, checkFn, local: { secondHandle } }) =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [secondHandle],
        expect: 0
      })
  },
  {
    description:
      "Make sure a project can't be created with the transfered handle.",
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
      "Make sure a project can't set its handle to the transfered handle.",
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
      "Make sure no one else but the intended recipient can claim the transferd handle.",
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
          "Projects::claimHandle: NOT_FOUND"
      })
  },
  {
    description:
      "Make sure a transfered handle can be claimed if it hasn't been already.",
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
          "Projects::claimHandle: NOT_FOUND"
      })
  },
  {
    description: "Make sure the claimed handle got saved.",
    fn: ({
      contracts,
      checkFn,
      local: {
        owner,
        secondOwner,
        secondHandle,
        expectedProjectId,
        expectedSecondProjectId
      }
    }) =>
      checkFn({
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
    description: "Make sure the project was saved to the claimed handle.",
    fn: ({
      contracts,
      checkFn,
      local: {
        owner,
        secondOwner,
        secondHandle,
        expectedProjectId,
        expectedSecondProjectId
      }
    }) =>
      checkFn({
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
    description: "Check to see if the first handle is still set correctly.",
    fn: ({
      contracts,
      checkFn,
      local: { owner, secondOwner, handle, expectedSecondProjectId }
    }) =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect:
          owner.address === secondOwner.address ? expectedSecondProjectId : 0
      })
  },
  {
    description: "Make a payment to the project.",
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
      // So, arbitrarily find a number less than 1/2 so that all payments can be made successfully.
      const paymentValue = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(2)
      });

      await executeFn({
        caller: payer,
        contract: contracts.juicer,
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
    description: "Configure the projects funding cycle.",
    fn: async ({
      contracts,
      constants,
      executeFn,
      BigNumber,
      randomBigNumberFn,
      local: { owner, paymentValue, expectedProjectId }
    }) => {
      // The currency will be 0, which corresponds to ETH.
      const currency = 0;
      await executeFn({
        caller: owner,
        contract: contracts.juicer,
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
      "Anyone can tap the full payment value on the project's behalf.",
    fn: ({
      contracts,
      executeFn,
      randomSignerFn,
      local: { paymentValue, currency, expectedProjectId }
    }) =>
      executeFn({
        caller: randomSignerFn(),
        contract: contracts.juicer,
        fn: "tap",
        args: [expectedProjectId, paymentValue, currency, paymentValue]
      })
  }
];
