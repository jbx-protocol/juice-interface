const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "withdraws",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        beneficiary: addrs[0].address,
        value: 1234
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ addrs }) => ({
        caller: addrs[0].address,
        beneficiary: addrs[0].address,
        value: 1234,
        revert: "Ownable: caller is not the owner"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, beneficiary, value } = successTest.fn(this);

        await caller.sendTransaction({
          to: this.contract.address,
          value
        });

        // Expect the stored values to match.
        const preBalance = await this.contract.provider.getBalance(
          this.contract.address
        );
        expect(preBalance).to.equal(value);
        // Execute the transaction.
        await this.contract.connect(caller).withdraw(beneficiary, value);
        const balance = await this.contract.provider.getBalance(
          this.contract.address
        );

        expect(balance).to.equal(0);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, beneficiary, value, revert } = failureTest.fn(this);

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).withdraw(beneficiary, value)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
