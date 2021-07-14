const { expect } = require("chai");
const { BigNumber, constants } = require("ethers");

const tests = {
  success: [
    {
      description: "with no tappable",
      fn: () => ({})
    },
    {
      description: "with no tappable sent by project operator",
      fn: ({ addrs }) => ({
        account: addrs[0].address,
        projectOperator: true
      })
    },
    {
      description: "with no tappable sent by wildcard operator",
      fn: ({ addrs }) => ({
        account: addrs[0].address,
        projectOperator: false,
        wildcardOperator: true
      })
    },
    {
      description: "with no tappable and a bonding curve",
      fn: () => ({
        bondingCurveRate: 100
      })
    },
    {
      description: "with no tappable and a reserve rate",
      fn: () => ({
        amount: BigNumber.from(10)
          .pow(18)
          .mul(9),
        reservedRate: 20
      })
    },
    {
      description: "With some tappable",
      fn: () => ({
        target: BigNumber.from(10)
          .pow(18)
          .mul(200),
        tapped: BigNumber.from(10)
          .pow(18)
          .mul(100),
        ethPrice: BigNumber.from(10)
          .pow(18)
          .mul(2),
        addToBalance: BigNumber.from(10)
          .pow(18)
          .mul(100),
        amount: BigNumber.from(10)
          .pow(18)
          .mul(50)
      })
    },
    {
      description:
        "With some tappable and bonding curve of 50%, redeeming 50% of the supply",
      fn: () => ({
        target: BigNumber.from(10)
          .pow(18)
          .mul(200),
        tapped: BigNumber.from(10)
          .pow(18)
          .mul(100),
        ethPrice: BigNumber.from(10)
          .pow(18)
          .mul(2),
        addToBalance: BigNumber.from(10)
          .pow(18)
          .mul(100),
        // sub-100% discount rate to make recurring.
        discountRate: 1,
        bondingCurveRate: 100,
        // Half the amount of tickets.
        count: BigNumber.from(10)
          .pow(18)
          .mul(5),
        ticketBalance: BigNumber.from(10)
          .pow(18)
          .mul(5),
        ticketTotalSupply: BigNumber.from(10)
          .pow(18)
          .mul(10),
        // rate should be %37.5
        amount: BigNumber.from(10)
          .pow(18)
          .mul(50)
          .mul(375)
          .div(1000)
      })
    },
    {
      description:
        "With some tappable and bonding curve of 50%, redeeming 10% of supply",
      fn: () => ({
        target: BigNumber.from(10)
          .pow(18)
          .mul(200),
        tapped: BigNumber.from(10)
          .pow(18)
          .mul(100),
        ethPrice: BigNumber.from(10)
          .pow(18)
          .mul(2),
        addToBalance: BigNumber.from(10)
          .pow(18)
          .mul(100),
        // sub-100% discount rate to make recurring.
        discountRate: 1,
        bondingCurveRate: 100,
        // Half the amount of tickets.
        count: BigNumber.from(10)
          .pow(18)
          .mul(1),
        ticketBalance: BigNumber.from(10)
          .pow(18)
          .mul(1),
        ticketTotalSupply: BigNumber.from(10)
          .pow(18)
          .mul(10),
        // rate should be %5.5
        amount: BigNumber.from(10)
          .pow(18)
          .mul(50)
          .mul(55)
          .div(1000)
      })
    },
    {
      description:
        "With some tappable and bonding curve of 10%, redeeming 50% of supply",
      fn: () => ({
        target: BigNumber.from(10)
          .pow(18)
          .mul(200),
        tapped: BigNumber.from(10)
          .pow(18)
          .mul(100),
        ethPrice: BigNumber.from(10)
          .pow(18)
          .mul(2),
        addToBalance: BigNumber.from(10)
          .pow(18)
          .mul(100),
        // sub-100% discount rate to make recurring.
        discountRate: 1,
        bondingCurveRate: 20,
        // Half the amount of tickets.
        count: BigNumber.from(10)
          .pow(18)
          .mul(5),
        ticketBalance: BigNumber.from(10)
          .pow(18)
          .mul(5),
        ticketTotalSupply: BigNumber.from(10)
          .pow(18)
          .mul(10),
        // rate should be %27.5
        amount: BigNumber.from(10)
          .pow(18)
          .mul(50)
          .mul(275)
          .div(1000)
      })
    },
    {
      description:
        "With some tappable and bonding curve of 10%, redeeming 10% of supply",
      fn: () => ({
        target: BigNumber.from(10)
          .pow(18)
          .mul(200),
        tapped: BigNumber.from(10)
          .pow(18)
          .mul(100),
        ethPrice: BigNumber.from(10)
          .pow(18)
          .mul(2),
        addToBalance: BigNumber.from(10)
          .pow(18)
          .mul(100),
        // sub-100% discount rate to make recurring.
        discountRate: 1,
        bondingCurveRate: 20,
        // Half the amount of tickets.
        count: BigNumber.from(10)
          .pow(18)
          .mul(1),
        ticketBalance: BigNumber.from(10)
          .pow(18)
          .mul(1),
        ticketTotalSupply: BigNumber.from(10)
          .pow(18)
          .mul(10),
        // rate should be %1.9
        amount: BigNumber.from(10)
          .pow(18)
          .mul(50)
          .mul(19)
          .div(1000)
      })
    },
    {
      description:
        "With some tappable and reconfiguration bonding curve of 50%",
      fn: () => ({
        target: BigNumber.from(10)
          .pow(18)
          .mul(200),
        tapped: BigNumber.from(10)
          .pow(18)
          .mul(100),
        ethPrice: BigNumber.from(10)
          .pow(18)
          .mul(2),
        addToBalance: BigNumber.from(10)
          .pow(18)
          .mul(100),
        // sub-100% discount rate to make recurring.
        discountRate: 1,
        // active ballot
        currentBallotStateOf: 1,
        reconfigutaionBondingCurveRate: 100,
        // Half the amount of tickets.
        count: BigNumber.from(10)
          .pow(18)
          .mul(5),
        ticketBalance: BigNumber.from(10)
          .pow(18)
          .mul(5),
        ticketTotalSupply: BigNumber.from(10)
          .pow(18)
          .mul(10),
        // rate should be %37.5
        amount: BigNumber.from(10)
          .pow(18)
          .mul(50)
          .mul(375)
          .div(1000)
      })
    },
    {
      description: "With exactly min returned",
      fn: () => ({
        target: BigNumber.from(10)
          .pow(18)
          .mul(200),
        tapped: BigNumber.from(10)
          .pow(18)
          .mul(100),
        ethPrice: BigNumber.from(10)
          .pow(18)
          .mul(2),
        addToBalance: BigNumber.from(10)
          .pow(18)
          .mul(100),
        minReturnedWei: BigNumber.from(10)
          .pow(18)
          .mul(50),
        amount: BigNumber.from(10)
          .pow(18)
          .mul(50)
      })
    },
    {
      description: "max uints",
      fn: () => ({
        count: BigNumber.from(2)
          .pow(255)
          .sub(1),
        ticketBalance: BigNumber.from(2)
          .pow(255)
          .sub(1),
        ticketTotalSupply: BigNumber.from(2)
          .pow(255)
          .sub(1)
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ addrs }) => ({
        account: addrs[0].address,
        projectOperator: false,
        wildcardOperator: false,
        revert: "Operatable: UNAUTHORIZED"
      })
    },
    {
      description: "zero count",
      fn: () => ({
        count: BigNumber.from(0),
        revert: "TerminalV1::redeem: NO_OP"
      })
    },
    {
      description: "zero address",
      fn: () => ({
        beneficiary: constants.AddressZero,
        revert: "TerminalV1::redeem: ZERO_ADDRESS"
      })
    },
    {
      description: "insufficient tickets",
      fn: () => ({
        count: BigNumber.from(2),
        ticketBalance: BigNumber.from(1),
        revert: "TerminalV1::claimableOverflow: INSUFFICIENT_TICKETS"
      })
    },
    {
      description: "no balance to claim",
      fn: () => ({
        target: BigNumber.from(10)
          .pow(18)
          .mul(200),
        tapped: BigNumber.from(10)
          .pow(18)
          .mul(100),
        ethPrice: BigNumber.from(10).pow(18),
        addToBalance: BigNumber.from(10)
          .pow(18)
          .mul(100),
        amount: BigNumber.from(0),
        revert: "TerminalV1::redeem: NO_OP"
      })
    },
    {
      description: "amount less than min returned",
      fn: () => ({
        target: BigNumber.from(10)
          .pow(18)
          .mul(200),
        tapped: BigNumber.from(10)
          .pow(18)
          .mul(100),
        ethPrice: BigNumber.from(10)
          .pow(18)
          .mul(2),
        addToBalance: BigNumber.from(10)
          .pow(18)
          .mul(100),
        minReturnedWei: BigNumber.from(10)
          .pow(18)
          .mul(50)
          .add(1),
        revert: "TerminalV1::redeem: INADEQUATE"
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

const ops = ({
  deployer,
  addrs,
  mockContracts,
  targetContract
}) => async custom => {
  const {
    caller = deployer,
    account = deployer.address,
    projectOperator = false,
    wildcardOperator = false,
    addToBalance = BigNumber.from(10)
      .pow(18)
      .mul(10),
    beneficiary = addrs[0].address,
    count = BigNumber.from(10)
      .pow(18)
      .mul(10),
    ticketBalance = BigNumber.from(10)
      .pow(18)
      .mul(10),
    ticketTotalSupply = BigNumber.from(10)
      .pow(18)
      .mul(10),
    ethPrice = BigNumber.from(10)
      .pow(18)
      .mul(42),
    preferUnstaked = false,
    amount = BigNumber.from(10)
      .pow(18)
      .mul(10),
    weight = BigNumber.from(10)
      .pow(18)
      .mul(10),
    minReturnedWei = BigNumber.from(0),
    reservedRate = 0,
    discountRate = 0,
    bondingCurveRate = 200,
    reconfigutaionBondingCurveRate = 200,
    projectId = 42,
    fundingCycleId = 1,
    currentBallotStateOf = 0,
    target = BigNumber.from(10)
      .pow(18)
      .mul(100),
    tapped = BigNumber.from(10)
      .pow(18)
      .mul(100),
    currency = 42,
    revert
  } = {
    ...custom
  };

  // Create a packed metadata value to store the reserved rate.
  let packedMetadata = BigNumber.from(0);
  packedMetadata = packedMetadata.add(reconfigutaionBondingCurveRate);
  packedMetadata = packedMetadata.shl(8);
  packedMetadata = packedMetadata.add(bondingCurveRate);
  packedMetadata = packedMetadata.shl(8);
  packedMetadata = packedMetadata.add(reservedRate);
  packedMetadata = packedMetadata.shl(8);

  const initialBeneficiaryBalance = await deployer.provider.getBalance(
    beneficiary
  );
  return [
    mockFn({
      mockContract: mockContracts.operatorStore,
      fn: "hasPermission",
      args: () => {
        const expectedPermissionIndex = 3;
        return [caller.address, account, projectId, expectedPermissionIndex];
      },
      returns: [projectOperator || false]
    }),
    mockFn({
      mockContract: mockContracts.operatorStore,
      fn: "hasPermission",
      args: () => {
        const expectedPermissionIndex = 3;
        return [caller.address, account, 0, expectedPermissionIndex];
      },
      returns: [wildcardOperator || false]
    }),
    mockFn({
      mockContract: mockContracts.ticketBooth,
      fn: "balanceOf",
      args: [account, projectId],
      returns: [ticketBalance]
    }),
    mockFn({
      mockContract: mockContracts.fundingCycles,
      fn: "currentOf",
      args: [projectId],
      returns: [
        {
          configured: 0,
          cycleLimit: 0,
          id: fundingCycleId,
          projectId,
          number: 0,
          basedOn: 0,
          weight,
          ballot: constants.AddressZero,
          start: 0,
          duration: 0,
          target,
          currency,
          fee: 0,
          discountRate,
          tapped,
          metadata: packedMetadata
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
      mockContract: mockContracts.ticketBooth,
      fn: "totalSupplyOf",
      args: [projectId],
      returns: [ticketTotalSupply]
    }),
    mockFn({
      mockContract: mockContracts.ticketBooth,
      fn: "redeem",
      args: [account, projectId, count, preferUnstaked],
      returns: []
    }),
    mockFn({
      mockContract: mockContracts.fundingCycles,
      fn: "currentBallotStateOf",
      args: [projectId],
      returns: [currentBallotStateOf]
    }),
    executeFn({
      caller,
      contract: targetContract,
      fn: "redeem",
      args: [
        account,
        projectId,
        count,
        minReturnedWei,
        beneficiary,
        preferUnstaked
      ],
      events: [
        {
          name: "Redeem",
          args: [account, beneficiary, projectId, count, amount, caller.address]
        }
      ],
      revert
    }),
    check({
      condition: !revert,
      contract: targetContract,
      fn: "balanceOf",
      args: [projectId],
      value: addToBalance.sub(amount)
    }),
    check({
      condition: !revert,
      contract: targetContract.provider,
      fn: "getBalance",
      args: [beneficiary],
      value: initialBeneficiaryBalance.add(amount)
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
