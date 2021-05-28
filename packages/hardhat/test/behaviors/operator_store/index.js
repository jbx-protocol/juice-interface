const { ethers } = require("hardhat");
const shouldBehaveLike = require("./behaviors");

const contractName = "OperatorStore";

module.exports = function() {
  before(async function() {
    const contractArtifacts = await ethers.getContractFactory(contractName);
    this.contract = await contractArtifacts.deploy();
    await this.contract.deployTransaction.wait();
  });
  // describe("Set operator", shouldBehaveLike.setOperator);
  // describe("Set operators", shouldBehaveLike.setOperators);
  describe("Has permission", shouldBehaveLike.hasPermission);
  // describe("Has permissions", shouldBehaveLike.hasPermissions);
};
