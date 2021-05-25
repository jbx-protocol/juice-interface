const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const projectId = 0;

let contract;
let caller;
let operator;

const contractName = "OperatorStore";

const permissionIndexes = [7, 42];

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
        it("Should return false if the operator doesn't have permissions.", async () => {
          const flag = await contract
            .connect(caller)
            .hasPermissions(caller.address, projectId, operator.address, [0]);
          expect(flag).to.equal(false);
        });
        it("Should return true if the operator does have permissions.", async () => {
          const tx = await contract
            .connect(caller)
            .setOperator(projectId, operator.address, permissionIndexes);
          await tx.wait();
          const flag = await contract
            .connect(caller)
            .hasPermissions(
              caller.address,
              projectId,
              operator.address,
              permissionIndexes
            );
          expect(flag).to.equal(true);
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
          ).to.be.revertedWith("OperatorStore::hasPermissions: BAD_INDEX");
        });
      });
    });
  });
};
