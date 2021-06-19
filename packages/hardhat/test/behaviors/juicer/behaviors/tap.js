const { expect } = require("chai");
const { BigNumber, constants } = require("ethers");

const tests = {
  success: [
    {
      description: "with no balance",
      fn: () => ({})
    }
  ],
  failure: []
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
  deployMockLocalContract,
  deployContract,
  contractName
}) => async custom => {
  const {
    caller = deployer,
    owner = addrs[0].address,
    addToBalance = BigNumber.from(10)
      .pow(18)
      .mul(42),
    amount = BigNumber.from(10)
      .pow(18)
      .mul(42),
    ethPrice = BigNumber.from(10)
      .pow(18)
      .mul(2),
    tapped = BigNumber.from(10)
      .pow(18)
      .mul(21),
    minReturnedWei = BigNumber.from(0),
    projectId = 42,
    fundingCycleId = 1,
    currency = 1,
    fee = 0,
    configured = 42,
    terminal = constants.AddressZero,
    revert
  } = {
    ...custom
  };

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

  const initialOwnerBalance = await deployer.provider.getBalance(owner);
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
          currency,
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
      returns: [[]]
    }),
    mockFn({
      mockContract: governance,
      fn: "terminal",
      args: [],
      returns: [terminal]
    }),
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
      args: [projectId, amount, minReturnedWei],
      events: [
        {
          name: "Tap",
          args: [
            fundingCycleId,
            projectId,
            owner,
            amount,
            currency,
            tapped,
            tapped,
            0,
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
      value: initialOwnerBalance.add(tapped)
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
