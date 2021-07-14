const { expect } = require("chai");
const { BigNumber, constants } = require("ethers");

const tests = {
  success: [
    {
      description: "with no balance",
      fn: () => ({})
    },
    {
      description: "with balance",
      fn: () => ({
        addToBalance: BigNumber.from(42)
      })
    },
    {
      description: "with no funding cycle",
      fn: () => ({
        fundingCycleNumber: 0,
        unreservedWeightedAmount: BigNumber.from(10)
          .pow(18)
          .mul(420)
      })
    },
    {
      description: "reserved rate 100%",
      fn: () => ({
        reservedRate: 200
      })
    }
  ],
  failure: [
    {
      description: "paid zero",
      fn: () => ({
        amount: BigNumber.from(0),
        revert: "TerminalV1::pay: BAD_AMOUNT"
      })
    },
    {
      description: "zero address beneficiary",
      fn: () => ({
        beneficiary: constants.AddressZero,
        revert: "TerminalV1::pay: ZERO_ADDRESS"
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
    unreservedWeightedAmount = BigNumber.from(10)
      .pow(18)
      .mul(399),
    reservedRate = 10,
    projectId = 42,
    fundingCycleId = 1,
    fundingCycleNumber = 1,
    revert
  } = {
    ...custom
  };

  // Create a packed metadata value to store the reserved rate.
  let packedMetadata = BigNumber.from(0);
  packedMetadata = packedMetadata.add(42);
  packedMetadata = packedMetadata.shl(8);
  packedMetadata = packedMetadata.add(42);
  packedMetadata = packedMetadata.shl(8);
  packedMetadata = packedMetadata.add(reservedRate);
  packedMetadata = packedMetadata.shl(8);

  return [
    mockFn({
      condition: !revert,
      mockContract: mockContracts.fundingCycles,
      fn: "currentOf",
      args: [projectId],
      returns: [
        {
          configured: 0,
          cycleLimit: 0,
          id: fundingCycleId,
          projectId,
          number: fundingCycleNumber,
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
          metadata: packedMetadata
        }
      ]
    }),
    ...(fundingCycleNumber === 0
      ? [
          mockFn({
            mockContract: mockContracts.fundingCycles,
            fn: "BASE_WEIGHT",
            args: [],
            returns: [weight]
          })
        ]
      : []),
    executeFn({
      condition: !revert && addToBalance > 0,
      caller,
      contract: targetContract,
      fn: "addToBalance",
      args: [projectId],
      value: addToBalance
    }),
    mockFn({
      condition: !revert,
      mockContract: mockContracts.ticketBooth,
      fn: "print",
      args: [beneficiary, projectId, unreservedWeightedAmount, preferUnstaked],
      returns: []
    }),
    executeFn({
      caller,
      contract: targetContract,
      fn: "pay",
      args: [projectId, beneficiary, memo, preferUnstaked],
      value: amount,
      events: [
        {
          name: "Pay",
          args: [
            fundingCycleId,
            projectId,
            beneficiary,
            amount,
            memo,
            caller.address
          ]
        }
      ],
      revert
    }),
    check({
      condition: !revert,
      contract: targetContract,
      fn: "balanceOf",
      args: [projectId],
      value: addToBalance.add(amount)
    }),
    mockFn({
      condition: !revert,
      mockContract: mockContracts.ticketBooth,
      fn: "totalSupplyOf",
      args: [projectId],
      returns: [unreservedWeightedAmount]
    }),
    check({
      condition: !revert,
      contract: targetContract,
      fn: "canPrintPreminedTickets",
      args: [projectId],
      value: fundingCycleNumber === 0
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
