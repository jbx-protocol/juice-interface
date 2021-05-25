const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const projectId = 0;
const permissionIndexes1 = [0, 7, 77];
const permissionIndexes2 = [0, 7, 77];
const unusedPermissions = [2, 4, 5, 23, 59, 88, 92, 224, 249, 255];

let contract;
let caller;
let operator1;

const contractName = "OperatorStore";

module.exports = () => {
  before(async () => {
    [caller, operator1] = await ethers.getSigners();
    const contractArtifacts = await ethers.getContractFactory(contractName);
    contract = await contractArtifacts.deploy();
    await contract.deployTransaction.wait();
  });
  describe("Set packed permissions", () => {
    describe("setPackedPermissions(...)", () => {
      it("Should set permissions correctly.", async () => {
        // Pack the permissions
        const packedPermissions = permissionIndexes1.reduce(
          (sum, i) => sum.add(ethers.BigNumber.from(2).pow(i)),
          ethers.BigNumber.from(0)
        );
        const tx = await contract
          .connect(caller)
          .setPackedPermissions(
            projectId,
            operator1.address,
            packedPermissions
          );
        const receipt = await tx.wait();
        expect(receipt.confirmations).to.equal(1);

        // Verify events
        expect(receipt.events).to.have.lengthOf(1);
        expect(receipt.events[0])
          .to.have.property("event")
          .that.equals("SetPackedPermissions");
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
        const expectedPackedPermissions = permissionIndexes1.reduce(
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
        // The operator should only have the permissions specified.
        await Promise.all(
          [...permissionIndexes1, ...unusedPermissions].map(async i => {
            // Get the stored packed permissions value.
            const storedHasPermission = await contract.hasPermission(
              caller.address,
              projectId,
              operator1.address,
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
              operator1.address,
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
  describe("Update packed permissions", () => {
    before(async () => {
      const packedPermissions = permissionIndexes2.reduce((sum, i) => {
        return sum.add(ethers.BigNumber.from(2).pow(i));
      }, ethers.BigNumber.from(0));
      const tx = await contract
        .connect(caller)
        .setPackedPermissions(projectId, operator1.address, packedPermissions);
      await tx.wait();
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
      const expectedPackedPermissions = permissionIndexes2.reduce(
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
      // The operator should only have the permissions specified.
      await Promise.all(
        [...permissionIndexes2, ...unusedPermissions].map(async i => {
          // Get the stored packed permissions value.
          const storedHasPermission = await contract.hasPermission(
            caller.address,
            projectId,
            operator1.address,
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
            operator1.address,
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
};
