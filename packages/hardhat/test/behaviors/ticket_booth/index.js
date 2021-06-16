const shouldBehaveLike = require("./behaviors");

const contractName = "TicketBooth";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.projects = await this.deployMockLocalContract("Projects");
    this.operatorStore = await this.deployMockLocalContract("OperatorStore");
    this.terminalDirectory = await this.deployMockLocalContract(
      "TerminalDirectory"
    );

    // Deploy the contract.
    this.contract = await this.deployContract(contractName, [
      this.projects.address,
      this.operatorStore.address,
      this.terminalDirectory.address
    ]);
  });

  // Test each function.
  describe("issue(...)", shouldBehaveLike.issue);
  describe("print(...)", shouldBehaveLike.print);
  describe("unstake(...)", shouldBehaveLike.unstake);
  describe("stake(...)", shouldBehaveLike.stake);
  describe("transfer(...)", shouldBehaveLike.transfer);
  describe("redeem(...)", shouldBehaveLike.redeem);
  describe("lock(...)", shouldBehaveLike.lock);
  describe("unlock(...)", shouldBehaveLike.unlock);
  describe("balanceOf(...)", shouldBehaveLike.balanceOf);
  describe("totalSupplyOf(...)", shouldBehaveLike.totalSupplyOf);
};
