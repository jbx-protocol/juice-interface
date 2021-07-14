const { expect } = require("chai");
const { BigNumber, constants } = require("ethers");

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
  await Promise.all(
    events.map(async event =>
      expect(tx)
        .to.emit(contract, event.name)
        .withArgs(...event.args)
    )
  );
};

const tests = {
  success: [
    {
      description: "with reserved rate",
      fn: () => ({})
    },
    {
      description: "ID is 0",
      fn: () => ({
        fundingCycleId: 0
      })
    },
    {
      description: "with mod",
      fn: ({ addrs }) => ({
        mod: {
          preferUnstaked: false,
          percent: 5000,
          lockedUntil: 0,
          beneficiary: addrs[3].address
        },
        expectedReservedAmount: BigNumber.from(10)
          .pow(18)
          .mul(2),
        expectedLeftover: BigNumber.from(10).pow(18)
      })
    },
    {
      description: "with all mod",
      fn: ({ addrs }) => ({
        mod: {
          preferUnstaked: false,
          percent: 10000,
          lockedUntil: 0,
          beneficiary: addrs[3].address
        },
        expectedReservedAmount: BigNumber.from(10)
          .pow(18)
          .mul(2),
        expectedLeftover: BigNumber.from(0)
      })
    },
    {
      description: "with no reserved rate",
      fn: () => ({
        reservedRate: 0
      })
    }
  ],
  failure: [
    {
      description: "overflow",
      fn: () => ({
        totalTickets: BigNumber.from(2).pow(255),
        revert: "TerminalV1::printReservedTickets: INT_LIMIT_REACHED"
      })
    }
  ]
};

const ops = ({
  deployer,
  addrs,
  mockContracts,
  targetContract
}) => async custom => {
  const {
    caller = deployer,
    owner = addrs[0].address,
    totalTickets = BigNumber.from(10)
      .pow(18)
      .mul(18),
    mod,
    reservedRate = 20, // 10%
    expectedReservedAmount = BigNumber.from(10)
      .pow(18)
      .mul(2),
    expectedLeftover = BigNumber.from(10)
      .pow(18)
      .mul(2),
    weight = BigNumber.from(10).pow(18),
    projectId = 42,
    fundingCycleId = 1,
    configured = 42,
    revert
  } = {
    ...custom
  };

  // Create a packed metadata value to store the reserved rate.
  let packedMetadata = BigNumber.from(0);
  packedMetadata = packedMetadata.add(0);
  packedMetadata = packedMetadata.shl(8);
  packedMetadata = packedMetadata.add(0);
  packedMetadata = packedMetadata.shl(8);
  packedMetadata = packedMetadata.add(reservedRate);
  packedMetadata = packedMetadata.shl(8);

  return [
    mockFn({
      mockContract: mockContracts.fundingCycles,
      fn: "currentOf",
      args: [projectId],
      returns: [
        {
          configured,
          id: fundingCycleId,
          projectId,
          number: 0,
          basedOn: 0,
          cycleLimit: 0,
          weight,
          ballot: constants.AddressZero,
          start: 0,
          duration: 0,
          target: 0,
          currency: 0,
          fee: 0,
          discountRate: 0,
          tapped: 0,
          metadata: packedMetadata
        }
      ]
    }),
    ...(projectId > 0
      ? [
          mockFn({
            mockContract: mockContracts.ticketBooth,
            fn: "totalSupplyOf",
            args: [projectId],
            returns: [totalTickets]
          }),
          mockFn({
            mockContract: mockContracts.projects,
            fn: "ownerOf",
            args: [projectId],
            returns: [owner]
          }),
          mockFn({
            mockContract: mockContracts.modStore,
            fn: "ticketModsOf",
            args: [projectId, configured],
            returns: [mod ? [mod] : []]
          }),
          ...(mod
            ? [
                mockFn({
                  mockContract: mockContracts.ticketBooth,
                  fn: "print",
                  args: [
                    mod.beneficiary,
                    projectId,
                    expectedReservedAmount.mul(mod.percent).div(10000),
                    mod.preferUnstaked
                  ],
                  returns: []
                })
              ]
            : []),
          ...(expectedLeftover > 0
            ? [
                mockFn({
                  mockContract: mockContracts.ticketBooth,
                  fn: "print",
                  args: [owner, projectId, expectedLeftover, false],
                  returns: []
                })
              ]
            : [])
        ]
      : []),
    executeFn({
      caller,
      contract: targetContract,
      fn: "printReservedTickets",
      args: [projectId],
      events: [
        ...(mod
          ? [
              {
                name: "DistributeToTicketMod",
                args: [
                  fundingCycleId,
                  projectId,
                  [
                    mod.preferUnstaked,
                    mod.percent,
                    mod.lockedUntil,
                    mod.beneficiary
                  ],
                  expectedReservedAmount.mul(mod.percent).div(10000),
                  caller.address
                ]
              }
            ]
          : []),
        ...(reservedRate > 0 && fundingCycleId > 0
          ? [
              {
                name: "PrintReserveTickets",
                args: [
                  fundingCycleId,
                  projectId,
                  owner,
                  expectedReservedAmount,
                  expectedLeftover,
                  caller.address
                ]
              }
            ]
          : [])
      ],
      revert
    })
  ];
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const resolvedOps = await ops(this)(await successTest.fn(this));
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
        const resolvedOps = await ops(this)(await failureTest.fn(this));
        // eslint-disable-next-line no-restricted-syntax
        for (const op of resolvedOps) {
          // eslint-disable-next-line no-await-in-loop
          await op();
        }
      });
    });
  });
};
