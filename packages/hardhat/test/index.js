const { ethers } = require("hardhat");

const shouldBehaveLike = require("./behaviors");

let snapshotId;
const snapshot = () => ethers.provider.send("evm_snapshot", []);
const restore = id => ethers.provider.send("evm_revert", [id]);

describe("Juice", async function() {
  before(async function() {
    [this.deployer, ...this.addrs] = await ethers.getSigners();
  });
  beforeEach(async function() {
    snapshotId = await snapshot();
  });
  describe("OperatorStore", shouldBehaveLike.operatorStore);
  describe("Prices", shouldBehaveLike.prices);
  afterEach(async function() {
    await restore(snapshotId);
  });
});
