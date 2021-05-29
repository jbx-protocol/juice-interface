const { ethers } = require("hardhat");
const shouldBehaveLike = require("./behaviors");

const contractName = "Prices";

module.exports = function() {
  // Before the tests, deploy the contract.
  before(async function() {
    const contractArtifacts = await ethers.getContractFactory(contractName);
    this.contract = await contractArtifacts.deploy();
  });

  // Test each function.
  describe("addFeed(...)", shouldBehaveLike.addFeed);
  // describe("getETHPrice(...)", shouldBehaveLike.getETHPrice);
};
