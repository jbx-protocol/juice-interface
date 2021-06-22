const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "set operator, no previously set value",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domain: 1,
        operator: addrs[0],
        permissionIndexes: {
          set: [42, 41, 255]
        }
      })
    },
    {
      description: "set operator, overriding previously set value",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domain: 1,
        operator: addrs[0],
        permissionIndexes: {
          pre: [33],
          set: [42, 41, 255]
        }
      })
    },
    {
      description: "set operator, clearing any previously set value",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domain: 1,
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
      description: "index out of bounds",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domain: 0,
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
      it(successTest.description, async function() {
        const { caller, domain, operator, permissionIndexes } = successTest.fn(
          this
        );

        // If specified, pre-set an operator before the rest of the test.
        if (permissionIndexes.pre) {
          await this.contract
            .connect(caller)
            .setOperator(operator.address, domain, permissionIndexes.pre);
        }

        // Calculate the expected packed value once the permissions are set.
        const expectedPackedPermissions = permissionIndexes.set.reduce(
          (sum, i) => sum.add(ethers.BigNumber.from(2).pow(i)),
          ethers.BigNumber.from(0)
        );

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .setOperator(operator.address, domain, permissionIndexes.set);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "SetOperator")
          .withArgs(
            operator.address,
            caller.address,
            domain,
            permissionIndexes.set,
            expectedPackedPermissions
          );

        // Get the stored packed permissions value.
        const storedPackedPermissions = await this.contract.permissionsOf(
          operator.address,
          caller.address,
          domain
        );

        // Expect the packed values to match.
        expect(storedPackedPermissions).to.equal(expectedPackedPermissions);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          domain,
          operator,
          permissionIndexes,
          revert
        } = failureTest.fn(this);
        await expect(
          this.contract
            .connect(caller)
            .setOperator(operator.address, domain, permissionIndexes)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
