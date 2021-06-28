const {
  ethers: { utils }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "transfers ownership",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        newOwner: addrs[0].address,
        projectId: 1
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ addrs }) => ({
        caller: addrs[0].address,
        newOwner: addrs[0].address,
        projectId: 1,
        revert: "Ownable: caller is not the owner"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, newOwner, projectId } = successTest.fn(this);

        const operatorStore = await this.deployMockLocalContractFn(
          "OperatorStore"
        );
        const projects = await this.deployMockLocalContractFn("Projects", [
          operatorStore.address
        ]);

        const data = utils.formatBytes32String("some-data");

        await projects.mock.safeTransferFrom
          .withArgs(this.contract.address, newOwner, projectId, data)
          .returns();

        // Execute the transaction.
        await this.contract
          .connect(caller)
          .transferProjectOwnership(
            projects.address,
            newOwner,
            projectId,
            data
          );
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, newOwner, projectId, revert } = failureTest.fn(this);

        const operatorStore = await this.deployMockLocalContractFn(
          "OperatorStore"
        );
        const projects = await this.deployMockLocalContractFn("Projects", [
          operatorStore.address
        ]);

        const data = utils.formatBytes32String("some-data");

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .transferProjectOwnership(
              projects.address,
              newOwner,
              projectId,
              data
            )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
