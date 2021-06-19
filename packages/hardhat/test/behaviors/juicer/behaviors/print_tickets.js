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
      description: "with balance",
      fn: () => ({
        addToBalance: BigNumber.from(42),
        revert: "Juicer::printTickets: ALREADY_ACTIVE"
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

const ops = ({ deployer, mockContracts, targetContract }) => custom => {
  const {
    caller = deployer,
    owner = deployer.address,
    permissionFlag = false,
    addToBalance = BigNumber.from(0),
    beneficiary = deployer.address,
    memo = "some-memo",
    preferUnstaked = false,
    amount = BigNumber.from(10)
      .pow(18)
      .mul(42),
    weight = BigNumber.from(10)
      .pow(18)
      .mul(10),
    weightedAmount = BigNumber.from(10)
      .pow(18)
      .mul(420),
    projectId = 42,
    fundingCycleId = 1,
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
    executeFn({
      condition: addToBalance > 0,
      caller,
      contract: targetContract,
      fn: "addToBalance",
      args: [projectId],
      value: addToBalance
    }),
    mockFn({
      condition: !revert,
      mockContract: mockContracts.fundingCycles,
      fn: "getCurrentOf",
      args: [projectId],
      returns: [
        {
          configured: 0,
          id: fundingCycleId,
          projectId,
          number: 0,
          basedOn: 0,
          weight,
          ballot: constants.AddressZero,
          start: 0,
          duration: 0,
          target: 0,
          currency: 0,
          fee: 0,
          discountRate: 0,
          tapped: 0,
          metadata: 0
        }
      ]
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
      fn: "printTickets",
      args: [projectId, amount, beneficiary, memo, preferUnstaked],
      events: [
        {
          name: "PrintTickets",
          args: [projectId, beneficiary, amount, memo, caller.address]
        }
      ],
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
