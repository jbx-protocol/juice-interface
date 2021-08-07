const {
  ethers: { constants },
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "transfer tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        beneficiary: deployer.address,
        amount: 10,
        beneficiary: addrs[2],
      }),
    },
  ],
};

module.exports = function () {
  describe("Success cases", function () {
    tests.success.forEach(function (successTest) {
      it(successTest.description, async function () {
        const { caller, beneficiary, amount } = successTest.fn(this);

        await this.ticketBooth.mock.transfer
          .withArgs(
            this.contract.address,
            this.projectId,
            amount,
            beneficiary.address
          )
          .returns();

        const tx = await this.contract
          .connect(caller)
          .transferTickets(beneficiary.address, amount);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "TransferTickets")
          .withArgs(
            caller.address,
            beneficiary.address,
            this.projectId,
            amount
          );
      });
    });
  });
};
