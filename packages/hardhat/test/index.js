const { ethers } = require("hardhat");
const bre = require("hardhat");
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
const setTimestamp = timestamp =>
  ethers.provider.send("evm_setNextBlockTimestamp", [timestamp]);

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

describe("Juice", async function() {
  before(async function() {
    // Bind a reference to the deployer address and an array of other addresses to `this`.
    [this.deployer, ...this.addrs] = await ethers.getSigners();

    // Bind the ability to manipulate time to `this`.
    this.fastforward = fastforward;
    this.getTimestamp = getTimestamp;
    this.setTimestamp = setTimestamp;
    this.setTimeMark = setTimeMark;

    // Bind a reference to a function that can deploy mock contracts from an abi.
    this.deployMockContract = abi => deployMockContract(this.deployer, abi);

    // Bind a reference to a function that can deploy mock local contracts from names.
    this.deployMockLocalContract = async mockContractName => {
      // Deploy mock contracts.
      const mockArtifacts = fs
        .readFileSync(
          `${bre.config.paths.artifacts}/contracts/${mockContractName}.sol/${mockContractName}.json`
        )
        .toString();

      return this.deployMockContract(JSON.parse(mockArtifacts).abi);
    };

    // Bind a reference to a function that can deploy a contract on the local network.
    this.deployContract = async (contractName, args = []) => {
      const artifacts = await ethers.getContractFactory(contractName);
      return artifacts.deploy(...args);
    };
  });

  // Before each test, take a snapshot of the contract state.
  beforeEach(async function() {
    snapshotId = await snapshot();

    // Mark the start time of each test.
    timeMark = await getTimestamp();
  });

  // Test each contract.
  describe("OperatorStore", shouldBehaveLike.operatorStore);
  describe("Prices", shouldBehaveLike.prices);
  describe.only("FundingCycles", shouldBehaveLike.fundingCycles);

  // Depends on OperatorStore and Projects.
  describe("ModStore", shouldBehaveLike.modStore);
  // Depends on OperatorStore and Projects.
  describe("Tickets", shouldBehaveLike.tickets);

  // After each test, restore the contract state.
  afterEach(async function() {
    await restore(snapshotId);
  });
});
