const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "sets project ID",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1234
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ addrs }) => ({
        caller: addrs[0].address,
        projectId: 1234,
        revert: "Ownable: caller is not the owner"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, projectId } = successTest.fn(this);

        // Execute the transaction.
        await this.contract.connect(caller).setProjectId(projectId);

        // Get the stored project ID.
        const storedProjectId = await this.contract.projectId();

        // Expect the stored values to match.
        expect(storedProjectId).to.equal(projectId);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, projectId, revert } = failureTest.fn(this);

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).setProjectId(projectId)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
