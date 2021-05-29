const { ethers } = require("hardhat");

const { deployMockContract } = require("@ethereum-waffle/mock-contract");
const AggregatorV3Interface = require("@chainlink/contracts/abi/v0.6/AggregatorV3Interface.json");

const shouldBehaveLike = require("./behaviors");

const contractName = "Prices";

module.exports = function() {
  // Before the tests, deploy the contract.
  before(async function() {
    const contractArtifacts = await ethers.getContractFactory(contractName);
    this.contract = await contractArtifacts.deploy();

    // Deploy a mock of the price feed oracle contract.
    this.mockAggregatorV3InterfaceContract = await deployMockContract(
      this.deployer,
      AggregatorV3Interface.compilerOutput.abi
    );
  });

  // Test each function.
  describe("addFeed(...)", shouldBehaveLike.addFeed);
  describe("getETHPrice(...)", shouldBehaveLike.getETHPrice);
};
