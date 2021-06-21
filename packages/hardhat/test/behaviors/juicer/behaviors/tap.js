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

const check = ({ condition, contract, fn, args, value }) => async () => {
  if (condition !== undefined && !condition) return;
  const storedVal = await contract[fn](...args);
  expect(storedVal).to.equal(value);
};

const tests = {
  success: [
    {
      description: "with no balance",
      fn: () => ({})
    },
    {
      description: "with fee, gov uses same terminal",
      fn: () => ({
        fee: 20,
        tapped: BigNumber.from(10)
          .pow(18)
          .mul(20),
        leftover: BigNumber.from(10)
          .pow(18)
          .mul(20),
        feeAmount: BigNumber.from(10)
          .pow(18)
          .mul(2),
        govUsesSameTerminal: true
      })
    },
    {
      description: "with fee, gov uses different terminal",
      fn: () => ({
        fee: 20,
        tapped: BigNumber.from(10)
          .pow(18)
          .mul(20),
        leftover: BigNumber.from(10)
          .pow(18)
          .mul(20),
        feeAmount: BigNumber.from(10)
          .pow(18)
          .mul(2),
        govUsesSameTerminal: false
      })
    },
    {
      description: "with project mod using different terminal",
      fn: async ({
        addrs,
        mockContracts,
        governance,
        contractName,
        deployMockLocalContract
      }) => {
        const terminal = await deployMockLocalContract(contractName, [
          mockContracts.projects.address,
          mockContracts.fundingCycles.address,
          mockContracts.ticketBooth.address,
          mockContracts.operatorStore.address,
          mockContracts.modStore.address,
          mockContracts.prices.address,
          mockContracts.terminalDirectory.address,
          governance.address
        ]);
        return {
          projectMod: {
            allocator: constants.AddressZero,
            projectId: 1212,
            beneficiary: addrs[0].address,
            percent: 100,
            memo: "sup",
            preferUnstaked: false,
            lockedUntil: 0,
            terminal
          },
          leftover: BigNumber.from(10)
            .pow(18)
            .mul(11)
        };
      }
    },
    {
      description: "with mods",
      fn: async ({ addrs, deployMockLocalContract }) => {
        const allocator = await deployMockLocalContract("ExampleModAllocator");

        return {
          projectMod: {
            allocator: constants.AddressZero,
            projectId: 1212,
            beneficiary: addrs[0].address,
            percent: 70,
            memo: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          },
          addressMod: {
            allocator: constants.AddressZero,
            projectId: 0,
            beneficiary: addrs[7].address,
            percent: 30,
            memo: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          },
          allocatorMod: {
            allocator,
            projectId: 9,
            beneficiary: addrs[3].address,
            percent: 50,
            memo: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          },
          leftover: BigNumber.from(10)
            .pow(18)
            .mul(22)
            .div(4)
        };
      }
    }
  ],
  failure: [
    {
      description: "unexpected currency",
      fn: () => ({
        currency: 19,
        revert: "Juicer::tap: UNEXPECTED_CURRENCY"
      })
    },
    {
      description: "insufficient funds",
      fn: () => ({
        addToBalance: BigNumber.from(10)
          .pow(18)
          .mul(1),
        ethPrice: BigNumber.from(10)
          .pow(18)
          .mul(1),
        amount: BigNumber.from(10)
          .pow(18)
          .mul(1)
          .add(1),
        revert: "Juicer::tap: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "inadequate amount",
      fn: () => ({
        amount: BigNumber.from(10)
          .pow(18)
          .mul(1),
        ethPrice: BigNumber.from(10)
          .pow(18)
          .mul(1),
        minReturnedWei: BigNumber.from(10)
          .pow(18)
          .mul(1)
          .add(1),
        revert: "Juicer::tap: INADEQUATE"
      })
    },
    {
      description: "bad mod project",
      fn: async ({ addrs }) => ({
        projectMod: {
          allocator: constants.AddressZero,
          projectId: 1212,
          beneficiary: addrs[0].address,
          percent: 150,
          memo: "sup",
          preferUnstaked: false,
          lockedUntil: 0,
          terminal: { address: constants.AddressZero }
        },
        revert: "Juicer::tap: BAD_MOD"
      })
    }
  ]
};

const ops = ({
  deployer,
  addrs,
  mockContracts,
  deployMockLocalContract,
  deployContract,
  contractName
}) => async custom => {
  const {
    caller = deployer,
    owner = addrs[0].address,
    addToBalance = BigNumber.from(10)
      .pow(18)
      .mul(44),
    amount = BigNumber.from(10)
      .pow(18)
      .mul(44),
    ethPrice = BigNumber.from(10)
      .pow(18)
      .mul(2),
    tapped = BigNumber.from(10)
      .pow(18)
      .mul(22),
    leftover = BigNumber.from(10)
      .pow(18)
      .mul(22),
    projectMod,
    addressMod,
    allocatorMod,
    minReturnedWei = BigNumber.from(0),
    govUsesSameTerminal = true,
    projectId = 42,
    fundingCycleId = 1,
    currency = 1,
    expectedCurrency = 1,
    fee = 0,
    configured = 42,
    feeAmount = BigNumber.from(0),
    govProjectId = 70,
    revert
  } = {
    ...custom
  };

  const mods = [];
  const modEvents = [];
  if (projectMod) {
    mods.push(projectMod);
    modEvents.push({
      name: "PaymentModDistribution",
      args: [
        fundingCycleId,
        projectId,
        [
          projectMod.preferUnstaked,
          projectMod.percent,
          projectMod.lockedUntil,
          projectMod.beneficiary,
          projectMod.allocator,
          projectMod.projectId,
          projectMod.memo
        ],
        tapped.mul(projectMod.percent).div(200),
        caller.address
      ]
    });
  }
  if (addressMod) {
    modEvents.push({
      name: "PaymentModDistribution",
      args: [
        fundingCycleId,
        projectId,
        [
          addressMod.preferUnstaked,
          addressMod.percent,
          addressMod.lockedUntil,
          addressMod.beneficiary,
          addressMod.allocator,
          addressMod.projectId,
          addressMod.memo
        ],
        tapped.mul(addressMod.percent).div(200),
        caller.address
      ]
    });
    mods.push(addressMod);
  }
  let allocator;
  if (allocatorMod) {
    allocator = allocatorMod.allocator;
    allocatorMod.allocator = allocatorMod.allocator.address;
    modEvents.push({
      name: "PaymentModDistribution",
      args: [
        fundingCycleId,
        projectId,
        [
          allocatorMod.preferUnstaked,
          allocatorMod.percent,
          allocatorMod.lockedUntil,
          allocatorMod.beneficiary,
          allocatorMod.allocator,
          allocatorMod.projectId,
          allocatorMod.memo
        ],
        tapped.mul(allocatorMod.percent).div(200),
        caller.address
      ]
    });
    mods.push(allocatorMod);
  }

  // Governance must be a mocked contract here.
  const governanceProjectId = 1;
  const governance = await deployMockLocalContract("Governance", [
    governanceProjectId
  ]);
  const targetContract = await deployContract(contractName, [
    mockContracts.projects.address,
    mockContracts.fundingCycles.address,
    mockContracts.ticketBooth.address,
    mockContracts.operatorStore.address,
    mockContracts.modStore.address,
    mockContracts.prices.address,
    mockContracts.terminalDirectory.address,
    governance.address
  ]);

  return [
    mockFn({
      mockContract: mockContracts.fundingCycles,
      fn: "tap",
      args: [projectId, amount],
      returns: [
        {
          configured,
          id: fundingCycleId,
          projectId,
          number: 0,
          basedOn: 0,
          weight: 0,
          ballot: constants.AddressZero,
          start: 0,
          duration: 0,
          target: 0,
          currency: expectedCurrency,
          fee,
          discountRate: 0,
          tapped: 0,
          metadata: 0
        }
      ]
    }),
    mockFn({
      mockContract: mockContracts.prices,
      fn: "getETHPriceFor",
      args: [currency],
      returns: [ethPrice]
    }),
    executeFn({
      condition: addToBalance > 0,
      caller,
      contract: targetContract,
      fn: "addToBalance",
      args: [projectId],
      value: addToBalance
    }),
    mockFn({
      mockContract: mockContracts.projects,
      fn: "ownerOf",
      args: [projectId],
      returns: [owner]
    }),
    mockFn({
      mockContract: mockContracts.modStore,
      fn: "paymentModsOf",
      args: [projectId, configured],
      returns: [mods]
    }),
    ...(fee > 0
      ? [
          mockFn({
            mockContract: governance,
            fn: "terminal",
            args: [],
            returns: [
              govUsesSameTerminal
                ? targetContract.address
                : constants.AddressZero
            ]
          }),
          mockFn({
            condition: !govUsesSameTerminal,
            mockContract: governance,
            fn: "pay",
            args: [owner, "Juice fee", false],
            returns: []
          }),
          mockFn({
            condition: govUsesSameTerminal,
            mockContract: governance,
            fn: "projectId",
            args: [],
            returns: [govProjectId]
          }),
          mockFn({
            condition: govUsesSameTerminal,
            mockContract: mockContracts.fundingCycles,
            fn: "getCurrentOf",
            args: [govProjectId],
            returns: [
              {
                metadata: 0,
                configured: 0,
                id: 0,
                projectId: 0,
                number: 0,
                basedOn: 0,
                weight: 0,
                ballot: constants.AddressZero,
                start: 0,
                duration: 0,
                target: 0,
                currency: 0,
                fee,
                discountRate: 0,
                tapped: 0
              }
            ]
          }),
          mockFn({
            condition: govUsesSameTerminal,
            mockContract: mockContracts.ticketBooth,
            fn: "print",
            args: [owner, govProjectId, 0, false],
            returns: []
          })
        ]
      : []),
    ...(allocatorMod
      ? [
          mockFn({
            mockContract: allocator,
            fn: "allocate",
            args: [
              projectId,
              allocatorMod.projectId,
              allocatorMod.beneficiary,
              allocatorMod.memo
            ],
            returns: []
          })
        ]
      : []),
    ...(projectMod
      ? [
          mockFn({
            condition: projectMod !== undefined,
            mockContract: mockContracts.terminalDirectory,
            fn: "terminalOf",
            args: [projectMod.projectId],
            returns: [
              (projectMod.terminal && projectMod.terminal.address) ||
                targetContract.address
            ]
          }),
          mockFn({
            condition: !revert && projectMod.terminal !== undefined,
            mockContract: projectMod.terminal,
            fn: "pay",
            args: [
              projectMod.projectId,
              projectMod.beneficiary,
              projectMod.memo,
              projectMod.preferUnstaked
            ],
            returns: [1]
          }),
          mockFn({
            condition: projectMod.terminal === undefined,
            mockContract: mockContracts.fundingCycles,
            fn: "getCurrentOf",
            args: [projectMod.projectId],
            returns: [
              {
                metadata: 0,
                configured: 0,
                id: 0,
                projectId: 0,
                number: 0,
                basedOn: 0,
                weight: 0,
                ballot: constants.AddressZero,
                start: 0,
                duration: 0,
                target: 0,
                currency: 0,
                fee,
                discountRate: 0,
                tapped: 0
              }
            ]
          }),
          mockFn({
            condition: projectMod.terminal === undefined,
            mockContract: mockContracts.ticketBooth,
            fn: "print",
            args: [
              projectMod.beneficiary,
              projectMod.projectId,
              0,
              projectMod.preferUnstaked
            ],
            returns: []
          })
        ]
      : []),
    mockFn({
      mockContract: governance,
      fn: "pay",
      args: [owner, "Juice fee", false],
      returns: []
    }),
    executeFn({
      caller,
      contract: targetContract,
      fn: "tap",
      args: [projectId, amount, currency, minReturnedWei],
      events: [
        ...modEvents,
        {
          name: "Tap",
          args: [
            fundingCycleId,
            projectId,
            owner,
            amount,
            currency,
            tapped,
            leftover,
            feeAmount,
            caller.address
          ]
        }
      ],
      revert
    }),
    check({
      condition: !revert,
      contract: caller.provider,
      fn: "getBalance",
      args: [owner],
      value: (await caller.provider.getBalance(owner)).add(leftover)
    }),
    ...(projectMod && projectMod.terminal === undefined
      ? [
          check({
            condition: !revert,
            contract: targetContract,
            fn: "balanceOf",
            args: [projectMod.projectId],
            value: tapped.mul(projectMod.percent).div(200)
          })
        ]
      : []),
    ...(addressMod
      ? [
          check({
            condition: !revert,
            contract: caller.provider,
            fn: "getBalance",
            args: [addressMod.beneficiary],
            value: (
              await caller.provider.getBalance(addressMod.beneficiary)
            ).add(tapped.mul(addressMod.percent).div(200))
          })
        ]
      : []),
    ...(allocatorMod
      ? [
          check({
            condition: !revert,
            contract: caller.provider,
            fn: "getBalance",
            args: [allocatorMod.allocator],
            value: (
              await caller.provider.getBalance(allocatorMod.allocator)
            ).add(tapped.mul(allocatorMod.percent).div(200))
          })
        ]
      : [])
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
