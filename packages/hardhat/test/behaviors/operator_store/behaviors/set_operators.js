const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "set operators, no previously set values",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domains: [1, 2],
        operators: [addrs[0], addrs[1]],
        permissionIndexes: {
          set: [
            [42, 41, 255],
            [4, 255, 3]
          ],
          expect: [
            [42, 41, 255],
            [4, 255, 3]
          ]
        }
      })
    },
    {
      description: "set operators, overriding previously set values",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domains: [1, 1],
        operators: [addrs[0], addrs[1]],
        permissionIndexes: {
          pre: [[33], [23]],
          set: [[42, 41, 255], [3]],
          expect: [[42, 41, 255], [3]]
        }
      })
    },
    {
      description: "set operators, clearing any previously set values",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domains: [0, 1],
        operators: [addrs[0], addrs[1]],
        permissionIndexes: {
          pre: [[33], [33]],
          set: [[], []],
          expect: [[], []]
        }
      })
    },
    {
      description:
        "set operators, with the same operator used for two different projects",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domains: [0, 1],
        operators: [addrs[0], addrs[0]],
        permissionIndexes: {
          set: [
            [42, 41, 255],
            [4, 255, 3]
          ],
          expect: [
            [42, 41, 255],
            [4, 255, 3]
          ]
        }
      })
    },
    {
      description:
        "set operators, with the same operator used for the same project",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domains: [0, 0],
        operators: [addrs[0], addrs[0]],
        permissionIndexes: {
          set: [
            [42, 41, 255],
            [4, 255, 3]
          ],
          expect: [
            [4, 255, 3],
            [4, 255, 3]
          ]
        }
      })
    },
    {
      description: "set only one operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domains: [1],
        operators: [addrs[0]],
        permissionIndexes: {
          set: [[42, 41, 255]],
          expect: [[42, 41, 255]]
        }
      })
    }
  ],
  failure: [
    {
      description: "not enough projects specified",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domains: [1],
        operators: [addrs[0], addrs[1]],
        permissionIndexes: {
          set: [
            [42, 41, 255],
            [4, 255, 3]
          ],
          expect: [
            [42, 41, 255],
            [4, 255, 3]
          ]
        },
        revert: "OperatorStore::setOperators: BAD_ARGS"
      })
    },
    {
      description: "too many projects specified",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domains: [1, 2, 3],
        operators: [addrs[0], addrs[1]],
        permissionIndexes: {
          set: [
            [42, 41, 255],
            [4, 255, 3]
          ],
          expect: [
            [42, 41, 255],
            [4, 255, 3]
          ]
        },
        revert: "OperatorStore::setOperators: BAD_ARGS"
      })
    },
    {
      description: "not enough permission indexes specified",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domains: [1, 2],
        operators: [addrs[0], addrs[1]],
        permissionIndexes: {
          set: [[42, 41, 255]],
          expect: [[42, 41, 255]]
        },
        revert: "OperatorStore::setOperators: BAD_ARGS"
      })
    },
    {
      description: "too many permission indexes specified",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domains: [1, 2],
        operators: [addrs[0], addrs[1]],
        permissionIndexes: {
          set: [
            [42, 41, 255],
            [42, 41, 255],
            [42, 41, 255]
          ],
          expect: [
            [42, 41, 255],
            [42, 41, 255],
            [42, 41, 255]
          ]
        },
        revert: "OperatorStore::setOperators: BAD_ARGS"
      })
    },
    {
      description: "index out of bounds",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        domains: [1, 2],
        operators: [addrs[0], addrs[1]],
        permissionIndexes: {
          set: [
            [42, 41, 256],
            [4, 255, 3]
          ],
          expect: [
            [42, 41, 255],
            [4, 255, 3]
          ]
        },
        revert: "OperatorStore::_packedPermissions: INDEX_OUT_OF_BOUNDS"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const {
          caller,
          domains,
          operators,
          permissionIndexes
        } = successTest.fn(this);

        // If specified, pre-set an operator before the rest of the test.
        if (permissionIndexes.pre) {
          await this.contract.connect(caller).setOperators(
            operators.map(o => o.address),
            domains,
            permissionIndexes.pre
          );
        }

        // Execute the transaction
        const tx = await this.contract.connect(caller).setOperators(
          operators.map(o => o.address),
          domains,
          permissionIndexes.set
        );

        // For each operator...
        await Promise.all(
          operators.map(async (operator, i) => {
            // Calculate the expected packed values once the permissions are set.
            const expectedPackedPermissions = permissionIndexes.expect[
              i
            ].reduce(
              (sum, index) => sum.add(ethers.BigNumber.from(2).pow(index)),
              ethers.BigNumber.from(0)
            );

            // Expect an event to be emitted.
            expect(tx)
              .to.emit(this.contract, "SetOperator")
              .withArgs(
                operator.address,
                caller.address,
                domains[i],
                permissionIndexes.expect[i],
                expectedPackedPermissions
              );

            // Get the stored packed permissions values.
            const storedPackedPermissions = await this.contract.permissionsOf(
              operator.address,
              caller.address,
              domains[i]
            );
            // Expect the packed values to match.
            expect(storedPackedPermissions).to.equal(expectedPackedPermissions);
          })
        );
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          domains,
          operators,
          permissionIndexes,
          revert
        } = failureTest.fn(this);
        await expect(
          this.contract.connect(caller).setOperators(
            operators.map(o => o.address),
            domains,
            permissionIndexes.set
          )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
