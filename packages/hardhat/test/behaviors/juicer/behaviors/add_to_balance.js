const {
  ethers: { BigNumber }
} = require("hardhat");

const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "add with no preset balance",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        amount: BigNumber.from(1),
        expectation: {
          projectBalance: BigNumber.from(1)
        }
      })
    },
    {
      description: "add with preset balance",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        amount: BigNumber.from(1),
        setup: {
          addToBalance: BigNumber.from(1)
        },
        expectation: {
          projectBalance: BigNumber.from(2)
        }
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
          amount,
          setup: { addToBalance } = {},
          expectation: { projectBalance, totalBalanceWithoutYield } = {}
        } = await successTest.fn(this);
        if (addToBalance) {
          await this.contract
            .connect(caller)
            .addToBalance(projectId, { value: addToBalance });
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .addToBalance(projectId, { value: amount });

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "AddToBalance")
          .withArgs(projectId, amount, caller.address);

        // Get the stored balance.
        const storedBalanceOf = await this.contract.balanceOf(projectId);

        // Get the total stored balance.
        const storedBalance = await this.contract.balance();

        // Expect the stored value to equal whats expected.
        expect(storedBalanceOf).to.equal(projectBalance);

        // Expect the stored value to equal whats expected.
        expect(storedBalance.amountWithoutYield).to.equal(
          totalBalanceWithoutYield
        );
      });
    });
  });
};
