const { expect } = require("chai");
const { BigNumber, constants } = require("ethers");

const tests = {
  success: [
    {
      description: "called by owner",
      fn: () => ({})
    },
    {
      description: "called by operator",
      fn: ({ addrs }) => ({
        owner: addrs[0].address,
        permissionFlag: true
      })
    },
    {
      description: "max uint",
      fn: ({ addrs }) => ({
        owner: addrs[0].address,
        permissionFlag: true,
        amount: constants.MaxUint256,
        weight: BigNumber.from(10)
          .pow(18)
          .mul(1),
        weightedAmount: constants.MaxUint256.div(2)
      })
    },
    {
      description: "with preprinted amount",
      fn: () => ({
        prePrintAmount: BigNumber.from(10)
          .pow(18)
          .mul(42),
        weightedPrePrintAmount: BigNumber.from(10)
          .pow(18)
          .mul(210)
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ addrs }) => ({
        owner: addrs[0].address,
        permissionFlag: false,
        revert: "Operatable: UNAUTHORIZED"
      })
    },
    {
      description: "with tickets",
      fn: () => ({
        weightedPrePrintAmount: BigNumber.from(42),
        revert: "TerminalV1::printTickets: ALREADY_ACTIVE"
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

const ops = ({ deployer, mockContracts, targetContract }) => custom => {
  const {
    caller = deployer,
    owner = deployer.address,
    permissionFlag = false,
    beneficiary = deployer.address,
    memo = "some-memo",
    preferUnstaked = false,
    amount = BigNumber.from(10)
      .pow(18)
      .mul(42),
    currency = 0,
    prePrintAmount = BigNumber.from(0),
    ethPrice = BigNumber.from(10)
      .pow(18)
      .mul(2),
    weight = BigNumber.from(10)
      .pow(18)
      .mul(10),
    weightedAmount = BigNumber.from(10)
      .pow(18)
      .mul(210),
    weightedPrePrintAmount = BigNumber.from(10)
      .pow(18)
      .mul(0),
    projectId = 42,
    revert
  } = {
    ...custom
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
        const expectedPermissionIndex = 2;
        return [caller.address, owner, projectId, expectedPermissionIndex];
      },
      returns: [permissionFlag || false]
    }),
    mockFn({
      mockContract: mockContracts.ticketBooth,
      fn: "totalSupplyOf",
      args: [projectId],
      returns: [0]
    }),
    mockFn({
      mockContract: mockContracts.fundingCycles,
      fn: "BASE_WEIGHT",
      args: [],
      returns: [weight]
    }),
    mockFn({
      mockContract: mockContracts.prices,
      fn: "getETHPriceFor",
      args: [currency],
      returns: [ethPrice]
    }),
    ...(prePrintAmount > 0
      ? [
          mockFn({
            mockContract: mockContracts.ticketBooth,
            fn: "print",
            args: [
              beneficiary,
              projectId,
              weightedPrePrintAmount,
              preferUnstaked
            ],
            returns: []
          })
        ]
      : []),
    ...(prePrintAmount > 0
      ? [
          executeFn({
            caller,
            contract: targetContract,
            fn: "printPreminedTickets",
            args: [
              projectId,
              prePrintAmount,
              currency,
              beneficiary,
              memo,
              preferUnstaked
            ]
          })
        ]
      : []),
    mockFn({
      mockContract: mockContracts.ticketBooth,
      fn: "totalSupplyOf",
      args: [projectId],
      returns: [weightedPrePrintAmount]
    }),
    mockFn({
      condition: !revert,
      mockContract: mockContracts.ticketBooth,
      fn: "print",
      args: [beneficiary, projectId, weightedAmount, preferUnstaked],
      returns: []
    }),
    executeFn({
      caller,
      contract: targetContract,
      fn: "printPreminedTickets",
      args: [projectId, amount, currency, beneficiary, memo, preferUnstaked],
      events: [
        {
          name: "PrintPreminedTickets",
          args: [projectId, beneficiary, amount, currency, memo, caller.address]
        }
      ],
      revert
    }),
    mockFn({
      mockContract: mockContracts.ticketBooth,
      fn: "totalSupplyOf",
      args: [projectId],
      returns: [weightedPrePrintAmount.add(weightedAmount)]
    }),
    ...(!revert
      ? [
          check({
            contract: targetContract,
            fn: "canPrintPreminedTickets",
            args: [projectId],
            value: true
          })
        ]
      : [])
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
