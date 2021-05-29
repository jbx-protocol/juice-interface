const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "has permission, account is caller",
      fn: ({ deployer, addrs }) => ({
        set: {
          caller: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42, 41, 255]
        },
        check: {
          caller: deployer,
          account: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndex: 42
        },
        result: true
      })
    },
    {
      description: "has permission, account is not caller",
      fn: ({ deployer, addrs }) => ({
        set: {
          caller: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [7]
        },
        check: {
          caller: addrs[1],
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
          caller: deployer,
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
          caller: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [1, 2, 3]
        },
        check: {
          caller: deployer,
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
          caller: deployer,
          projectId: 1,
          operator: addrs[0],
          permissionIndexes: [42]
        },
        check: {
          caller: deployer,
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
          caller: deployer,
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

        // If specified, set an operator before the rest of the test.
        if (set) {
          await this.contract
            .connect(set.caller)
            .setOperator(
              set.projectId,
              set.operator.address,
              set.permissionIndexes
            );
        }

        // Check for permissions.
        const flag = await this.contract
          .connect(check.caller)
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
            .connect(check.caller)
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
