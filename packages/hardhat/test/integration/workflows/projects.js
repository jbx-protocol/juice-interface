/** 
  Projects can be created independently from the Juicer `deploy` mechanism.
  Each project can set a URI that should be a IPFS CID, and a unique handle.

  Unique handles can be transfered between accounts.

  A created project can make use all Juicer functionality as normal.
*/
module.exports = async ({
  deployer,
  addrs,
  contracts,
  constants,
  executeFn,
  checkFn,
  BigNumber,
  randomBigNumberFn,
  stringToBytesFn,
  randomStringFn,
  getBalanceFn,
  randomAddressFn,
  randomBoolFn
}) => {
  // The address that will own a project.
  const owner = addrs[0];

  // The address that will own another project.
  const secondOwner = addrs[1];

  // An account that will be used to make payments.
  const payer = addrs[2];

  // One payment will be made. Cant pay entire balance because some is needed for gas.
  // So, arbitrarily find a number less than 1/2 so that all payments can be made successfully.
  const paymentValue = randomBigNumberFn({
    max: (await getBalanceFn(payer.address)).div(4)
  });

  // Set a target amount thats at least the payment value so that the full payment value can be tapped.
  const target = randomBigNumberFn({ min: paymentValue });

  // The currency will be 0, which corresponds to ETH.
  const currency = 0;

  // Use the juicer as the terminal.
  const terminal = contracts.juicer.address;

  const handle = stringToBytesFn("some-unique-handle");
  const secondHandle = stringToBytesFn("some-other-unique-handle");
  const thirdHandle = stringToBytesFn("another-unique-handle");
  const uri = randomStringFn();
  const secondUri = randomStringFn();

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = BigNumber.from(2);

  // The second project should have an incremented ID.
  const expectedSecondProjectId = BigNumber.from(3);

  return [
    /** 
      Create a project.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.projects,
        fn: "create",
        args: [owner.address, handle, uri, terminal]
      }),
    /**
      Make sure the project's handle got saved.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId],
        expect: handle
      }),
    /**
      Make sure the project was saved to the handle.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect: expectedProjectId
      }),
    /**
      Make sure the project's uri got saved.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "uriOf",
        args: [expectedProjectId],
        expect: uri
      }),
    /**
      Make sure the terminal was set in the directory.
    */
    () =>
      checkFn({
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: terminal
      }),
    /**
      Make sure someone else can't deploy a project with the same handle.
    */
    () =>
      executeFn({
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
      }),
    /**
      Set a new URI.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "setUri",
        args: [expectedProjectId, secondUri]
      }),
    /**
      Make sure the new uri got saved.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "uriOf",
        args: [expectedProjectId],
        expect: secondUri
      }),
    /**
      Set a new handle.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "setHandle",
        args: [expectedProjectId, secondHandle]
      }),
    /**
      Make sure the new handle got saved.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId],
        expect: secondHandle
      }),
    /**
      Make sure the project was saved to the new handle.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [secondHandle],
        expect: expectedProjectId
      }),
    /**
      Make sure the old handle isn't affiliated with a project any longer.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect: 0
      }),
    /**
      Create another project for a different owner using the old handle.
    */
    () =>
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
      }),
    /**
      Make sure the other owner can't set its project's handle to the one currently in use.
    */
    () =>
      executeFn({
        caller: secondOwner,
        contract: contracts.projects,
        fn: "setHandle",
        args: [expectedSecondProjectId, secondHandle],
        revert: "Projects::setHandle: HANDLE_TAKEN"
      }),
    /**
      Don't allow a handle to be transfered if the replacement is taken.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "transferHandle",
        args: [expectedProjectId, secondOwner.address, handle],
        revert: "Projects::transferHandle: HANDLE_TAKEN"
      }),
    /**
      Transfer a handle and replace it with a new one.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "transferHandle",
        args: [expectedProjectId, secondOwner.address, thirdHandle]
      }),
    /**
      Make sure the replacement handle got saved.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId],
        expect: thirdHandle
      }),
    /**
      Make sure the project was saved to the replacement handle.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [thirdHandle],
        expect: expectedProjectId
      }),
    /**
      Make sure there is no project associated with the transfered handle.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [secondHandle],
        expect: 0
      }),
    /**
      Make sure a project can't be created with the transfered handle.
    */
    () =>
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
      }),
    /**
      Make sure a project can't set its handle to the transfered handle.
    */
    () =>
      executeFn({
        caller: secondOwner,
        contract: contracts.projects,
        fn: "setHandle",
        args: [expectedSecondProjectId, secondHandle],
        revert: "Projects::setHandle: HANDLE_TAKEN"
      }),
    /**
      Make sure no one else but the intended recipient can claim the transferd handle.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "claimHandle",
        args: [secondHandle, owner.address, expectedProjectId],
        revert: "Projects::claimHandle: NOT_FOUND"
      }),
    /**
      Make sure a transfered handle can be claimed.
    */
    () =>
      executeFn({
        caller: secondOwner,
        contract: contracts.projects,
        fn: "claimHandle",
        args: [secondHandle, secondOwner.address, expectedSecondProjectId]
      }),
    /**
      Make sure the claimed handle got saved.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedSecondProjectId],
        expect: secondHandle
      }),
    /**
      Make sure the project was saved to the claimed handle.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [secondHandle],
        expect: expectedSecondProjectId
      }),
    /**
      Make sure there is no project associated with old handle
      of the project that received the claimed handle.
    */
    () =>
      checkFn({
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect: 0
      }),
    /**
      Make a payment to the project.
    */
    () =>
      executeFn({
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
      }),
    /**
      Configure the projects funding cycle.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.juicer,
        fn: "configure",
        args: [
          expectedProjectId,
          {
            target,
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
      }),
    /**
      The owner can tap the full payment value.
    */
    () =>
      executeFn({
        caller: payer,
        contract: contracts.juicer,
        fn: "tap",
        args: [expectedProjectId, paymentValue, currency, paymentValue]
      })
  ];
};
