// const { ethers } = require("hardhat");
const { expect } = require("chai");
const {
  ethers: { BigNumber, constants, getContractFactory }
} = require("hardhat");

const tests = {
  success: [
    {
      description: "redeems IOU tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: false,
        setup: {
          IOUBalance: BigNumber.from(50),
          erc20Balance: BigNumber.from(0),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "redeems ERC-20 tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: false,
        setup: {
          IOUBalance: BigNumber.from(0),
          erc20Balance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "redeems mix of IOUs and ERC-20 tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: false,
        setup: {
          IOUBalance: BigNumber.from(20),
          erc20Balance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "redeems mix of IOUs and ERC-20 tickets, prefering ERC-20s",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: true,
        setup: {
          IOUBalance: BigNumber.from(20),
          erc20Balance: BigNumber.from(40),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "redeems only ERC-20 tickets, prefering ERC-20s",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: true,
        setup: {
          IOUBalance: BigNumber.from(20),
          erc20Balance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "redeems only IOUs, prefering ERC-20s",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: true,
        setup: {
          IOUBalance: BigNumber.from(50),
          erc20Balance: BigNumber.from(0),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "redeems mix of IOUs and ERC-20 tickets, max uints",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: constants.MaxUint256,
        preferConverted: false,
        setup: {
          IOUBalance: constants.MaxUint256,
          erc20Balance: constants.MaxUint256,
          lockedAmount: 0
        }
      })
    },
    {
      description:
        "redeems mix of IOUs and ERC-20 tickets, max uints including locked",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: constants.MaxUint256,
        preferConverted: false,
        setup: {
          IOUBalance: constants.MaxUint256,
          erc20Balance: constants.MaxUint256,
          lockedAmount: constants.MaxUint256
        }
      })
    },
    {
      description: "redeems mix of IOUs and ERC-20 tickets, some locked",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: false,
        setup: {
          IOUBalance: BigNumber.from(20),
          erc20Balance: BigNumber.from(50),
          lockedAmount: BigNumber.from(20)
        }
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: addrs[0],
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: false,
        setup: {
          IOUBalance: BigNumber.from(50),
          erc20Balance: BigNumber.from(0),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Tickets::redeem: UNAUTHORIZED"
      })
    },
    {
      description: "insufficient funds with no IOUs or ERC-20s",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: false,
        setup: {
          IOUBalance: BigNumber.from(0),
          erc20Balance: BigNumber.from(0),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Tickets::redeem: INSUFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds with IOUs but no ERC-20s",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: false,
        setup: {
          IOUBalance: BigNumber.from(30),
          erc20Balance: BigNumber.from(0),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Tickets::redeem: INSUFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds with IOUs but not enough ERC-20s",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: false,
        setup: {
          IOUBalance: BigNumber.from(30),
          erc20Balance: BigNumber.from(10),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Tickets::redeem: INSUFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds with no IOUs and not enough ERC-20s",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: false,
        setup: {
          IOUBalance: BigNumber.from(0),
          erc20Balance: BigNumber.from(10),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Tickets::redeem: INSUFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds with IOUs but locked",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: false,
        setup: {
          IOUBalance: BigNumber.from(50),
          erc20Balance: BigNumber.from(0),
          lockedAmount: BigNumber.from(20)
        },
        revert: "Tickets::redeem: INSUFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds with IOUs and ERC20s but locked",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferConverted: false,
        setup: {
          IOUBalance: BigNumber.from(50),
          erc20Balance: BigNumber.from(10),
          lockedAmount: BigNumber.from(20)
        },
        revert: "Tickets::redeem: INSUFICIENT_FUNDS"
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
          setup: { IOUBalance, erc20Balance, lockedAmount }
        } = successTest.fn(this);

        // Initialize the project's tickets to set the specified controller.
        // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);
        await this.contract.connect(caller).initialize(controller, projectId);

        // If there should be an IOU balance set up, print the necessary tickets before issuing a ticket.
        if (IOUBalance > 0) {
          // Print tickets to make up the balance.
          await this.contract
            .connect(caller)
            .print(holder, projectId, IOUBalance, false);
        }
        // Add to the erc20 balance if needed.
        if (erc20Balance > 0) {
          // Issue tickets.
          // Must make the caller the project owner in order to issue.
          await this.projects.mock.ownerOf
            .withArgs(projectId)
            .returns(caller.address);
          await this.contract
            .connect(caller)
            .issue(projectId, "doesnt", "matter");
          // Print tickets to make up the balance.
          await this.contract
            .connect(caller)
            .print(holder, projectId, erc20Balance, true);
        }
        if (lockedAmount > 0) {
          // Lock the specified amount of tickets.
          await this.contract
            .connect(caller)
            .lock(holder, projectId, lockedAmount);
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .redeem(holder, projectId, amount, preferConverted);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Redeem")
          .withArgs(
            holder,
            projectId,
            amount,
            IOUBalance.sub
              ? IOUBalance.sub(lockedAmount)
              : IOUBalance - lockedAmount,
            preferConverted,
            caller.address
          );

        // The expected total IOU supply.
        let expectedIOUTotalSupply;
        if (preferConverted && erc20Balance > 0) {
          expectedIOUTotalSupply = IOUBalance.sub(
            amount > erc20Balance ? amount.sub(erc20Balance) : BigNumber.from(0)
          );
        } else {
          expectedIOUTotalSupply =
            IOUBalance.sub(amount) > lockedAmount
              ? IOUBalance.sub(amount)
              : lockedAmount;
        }

        // Get the stored IOU supply.
        const storedIOUTotalSupply = await this.contract
          .connect(caller)
          .IOUTotalSupply(projectId);

        // The expected should match what's stored.
        expect(storedIOUTotalSupply).to.equal(expectedIOUTotalSupply);

        // The expected balance of the holder.
        const expectedIOUBalance = expectedIOUTotalSupply;

        // Get the stored IOU supply.
        const storedIOUBalance = await this.contract
          .connect(caller)
          .IOUBalance(holder, projectId);

        // The expected should match what's stored.
        expect(storedIOUBalance).to.equal(expectedIOUBalance);

        // Get the stored lcoked amount.
        const storedLocked = await this.contract
          .connect(caller)
          .locked(holder, projectId);

        // Locked shouldn't change.
        expect(storedLocked).to.equal(lockedAmount);

        if (erc20Balance > 0) {
          // Get the stored tickets.
          const storedTicketAddress = await this.contract
            .connect(caller)
            .tickets(projectId);

          // Attach the address to the Ticket contract.
          const TicketFactory = await getContractFactory("Ticket");
          const StoredTicket = await TicketFactory.attach(storedTicketAddress);
          // Get the stored ticket balance for the holder.
          const storedTicketBalance = await StoredTicket.connect(
            caller
          ).balanceOf(holder);

          let expectedTicketBalance;
          if (preferConverted) {
            expectedTicketBalance =
              erc20Balance > amount ? erc20Balance.sub(amount) : 0;
          } else {
            expectedTicketBalance = erc20Balance.sub(
              amount > IOUBalance.sub(lockedAmount)
                ? amount.sub(IOUBalance.sub(lockedAmount))
                : 0
            );
          }

          // Expect the stored balance to equal the expected.
          expect(storedTicketBalance).to.equal(expectedTicketBalance);
          // Get the stored ticket total supply.
          const storedTicketTotalSupply = await StoredTicket.connect(
            caller
          ).totalSupply();

          // Expect the stored total supply to equal the expected value.
          expect(storedTicketTotalSupply).to.equal(expectedTicketBalance);
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
          setup: { IOUBalance, erc20Balance, lockedAmount },
          revert
        } = failureTest.fn(this);

        // Initialize the project's tickets to set the specified controller.
        // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);
        // The caller needs to be a controller to run the setup code.
        // It will transfer this power to the specified controller after setup.
        await this.contract
          .connect(caller)
          .initialize(caller.address, projectId);

        // If there should be an IOU balance set up, print the necessary tickets before issuing a ticket.
        if (IOUBalance > 0) {
          // Print tickets to make up the balance.
          await this.contract
            .connect(caller)
            .print(holder, projectId, IOUBalance, false);
        }
        // Add to the erc20 balance if needed.
        if (erc20Balance > 0) {
          // Issue tickets.
          // Must make the caller the project owner in order to issue.
          await this.projects.mock.ownerOf
            .withArgs(projectId)
            .returns(caller.address);
          await this.contract
            .connect(caller)
            .issue(projectId, "doesnt", "matter");
          // Print tickets to make up the balance.
          await this.contract
            .connect(caller)
            .print(holder, projectId, erc20Balance, true);
        }
        if (lockedAmount > 0) {
          // Lock the specified amount of tickets.
          await this.contract
            .connect(caller)
            .lock(holder, projectId, lockedAmount);
        }

        // If the controller is different from the caller, resign control and add to the controller.
        if (controller !== caller.address) {
          await this.contract
            .connect(caller)
            .addController(controller, projectId);
          await this.contract
            .connect(caller)
            .removeController(caller.address, projectId);
        }

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .redeem(holder, projectId, amount, preferConverted)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
