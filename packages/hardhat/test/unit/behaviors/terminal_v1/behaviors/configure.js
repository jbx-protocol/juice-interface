const { expect } = require("chai");
const { BigNumber, utils, constants } = require("ethers");

const tests = {
  success: [
    {
      description: "by owner",
      fn: () => ({})
    },
    {
      description: "by operator",
      fn: ({ addrs }) => ({
        owner: addrs[0].address,
        permissionFlag: true
      })
    },
    {
      description: "with a terminal already set",
      fn: () => ({
        addTerminal: true
      })
    },
    {
      description: "with mods",
      fn: async ({ deployMockLocalContractFn }) => ({
        payoutMods: [
          {
            // These values dont matter.
            preferUnstaked: false,
            percent: 200,
            lockedUntil: 1000,
            beneficiary: constants.AddressZero,
            allocator: (await deployMockLocalContractFn("ExampleModAllocator"))
              .address,
            projectId: 1
          }
        ],
        ticketMods: [
          {
            // These values dont matter.
            preferUnstaked: false,
            percent: 200,
            lockedUntil: 1000,
            beneficiary: constants.AddressZero
          }
        ]
      })
    },
    {
      description: "with a ticket supply",
      fn: () => ({
        addToTicketSupply: 1
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ addrs }) => ({
        owner: addrs[0].address,
        revert: "Operatable: UNAUTHORIZED"
      })
    },
    {
      description: "reserved rate over 100%",
      fn: () => ({
        metadata: {
          reservedRate: 201
        },
        revert:
          "TerminalV1::_validateAndPackFundingCycleMetadata: BAD_RESERVED_RATE"
      })
    },
    {
      description: "bonding curve rate over 100%",
      fn: () => ({
        metadata: {
          bondingCurveRate: 201
        },
        revert:
          "TerminalV1::_validateAndPackFundingCycleMetadata: BAD_BONDING_CURVE_RATE"
      })
    },
    {
      description: "reconfiguration bonding curve rate over 100%",
      fn: () => ({
        metadata: {
          reconfigurationBondingCurveRate: 201
        },
        revert:
          "TerminalV1::_validateAndPackFundingCycleMetadata: BAD_RECONFIGURATION_BONDING_CURVE_RATE"
      })
    }
  ]
};

const mockFn = ({
  condition,
  mockContract,
  fn,
  args = [],
  returns = []
}) => async () => {
  if (condition !== undefined && !condition) return;
  const normalizedArgs = typeof args === "function" ? await args() : args;
  const normalizedReturns =
    typeof returns === "function" ? await returns() : returns;
  await mockContract.mock[fn]
    .withArgs(...normalizedArgs)
    .returns(...normalizedReturns);
};

const executeFn = ({
  condition,
  caller,
  contract,
  fn,
  args = [],
  value = 0,
  events = [],
  revert
}) => async () => {
  if (condition !== undefined && !condition) return;
  const normalizedArgs = typeof args === "function" ? await args() : args;
  const promise = contract.connect(caller)[fn](...normalizedArgs, { value });
  if (revert) {
    await expect(promise).to.be.revertedWith(revert);
    return;
  }
  if (events.length === 0) {
    await promise;
    return;
  }
  const tx = await promise;
  await tx.wait();
  events.forEach(event =>
    expect(tx)
      .to.emit(contract, event.name)
      .withArgs(...event.args)
  );
};

