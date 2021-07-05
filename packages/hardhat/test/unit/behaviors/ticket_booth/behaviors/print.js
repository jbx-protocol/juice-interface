const {
  ethers: { BigNumber, constants, getContractFactory }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "prints staked tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        withERC20: false
      })
    },
    {
      description: "prints ERC-20 tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: true,
        withERC20: true
      })
    },
    {
      description: "prints staked tickets if no ERC20 issued",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: true,
        withERC20: false
      })
    },
    {
      description: "prints staked tickets if ERC20 issued but not prefered",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        withERC20: true
      })
    },
    {
      description: "prints staked tickets, max uint",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: constants.MaxUint256,
        preferUnstaked: false,
        withERC20: false
      })
    }
  ],
  failure: [
    {
      description: "overflow",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: constants.MaxUint256,
        preferUnstaked: false,
        withERC20: false,
        setup: { stakedBalance: BigNumber.from(1) },
        revert: ""
      })
    },
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: addrs[0].address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        withERC20: false,
        revert: "TerminalUtility: UNAUTHORIZED"
      })
    },
    {
      description: "amount is 0",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(0),
        preferUnstaked: false,
        withERC20: false,
        revert: "TicketBooth::print: NO_OP"
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
          holder,
          amount,
          preferUnstaked,
          withERC20
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // Issue ERC-20s if needed.
        if (withERC20) {
          // Must make the caller the project owner in order to issue.
          await this.projects.mock.ownerOf
            .withArgs(projectId)
            .returns(caller.address);
          await this.contract
            .connect(caller)
            .issue(projectId, "doesnt", "matter");
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .print(holder, projectId, amount, preferUnstaked);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Print")
          .withArgs(
            holder,
            projectId,
            amount,
            withERC20 && preferUnstaked,
            preferUnstaked,
            caller.address
          );

        // The expected balance is the amount printed.
        const expectedBalance = amount;
        // The expected total supply is the amount printed.
        const expectedTotalSupply = amount;

        if (withERC20 && preferUnstaked) {
          // Get the stored ticket for the project.
          const storedTicketAddress = await this.contract
            .connect(caller)
            .ticketsOf(projectId);

          // Attach the address to the Tickets contract.
          const TicketFactory = await getContractFactory("Tickets");
          const StoredTicket = await TicketFactory.attach(storedTicketAddress);

          // Get the stored ticket balance for the holder.
          const storedTicketBalance = await StoredTicket.connect(
            caller
          ).balanceOf(holder);

          // Expect the stored balance to equal the expected value.
          expect(storedTicketBalance).to.equal(expectedBalance);

          // Get the stored ticket total supply.
          const storedTicketTotalSupply = await StoredTicket.connect(
            caller
          ).totalSupply();

          // Expect the stored total supply to equal the expected value.
          expect(storedTicketTotalSupply).to.equal(expectedTotalSupply);
        } else {
          // Get the stored project staked balance for the holder.
          const storedStakedBalance = await this.contract
            .connect(caller)
            .stakedBalanceOf(holder, projectId);

          // Expect the stored staked balance to equal the expected value.
          expect(storedStakedBalance).to.equal(expectedBalance);

          // Get the stored project staked total supply for the holder.
          const storedStakedTotalSupply = await this.contract
            .connect(caller)
            .stakedTotalSupplyOf(projectId);

          // Expect the stored staked total supply to equal the expected value.
          expect(storedStakedTotalSupply).to.equal(expectedTotalSupply);
        }
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          controller,
          projectId,
          holder,
          amount,
          preferUnstaked,
          setup: { stakedBalance = 0 } = {},
          revert
        } = failureTest.fn(this);
        // Mock the controller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(controller);

        if (stakedBalance > 0) {
          await this.contract
            .connect(caller)
            .print(holder, projectId, stakedBalance, false);
        }

        await expect(
          this.contract
            .connect(caller)
            .print(holder, projectId, amount, preferUnstaked)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
