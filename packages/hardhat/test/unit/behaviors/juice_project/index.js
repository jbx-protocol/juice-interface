const {
  ethers: { constants }
} = require("hardhat");

const shouldBehaveLike = require("./behaviors");

const contractName = "ExampleJuiceProject";

module.exports = function() {
  // Before the tests, deploy the contract.
  before(async function() {
    this.projectId = 1;

    // Deploy the contract.
    this.contract = await this.deployContract(contractName, [
      constants.AddressZero,
      this.projectId
    ]);
  });

  // Test each function.
  describe("setOperator(...)", shouldBehaveLike.setOperator);
  describe("setOperators(...)", shouldBehaveLike.setOperators);
  describe(
    "transferProjectOwnership(...)",
    shouldBehaveLike.transferProjectOwnership
  );
  describe("pay(...)", shouldBehaveLike.pay);
  describe("takeFee(...)", shouldBehaveLike.takeFee);
  describe("setProjectId(...)", shouldBehaveLike.setProjectId);
  describe("setTerminal(...)", shouldBehaveLike.setTerminal);
  describe("withdraw(...)", shouldBehaveLike.withdraw);
};
