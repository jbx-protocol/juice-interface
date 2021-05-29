const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "has permissions, account is sender",
      fn: ({ deployer, addrs }) => ({
        set: {
          sender: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42, 41, 255]
        },
        check: {
          sender: deployer,
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42, 41]
        },
        result: true
      })
    },
    {
      description: "has permissions, account is not sender",
      fn: ({ deployer, addrs }) => ({
        set: {
          sender: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [7, 8, 9]
        },
        check: {
          sender: addrs[1],
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [7]
        },
        result: true
      })
    },
    {
      description: "doesnt have permissions, never set",
      fn: ({ deployer, addrs }) => ({
        check: {
          sender: deployer,
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42]
        },
        result: false
      })
    },
    {
      description: "doesnt have permission, all indexes differ",
      fn: ({ deployer, addrs }) => ({
        set: {
          sender: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [1, 2, 3]
        },
        check: {
          sender: deployer,
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42]
        },
        result: false
      })
    },
    {
      description: "doesnt have permission, some indexes differ",
      fn: ({ deployer, addrs }) => ({
        set: {
          sender: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [1, 2, 3]
        },
        check: {
          sender: deployer,
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [1, 42]
        },
        result: false
      })
    },
    {
      description: "doesnt have permissions, projectId differs",
      fn: ({ deployer, addrs }) => ({
        set: {
          sender: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42]
        },
        check: {
          sender: deployer,
          account: deployer,
          projectId: 0,
          operator: addrs[0],
          permissionIndexes: [42]
        },
        result: false
      })
    }
  ],
  failure: [
    {
      description: "index out of bounds",
      fn: ({ deployer, addrs }) => ({
        check: {
          sender: deployer,
          account: deployer,
          projectId: 0,
          operator: addrs[0],
          permissionIndexes: [256]
        },
        revert: "OperatorStore::hasPermissions: INDEX_OUT_OF_BOUNDS"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { set, check, result } = successTest.fn(this);

        // If specified, set an operator before the rest of the test.
        if (set) {
          await this.contract
            .connect(set.sender)
            .setOperator(
              set.projectId,
              set.operator.address,
              set.permissionIndexes
            );
        }

        // Check for permissions.
        const flag = await this.contract
          .connect(check.sender)
          .hasPermissions(
            check.account.address,
            check.projectId,
            check.operator.address,
            check.permissionIndexes
          );
        expect(flag).to.equal(result);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { check, revert } = failureTest.fn(this);
        await expect(
          this.contract
            .connect(check.sender)
            .hasPermissions(
              check.account.address,
              check.projectId,
              check.operator.address,
              check.permissionIndexes
            )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
