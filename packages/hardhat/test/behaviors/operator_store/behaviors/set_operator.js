const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      it: "set operator, no previously set value",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectId: 1,
        operator: addrs[0],
        permissionIndexes: {
          set: [42, 41, 255]
        }
      })
    },
    {
      it: "set operator, overriding previously set value",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectId: 1,
        operator: addrs[0],
        permissionIndexes: {
          pre: [33],
          set: [42, 41, 255]
        }
      })
    },
    {
      it: "set operator, clearing any previously set value",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectId: 1,
        operator: addrs[0],
        permissionIndexes: {
          pre: [33],
          set: []
        }
      })
    }
  ],
  failure: [
    {
      it: "index out of bounds",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectId: 0,
        operator: addrs[0],
        permissionIndexes: [256],
        revert: "OperatorStore::_packedPermissions: INDEX_OUT_OF_BOUNDS"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.it, async function() {
        const {
          sender,
          projectId,
          operator,
          permissionIndexes
        } = successTest.fn(this);

        if (permissionIndexes.pre) {
          await this.contract
            .connect(sender)
            .setOperator(projectId, operator.address, permissionIndexes.pre);
        }

        // Calculate packed value.
        const expectedPackedPermissions = permissionIndexes.set.reduce(
          (sum, i) => sum.add(ethers.BigNumber.from(2).pow(i)),
          ethers.BigNumber.from(0)
        );

        await expect(
          this.contract
            .connect(sender)
            .setOperator(projectId, operator.address, permissionIndexes.set)
        )
          .to.emit(this.contract, "SetOperator")
          .withArgs(
            sender.address,
            projectId,
            operator.address,
            permissionIndexes.set,
            expectedPackedPermissions
          );

        // Get the stored packed permissions value.
        const storedPackedPermissions = await this.contract.permissions(
          sender.address,
          projectId,
          operator.address
        );

        // Expect the packed values to match.
        expect(storedPackedPermissions).to.equal(expectedPackedPermissions);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.it, async function() {
        const {
          sender,
          projectId,
          operator,
          permissionIndexes,
          revert
        } = failureTest.fn(this);
        await expect(
          this.contract
            .connect(sender)
            .setOperator(projectId, operator.address, permissionIndexes)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
