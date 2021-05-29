const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      it: "set operators, no previously set values",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectIds: [1, 2],
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
      it: "set operators, overriding previously set values",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectIds: [1, 1],
        operators: [addrs[0], addrs[1]],
        permissionIndexes: {
          pre: [[33], [23]],
          set: [[42, 41, 255], [3]],
          expect: [[42, 41, 255], [3]]
        }
      })
    },
    {
      it: "set operators, clearing any previously set values",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectIds: [0, 1],
        operators: [addrs[0], addrs[1]],
        permissionIndexes: {
          pre: [[33], [33]],
          set: [[], []],
          expect: [[], []]
        }
      })
    },
    {
      it:
        "set operators, with the same operator used for two different projects",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectIds: [0, 1],
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
      it: "set operators, with the same operator used for the same project",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectIds: [0, 0],
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
    }
  ],
  failure: [
    {
      it: "not enough projects specified",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectIds: [1],
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
      it: "not enough permission indexes specified",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectIds: [1, 2],
        operators: [addrs[0], addrs[1]],
        permissionIndexes: {
          set: [[42, 41, 255]],
          expect: [[42, 41, 255]]
        },
        revert: "OperatorStore::setOperators: BAD_ARGS"
      })
    },
    {
      it: "index out of bounds",
      fn: ({ deployer, addrs }) => ({
        sender: deployer,
        projectIds: [1, 2],
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
      it(successTest.it, async function() {
        const {
          sender,
          projectIds,
          operators,
          permissionIndexes
        } = successTest.fn(this);

        if (permissionIndexes.pre) {
          await this.contract.connect(sender).setOperators(
            projectIds,
            operators.map(o => o.address),
            permissionIndexes.pre
          );
        }

        // Calculate packed value.
        const expectedPackedPermissions = permissionIndexes.expect.map(p =>
          p.reduce(
            (sum, i) => sum.add(ethers.BigNumber.from(2).pow(i)),
            ethers.BigNumber.from(0)
          )
        );

        await expect(
          this.contract.connect(sender).setOperators(
            projectIds,
            operators.map(o => o.address),
            permissionIndexes.set
          )
        )
          .to.emit(this.contract, "SetOperator")
          .withArgs(
            sender.address,
            projectIds[0],
            operators[0].address,
            permissionIndexes.expect[0],
            expectedPackedPermissions[0]
          )
          .and.to.emit(this.contract, "SetOperator")
          .withArgs(
            sender.address,
            projectIds[1],
            operators[1].address,
            permissionIndexes.expect[1],
            expectedPackedPermissions[1]
          );

        // Get the stored packed permissions value.
        const storedPackedPermissions0 = await this.contract.permissions(
          sender.address,
          projectIds[0],
          operators[0].address
        );
        const storedPackedPermissions1 = await this.contract.permissions(
          sender.address,
          projectIds[1],
          operators[1].address
        );

        // Expect the packed values to match.
        expect(storedPackedPermissions0).to.equal(expectedPackedPermissions[0]);
        expect(storedPackedPermissions1).to.equal(expectedPackedPermissions[1]);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.it, async function() {
        const {
          sender,
          projectIds,
          operators,
          permissionIndexes,
          revert
        } = failureTest.fn(this);
        await expect(
          this.contract.connect(sender).setOperators(
            projectIds,
            operators.map(o => o.address),
            permissionIndexes.set
          )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
