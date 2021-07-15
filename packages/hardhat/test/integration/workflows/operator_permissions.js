/** 
  Project owners can give an operator permission
  to do certain things on their behalf. 

  Test to make sure each function that can be operated 
  handles authorization correctly.
*/
const operations = [
  {
    expand: ({
      BigNumber,
      contracts,
      constants,
      local: { expectedProjectId }
    }) => ({
      contract: contracts.terminalV1,
      fn: "configure",
      args: [
        expectedProjectId,
        {
          target: BigNumber.from(1000),
          currency: BigNumber.from(1),
          duration: BigNumber.from(1),
          cycleLimit: BigNumber.from(0),
          discountRate: BigNumber.from(1),
          ballot: constants.AddressZero
        },
        {
          reservedRate: BigNumber.from(201),
          bondingCurveRate: BigNumber.from(1),
          reconfigurationBondingCurveRate: BigNumber.from(1)
        },
        [],
        []
      ],
      domain: expectedProjectId,
      permissionIndex: 1,
      authorizedRevert:
        "TerminalV1::_validateAndPackFundingCycleMetadata: BAD_RESERVED_RATE"
    })
  },
  {
    expand: ({
      contracts,
      BigNumber,
      constants,
      local: { expectedProjectId }
    }) => ({
      contract: contracts.terminalV1,
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
      authorizedRevert: "TerminalV1::printTickets: ZERO_ADDRESS"
    })
  },
  {
    expand: ({
      contracts,
      BigNumber,
      constants,
      local: { expectedProjectId, owner }
    }) => ({
      contract: contracts.terminalV1,
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
      authorizedRevert: "TerminalV1::redeem: ZERO_ADDRESS"
    })
  },
  {
    expand: ({ contracts, constants, local: { expectedProjectId } }) => ({
      contract: contracts.terminalV1,
      fn: "migrate",
      args: [expectedProjectId, constants.AddressZero],
      domain: expectedProjectId,
      permissionIndex: 4,
      authorizedRevert: "TerminalV1::migrate: NOT_ALLOWED"
    })
  },
  {
    expand: ({ contracts, stringToBytes, local: { expectedProjectId } }) => ({
      contract: contracts.projects,
      fn: "setHandle",
      args: [expectedProjectId, stringToBytes("")],
      domain: expectedProjectId,
      permissionIndex: 5,
      authorizedRevert: "Projects::setHandle: EMPTY_HANDLE"
    })
  },
  {
    expand: ({ contracts, local: { expectedProjectId } }) => ({
      contract: contracts.projects,
      fn: "setUri",
      args: [expectedProjectId, ""],
      domain: expectedProjectId,
      permissionIndex: 6
    })
  },
  {
    expand: ({
      contracts,
      constants,
      stringToBytes,
      local: { expectedProjectId }
    }) => ({
      contract: contracts.projects,
      fn: "transferHandle",
      args: [expectedProjectId, constants.AddressZero, stringToBytes("")],
      domain: expectedProjectId,
      permissionIndex: 5,
      authorizedRevert: "Projects::transferHandle: EMPTY_HANDLE"
    })
  },
  {
    override: [
      {
        description: "Unauthorized if claiming for a different account",
        fn: ({
          executeFn,
          contracts,
          randomBytesFn,
          randomAddressFn,
          local: { owner, operator, expectedProjectId }
        }) =>
          executeFn({
            caller: owner,
            contract: contracts.projects,
            fn: "claimHandle",
            args: [
              randomBytesFn(),
              randomAddressFn({ exclude: [owner.address, operator.address] }),
              expectedProjectId
            ],
            revert: "Operatable: UNAUTHORIZED"
          })
      },
      {
        description: "Authorized if claiming for owner account",
        fn: ({
          executeFn,
          contracts,
          randomBytesFn,
          local: { owner, expectedProjectId }
        }) =>
          executeFn({
            caller: owner,
            contract: contracts.projects,
            fn: "claimHandle",
            args: [randomBytesFn(), owner.address, expectedProjectId],
            revert: "Projects::claimHandle: UNAUTHORIZED"
          })
      },
      {
        description: "The operator should not have permission",
        fn: ({
          checkFn,
          contracts,
          randomSignerFn,
          local: { owner, expectedProjectId, operator }
        }) =>
          checkFn({
            caller: randomSignerFn(),
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, owner.address, expectedProjectId, [7]],
            expect: false
          })
      },
      {
        description: "Set the operator on the owner",
        fn: ({
          executeFn,
          contracts,
          local: { owner, expectedProjectId, operator }
        }) =>
          executeFn({
            caller: owner,
            contract: contracts.operatorStore,
            fn: "setOperator",
            args: [operator.address, expectedProjectId, [7]]
          })
      },
      {
        description: "The operator should now have permission",
        fn: ({
          checkFn,
          contracts,
          randomSignerFn,
          local: { owner, expectedProjectId, operator }
        }) =>
          checkFn({
            caller: randomSignerFn(),
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, owner.address, expectedProjectId, [7]],
            expect: true
          })
      },
      {
        description: "The operator should not have permission over the claimer",
        fn: ({
          checkFn,
          contracts,
          randomAddressFn,
          randomSignerFn,
          local: { expectedProjectId, owner, operator }
        }) =>
          checkFn({
            caller: randomSignerFn(),
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [
              operator.address,
              randomAddressFn({ exclude: [owner.address, operator.address] }),
              expectedProjectId,
              [7]
            ],
            expect: false
          })
      },
      {
        description: "Set the operator on the claimer",
        fn: async ({
          executeFn,
          contracts,
          randomSignerFn,
          local: { expectedProjectId, operator, owner }
        }) => {
          const claimer = randomSignerFn({
            exclude: [owner.address, operator.address]
          });
          await executeFn({
            caller: claimer,
            contract: contracts.operatorStore,
            fn: "setOperator",
            args: [operator.address, expectedProjectId, [7]]
          });
          return { claimer };
        }
      },
      {
        description: "The operator should now have permission over the claimer",
        fn: ({
          checkFn,
          contracts,
          randomSignerFn,
          local: { expectedProjectId, operator, claimer }
        }) =>
          checkFn({
            caller: randomSignerFn(),
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, claimer.address, expectedProjectId, [7]],
            expect: true
          })
      },
      {
        description: "The operator should have permissions",
        fn: ({
          executeFn,
          contracts,
          randomBytesFn,
          local: { expectedProjectId, operator, claimer }
        }) =>
          executeFn({
            caller: operator,
            contract: contracts.projects,
            fn: "claimHandle",
            args: [randomBytesFn(), claimer.address, expectedProjectId],
            revert: "Projects::claimHandle: UNAUTHORIZED"
          })
      },
      {
        description: "Get rid of the permission from the projects domain",
        fn: ({
          executeFn,
          contracts,
          local: { expectedProjectId, operator, claimer }
        }) =>
          executeFn({
            caller: claimer,
            contract: contracts.operatorStore,
            fn: "setOperator",
            args: [operator.address, expectedProjectId, []]
          })
      },
      {
        description: "The operator should not have permission over the claimer",
        fn: ({
          checkFn,
          contracts,
          randomSignerFn,
          local: { expectedProjectId, operator, claimer }
        }) =>
          checkFn({
            caller: randomSignerFn(),
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, claimer.address, expectedProjectId, [7]],
            expect: false
          })
      },
      {
        description:
          "The operator should not have permission over the claimer's wildcard",
        fn: ({
          checkFn,
          randomSignerFn,
          contracts,
          local: { operator, claimer }
        }) =>
          checkFn({
            caller: randomSignerFn(),
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, claimer.address, 0, [7]],
            expect: false
          })
      },
      {
        description: "Add the permission to the wildcard domain",
        fn: ({ executeFn, contracts, local: { operator, claimer } }) =>
          executeFn({
            caller: claimer,
            contract: contracts.operatorStore,
            fn: "setOperator",
            args: [operator.address, 0, [7]]
          })
      },
      {
        description:
          "The operator should now have permission over the claimer's wildcard",
        fn: ({
          checkFn,
          randomSignerFn,
          contracts,
          local: { operator, claimer }
        }) =>
          checkFn({
            caller: randomSignerFn(),
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, claimer.address, 0, [7]],
            expect: true
          })
      },
      {
        description: "The operator should still have permissions",
        fn: ({
          executeFn,
          contracts,
          randomBytesFn,
          local: { expectedProjectId, operator, claimer }
        }) =>
          executeFn({
            caller: operator,
            contract: contracts.projects,
            fn: "claimHandle",
            args: [randomBytesFn(), claimer.address, expectedProjectId],
            revert: "Projects::claimHandle: UNAUTHORIZED"
          })
      },
      {
        description: "A non-owner or operator account shouldnt be authorized",
        fn: ({
          executeFn,
          contracts,
          randomBytesFn,
          randomSignerFn,
          local: { expectedProjectId, owner, operator, claimer }
        }) =>
          executeFn({
            caller: randomSignerFn({
              exclude: [owner.address, operator.address]
            }),
            contract: contracts.projects,
            fn: "claimHandle",
            args: [randomBytesFn(), claimer.address, expectedProjectId],
            revert: "Operatable: UNAUTHORIZED"
          })
      },
      {
        description: "Remove permissions from the operator",
        fn: ({ executeFn, contracts, local: { claimer, operator } }) =>
          executeFn({
            caller: claimer,
            contract: contracts.operatorStore,
            fn: "setOperator",
            args: [operator.address, 0, []]
          })
      },
      {
        description:
          "The operator should not have permission over the claimer's wildcard",
        fn: ({
          checkFn,
          contracts,
          randomSignerFn,
          local: { operator, claimer }
        }) =>
          checkFn({
            caller: randomSignerFn(),
            contract: contracts.operatorStore,
            fn: "hasPermission",
            args: [operator.address, claimer.address, 0, [7]],
            expect: false
          })
      },
      {
        description: "Operator should no longer have permission",
        fn: ({
          executeFn,
          contracts,
          randomBytesFn,
          local: { expectedProjectId, operator, claimer }
        }) =>
          executeFn({
            caller: operator,
            contract: contracts.projects,
            fn: "claimHandle",
            args: [randomBytesFn(), claimer.address, expectedProjectId],
            revert: "Operatable: UNAUTHORIZED"
          })
      }
    ]
  },
  {
    expand: ({ contracts, local: { expectedProjectId } }) => ({
      contract: contracts.projects,
      fn: "renewHandle",
      args: [expectedProjectId],
      domain: expectedProjectId,
      permissionIndex: 8
    })
  },
  {
    expand: ({ contracts, local: { expectedProjectId } }) => ({
      contract: contracts.ticketBooth,
      fn: "issue",
      args: [expectedProjectId, "", ""],
      domain: expectedProjectId,
      permissionIndex: 9,
      authorizedRevert: "TicketBooth::issue: EMPTY_NAME"
    })
  },
  {
    expand: ({
      contracts,
      BigNumber,
      local: { owner, expectedProjectId }
    }) => ({
      contract: contracts.ticketBooth,
      fn: "stake",
      args: [owner.address, expectedProjectId, BigNumber.from(1)],
      domain: expectedProjectId,
      permissionIndex: 10,
      authorizedRevert: "TicketBooth::stake: NOT_FOUND"
    }),
    allowWildcard: true
  },
  {
    expand: ({
      contracts,
      BigNumber,
      local: { owner, expectedProjectId }
    }) => ({
      contract: contracts.ticketBooth,
      fn: "unstake",
      args: [owner.address, expectedProjectId, BigNumber.from(1)],
      domain: expectedProjectId,
      permissionIndex: 11,
      authorizedRevert: "TicketBooth::unstake: NOT_FOUND"
    }),
    allowWildcard: true
  },
  {
    expand: ({
      contracts,
      BigNumber,
      constants,
      local: { owner, expectedProjectId }
    }) => ({
      contract: contracts.ticketBooth,
      fn: "transfer",
      args: [
        owner.address,
        expectedProjectId,
        BigNumber.from(1),
        constants.AddressZero
      ],
      domain: expectedProjectId,
      permissionIndex: 12,
      authorizedRevert: "TicketBooth::transfer: ZERO_ADDRESS"
    }),
    allowWildcard: true
  },
  {
    expand: ({
      contracts,
      BigNumber,
      local: { owner, expectedProjectId }
    }) => ({
      contract: contracts.ticketBooth,
      fn: "lock",
      args: [owner.address, expectedProjectId, BigNumber.from(0)],
      domain: expectedProjectId,
      permissionIndex: 13,
      authorizedRevert: "TicketBooth::lock: NO_OP"
    }),
    allowWildcard: true
  },
  // TerminalV1 calls to set payout mods and ticket mods are checked throughout other integration tests.
  {
    expand: ({ contracts, BigNumber, local: { expectedProjectId } }) => ({
      contract: contracts.modStore,
      fn: "setPayoutMods",
      args: [expectedProjectId, BigNumber.from(0), []],
      domain: expectedProjectId,
      permissionIndex: 14,
      authorizedRevert: "ModStore::setPayoutMods: NO_OP"
    })
  },
  {
    expand: ({ contracts, BigNumber, local: { expectedProjectId } }) => ({
      contract: contracts.modStore,
      fn: "setTicketMods",
      args: [expectedProjectId, BigNumber.from(0), []],
      domain: expectedProjectId,
      permissionIndex: 15,
      authorizedRevert: "ModStore::setTicketMods: NO_OP"
    })
  },
  // The other allow cases are tested in various other integration tests.
  {
    expand: ({ contracts, constants, local: { expectedProjectId } }) => ({
      contract: contracts.terminalDirectory,
      fn: "setTerminal",
      args: [expectedProjectId, constants.AddressZero],
      domain: expectedProjectId,
      permissionIndex: 16,
      authorizedRevert: "TerminalDirectory::setTerminal: UNAUTHORIZED",
      revert: "TerminalDirectory::setTerminal: UNAUTHORIZED"
    })
  }
];

