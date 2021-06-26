/** 
  Project owners can give an operator permission
  to do certain things on their behalf. 

  Test to make sure each function that can be operated 
  handles authorization correctly.
*/
module.exports = async ({
  deployer,
  addrs,
  constants,
  contracts,
  executeFn,
  checkFn,
  BigNumber,
  stringToBytesFn,
  randomStringFn
}) => {
  // The address that will own a project.
  const owner = addrs[0];
  // The address that will operate a project.
  const operator = addrs[1];
  // An address that's neither the owner nor the operator.
  const other = addrs[2];

  // Since the governance project was created before this test, the created project ID should be 2.
  const expectedProjectId = BigNumber.from(2);

  const operations = [
    {
      contract: contracts.juicer,
      fn: "configure",
      args: [
        expectedProjectId,
        {
          target: BigNumber.from(1000),
          currency: BigNumber.from(1),
          duration: BigNumber.from(1),
          discountRate: BigNumber.from(1),
          ballot: constants.AddressZero
        },
        {
          reservedRate: BigNumber.from(1),
          bondingCurveRate: BigNumber.from(1),
          reconfigurationBondingCurveRate: BigNumber.from(1)
        },
        [],
        []
      ],
      domain: expectedProjectId,
      permissionIndex: 1
    },
    {
      contract: contracts.juicer,
      fn: "printPreminedTickets",
      args: [
        expectedProjectId,
        BigNumber.from(1000),
        BigNumber.from(0),
        constants.AddressZero,
        "",
        false
      ],
      domain: expectedProjectId,
      permissionIndex: 2,
      authorizedRevert: "Juicer::printTickets: ZERO_ADDRESS"
    },
    {
      contract: contracts.juicer,
      fn: "redeem",
      args: [
        owner.address,
        expectedProjectId,
        BigNumber.from(1),
        BigNumber.from(0),
        constants.AddressZero,
        true
      ],
      domain: expectedProjectId,
      permissionIndex: 3,
      authorizedRevert: "Juicer::redeem: ZERO_ADDRESS"
    },
    {
      contract: contracts.juicer,
      fn: "migrate",
      args: [expectedProjectId, constants.AddressZero],
      domain: expectedProjectId,
      permissionIndex: 4,
      authorizedRevert: "Juicer::migrate: NOT_ALLOWED"
    },
    {
      contract: contracts.projects,
      fn: "setHandle",
      args: [expectedProjectId, stringToBytesFn("")],
      domain: expectedProjectId,
      permissionIndex: 5,
      authorizedRevert: "Projects::setHandle: EMPTY_HANDLE"
    },
    {
      contract: contracts.projects,
      fn: "setUri",
      args: [expectedProjectId, ""],
      domain: expectedProjectId,
      permissionIndex: 6
    },
    {
      contract: contracts.projects,
      fn: "transferHandle",
      args: [expectedProjectId, constants.AddressZero, stringToBytesFn("")],
      domain: expectedProjectId,
      permissionIndex: 5,
      authorizedRevert: "Projects::transferHandle: EMPTY_HANDLE"
    },
    {
      override: [
        // Unauthorized if claiming for a different account.
        () =>
          executeFn({
            caller: owner,
            contract: contracts.projects,
            fn: "claimHandle",
            args: [stringToBytesFn(""), addrs[4].address, expectedProjectId],
            revert: "Operatable: UNAUTHORIZED"
          }),
        // Authorized if claiming for owner account.
        () => () =>
          executeFn({
            caller: owner,
            contract: contracts.projects,
            fn: "claimHandle",
            args: [stringToBytesFn(""), owner.address, expectedProjectId],
            revert: "Projects::claimHandle: NOT_FOUND"
          }),
        // The operator should not have permission.
        () =>
          checkFn({
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, owner.address, expectedProjectId, [7]],
            expect: false
          }),
        // Set the operator on the owner.
        () =>
          executeFn({
            caller: owner,
            contract: contracts.operatorStore,
            fn: "setOperator",
            args: [operator.address, expectedProjectId, [7]]
          }),
        // The operator should now have permission.
        () =>
          checkFn({
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, owner.address, expectedProjectId, [7]],
            expect: true
          }),
        // The operator should not have permission over the claimer.
        () =>
          checkFn({
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, addrs[4].address, expectedProjectId, [7]],
            expect: false
          }),
        // Set the operator on the claimer.
        () =>
          executeFn({
            caller: addrs[4],
            contract: contracts.operatorStore,
            fn: "setOperator",
            args: [operator.address, expectedProjectId, [7]]
          }),
        // The operator should now have permission over the claimer.
        () =>
          checkFn({
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, addrs[4].address, expectedProjectId, [7]],
            expect: true
          }),
        // The operator should have permissions.
        () =>
          executeFn({
            caller: operator,
            contract: contracts.projects,
            fn: "claimHandle",
            args: [stringToBytesFn(""), addrs[4].address, expectedProjectId],
            revert: "Projects::claimHandle: NOT_FOUND"
          }),
        // Get rid of the permission from the projects domain.
        () =>
          executeFn({
            caller: addrs[4],
            contract: contracts.operatorStore,
            fn: "setOperator",
            args: [operator.address, expectedProjectId, []]
          }),
        // The operator should not have permission over the claimer.
        () =>
          checkFn({
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, addrs[4].address, expectedProjectId, [7]],
            expect: false
          }),
        // The operator should not have permission over the claimer's wildcard.
        () =>
          checkFn({
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, addrs[4].address, 0, [7]],
            expect: false
          }),
        // Add the permission to the wildcard domain.
        () =>
          executeFn({
            caller: addrs[4],
            contract: contracts.operatorStore,
            fn: "setOperator",
            args: [operator.address, 0, [7]]
          }),
        // The operator should now have permission over the claimer's wildcard.
        () =>
          checkFn({
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, addrs[4].address, 0, [7]],
            expect: true
          }),
        // The operator should still have permissions.
        () =>
          executeFn({
            caller: operator,
            contract: contracts.projects,
            fn: "claimHandle",
            args: [stringToBytesFn(""), addrs[4].address, expectedProjectId],
            revert: "Projects::claimHandle: NOT_FOUND"
          }),
        // A non-owner or operator account shouldnt be authorized.
        () =>
          executeFn({
            caller: other,
            contract: contracts.projects,
            fn: "claimHandle",
            args: [stringToBytesFn(""), addrs[4].address, expectedProjectId],
            revert: "Operatable: UNAUTHORIZED"
          }),
        // Remove permissions from the operator.
        () =>
          executeFn({
            caller: owner,
            contract: contracts.operatorStore,
            fn: "setOperator",
            args: [operator.address, expectedProjectId, []]
          }),
        // The operator should not have permission over the claimer's wildcard.
        () =>
          checkFn({
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, addrs[4].address, expectedProjectId, [7]],
            expect: false
          }),
        // Operator should no longer have permission.
        () =>
          executeFn({
            caller: operator,
            contract: contracts.projects,
            fn: "claimHandle",
            args: [stringToBytesFn(""), addrs[4].address, expectedProjectId],
            revert: "Operatable: UNAUTHORIZED"
          })
      ]
    },
    {
      contract: contracts.ticketBooth,
      fn: "issue",
      args: [expectedProjectId, "", ""],
      domain: expectedProjectId,
      permissionIndex: 8,
      authorizedRevert: "Tickets::issue: ALREADY_ISSUED",

      // Issue tickets ahead of time so that the authorized revert message will be consistent.
      pre: [
        () =>
          executeFn({
            caller: owner,
            contract: contracts.ticketBooth,
            fn: "issue",
            args: [expectedProjectId, "", ""]
          })
      ]
    },
    {
      contract: contracts.ticketBooth,
      fn: "stake",
      args: [owner.address, expectedProjectId, BigNumber.from(1)],
      domain: expectedProjectId,
      allowWildcard: true,
      permissionIndex: 9,
      authorizedRevert: "Tickets::stake: INSUFFICIENT_FUNDS"
    },
    {
      contract: contracts.ticketBooth,
      fn: "unstake",
      args: [owner.address, expectedProjectId, BigNumber.from(1)],
      domain: expectedProjectId,
      permissionIndex: 10,
      allowWildcard: true,
      authorizedRevert: "Tickets::unstake: INSUFFICIENT_FUNDS"
    },
    {
      contract: contracts.ticketBooth,
      fn: "transfer",
      args: [
        owner.address,
        expectedProjectId,
        BigNumber.from(1),
        constants.AddressZero
      ],
      domain: expectedProjectId,
      allowWildcard: true,
      permissionIndex: 11,
      authorizedRevert: "Tickets::transfer: ZERO_ADDRESS"
    },
    {
      contract: contracts.ticketBooth,
      fn: "lock",
      args: [owner.address, expectedProjectId, BigNumber.from(0)],
      domain: expectedProjectId,
      allowWildcard: true,
      permissionIndex: 12,
      authorizedRevert: "Tickets::lock: NO_OP"
    },
    // Juicer calls to set payment mods and ticket mods are checked throughout other integration tests.
    {
      contract: contracts.modStore,
      fn: "setPaymentMods",
      args: [expectedProjectId, BigNumber.from(0), []],
      domain: expectedProjectId,
      permissionIndex: 13,
      authorizedRevert: "ModStore::setPaymentMods: NO_OP"
    },
    {
      contract: contracts.modStore,
      fn: "setTicketMods",
      args: [expectedProjectId, BigNumber.from(0), []],
      domain: expectedProjectId,
      permissionIndex: 14,
      authorizedRevert: "ModStore::setTicketMods: NO_OP"
    }
  ];
  return [
    /** 
      Create a project.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.projects,
        fn: "create",
        args: [
          owner.address,
          stringToBytesFn("some-unique-handle"),
          randomStringFn()
        ]
      }),
    /** 
      For each operation, test owner access, operator access, and unauthorized access.
    */
    ...operations.reduce(
      (
        all,
        {
          contract,
          fn,
          args,
          domain,
          authorizedRevert,
          permissionIndex,
          allowWildcard,
          override,
          pre = []
        }
      ) => {
        return [
          ...all,
          ...pre,
          ...(override || [
            // Operator shouldnt have permission at first.
            () =>
              checkFn({
                contract: contracts.operatorStore,
                fn: "hasPermission",
                args: [
                  operator.address,
                  owner.address,
                  domain,
                  [permissionIndex]
                ],
                expect: false
              }),
            // The owner should be authorized.
            () =>
              executeFn({
                caller: owner,
                contract,
                fn,
                args,
                revert: authorizedRevert
              }),
            // At permissions to the operator on the domain.
            () =>
              executeFn({
                caller: owner,
                contract: contracts.operatorStore,
                fn: "setOperator",
                args: [operator.address, domain, [permissionIndex]]
              }),
            // The operator should now have permission.
            () =>
              checkFn({
                contract: contracts.operatorStore,
                fn: "hasPermission",
                args: [
                  operator.address,
                  owner.address,
                  domain,
                  [permissionIndex]
                ],
                expect: true
              }),
            // Operator should be authorized.
            () =>
              executeFn({
                caller: operator,
                contract,
                fn,
                args,
                revert: authorizedRevert
              }),
            // Check for wildcard authorization if needed.
            ...(allowWildcard
              ? [
                  // Remove the operator's permission from domain.
                  () =>
                    executeFn({
                      caller: owner,
                      contract: contracts.operatorStore,
                      fn: "setOperator",
                      args: [operator.address, domain, []]
                    }),
                  // The operator should no longer have permission over this domain.
                  () =>
                    checkFn({
                      contract: contracts.operatorStore,
                      fn: "hasPermission",
                      args: [
                        operator.address,
                        owner.address,
                        domain,
                        [permissionIndex]
                      ],
                      expect: false
                    }),
                  // Give the operator permission over the wildcard.
                  () =>
                    executeFn({
                      caller: owner,
                      contract: contracts.operatorStore,
                      fn: "setOperator",
                      args: [operator.address, 0, [permissionIndex]]
                    }),
                  // The operator should now have permission over the wildcard.
                  () =>
                    checkFn({
                      contract: contracts.operatorStore,
                      fn: "hasPermission",
                      args: [
                        operator.address,
                        owner.address,
                        0,
                        [permissionIndex]
                      ],
                      expect: true
                    }),
                  // Should still be authorized.
                  () =>
                    executeFn({
                      caller: operator,
                      contract,
                      fn,
                      args,
                      revert: authorizedRevert
                    }),
                  // Remove permission from wildcard.
                  () =>
                    executeFn({
                      caller: owner,
                      contract: contracts.operatorStore,
                      fn: "setOperator",
                      args: [operator.address, 0, []]
                    }),
                  // The operator should no longer have permission over the wildcard.
                  () =>
                    checkFn({
                      contract: contracts.operatorStore,
                      fn: "hasPermission",
                      args: [
                        operator.address,
                        owner.address,
                        0,
                        [permissionIndex]
                      ],
                      expect: false
                    })
                ]
              : []),
            // A non-owner or operator account shouldnt be authorized.
            () =>
              executeFn({
                caller: other,
                contract,
                fn,
                args,
                revert: "Operatable: UNAUTHORIZED"
              }),
            // Remove all permissions from operator for domain.
            () =>
              executeFn({
                caller: owner,
                contract: contracts.operatorStore,
                fn: "setOperator",
                args: [operator.address, domain, []]
              }),
            // The operator should no longer have permission over this domain.
            () =>
              checkFn({
                contract: contracts.operatorStore,
                fn: "hasPermission",
                args: [
                  operator.address,
                  owner.address,
                  domain,
                  [permissionIndex]
                ],
                expect: false
              }),
            // Operator should no longer be authorized.
            () =>
              executeFn({
                caller: operator,
                contract,
                fn,
                args,
                revert: "Operatable: UNAUTHORIZED"
              })
          ])
        ];
      },
      []
    )
  ];
};
