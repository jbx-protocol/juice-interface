const { ethers } = require("hardhat");
const shouldBehaveLike = require("./behaviors");

const contractName = "Prices";

module.exports = function() {
  before(async function() {
    const contractArtifacts = await ethers.getContractFactory(contractName);
    this.contract = await contractArtifacts.deploy();
    await this.contract.deployTransaction.wait();
  });
  describe("addFeed(...)", shouldBehaveLike.addFeed);
  // describe("getETHPrice(...)", shouldBehaveLike.getETHPrice);
};
