const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "sets operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        operator: addrs[0].address,
        permissionIndexes: [1]
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ addrs }) => ({
        caller: addrs[0].address,
        projectId: 1,
        operator: addrs[0].address,
        permissionIndexes: [1],
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
          projectId,
          operator,
          permissionIndexes
        } = successTest.fn(this);

        const operatorStore = await this.deployMockLocalContractFn(
          "OperatorStore"
        );

        await operatorStore.mock.setOperator
          .withArgs(operator, projectId, permissionIndexes)
          .returns();

        // Execute the transaction.
        await this.contract
          .connect(caller)
          .setOperator(
            operatorStore.address,
            operator,
            projectId,
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
          projectId,
          operator,
          permissionIndexes,
          revert
        } = failureTest.fn(this);

        const operatorStore = await this.deployMockLocalContractFn(
          "OperatorStore"
        );

        await operatorStore.mock.setOperator
          .withArgs(operator, projectId, permissionIndexes)
          .returns();

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .setOperator(
              operatorStore.address,
              operator,
              projectId,
              permissionIndexes
            )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