const ops = ({ deployer, mockContracts, targetContract }) => custom => {
  const {
    caller = deployer,
    permissionFlag = false,
    addToTicketSupply = 0,
    addTerminal,
    owner = deployer.address,
    payoutMods = [],
    ticketMods = [],
    handle = utils.formatBytes32String("something"),
    uri = "some-uri",
    metadata,
    properties = {
      target: 10,
      currency: 1,
      duration: 10,
      cycleLimit: 0,
      discountRate: 10,
      ballot: constants.AddressZero
    },
    projectId = 42,
    configured = 171717,
    revert
  } = {
    ...custom,
    metadata: {
      reservedRate: 200,
      bondingCurveRate: 200,
      reconfigurationBondingCurveRate: 200,
      ...custom.metadata
    }
  };

  return [
    mockFn({
      mockContract: mockContracts.projects,
      fn: "ownerOf",
      args: [projectId],
      returns: [owner]
    }),
    mockFn({
      mockContract: mockContracts.operatorStore,
      fn: "hasPermission",
      args: () => {
        const expectedPermissionIndex = 1;
        return [caller.address, owner, projectId, expectedPermissionIndex];
      },
      returns: [permissionFlag || false]
    }),
    ...(!revert
      ? [
          mockFn({
            condition: !revert,
            mockContract: mockContracts.terminalDirectory,
            fn: "terminalOf",
            args: [projectId],
            returns: [
              addTerminal ? constants.AddressZero : targetContract.address
            ]
          })
        ]
      : []),
    ...(!revert && addTerminal
      ? [
          mockFn({
            mockContract: mockContracts.terminalDirectory,
            fn: "setTerminal",
            args: [projectId, targetContract.address]
          })
        ]
      : []),
    ...(!revert
      ? [
          mockFn({
            mockContract: mockContracts.projects,
            fn: "create",
            args: [owner, handle, uri, targetContract.address],
            returns: [projectId]
          })
        ]
      : []),
    ...(!revert
      ? [
          mockFn({
            mockContract: mockContracts.ticketBooth,
            fn: "totalSupplyOf",
            args: [projectId],
            returns: [addToTicketSupply]
          })
        ]
      : []),
    ...(!revert
      ? [
          mockFn({
            condition: !revert,
            mockContract: mockContracts.fundingCycles,
            fn: "configure",
            args: () => {
              /**
          Mock the funding cycle configuration.

          - requires calculating the expected packed metadata.
         */
              let packedMetadata = BigNumber.from(0);
              packedMetadata = packedMetadata.add(
                metadata.reconfigurationBondingCurveRate
              );
              packedMetadata = packedMetadata.shl(8);
              packedMetadata = packedMetadata.add(metadata.bondingCurveRate);
              packedMetadata = packedMetadata.shl(8);
              packedMetadata = packedMetadata.add(metadata.reservedRate);
              packedMetadata = packedMetadata.shl(8);
              return [
                projectId,
                properties,
                packedMetadata,
                10,
                !addToTicketSupply
              ];
            },
            returns: [
              {
                configured,
                id: 0,
                projectId: 0,
                number: 0,
                basedOn: 0,
                weight: 0,
                ballot: constants.AddressZero,
                start: 0,
                duration: 0,
                cycleLimit: 0,
                target: 0,
                currency: 0,
                fee: 0,
                discountRate: 0,
                tapped: 0,
                metadata: 0
              }
            ]
          })
        ]
      : []),
    ...(!revert && payoutMods.length
      ? [
          mockFn({
            condition: !revert && payoutMods.length,
            mockContract: mockContracts.modStore,
            fn: "setPayoutMods",
            args: [projectId, configured, payoutMods]
          })
        ]
      : []),
    ...(!revert && ticketMods.length
      ? [
          mockFn({
            condition: !revert && payoutMods.length,
            mockContract: mockContracts.modStore,
            fn: "setTicketMods",
            args: [projectId, configured, payoutMods]
          })
        ]
      : []),
    executeFn({
      caller,
      contract: targetContract,
      fn: "configure",
      args: [projectId, properties, metadata, payoutMods, ticketMods],
      revert
    })
  ];
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const resolvedOps = ops(this)(await successTest.fn(this));
        // eslint-disable-next-line no-restricted-syntax
        for (const op of resolvedOps) {
          // eslint-disable-next-line no-await-in-loop
          await op();
        }
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const resolvedOps = ops(this)(await failureTest.fn(this));
        // eslint-disable-next-line no-restricted-syntax
        for (const op of resolvedOps) {
          // eslint-disable-next-line no-await-in-loop
          await op();
        }
      });
    });
  });
};
