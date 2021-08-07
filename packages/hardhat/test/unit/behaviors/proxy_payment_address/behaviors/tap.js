const {
  ethers: { constants },
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "tap",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        ops: [
          {
            sender: addrs[0],
            value: 1,
          },
          {
            sender: addrs[1],
            value: 2,
          },
          {
            sender: addrs[0],
            value: 4,
          },
        ],
        beneficiary: addrs[2],
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
            const tx = await op.sender.sendTransaction({
              to: this.contract.address,
              value: op.value,
            });

            // Expect an event to have been emitted.
            await expect(tx)
              .to.emit(this.contract, "Receive")
              .withArgs(op.sender.address, op.value);
          })
        );

        const expectedBalance = ops.reduce((value, op) => value + op.value, 0);

        const storedBalance = await caller.provider.getBalance(
          this.contract.address
        );

        expect(storedBalance).to.equal(expectedBalance);

        await this.terminalV1.mock.pay
          .withArgs(this.projectId, this.contract.address, this.memo, false)
          .returns(1);

        await this.terminalDirectory.mock.terminalOf
          .withArgs(this.projectId)
          .returns(this.terminalV1.address);

        const tapTx = await this.contract.connect(caller).tap();

        // Expect an event to have been emitted.
        await expect(tapTx)
          .to.emit(this.contract, "Tap")
          .withArgs(caller.address, expectedBalance);
      });
    });
  });
};
