const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const projectId1 = 0;
const projectId2 = 1;
const permissionIndexes1 = [0, 7, 77];
const permissionIndexes2 = [1, 7, 58];
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

    // Add some permissions.
    const tx = await contract
      .connect(caller)
      .addPermission(projectId1, operator1.address, permissionIndexes2);

    await tx.wait();
  });
  describe("addPermissions(...)", () => {
    it("Should add operators correctly", async () => {
      const tx = await contract
        .connect(caller)
        .addPermissions(
          [projectId1, projectId2],
          [operator1.address, operator2.address],
          [permissionIndexes1, permissionIndexes2]
        );
      const receipt = await tx.wait();

      // Verify events
      expect(receipt.events).to.have.lengthOf(3);
      expect(receipt.events[0])
        .to.have.property("event")
        .that.equals("SetPackedPermissions");

      expect(receipt.events[1])
        .to.have.property("event")
        .that.equals("SetPackedPermissions");

      expect(receipt.events[2])
        .to.have.property("event")
        .that.equals("AddPermissions");
    });
  });
  describe("permissions(...)", () => {
    it("Should have stored the correct packed permissions", async () => {
      // Get the stored packed permissions value for operator1.
      const storedPackedPermissions1 = await contract.permissions(
        caller.address,
        projectId1,
        operator1.address
      );

      // Get the stored packed permissions value for operator2.
      const storedPackedPermissions2 = await contract.permissions(
        caller.address,
        projectId2,
        operator2.address
      );

      // Calculate expected packed value.
      const expectedPackedPermissions1 = [
        ...permissionIndexes1,
        ...permissionIndexes2
      ]
        // get unique values only.
        .filter((v, i, a) => a.indexOf(v) === i)
        .reduce(
          (sum, i) => sum.add(ethers.BigNumber.from(2).pow(i)),
          ethers.BigNumber.from(0)
        );

      // Calculate expected packed value.
      const expectedPackedPermissions2 = permissionIndexes2.reduce(
        (sum, i) => sum.add(ethers.BigNumber.from(2).pow(i)),
        ethers.BigNumber.from(0)
      );

      // Expect the packed values to match.
      expect(storedPackedPermissions1).to.equal(expectedPackedPermissions1);
      expect(storedPackedPermissions2).to.equal(expectedPackedPermissions2);
    });
  });
  describe("hasPermission(...) & hasPermissions(...)", () => {
    it("Should report as having the correct permissions", async () => {
      const confirmedStoredHasPermissions1 = [];
      const confirmedStoredHasPermissions2 = [];

      // The operator should only have the permissions specified.
      await Promise.all(
        [
          ...permissionIndexes1,
          ...permissionIndexes2,
          ...unusedPermissions
        ].map(async i => {
          // Get the stored packed permissions value.
          const storedHasPermission1 = await contract.hasPermission(
            caller.address,
            projectId1,
            operator1.address,
            i
          );
          const storedHasPermission2 = await contract.hasPermission(
            caller.address,
            projectId2,
            operator2.address,
            i
          );

          // Expect the permission state to match.
          expect(storedHasPermission1).to.be.equal(
            [...permissionIndexes1, ...permissionIndexes2].includes(i)
          );
          expect(storedHasPermission2).to.be.equal(
            permissionIndexes2.includes(i)
          );

          // Make sure that checking for multiple permissions works.
          const storedHasPermissions1 = await contract.hasPermissions(
            caller.address,
            projectId1,
            operator1.address,
            [...confirmedStoredHasPermissions1, i]
          );
          const storedHasPermissions2 = await contract.hasPermissions(
            caller.address,
            projectId2,
            operator2.address,
            [...confirmedStoredHasPermissions2, i]
          );

          // Expect the permissions state to match.
          expect(storedHasPermissions1).to.be.equal(
            [...permissionIndexes1, ...permissionIndexes2].includes(i)
          );
          expect(storedHasPermissions2).to.be.equal(
            permissionIndexes2.includes(i)
          );

          // Add the the array if the permissions match.
          if (storedHasPermissions1) confirmedStoredHasPermissions1.push(i);
          if (storedHasPermissions2) confirmedStoredHasPermissions2.push(i);
        })
      );
    });
  });
};
