const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const projectId = 0;
const permissionIndexes1 = [0, 7, 77];
const permissionIndexes2 = [77, 3, 58];
const unusedPermissions = [2, 4, 5, 23, 59, 88, 92, 224, 249, 255];

let contract;
let caller;
let operator1;
let operator2;

const contractName = "OperatorStore";

module.exports = () => {
  before(async () => {
    [caller, operator1, operator2] = await ethers.getSigners();
    const contractArtifacts = await ethers.getContractFactory(contractName);
    contract = await contractArtifacts.deploy();
    await contract.deployTransaction.wait();

    // Add operator.
    const tx = await contract
      .connect(caller)
      .addPermissionsToOperator(projectId, operator1.address, [
        ...permissionIndexes1,
        ...permissionIndexes2
      ]);
    await tx.wait();
  });
  describe("Success cases", () => {
    describe("Remove some permissions", async () => {
      describe("removePermissionsFromOperator(...)", () => {
        it("Should remove permissions correctly", async () => {
          const tx = await contract
            .connect(caller)
            .removePermissionsFromOperator(
              caller.address,
              projectId,
              operator1.address,
              permissionIndexes1
            );
          const receipt = await tx.wait();

          expect(receipt.confirmations).to.equal(1);

          // Verify events
          expect(receipt.events).to.have.lengthOf(2);
          expect(receipt.events[0])
            .to.have.property("event")
            .that.equals("SetPackedPermissions");
          expect(receipt.events[1])
            .to.have.property("event")
            .that.equals("RemovePermissionsFromOperator");
        });
        it("Should work if called by the operator being removed", async () => {
          const tx = await contract
            .connect(operator1)
            .removePermissionsFromOperator(
              caller.address,
              projectId,
              operator1.address,
              permissionIndexes1
            );
          const receipt = await tx.wait();
          expect(receipt.confirmations).to.equal(1);
        });
      });
      describe("permissions(...)", () => {
        it("Should have stored the correct packed permissions.", async () => {
          // Get the stored packed permissions value.
          const storedPackedPermissions = await contract.permissions(
            caller.address,
            projectId,
            operator1.address
          );
          // Calculate packed value.
          const expectedPackedPermissions = permissionIndexes2
            // get values not in permissionIndexes1 only.
            .filter(value => !permissionIndexes1.includes(value))
            .reduce(
              (sum, i) => sum.add(ethers.BigNumber.from(2).pow(i)),
              ethers.BigNumber.from(0)
            );
          // Expect the packed values to match.
          expect(storedPackedPermissions).to.equal(expectedPackedPermissions);
        });
      });
      describe("hasPermission(...) & hasPermissions(...)", () => {
        it("Should report as having the correct permissions.", async () => {
          const confirmedStoredHasPermissions = [];

          const uniquePermissionIndexes2 = permissionIndexes2.filter(
            value => !permissionIndexes1.includes(value)
          );

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
                operator1.address,
                i
              );

              // Expect the permission state to match.
              expect(storedHasPermission).to.be.equal(
                // get values not in permissionIndexes1 only.
                uniquePermissionIndexes2.includes(i)
              );

              // Make sure that checking for multiple permissions works.
              const storedHasPermissions = await contract.hasPermissions(
                caller.address,
                projectId,
                operator1.address,
                [...confirmedStoredHasPermissions, i]
              );

              // Expect the permissions state to match.
              expect(storedHasPermissions).to.be.equal(
                uniquePermissionIndexes2.includes(i)
              );

              // Add the the array if the permissions match.
              if (storedHasPermissions) confirmedStoredHasPermissions.push(i);
            })
          );
        });
      });
    });
    describe("Remove all permissions", async () => {
      before(async () => {
        const tx = await contract
          .connect(caller)
          .removePermissionsFromOperator(
            caller.address,
            projectId,
            operator1.address,
            permissionIndexes2
          );
        await tx.wait();
      });
      describe("permissions(...)", () => {
        it("Should have stored the correct packed permissions", async () => {
          // Get the stored packed permissions value.
          const storedPackedPermissions = await contract.permissions(
            caller.address,
            projectId,
            operator1.address
          );
          // Expect the packed values to be zero.
          expect(storedPackedPermissions).to.equal(0);
        });
      });
      describe("hasPermission(...) & hasPermissions(...)", () => {
        it("Should report as having the correct permissions.", async () => {
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
                operator1.address,
                i
              );

              // Expect the permission state to match.
              expect(storedHasPermission).to.be.equal(false);

              // Make sure that checking for multiple permissions works.
              const storedHasPermissions = await contract.hasPermissions(
                caller.address,
                projectId,
                operator1.address,
                [i]
              );

              // Expect the permissions state to match.
              expect(storedHasPermissions).to.be.equal(false);
            })
          );
        });
      });
    });
  });
  describe("Failure cases", () => {
    it("Should revert if caller isnt msg.sender, nor the operator being removed", async () => {
      await expect(
        contract
          .connect(caller)
          .removePermissionsFromOperator(
            operator2.address,
            projectId,
            operator1.address,
            permissionIndexes1
          )
      ).to.be.reverted;
    });
  });
};
