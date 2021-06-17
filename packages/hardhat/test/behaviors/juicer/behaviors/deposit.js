const { expect } = require("chai");
const { BigNumber } = require("ethers");

const tests = {
  success: [
    {
      description: "deposits with no target",
      fn: ({ deployer, governance }) => ({
        caller: deployer,
        governance,
        setup: {
          addToBalance: BigNumber.from(1)
        }
      })
    },
    {
      description: "deposits with target",
      fn: ({ deployer, governance }) => ({
        caller: deployer,
        governance,
        setup: {
          addToBalance: BigNumber.from(69),
          targetLocalWei: BigNumber.from(42)
        }
      })
    }
  ],
  failure: [
    {
      description: "no yielder",
      fn: ({ deployer, governance }) => ({
        caller: deployer,
        governance,
        setup: {
          addYielder: false
        },
        revert: "Juicer::deposit: NOT_FOUND"
      })
    },
    {
      description: "insufficient funds",
      fn: ({ deployer, governance }) => ({
        caller: deployer,
        governance,
        setup: {
          addToBalance: BigNumber.from(1),
          targetLocalWei: BigNumber.from(2)
        },
        revert: "Juicer::deposit: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "no op",
      fn: ({ deployer, governance }) => ({
        caller: deployer,
        governance,
        setup: {
          addToBalance: BigNumber.from(1),
          targetLocalWei: BigNumber.from(1)
        },
        revert: "Juicer::deposit: NO_OP"
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
          governance,
          setup: {
            addToBalance = BigNumber.from(0),
            targetLocalWei = BigNumber.from(0)
          } = {}
        } = await successTest.fn(this);

        // Set a yielder.
        const yielder = await this.deployMockLocalContract("ExampleYielder");
        await this.contract.connect(governance).setYielder(yielder.address);
        // Set a mock for the deposit function of the yielder.
        await yielder.mock.deposit.returns();
        // Add a balance to the contract.
        await this.contract.connect(caller).addToBalance(72, {
          value: addToBalance
        });
        // Add a target local eth to the contract.
        await this.contract
          .connect(governance)
          .setTargetLocalWei(targetLocalWei);

        // Execute the transaction.
        const tx = await this.contract.connect(caller).deposit();

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Deposit")
          .withArgs(addToBalance.sub(targetLocalWei));

        // Get the stored allowed value.
        const storedBalance = await this.contract.provider.getBalance(
          this.contract.address
        );

        // Expect the stored value to equal whats expected.
        expect(storedBalance).to.equal(targetLocalWei);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          governance,
          setup: {
            addYielder = true,
            addToBalance = BigNumber.from(0),
            targetLocalWei = BigNumber.from(0)
          } = {},
          revert
        } = failureTest.fn(this);

        if (addYielder) {
          const yielder = await this.deployMockLocalContract("ExampleYielder");
          await this.contract.connect(governance).setYielder(yielder.address);
          await yielder.mock.deposit.returns();
          if (targetLocalWei.gt(addToBalance)) {
            await yielder.mock.withdraw
              .withArgs(targetLocalWei.sub(addToBalance), this.contract.address)
              .returns();
          }
          await yielder.mock.deposited.returns(0);
          await yielder.mock.getCurrentBalance.returns(0);
        }
        await this.contract.connect(caller).addToBalance(72, {
          value: addToBalance
        });
        await this.contract
          .connect(governance)
          .setTargetLocalWei(targetLocalWei);

        await expect(
          this.contract.connect(caller).deposit()
        ).to.be.revertedWith(revert);
      });
    });
  });
};
