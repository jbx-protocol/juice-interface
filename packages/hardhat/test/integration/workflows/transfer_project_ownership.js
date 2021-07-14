/** 
  The governance of the TerminalV1 can transfer its power to a new address.
  To do so, the governance must appoint a new address, and that address must accept the appointment.
*/
module.exports = [
  {
    description: "Create a project for the initial owner",
    fn: async ({
      contracts,
      constants,
      executeFn,
      randomStringFn,
      randomSignerFn,
      incrementProjectIdFn,
      randomBytesFn
    }) => {
      const expectedProjectId = incrementProjectIdFn();

      // The address that will own a project.
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
          constants.AddressZero
        ]
      });
      return { owner, expectedProjectId };
    }
  },
  {
    description: "The owner should be able to set a new uri for the project",
    fn: ({
      contracts,
      executeFn,
      randomStringFn,
      local: { owner, expectedProjectId }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "setUri",
        args: [expectedProjectId, randomStringFn()]
      })
  },
  {
    description: "Non owners that aren't operators cant set the uri",
    fn: ({
      executeFn,
      contracts,
      randomStringFn,
      randomSignerFn,
      local: { owner, expectedProjectId }
    }) =>
      executeFn({
        caller: randomSignerFn({ exclude: [owner.address] }),
        contract: contracts.projects,
        fn: "setUri",
        args: [expectedProjectId, randomStringFn()],
        revert: "Operatable: UNAUTHORIZED"
      })
  },
  {
    description: "Transfer ownership to a new owner",
    fn: async ({
      executeFn,
      contracts,
      randomSignerFn,
      local: { owner, expectedProjectId }
    }) => {
      // The address that will own another project.
      const secondOwner = randomSignerFn();
      await executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "transferFrom",
        args: [owner.address, secondOwner.address, expectedProjectId]
      });
      return { secondOwner };
    }
  },
  {
    description:
      "The new owner should be able to set a new uri for the project",
    fn: ({
      executeFn,
      contracts,
      randomStringFn,
      local: { secondOwner, expectedProjectId }
    }) =>
      executeFn({
        caller: secondOwner,
        contract: contracts.projects,
        fn: "setUri",
        args: [expectedProjectId, randomStringFn()]
      })
  },
  {
    description: "The old owner can no longer set the uri",
    fn: ({
      executeFn,
      contracts,
      randomStringFn,
      local: { owner, secondOwner, expectedProjectId }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "setUri",
        args: [expectedProjectId, randomStringFn()],
        revert:
          owner.address !== secondOwner.address && "Operatable: UNAUTHORIZED"
      })
  }
];
