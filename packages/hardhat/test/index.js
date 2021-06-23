const { ethers, config } = require("hardhat");
const chai = require("chai");
const fs = require("fs");

const { deployMockContract } = require("@ethereum-waffle/mock-contract");

const unit = require("./unit");
const integration = require("./integration");

let snapshotId;

const snapshotFn = () => ethers.provider.send("evm_snapshot", []);
const restoreFn = id => ethers.provider.send("evm_revert", [id]);

// Save the initial balances for each address.
const initialBalances = {};

describe("Juice", async function() {
  before(async function() {
    // Bind a reference to the deployer address and an array of other addresses to `this`.
    [this.deployer, ...this.addrs] = await ethers.getSigners();

    // Bind the ability to manipulate time to `this`.
    // Bind a function that gets the current block's timestamp.
    this.getTimestampFn = async block => {
      return ethers.BigNumber.from(
        (await ethers.provider.getBlock(block || "latest")).timestamp
      );
    };

    // Binds a function that sets a time mark that is taken into account while fastforward.
    this.setTimeMarkFn = async blockNumber => {
      this.timeMark = await this.getTimestampFn(blockNumber);
    };

    // Binds a function that fastforward a certain amount from the beginning of the test, or from the latest time mark if one is set.
    this.fastforwardFn = async seconds => {
      const now = await this.getTimestampFn();
      const timeSinceTimemark = now.sub(this.timeMark);
      this.timeMark = now;

      // Subtract away any time that has already passed between the start of the test,
      // or from the last fastforward, from the provided value.
      await ethers.provider.send("evm_increaseTime", [
        seconds.toNumber() - timeSinceTimemark
      ]);
      // Mine a block.
      await ethers.provider.send("evm_mine");
    };

    // Bind a reference to a function that can deploy mock contracts from an abi.
    this.deployMockContractFn = abi => deployMockContract(this.deployer, abi);

    // Bind a reference to a function that can deploy mock local contracts from names.
    this.deployMockLocalContractFn = async mockContractName => {
      // Deploy mock contracts.
      const mockArtifacts = fs
        .readFileSync(
          `${config.paths.artifacts}/contracts/${mockContractName}.sol/${mockContractName}.json`
        )
        .toString();

      return this.deployMockContractFn(JSON.parse(mockArtifacts).abi);
    };

    // Bind a reference to a function that can deploy a contract on the local network.
    this.deployContractFn = async (contractName, args = []) => {
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
    this.executeFn = async ({
      caller,
      contract,
      fn,
      args = [],
      value = 0,
      events = [],
      revert
    }) => {
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
      await this.setTimeMarkFn(tx.blockNumber);

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
    this.checkFn = async ({ contract, fn, args, expect }) => {
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

    // Binds a function that gets the balance of an address.
    this.getBalanceFn = address => ethers.provider.getBalance(address);

    // Binds a function that gets the balance of an address as its changed during the current test.
    this.changeInBalanceFn = async address =>
      (await ethers.provider.getBalance(address)).sub(
        initialBalances[address] || 0
      );

    // Bind some constants.

    this.constants = {
      AddressZero: ethers.constants.AddressZero,
      MaxUint256: ethers.constants.MaxUint256,
      MaxInt256: ethers.BigNumber.from(2)
        .pow(255)
        .sub(1),
      MaxUint24: ethers.BigNumber.from(2)
        .pow(24)
        .sub(1),
      MaxUint8: ethers.BigNumber.from(2)
        .pow(8)
        .sub(1),
      MaxPercent: ethers.BigNumber.from(200)
    };

    // Bind function that gets a random big number.
    this.randomBigNumberFn = ({
      min = ethers.BigNumber.from(0),
      max = this.constants.MaxUint256,
      fidelity = 10000000
    } = {}) => {
      const base = max.sub(min).add(min);
      return base.gt(fidelity)
        ? base
            .div(fidelity)
            .mul(ethers.BigNumber.from(Math.floor(Math.random() * fidelity)))
        : base
            .mul(ethers.BigNumber.from(Math.floor(Math.random() * fidelity)))
            .div(fidelity);
    };

    // Bind a function that gets a random address.
    this.randomAddressFn = () =>
      this.addrs[Math.floor(Math.random() * 9)].address;

    this.percentageFn = ({ value, percent }) => value.mul(percent).div(100);

    // Bind a function to create a value padding by 18 zeros.
    this.e18Fn = value =>
      ethers.BigNumber.from(10)
        .pow(18)
        .mul(value);

    // Bind the big number utils.
    this.BigNumber = ethers.BigNumber;

    // Bind a function that turns a string into bytes.
    this.stringToBytesFn = ethers.utils.formatBytes32String;

    // Bind a function to get a normalized percent.
    this.normalizedPercentFn = percent =>
      ethers.BigNumber.from(percent)
        .mul(this.constants.MaxPercent)
        .div(100);
  });

  // Before each test, take a snapshot of the contract state.
  beforeEach(async function() {
    snapshotId = await snapshotFn();

    // Mark the start time of each test.
    this.timeMark = await this.getTimestampFn();

    // Make the start time of the test available.
    this.testStart = await this.getTimestampFn();

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
  // describe("Unit", unit);
  describe("Integration", integration);

  // After each test, restore the contract state.
  afterEach(async function() {
    await restoreFn(snapshotId);
  });
});
