/** 
  These tests rely on time manipulation quite a bit, which as far as i understand is hard to do precisely. 
  Ideally, the tests could mock the block.timestamp to preset numbers, but instead 
  they rely on 'fastforwarding' the time between operations. Fastforwarding creates a
  high probability that the subsequent operation will fall on a block with the intended timestamp,
  but there's a small chance that there's an off-by-one error. 

  As a result, tests that depend on the exact time are flaky 10% of the time.
  This is ok. There are tests for either side of the exact time that are included.

  If anyone has ideas on how to mitigate this, please let me know.

  NOTE: Considering removing these tests from the corpus all together.
*/
process.env.INCLUDE_TIME_EDGE_CASE_TEST = false;

const shouldBehaveLike = require("./behaviors");

const contractName = "FundingCycles";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.ballot = await this.deployMockLocalContractFn(
      "Active14DaysFundingCycleBallot"
    );
    this.terminalDirectory = await this.deployMockLocalContractFn(
      "TerminalDirectory"
    );

    // Deploy the contract.
    this.contract = await this.deployContractFn(contractName, [
      this.terminalDirectory.address
    ]);
  });

  // Test each function.
  describe("configure(...)", shouldBehaveLike.configure);
  describe("tap(...)", shouldBehaveLike.tap);
  describe("currentOf(...)", shouldBehaveLike.currentOf);
  describe("queuedOf(...)", shouldBehaveLike.queuedOf);
  describe("currentBallotStateOf(...)", shouldBehaveLike.currentBallotStateOf);
};
