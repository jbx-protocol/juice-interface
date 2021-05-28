const { ethers } = require("hardhat");
const shouldBehaveLike = require("./behaviors");

const snapshot = function() {
  return ethers.provider.send("evm_snapshot", []);
};

const restore = function(id) {
  return ethers.provider.send("evm_revert", [id]);
};

let snapshotId;

describe("Juice", async function() {
  before(async function() {
    [this.deployer, ...this.addrs] = await ethers.getSigners();
  });
  beforeEach(async function() {
    snapshotId = await snapshot();
  });
  describe("OperatorStore", shouldBehaveLike.operatorStore);
  afterEach(async function() {
    await restore(snapshotId);
  });
});
