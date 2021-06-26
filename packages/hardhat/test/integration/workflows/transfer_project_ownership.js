/** 
  The governance of the Juicer can transfer its power to a new address.
  To do so, the governance must appoint a new address, and that address must accept the appointment.
*/
module.exports = async ({
  deployer,
  addrs,
  contracts,
  constants,
  BigNumber,
  executeFn,
  stringToBytesFn,
  randomStringFn
}) => {
  // The address that will own a project.
  const owner = addrs[0];

  // The address that will own another project.
  const secondOwner = addrs[1];

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = BigNumber.from(2);

  return [
    /** 
      Create a project for the initial owner.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.projects,
        fn: "create",
        args: [
          owner.address,
          stringToBytesFn("some-unique-handle"),
          stringToBytesFn("some-unique-handle"),
          constants.AddressZero
        ]
      }),
    /**
      The owner should be able to set a new uri for the project.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "setUri",
        args: [expectedProjectId, randomStringFn()]
      }),
    /**
      Non owners that aren't operators cant set the uri.
    */
    () =>
      executeFn({
        caller: secondOwner,
        contract: contracts.projects,
        fn: "setUri",
        args: [expectedProjectId, randomStringFn()],
        revert: "Operatable: UNAUTHORIZED"
      }),
    /**
      Transfer ownership to a new owner.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "transferFrom",
        args: [owner.address, secondOwner.address, expectedProjectId]
      }),
    /**
      The new owner should be able to set a new uri for the project.
    */
    () =>
      executeFn({
        caller: secondOwner,
        contract: contracts.projects,
        fn: "setUri",
        args: [expectedProjectId, randomStringFn()]
      }),
    /**
      The old owner can no longer set the uri.
    */
    () =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "setUri",
        args: [expectedProjectId, randomStringFn()],
        revert: "Operatable: UNAUTHORIZED"
      })
  ];
};
