const { ethers, config } = require("hardhat");
const { expect } = require("chai");
const fs = require("fs");

const { deployMockContract } = require("@ethereum-waffle/mock-contract");

const shouldBehaveLike = require("./behaviors");

let snapshotId;
let timeMark;

const snapshot = () => ethers.provider.send("evm_snapshot", []);
const restore = id => ethers.provider.send("evm_revert", [id]);

const getTimestamp = async block => {
  return ethers.BigNumber.from(
    (await ethers.provider.getBlock(block || "latest")).timestamp
  );
};
const setTimeMark = async blockNumber => {
  timeMark = await getTimestamp(blockNumber);
};
const fastforward = async seconds => {
  // eslint-disable-next-line no-await-in-loop
  const now = await getTimestamp();
  const timeSinceTimemark = now.sub(timeMark);
  timeMark = now;

  // Subtract away any time that has already passed between the start of the test,
  // or from the last fastforward, from the provided value.
  await ethers.provider.send("evm_increaseTime", [
    seconds.toNumber() - timeSinceTimemark
  ]);
  await ethers.provider.send("evm_mine");
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

const check = ({ condition, contract, fn, args, value }) => async () => {
  if (condition !== undefined && !condition) return;
  const storedVal = await contract[fn](...args);
  expect(storedVal).to.deep.equal(value);
};

describe("Juice", async function() {
  before(async function() {
    // Bind a reference to the deployer address and an array of other addresses to `this`.
    [this.deployer, ...this.addrs] = await ethers.getSigners();

    // Bind the ability to manipulate time to `this`.
    this.fastforward = fastforward;
    this.getTimestamp = getTimestamp;
    this.setTimeMark = setTimeMark;

    // Bind a reference to a function that can deploy mock contracts from an abi.
    this.deployMockContract = abi => deployMockContract(this.deployer, abi);

    // Bind a reference to a function that can deploy mock local contracts from names.
    this.deployMockLocalContract = async mockContractName => {
      // Deploy mock contracts.
      const mockArtifacts = fs
        .readFileSync(
          `${config.paths.artifacts}/contracts/${mockContractName}.sol/${mockContractName}.json`
        )
        .toString();

      return this.deployMockContract(JSON.parse(mockArtifacts).abi);
    };

    // Bind a reference to a function that can deploy a contract on the local network.
    this.deployContract = async (contractName, args = []) => {
      const artifacts = await ethers.getContractFactory(contractName);
      return artifacts.deploy(...args);
    };

    // Bind functions to mock, execute, and check functionality.
    this.executeFn = executeFn;
    this.check = check;
  });

  // Before each test, take a snapshot of the contract state.
  beforeEach(async function() {
    snapshotId = await snapshot();
    // Mark the start time of each test.
    timeMark = await getTimestamp();

    // Make the start time of the test available.
    this.testStart = await getTimestamp();
  });

  // Test each contract.
  describe("OperatorStore", shouldBehaveLike.operatorStore);
  describe("Prices", shouldBehaveLike.prices);
  describe("Projects", shouldBehaveLike.projects);
  describe("TerminalDirectory", shouldBehaveLike.terminalDirectory);
  describe("Governance", shouldBehaveLike.governance);
  describe("JuiceProject", shouldBehaveLike.juiceProject);

  // Depends on TerminalDirectory.
  describe("FundingCycles", shouldBehaveLike.fundingCycles);
  // Depends on TerminalDirectory.
  describe("DirectPaymentAddress", shouldBehaveLike.directPaymentAddress);
  // Depends on OperatorStore and Projects.
  describe("ModStore", shouldBehaveLike.modStore);
  // Depends on OperatorStore and Projects.
  describe("TicketBooth", shouldBehaveLike.ticketBooth);

  // Depends on everything.
  // describe("Juicer", shouldBehaveLike.juicer);

  describe.only("Integration", shouldBehaveLike.integration);

  // After each test, restore the contract state.
  afterEach(async function() {
    await restore(snapshotId);
  });
});
