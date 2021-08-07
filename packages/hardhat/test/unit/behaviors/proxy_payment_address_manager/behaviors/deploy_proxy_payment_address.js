const {
  ethers: { constants },
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "deploy one proxy payment address",
      fn: ({ deployer }) => ({
        caller: deployer,
        ops: [
          {
            projectId: 1,
            memo: "some-memo",
          },
        ],
        expectations: [
          {
            projectId: 1,
            memos: ["some-memo"],
          },
        ],
      }),
    },
  ],
  failure: [
    {
      description: "zero project",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 0,
        memo: "some-memo",
        revert: "ProxyPaymentAddressManager::deploy: ZERO_PROJECT",
      }),
    },
  ],
};

module.exports = function () {
  describe("Success cases", function () {
    tests.success.forEach(function (successTest) {
      it(successTest.description, async function () {
        const { caller, ops } = successTest.fn(this);

        await Promise.all(
          ops.map(async (op) => {
            // Execute the transaction.
            const tx = await this.contract
              .connect(caller)
              .deploy(op.projectId, op.memo);

            // Expect an event to have been emitted.
            await expect(tx)
              .to.emit(this.contract, "Deploy")
              .withArgs(op.projectId, op.memo, caller.address);
          })
        );
      });
    });
  });
  describe("Failure cases", function () {
    tests.failure.forEach(function (failureTest) {
      it(failureTest.description, async function () {
        const { caller, projectId, memo, revert } = failureTest.fn(this);

        await expect(
          this.contract.connect(caller).deploy(projectId, memo)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
