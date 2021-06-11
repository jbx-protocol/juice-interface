const { ethers } = require("hardhat");
const shouldBehaveLike = require("./behaviors");

const contractName = "FundingCycles";

/** 
  These tests rely on time manipulation quite a bit, which as far as i understand is hard to do precisely. 
  Ideally, the tests could mock the block.timestamp to preset numbers, but instead 
  they rely on 'fastforwarding' the time between operations. Fastforwarding creates a
  high probability that the subsequent operation will fall on a block with the intended timestamp,
  but there's a small chance that there's an off-by-one error. 

  If anyone has ideas on how to mitigate this, please let me know.
*/

let timeMark;
const getTimestamp = async block => {
  return ethers.BigNumber.from(
    (await ethers.provider.getBlock(block || "latest")).timestamp
  );
};
const setTimeMark = async blockNumber => {
  timeMark = await getTimestamp(blockNumber);
};
const fastforward = async seconds => {
  // eslint-disable-next-line no-await-in-loop
  const now = await getTimestamp();
  const timeSinceTimemark = now.sub(timeMark);
  timeMark = now;

  // Subtract away any time that has already passed between the start of the test,
  // or from the last fastforward, from the provided value.
  await ethers.provider.send("evm_increaseTime", [
    seconds.toNumber() - timeSinceTimemark
  ]);
  await ethers.provider.send("evm_mine");
};

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.ballot = await this.deployMockLocalContract("FundingCycleBallot");
    this.juiceTerminalDirectory = await this.deployMockLocalContract(
      "JuiceTerminalDirectory"
    );

    // Deploy the contract.
    this.contract = await this.deployContract(contractName, [
      this.juiceTerminalDirectory.address
    ]);

    // Bind the ability to manipulate time to `this`.
    this.fastforward = fastforward;
    this.getTimestamp = getTimestamp;
    this.setTimeMark = setTimeMark;
  });
  beforeEach(async function() {
    // Mark the start time of each test.
    timeMark = await getTimestamp();
  });

  // Test each function.
  describe("configure(...)", shouldBehaveLike.configure);
  describe("tap(...)", shouldBehaveLike.tap);
  describe("getCurrent(...)", shouldBehaveLike.getCurrent);
  describe("getQueued(...)", shouldBehaveLike.getQueued);
  describe("currentBallotState(...)", shouldBehaveLike.currentBallotState);
};
