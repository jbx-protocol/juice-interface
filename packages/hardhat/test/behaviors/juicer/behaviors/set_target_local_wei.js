const {
  ethers: { BigNumber }
} = require("hardhat");

const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "set with no yielder",
      fn: ({ governance }) => ({
        caller: governance,
        amount: BigNumber.from(1)
      })
    },
    {
      description: "with yielder, enough balance",
      fn: ({ governance }) => ({
        caller: governance,
        amount: BigNumber.from(1),
        setup: {
          addYielder: true,
          addToBalance: BigNumber.from(1)
        }
      })
    },
    {
      description: "with yielder, withdrawing whats necessary",
      fn: ({ governance }) => ({
        caller: governance,
        amount: BigNumber.from(2),
        setup: {
          addYielder: true,
          addToBalance: BigNumber.from(1)
        },
        expectation: {
          withdraw: BigNumber.from(1)
        }
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer }) => ({
        caller: deployer,
        amount: BigNumber.from(1),
        revert: "Juicer: UNAUTHORIZED"
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
          amount,
          setup: { addYielder, addToBalance } = {},
          expectation: { withdraw } = {}
        } = successTest.fn(this);
        if (addYielder) {
          const yielder = await this.deployMockLocalContract("ExampleYielder");
          await this.contract.connect(caller).setYielder(yielder.address);
          if (withdraw) {
            await yielder.mock.withdraw
              .withArgs(withdraw, this.contract.address)
              .returns();
          }
          if (addToBalance) {
            await yielder.mock.deposited.returns(0);
            await yielder.mock.getCurrentBalance.returns(0);
            await this.contract.addToBalance(1, { value: addToBalance });
          }
        }
        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .setTargetLocalWei(amount);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "SetTargetLocalWei")
          .withArgs(amount);

        // Get the stored target value.
        const storedTargetLocalWei = await this.contract.targetLocalETH();

        // Expect the stored value to equal whats expected.
        expect(storedTargetLocalWei).to.equal(amount);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, amount, revert } = failureTest.fn(this);

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).setTargetLocalWei(amount)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
