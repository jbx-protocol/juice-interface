const {
  ethers: { constants }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "no preset beneficiary or preference for unstaked tickets",
      fn: ({ deployer }) => ({
        caller: deployer,
        beneficiary: deployer.address,
        preferUnstakedTickets: false,
        // below values doesnt matter
        value: 1
      })
    },
    {
      description: "preset beneficiary, preset preference for unstaked tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        beneficiary: addrs[0].address,
        preferUnstakedTickets: true,
        // below values doesnt matter
        value: 1
      })
    }
  ],
  failure: [
    {
      description: "not owner",
      fn: ({ addrs }) => ({
        caller: addrs[0],
        currency: 1,
        decimals: 18,
        revert: "Ownable: caller is not the owner"
      })
    },
    {
      description: "reserved currency",
      fn: ({ deployer }) => ({
        caller: deployer,
        currency: 0,
        decimals: 18,
        revert: "Prices::addFeed: RESERVED"
      })
    },
    {
      description: "over 18 decimals",
      fn: ({ deployer }) => ({
        caller: deployer,
        currency: 1,
        decimals: 19,
        revert: "Prices::addFeed: BAD_DECIMALS"
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
          value,
          beneficiary,
          preferUnstakedTickets
        } = successTest.fn(this);

        await this.juicer.mock.pay
          .withArgs(
            this.projectId,
            beneficiary,
            this.memo,
            preferUnstakedTickets
          )
          .returns(1);
        await this.terminalDirectory.mock.preferUnstakedTickets
          .withArgs(caller.address)
          .returns(preferUnstakedTickets);
        await this.terminalDirectory.mock.beneficiaries
          .withArgs(caller.address)
          .returns(beneficiary || constants.AddressZero);
        await this.terminalDirectory.mock.terminals
          .withArgs(this.projectId)
          .returns(this.juicer.address);

        // Execute the transaction.
        const tx = await caller.sendTransaction({
          to: this.contract.address,
          value
        });

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Forward")
          .withArgs(
            this.projectId,
            beneficiary,
            value,
            this.memo,
            preferUnstakedTickets
          );
      });
    });
  });
};
