const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "set operators",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectIds: [1, 2, 3],
        operators: [addrs[0].address, addrs[1].address, addrs[2].address],
        permissionIndexes: [[1], [2], [3]]
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ addrs }) => ({
        caller: addrs[0].address,
        projectIds: [1, 2, 3],
        operators: [addrs[0].address, addrs[1].address, addrs[2].address],
        permissionIndexes: [[1], [2], [3]],
        revert: "Ownable: caller is not the owner"
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
          projectIds,
          operators,
          permissionIndexes
        } = successTest.fn(this);

        const operatorStore = await this.deployMockLocalContractFn(
          "OperatorStore"
        );

        await operatorStore.mock.setOperators
          .withArgs(operators, projectIds, permissionIndexes)
          .returns();

        // Execute the transaction.
        await this.contract
          .connect(caller)
          .setOperators(
            operatorStore.address,
            operators,
            projectIds,
            permissionIndexes
          );
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          projectIds,
          operators,
          permissionIndexes,
          revert
        } = failureTest.fn(this);

        const operatorStore = await this.deployMockLocalContractFn(
          "OperatorStore"
        );

        await operatorStore.mock.setOperators
          .withArgs(operators, projectIds, permissionIndexes)
          .returns();

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .setOperators(
              operatorStore.address,
              operators,
              projectIds,
              permissionIndexes
            )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
