const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const tests = {
  success: [
    {
      it: "has permissions, account is sender",
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
      it: "has permissions, account is not sender",
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
      it: "doesnt have permissions, never set",
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
      it: "doesnt have permission, all indexes differ",
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
      it: "doesnt have permission, some indexes differ",
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
      it: "doesnt have permissions, projectId differs",
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
      it: "index out of bounds",
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
  describe("Check to see if an operator has permissions", function() {
    describe("Success cases", function() {
      tests.success.forEach(function(successTest) {
        it(successTest.it, async function() {
          const { set, check, result } = successTest.fn(this);
          if (set) {
            const tx = await this.contract
              .connect(set.sender)
              .setOperator(
                set.projectId,
                set.operator.address,
                set.permissionIndexes
              );
            await tx.wait();
          }
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
        it(failureTest.it, async function() {
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
  });
};

// const { ethers } = require("hardhat");
// const { use, expect } = require("chai");
// const { solidity } = require("ethereum-waffle");

// use(solidity);

// const projectId = 0;

// let contract;
// let caller;
// let operator;

// const contractName = "OperatorStore";

// const permissionIndexes = [7, 42];

// module.exports = () => {
//   before(async () => {
//     [caller, operator] = await ethers.getSigners();
//     const contractArtifacts = await ethers.getContractFactory(contractName);
//     contract = await contractArtifacts.deploy();
//     await contract.deployTransaction.wait();
//   });
//   describe("Check to see if an operator has permissions", () => {
//     describe("Success cases", () => {
//       describe("hasPermissions(...)", () => {
//         it("Should return false if the operator doesn't have permissions.", async () => {
//           const flag = await contract
//             .connect(caller)
//             .hasPermissions(caller.address, projectId, operator.address, [0]);
//           expect(flag).to.equal(false);
//         });
//         it("Should return true if the operator does have permissions.", async () => {
//           const tx = await contract
//             .connect(caller)
//             .setOperator(projectId, operator.address, permissionIndexes);
//           await tx.wait();
//           const flag = await contract
//             .connect(caller)
//             .hasPermissions(
//               caller.address,
//               projectId,
//               operator.address,
//               permissionIndexes
//             );
//           expect(flag).to.equal(true);
//         });
//       });
//     });
//     describe("Failure cases", () => {
//       describe("hasPermissions(...)", () => {
//         it("Should revert if an index is greater than 255.", async () => {
//           await expect(
//             contract
//               .connect(caller)
//               .hasPermissions(caller.address, projectId, operator.address, [
//                 256
//               ])
//           ).to.be.revertedWith("OperatorStore::hasPermissions: BAD_INDEX");
//         });
//       });
//     });
//   });
// };
