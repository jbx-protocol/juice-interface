const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "prints IOU tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: 50,
        preferConverted: false,
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
        amount: 50,
        preferConverted: true,
        withERC20: true
      })
    },
    {
      description: "prints IOU tickets if no ERC20 issued",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: 50,
        preferConverted: true,
        withERC20: false
      })
    },
    {
      description: "prints IOU tickets if ERC20 issued but not prefered",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: 50,
        preferConverted: false,
        withERC20: true
      })
    },
    {
      description: "prints IOU tickets, max uint",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: ethers.constants.MaxUint256,
        preferConverted: false,
        withERC20: false
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: addrs[0].address,
        projectId: 1,
        holder: addrs[0].address,
        amount: 50,
        preferConverted: false,
        withERC20: false,
        revert: "Tickets::print: UNAUTHORIZED"
      })
    },
    {
      description: "amount is 0",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: 0,
        preferConverted: false,
        withERC20: false,
        revert: "Tickets::print: NO_OP"
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
          controller,
          projectId,
          holder,
          amount,
          preferConverted,
          withERC20
        } = successTest.fn(this);

        // Initialize the project's tickets to set the specified controller.
        // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);
        await this.contract.connect(caller).initialize(controller, projectId);

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
          .print(holder, projectId, amount, preferConverted);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Print")
          .withArgs(
            projectId,
            holder,
            amount,
            withERC20 && preferConverted,
            preferConverted,
            caller.address
          );

        // The expected balance is the amount printed.
        const expectedBalance = amount;
        // The expected total supply is the amount printed.
        const expectedTotalSupply = amount;

        if (withERC20 && preferConverted) {
          // Get the stored ticket for the project.
          const storedTicketAddress = await this.contract
            .connect(caller)
            .tickets(projectId);

          // Attach the address to the Ticket contract.
          const TicketFactory = await ethers.getContractFactory("Ticket");
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
          // Get the stored project IOU balance for the holder.
          const storedIOUBalance = await this.contract
            .connect(caller)
            .IOUBalance(holder, projectId);

          // Expect the stored IOU balance to equal the expected value.
          expect(storedIOUBalance).to.equal(expectedBalance);

          // Get the stored project IOU total supply for the holder.
          const storedIOUTotalSupply = await this.contract
            .connect(caller)
            .IOUTotalSupply(projectId);

          // Expect the stored IOU total supply to equal the expected value.
          expect(storedIOUTotalSupply).to.equal(expectedTotalSupply);
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
          preferConverted,
          revert
        } = failureTest.fn(this);
        await this.contract.connect(caller).setOwnership(caller.address);
        await this.contract.connect(caller).initialize(controller, projectId);

        await expect(
          this.contract
            .connect(caller)
            .print(holder, projectId, amount, preferConverted)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