module.exports = [
  // For each operation, test owner access, operator access, and unauthorized access.
  ...operations.reduce((all, { pre = [], expand, override, allowWildcard }) => {
    return [
      ...all,
      {
        description: "Create a project",
        fn: async ({
          executeFn,
          randomBytesFn,
          randomSignerFn,
          contracts,
          randomStringFn,
          incrementProjectIdFn
        }) => {
          const expectedProjectId = incrementProjectIdFn();

          // The address that will own a project.
          const owner = randomSignerFn();

          // The address that will operate a project.
          const operator = randomSignerFn({ exclude: [owner.address] });

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

          return { expectedProjectId, owner, operator };
        }
      },
      ...pre,
      {
        description: "Load op",
        fn: params => {
          const {
            contract,
            fn,
            args,
            domain,
            authorizedRevert,
            revert,
            permissionIndex
          } = expand ? expand(params) : {};

          return {
            contract,
            fn,
            args,
            domain,
            authorizedRevert,
            revert,
            permissionIndex,
            allowWildcard,
            override,
            pre
          };
        }
      },
      ...(override || [
        {
          description: "Operator shouldnt have permission at first",
          fn: ({
            checkFn,
            contracts,
            randomSignerFn,
            local: { operator, domain, permissionIndex, owner }
          }) =>
            checkFn({
              caller: randomSignerFn(),
              contract: contracts.operatorStore,
              fn: "hasPermission",
              args: [
                operator.address,
                owner.address,
                domain,
                [permissionIndex]
              ],
              expect: false
            })
        },
        {
          description: "The owner should be authorized",
          fn: ({
            executeFn,
            local: { owner, contract, fn, args, authorizedRevert }
          }) =>
            executeFn({
              caller: owner,
              contract,
              fn,
              args,
              revert: authorizedRevert
            })
        },
        {
          description: "At permissions to the operator on the domain",
          fn: ({
            executeFn,
            contracts,
            local: { operator, domain, owner, permissionIndex }
          }) =>
            executeFn({
              caller: owner,
              contract: contracts.operatorStore,
              fn: "setOperator",
              args: [operator.address, domain, [permissionIndex]]
            })
        },
        {
          description: "The operator should now have permission",
          fn: ({
            checkFn,
            randomSignerFn,
            contracts,
            local: { operator, domain, owner, permissionIndex }
          }) =>
            checkFn({
              caller: randomSignerFn(),
              contract: contracts.operatorStore,
              fn: "hasPermission",
              args: [
                operator.address,
                owner.address,
                domain,
                [permissionIndex]
              ],
              expect: true
            })
        },
        {
          description: "Operator should be authorized",
          fn: ({
            executeFn,
            local: { operator, contract, fn, args, authorizedRevert }
          }) =>
            executeFn({
              caller: operator,
              contract,
              fn,
              args,
              revert: authorizedRevert
            })
        },
        // Check for wildcard authorization if needed.
        ...(allowWildcard
          ? [
              {
                description: "Remove the operator's permission from domain",
                fn: ({
                  executeFn,
                  contracts,
                  local: { operator, owner, domain }
                }) =>
                  executeFn({
                    caller: owner,
                    contract: contracts.operatorStore,
                    fn: "setOperator",
                    args: [operator.address, domain, []]
                  })
              },
              {
                description:
                  "The operator should no longer have permission over this domain",
                fn: ({
                  checkFn,
                  randomSignerFn,
                  contracts,
                  local: { operator, domain, owner, permissionIndex }
                }) =>
                  checkFn({
                    caller: randomSignerFn(),
                    contract: contracts.operatorStore,
                    fn: "hasPermission",
                    args: [
                      operator.address,
                      owner.address,
                      domain,
                      [permissionIndex]
                    ],
                    expect: false
                  })
              },
              {
                description: "Give the operator permission over the wildcard",
                fn: ({
                  executeFn,
                  contracts,
                  local: { operator, owner, permissionIndex }
                }) =>
                  executeFn({
                    caller: owner,
                    contract: contracts.operatorStore,
                    fn: "setOperator",
                    args: [operator.address, 0, [permissionIndex]]
                  })
              },
              {
                description:
                  "The operator should now have permission over the wildcard",
                fn: ({
                  checkFn,
                  randomSignerFn,
                  contracts,
                  local: { operator, owner, permissionIndex }
                }) =>
                  checkFn({
                    caller: randomSignerFn(),
                    contract: contracts.operatorStore,
                    fn: "hasPermission",
                    args: [
                      operator.address,
                      owner.address,
                      0,
                      [permissionIndex]
                    ],
                    expect: true
                  })
              },
              {
                description: "Should still be authorized",
                fn: ({
                  executeFn,
                  local: { operator, contract, fn, args, authorizedRevert }
                }) =>
                  executeFn({
                    caller: operator,
                    contract,
                    fn,
                    args,
                    revert: authorizedRevert
                  })
              },
              {
                description: "Remove permission from wildcard",
                fn: ({ executeFn, contracts, local: { operator, owner } }) =>
                  executeFn({
                    caller: owner,
                    contract: contracts.operatorStore,
                    fn: "setOperator",
                    args: [operator.address, 0, []]
                  })
              },
              {
                description:
                  "The operator should no longer have permission over the wildcard",
                fn: ({
                  checkFn,
                  contracts,
                  randomSignerFn,
                  local: { operator, permissionIndex, owner }
                }) =>
                  checkFn({
                    caller: randomSignerFn(),
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
              }
            ]
          : []),
        {
          description: "A non-owner or operator account shouldnt be authorized",
          fn: ({
            executeFn,
            randomSignerFn,
            local: { contract, fn, args, revert, owner, operator }
          }) =>
            executeFn({
              caller: randomSignerFn({
                exclude: [owner.address, operator.address]
              }),
              contract,
              fn,
              args,
              revert: revert || "Operatable: UNAUTHORIZED"
            })
        },
        {
          description: "Remove all permissions from operator for domain",
          fn: ({ executeFn, contracts, local: { operator, domain, owner } }) =>
            executeFn({
              caller: owner,
              contract: contracts.operatorStore,
              fn: "setOperator",
              args: [operator.address, domain, []]
            })
        },
        {
          description:
            "The operator should no longer have permission over this domain",
          fn: ({
            checkFn,
            contracts,
            randomSignerFn,
            local: { operator, domain, permissionIndex, owner }
          }) =>
            checkFn({
              caller: randomSignerFn(),
              contract: contracts.operatorStore,
              fn: "hasPermission",
              args: [
                operator.address,
                owner.address,
                domain,
                [permissionIndex]
              ],
              expect: false
            })
        },
        {
          description: "Operator should no longer be authorized",
          fn: ({
            executeFn,
            local: { operator, contract, fn, args, revert }
          }) =>
            executeFn({
              caller: operator,
              contract,
              fn,
              args,
              revert: revert || "Operatable: UNAUTHORIZED"
            })
        }
      ])
    ];
  }, [])
];
