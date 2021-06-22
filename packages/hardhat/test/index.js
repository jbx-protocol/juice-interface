const { ethers, config } = require("hardhat");
const chai = require("chai");
const fs = require("fs");

const { deployMockContract } = require("@ethereum-waffle/mock-contract");

const unit = require("./unit");
const integration = require("./integration");

let snapshotId;
let timeMark;

const snapshot = () => ethers.provider.send("evm_snapshot", []);
const restore = id => ethers.provider.send("evm_revert", [id]);

// Save the initial balances for each address.
const initialBalances = {};

// A seed that gets incremented as random numbers are created.
let randomnessSeed = 0;

describe("Juice", async function() {
  before(async function() {
    // Bind a reference to the deployer address and an array of other addresses to `this`.
    [this.deployer, ...this.addrs] = await ethers.getSigners();

    // Bind the ability to manipulate time to `this`.
    // Bind a function that gets the current block's timestamp.
    this.getTimestamp = async block => {
      return ethers.BigNumber.from(
        (await ethers.provider.getBlock(block || "latest")).timestamp
      );
    };

    // Binds a function that sets a time mark that is taken into account while fastforward.
    this.setTimeMark = async blockNumber => {
      timeMark = await this.getTimestamp(blockNumber);
    };

    // Binds the ability to get the latest time mark.
    this.getTimeMark = () => timeMark;

    // Binds a function that fastforward a certain amount from the beginning of the test, or from the latest time mark if one is set.
    this.fastforward = async seconds => {
      const now = await this.getTimestamp();
      const timeSinceTimemark = now.sub(timeMark);
      timeMark = now;

      // Subtract away any time that has already passed between the start of the test,
      // or from the last fastforward, from the provided value.
      await ethers.provider.send("evm_increaseTime", [
        seconds.toNumber() - timeSinceTimemark
      ]);
      // Mine a block.
      await ethers.provider.send("evm_mine");
    };

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

    // Bind a function that mocks a contract function's execution with the provided args to return the provided values.
    this.mockFn = ({ mockContract, fn, args, returns = [] }) => async () => {
      // The `args` can be a function or an array.
      const normalizedArgs =
        args && typeof args === "function" ? await args() : args;

      // The `returns` value can be a function or an array.
      const normalizedReturns =
        typeof returns === "function" ? await returns() : returns;

      // Get a reference to the mock.
      const mock = mockContract.mock[fn];

      // If args were provided, make the the mock only works if invoked with the provided args.
      if (normalizedArgs) mock.withArgs(...normalizedArgs);

      // Set its return value.
      await mock.returns(...normalizedReturns);
    };

    // Bind a function that executes a transaction on a contract.
    this.executeFn = ({
      caller,
      contract,
      fn,
      args = [],
      value = 0,
      events = [],
      revert
    }) => async () => {
      // Args can be either a function or an array.
      const normalizedArgs = typeof args === "function" ? await args() : args;

      // Save the promise that is returned.
      const promise = contract
        .connect(caller)
        [fn](...normalizedArgs, { value });

      // If a revert message is passed in, check to see if it was thrown.
      if (revert) {
        await chai.expect(promise).to.be.revertedWith(revert);
        return;
      }

      // Await the promise.
      const tx = await promise;

      // Wait for a block to get mined.
      await tx.wait();

      // Set the time mark of this function.
      await this.setTimeMark(tx.blockNumber);

      // Return if there are no events.
      if (events.length === 0) return;

      // Check for events.
      events.forEach(event =>
        chai
          .expect(tx)
          .to.emit(contract, event.name)
          .withArgs(...event.args)
      );
    };

    // Bind a function that checks if a contract getter equals an expected value.
    this.checkFn = ({ contract, fn, args, expect }) => async () => {
      const storedVal = await contract[fn](...args);
      chai.expect(storedVal).to.deep.equal(expect);
    };

    // Binds a function that makes sure the provided address has the balance
    this.verifyBalanceFn = ({ address, expect }) => async () => {
      const storedVal = await ethers.provider.getBalance(address);
      chai
        .expect(storedVal.sub(initialBalances[address] || 0))
        .to.deep.equal(expect);
    };

    // Bind randomness functions.

    // Randomness functions.
    this.randomBytes = ({ lower, upper }) =>
      // eslint-disable-next-line no-plusplus
      ethers.testcases.randomBytes(randomnessSeed++, lower, upper);

    this.randomNumber = ({ lower, upper }) =>
      // eslint-disable-next-line no-plusplus
      ethers.testcases.randomNumber(randomnessSeed++, lower, upper);
  });

  // Before each test, take a snapshot of the contract state.
  beforeEach(async function() {
    snapshotId = await snapshot();

    // Mark the start time of each test.
    timeMark = await this.getTimestamp();

    // Make the start time of the test available.
    this.testStart = await this.getTimestamp();

    // Set initial balances.
    await Promise.all(
      this.addrs.map(async addr => {
        initialBalances[addr.address] = await ethers.provider.getBalance(
          addr.address
        );
      })
    );
  });

  // Run the tests.
  describe("Unit", unit);
  describe("Integration", integration);

  // After each test, restore the contract state.
  afterEach(async function() {
    await restore(snapshotId);
  });
});
