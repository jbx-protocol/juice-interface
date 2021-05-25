const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const projectId = 0;
const permissionIndexes1 = [0, 7, 77];
const permissionIndexes2 = [1, 7, 58];
const unusedPermissions = [2, 4, 5, 23, 59, 88, 92, 224, 249, 255];

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
  describe("Success cases", () => {
    describe("Set", () => {
      describe("setOperator(...)", () => {
        it("Should set an operator correctly and emit events.", async () => {
          const tx = await contract
            .connect(caller)
            .setOperator(projectId, operator.address, permissionIndexes1);
          const receipt = await tx.wait();

          expect(receipt.confirmations).to.equal(1);

          // Verify events
          expect(receipt.events).to.have.lengthOf(1);

          expect(receipt.events[0])
            .to.have.property("event")
            .that.equals("SetOperator");
        });
      });
      describe("permissions(...)", () => {
        it("Should have stored the correct packed permissions for the operator.", async () => {
          // Get the stored packed permissions value.
          const storedPackedPermissions = await contract.permissions(
            caller.address,
            projectId,
            operator.address
          );

          // Calculate packed value.
          const expectedPackedPermissions = permissionIndexes1.reduce(
            (sum, i) => sum.add(ethers.BigNumber.from(2).pow(i)),
            ethers.BigNumber.from(0)
          );

          // Expect the packed values to match.
          expect(storedPackedPermissions).to.equal(expectedPackedPermissions);
        });
      });
      describe("hasPermission(...) & hasPermissions(...)", () => {
        it("Should report operator as having the correct permissions.", async () => {
          const confirmedStoredHasPermissions = [];

          // The operator should only have the permissions specified.
          await Promise.all(
            [...permissionIndexes1, ...unusedPermissions].map(async i => {
              // Get the stored packed permissions value.
              const storedHasPermission = await contract.hasPermission(
                caller.address,
                projectId,
                operator.address,
                i
              );

              // Expect the permission state to match.
              expect(storedHasPermission).to.be.equal(
                permissionIndexes1.includes(i)
              );

              // Make sure that checking for multiple permissions works.
              const storedHasPermissions = await contract.hasPermissions(
                caller.address,
                projectId,
                operator.address,
                [...confirmedStoredHasPermissions, i]
              );

              // Expect the permissions state to match.
              expect(storedHasPermissions).to.be.equal(
                permissionIndexes1.includes(i)
              );

              // Add the the array if the permissions match.
              if (storedHasPermissions) confirmedStoredHasPermissions.push(i);
            })
          );
        });
      });
    });
    describe("Update", () => {
      before(async () => {
          const tx = await contract
            .connect(caller)
            .setOperator(projectId, operator.address, permissionIndexes2);
          await tx.wait();
      });
      describe("permissions(...)", () => {
        it("Should have stored the updated packed permissions", async () => {
          // Get the stored packed permissions value for operator1.
          const storedPackedPermissions = await contract.permissions(
            caller.address,
            projectId,
            operator.address
          );

          // Calculate expected packed value.
          const expectedPackedPermissions = 
            permissionIndexes2
            .reduce(
              (sum, i) => sum.add(ethers.BigNumber.from(2).pow(i)),
              ethers.BigNumber.from(0)
            );

          // Expect the packed values to match.
          expect(storedPackedPermissions).to.equal(expectedPackedPermissions);
        });
      });
      describe("hasPermission(...) & hasPermissions(...)", () => {
        it("Should report as having the updated permissions", async () => {
          const confirmedStoredHasPermissions = [];

          // The operator should only have the permissions specified.
          await Promise.all(
            [
              ...permissionIndexes1,
              ...permissionIndexes2,
              ...unusedPermissions
            ].map(async i => {
              // Get the stored packed permissions value.
              const storedHasPermission = await contract.hasPermission(
                caller.address,
                projectId,
                operator.address,
                i
              );

              // Expect the permission state to match.
              expect(storedHasPermission).to.be.equal(
                permissionIndexes2.includes(i)
              );

              // Make sure that checking for multiple permissions works.
              const storedHasPermissions = await contract.hasPermissions(
                caller.address,
                projectId,
                operator.address,
                [...confirmedStoredHasPermissions, i]
              );

              // Expect the permissions state to match.
              expect(storedHasPermissions).to.be.equal(
                permissionIndexes2.includes(i)
              );

              // Add the the array if the permissions match.
              if (storedHasPermissions) confirmedStoredHasPermissions.push(i);
            })
          );
        });
      });
    });
    describe("Clear", () => {
      before(async () => {
          const tx = await contract
            .connect(caller)
            .setOperator(projectId, operator.address, []);
          await tx.wait();
      });
      describe("permissions(...)", () => {
        it("Should have stored the nullified packed permissions", async () => {
          // Get the stored packed permissions value for operator1.
          const storedPackedPermissions = await contract.permissions(
            caller.address,
            projectId,
            operator.address
          );

          // Expect 0.
          const expectedPackedPermissions = 0;

          // Expect the packed values to match.
          expect(storedPackedPermissions).to.equal(expectedPackedPermissions);
        });
      });
      describe("hasPermission(...) & hasPermissions(...)", () => {
        it("Should report as having the no permissions", async () => {
          // The operator should only have the permissions specified.
          await Promise.all(
            [
              ...permissionIndexes1,
              ...permissionIndexes2,
              ...unusedPermissions
            ].map(async i => {
              // Get the stored packed permissions value.
              const storedHasPermission = await contract.hasPermission(
                caller.address,
                projectId,
                operator.address,
                i
              );

              // Expect the permission state to always be false.
              expect(storedHasPermission).to.be.equal(false);

              // Make sure that checking for multiple permissions works.
              const storedHasPermissions = await contract.hasPermissions(
                caller.address,
                projectId,
                operator.address,
                [i]
              );

              // Expect the permission state to always be false.
              expect(storedHasPermissions).to.be.equal(false);
            })
          );
        });
      });
    });
  });
  describe("Failure cases", () => {
    it("Should revert if the index is greater than 255.", async () => {
      await expect(
        contract
          .connect(caller)
          .setOperator(projectId, operator.address, [256])
      ).to.be.reverted;
    });
  });
};
