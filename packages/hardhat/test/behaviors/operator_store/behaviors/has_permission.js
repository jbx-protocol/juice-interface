const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "has permission, account is sender",
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
          permissionIndex: 42
        },
        result: true
      })
    },
    {
      description: "has permission, account is not sender",
      fn: ({ deployer, addrs }) => ({
        set: {
          sender: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [7]
        },
        check: {
          sender: addrs[1],
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndex: 7
        },
        result: true
      })
    },
    {
      description: "doesnt have permission, never set",
      fn: ({ deployer, addrs }) => ({
        check: {
          sender: deployer,
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndex: 42
        },
        result: false
      })
    },
    {
      description: "doesnt have permission, indexes differ",
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
          permissionIndex: 42
        },
        result: false
      })
    },
    {
      description: "doesnt have permission, projectId differs",
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
          permissionIndex: 42
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
          permissionIndex: 256
        },
        revert: "OperatorStore::hasPermission: INDEX_OUT_OF_BOUNDS"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { set, check, result } = successTest.fn(this);
        if (set) {
          await this.contract
            .connect(set.sender)
            .setOperator(
              set.projectId,
              set.operator.address,
              set.permissionIndexes
            );
        }
        const flag = await this.contract
          .connect(check.sender)
          .hasPermission(
            check.account.address,
            check.projectId,
            check.operator.address,
            check.permissionIndex
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
            .hasPermission(
              check.account.address,
              check.projectId,
              check.operator.address,
              check.permissionIndex
            )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
