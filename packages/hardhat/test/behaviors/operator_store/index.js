const { ethers } = require("hardhat");
const shouldBehaveLike = require("./behaviors");

const contractName = "OperatorStore";

module.exports = function() {
  // Before the tests, deploy the contract.
  before(async function() {
    const contractArtifacts = await ethers.getContractFactory(contractName);
    this.contract = await contractArtifacts.deploy();
  });

  // Test each function.
  describe("setOperator(...)", shouldBehaveLike.setOperator);
  describe("setOperators(...)", shouldBehaveLike.setOperators);
  describe("hasPermission(...)", shouldBehaveLike.hasPermission);
  describe("hasPermissions(...)", shouldBehaveLike.hasPermissions);
};
