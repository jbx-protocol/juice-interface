/** 
  A project's handle can be challenged, after which a year must pass without it being renewed before it can be claimed.
*/
module.exports = [
  {
    description: "The challenge expiry for an unused handle should start at 0",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      incrementProjectIdFn,
      randomBytesFn
    }) => {
      const expectedProjectId1 = incrementProjectIdFn();

      // Make sure its unique by prepending the id.
      const handle = randomBytesFn({ prepend: expectedProjectId1.toString() });

      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "challengeExpiryOf",
        args: [handle],
        expect: 0
      });

      return { handle, expectedProjectId1 };
    }
  },
  {
    description: "Create a project",
    fn: async ({
      deployer,
      contracts,
      executeFn,
      randomStringFn,
      randomSignerFn,
      local: { handle }
    }) => {
      // The address that will own a project.
      const owner = randomSignerFn();

      await executeFn({
        caller: deployer,
        contract: contracts.projects,
        fn: "create",
        args: [
          owner.address,
          handle,
          randomStringFn(),
          contracts.terminalV1.address
        ]
      });

      return { owner, handle };
    }
  },
  {
    description: "Make sure the project's handle got saved",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { handle, expectedProjectId1 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId1],
        expect: handle
      })
  },
  {
    description: "Make sure the project was saved to the handle",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { handle, expectedProjectId1 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect: expectedProjectId1
      })
  },
  {
    description: "The challenge expiry should still be 0",
    fn: async ({ contracts, checkFn, randomSignerFn, local: { handle } }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "challengeExpiryOf",
        args: [handle],
        expect: 0
      })
  },
  {
    description: "Challenge the handle",
    fn: async ({ contracts, executeFn, randomSignerFn, local: { handle } }) =>
      executeFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "challengeHandle",
        args: [handle]
      })
  },
  {
    description: "Make sure the challenge expiry got set",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      timeMark,
      local: { handle }
    }) => {
      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "challengeExpiryOf",
        args: [handle],
        expect: timeMark.add(31536000)
      });

      return { challengeTimeMark: timeMark };
    }
  },
  {
    description: "Create another project to claim the challenged handle onto",
    fn: async ({
      deployer,
      contracts,
      executeFn,
      randomStringFn,
      randomSignerFn,
      incrementProjectIdFn,
      randomBytesFn
    }) => {
      // The address that will own the second project.
      const claimer = randomSignerFn();

      const expectedProjectId2 = incrementProjectIdFn();

      // Make sure its unique by prepending the id.
      const handle2 = randomBytesFn({ prepend: expectedProjectId2.toString() });

      await executeFn({
        caller: deployer,
        contract: contracts.projects,
        fn: "create",
        args: [
          claimer.address,
          handle2,
          randomStringFn(),
          contracts.terminalV1.address
        ]
      });

      return { claimer, handle2, expectedProjectId2 };
    }
  },
  {
    description: "Make sure the second project's handle got saved",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { handle2, expectedProjectId2 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId2],
        expect: handle2
      })
  },
  {
    description: "Make sure the second project was saved to the handle",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { handle2, expectedProjectId2 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle2],
        expect: expectedProjectId2
      })
  },
  {
    description: "Fastforward to within the challenge expiry",
    fn: ({ fastforwardFn, BigNumber }) =>
      fastforwardFn(BigNumber.from(31535900))
  },
  {
    description: "Claiming should still be unauthorized",
    fn: ({
      contracts,
      executeFn,
      local: { handle, claimer, expectedProjectId2 }
    }) =>
      executeFn({
        caller: claimer,
        contract: contracts.projects,
        fn: "claimHandle",
        args: [handle, claimer.address, expectedProjectId2],
        revert: "Projects::claimHandle: UNAUTHORIZED"
      })
  },
  {
    description: "Fastforward to past the challenge expiry",
    fn: ({ BigNumber, fastforwardFn, randomBigNumberFn }) =>
      fastforwardFn(
        randomBigNumberFn({
          min: BigNumber.from(100),
          max: BigNumber.from(9999)
        })
      )
  },
  {
    description: "Claim the handle",
    fn: ({
      contracts,
      executeFn,
      local: { handle, claimer, expectedProjectId2 }
    }) =>
      executeFn({
        caller: claimer,
        contract: contracts.projects,
        fn: "claimHandle",
        args: [handle, claimer.address, expectedProjectId2]
      })
  },
  {
    description: "Make sure the second project's claimed handle got saved",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { handle, expectedProjectId2 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId2],
        expect: handle
      })
  },
  {
    description: "Make sure the second project was saved to the claimed handle",
    fn: ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { handle, expectedProjectId2 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "projectFor",
        args: [handle],
        expect: expectedProjectId2
      })
  },
  {
    description:
      "The first project should still have the handle, but not the resolver.",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      local: { handle, expectedProjectId1 }
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "handleOf",
        args: [expectedProjectId1],
        expect: handle
      })
  },
  {
    description: "Make sure the challenge expiry got reset",
    fn: ({ contracts, checkFn, randomSignerFn, local: { handle } }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "challengeExpiryOf",
        args: [handle],
        expect: 0
      })
  },
  {
    description:
      "The original owner will try to claim the handle back, but it should be too soon",
    fn: async ({ contracts, executeFn, randomSignerFn, local: { handle } }) =>
      executeFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "challengeHandle",
        args: [handle]
      })
  },
  {
    description: "Make sure the challenge expiry got set",
    fn: async ({
      contracts,
      checkFn,
      randomSignerFn,
      timeMark,
      local: { handle }
    }) => {
      await checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "challengeExpiryOf",
        args: [handle],
        expect: timeMark.add(31536000)
      });

      return { challengeTimeMark: timeMark };
    }
  },
  {
    description: "Fastforward to within the second challenge expiry",
    fn: ({ fastforwardFn, BigNumber }) =>
      fastforwardFn(BigNumber.from(31535990))
  },
  {
    description:
      "The original owner will try to claim the handle back, but it should be too soon",
    fn: ({
      contracts,
      executeFn,
      local: { handle, owner, expectedProjectId1 }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "claimHandle",
        args: [handle, owner.address, expectedProjectId1],
        revert: "Projects::claimHandle: UNAUTHORIZED"
      })
  },
  {
    description:
      "The claimer can renew the handle so that it cannot be claimed without being challenged again.",
    fn: async ({
      contracts,
      executeFn,
      local: { expectedProjectId2, claimer }
    }) =>
      executeFn({
        caller: claimer,
        contract: contracts.projects,
        fn: "renewHandle",
        args: [expectedProjectId2]
      })
  },
  {
    description: "Make sure the challenge expiry got reset after the renewal",
    fn: ({ contracts, checkFn, randomSignerFn, local: { handle } }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.projects,
        fn: "challengeExpiryOf",
        args: [handle],
        expect: 0
      })
  },
  {
    description: "Fastforward to past the challenge expiry prior to renewing",
    fn: ({ BigNumber, fastforwardFn, randomBigNumberFn }) =>
      fastforwardFn(
        randomBigNumberFn({
          min: BigNumber.from(10),
          max: BigNumber.from(9999)
        })
      )
  },
  {
    description:
      "Claiming should still be unauthorized because the handle has been renewed",
    fn: ({
      contracts,
      executeFn,
      local: { handle, owner, expectedProjectId1 }
    }) =>
      executeFn({
        caller: owner,
        contract: contracts.projects,
        fn: "claimHandle",
        args: [handle, owner.address, expectedProjectId1],
        revert: "Projects::claimHandle: UNAUTHORIZED"
      })
  }
];
