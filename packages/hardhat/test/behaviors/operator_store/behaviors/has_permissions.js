const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "has permissions, account is caller",
      fn: ({ deployer, addrs }) => ({
        set: {
          caller: deployer,
          domain: 1,
          operator: addrs[0],
          permissionIndexes: [42, 41, 255]
        },
        check: {
          caller: deployer,
          account: deployer,
          domain: 1,
          operator: addrs[0],
          permissionIndexes: [42, 41]
        },
        result: true
      })
    },
    {
      description: "has permissions, account is not caller",
      fn: ({ deployer, addrs }) => ({
        set: {
          caller: deployer,
          domain: 1,
          operator: addrs[0],
          permissionIndexes: [7, 8, 9]
        },
        check: {
          caller: addrs[1],
          account: deployer,
          domain: 1,
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
          caller: deployer,
          account: deployer,
          domain: 1,
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
          caller: deployer,
          domain: 1,
          operator: addrs[0],
          permissionIndexes: [1, 2, 3]
        },
        check: {
          caller: deployer,
          account: deployer,
          domain: 1,
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
          caller: deployer,
          domain: 1,
          operator: addrs[0],
          permissionIndexes: [1, 2, 3]
        },
        check: {
          caller: deployer,
          account: deployer,
          domain: 1,
          operator: addrs[0],
          permissionIndexes: [1, 42]
        },
        result: false
      })
    },
    {
      description: "doesnt have permissions, domain differs",
      fn: ({ deployer, addrs }) => ({
        set: {
          caller: deployer,
          domain: 1,
          operator: addrs[0],
          permissionIndexes: [42]
        },
        check: {
          caller: deployer,
          account: deployer,
          domain: 0,
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
          caller: deployer,
          account: deployer,
          domain: 0,
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
            .connect(set.caller)
            .setOperator(
              set.operator.address,
              set.domain,
              set.permissionIndexes
            );
        }

        // Check for permissions.
        const flag = await this.contract
          .connect(check.caller)
          .hasPermissions(
            check.operator.address,
            check.account.address,
            check.domain,
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
            .connect(check.caller)
            .hasPermissions(
              check.operator.address,
              check.account.address,
              check.domain,
              check.permissionIndexes
            )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
