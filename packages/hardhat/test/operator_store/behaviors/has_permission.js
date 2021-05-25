const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const projectId = 0;

let contract;
let caller;
let operator;

const contractName = "OperatorStore";

const permissionIndex = 42;

module.exports = () => {
  before(async () => {
    [caller, operator] = await ethers.getSigners();
    const contractArtifacts = await ethers.getContractFactory(contractName);
    contract = await contractArtifacts.deploy();
    await contract.deployTransaction.wait();
  });
  describe("Check to see if an operator has a permission", () => {
    describe("hasPermissions(...)", () => {
      describe("Success cases", () => {
        describe("hasPermissions(...)", () => {
          it("Should return false if the operator doesn't have permission.", async () => {
            const flag = await contract
              .connect(caller)
              .hasPermission(caller.address, projectId, operator.address, 0);
            expect(flag).to.equal(false);
          });
          it("Should return true if the operator does have permission.", async () => {
            const tx = await contract
              .connect(caller)
              .setOperator(projectId, operator.address, [permissionIndex]);
            await tx.wait();
            const flag = await contract
              .connect(caller)
              .hasPermission(
                caller.address,
                projectId,
                operator.address,
                permissionIndex
              );
            expect(flag).to.equal(true);
          });
        });
      });
      describe("Failure cases", () => {
        it("Should revert if the index is greater than 255.", async () => {
          await expect(
            contract
              .connect(caller)
              .hasPermission(caller.address, projectId, operator.address, 256)
          ).to.be.reverted;
        });
      });
    });
  });
};
