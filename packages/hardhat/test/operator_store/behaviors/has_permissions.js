const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const projectId = 0;

let contract;
let caller;
let operator;

const contractName = "OperatorStore";

module.exports = () => {
  before(async () => {
    [caller, operator] = await ethers.getSigners();
    const contractArtifacts = await ethers.getContractFactory(contractName);
    contract = await contractArtifacts.deploy();
    await contract.deployTransaction.wait();
  });
  describe("Check to see if an operator has permissions", () => {
    describe("Success cases", () => {
      describe("hasPermissions(...)", () => {
        it("Should return false if the operator doesn't have permission.", async () => {
          const flag = await contract
            .connect(caller)
            .hasPermissions(caller.address, projectId, operator.address, [0]);
          expect(flag).to.equal(false);
        });
      });
    });
    describe("Failure cases", () => {
      describe("hasPermissions(...)", () => {
        it("Should revert if an index is greater than 255.", async () => {
          await expect(
            contract
              .connect(caller)
              .hasPermissions(caller.address, projectId, operator.address, [
                256
              ])
          ).to.be.reverted;
        });
      });
    });
  });
};
