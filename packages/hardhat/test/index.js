const { ethers } = require("hardhat");

const shouldBehaveLike = require("./behaviors");

let snapshotId;
const snapshot = () => ethers.provider.send("evm_snapshot", []);
const restore = id => ethers.provider.send("evm_revert", [id]);

describe("Juice", async function() {
  // Bind a reference to the deployer address, and an array of other addresses to `this`.
  before(async function() {
    [this.deployer, ...this.addrs] = await ethers.getSigners();
  });

  // Before each test, take a snapshot of the contract state.
  beforeEach(async function() {
    snapshotId = await snapshot();
  });

  // Test each contract.
  describe("OperatorStore", shouldBehaveLike.operatorStore);
  describe("Prices", shouldBehaveLike.prices);

  // After each test, restore the contract state.
  afterEach(async function() {
    await restore(snapshotId);
  });
});
