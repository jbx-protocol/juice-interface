// const { ethers } = require("hardhat");
const { expect } = require("chai");
const {
  ethers: { BigNumber, constants, getContractFactory }
} = require("hardhat");

const tests = {
  success: [
    {
      description: "redeems staked tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        setup: {
          stakedBalance: BigNumber.from(50),
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
        preferUnstaked: false,
        setup: {
          stakedBalance: BigNumber.from(0),
          erc20Balance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "redeems mix of staked and unstaked tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        setup: {
          stakedBalance: BigNumber.from(20),
          erc20Balance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description:
        "redeems mix of staked and unstaked tickets, prefering ERC-20s",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: true,
        setup: {
          stakedBalance: BigNumber.from(20),
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
        preferUnstaked: true,
        setup: {
          stakedBalance: BigNumber.from(20),
          erc20Balance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "redeems only staked tickets, prefering unstaked",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: true,
        setup: {
          stakedBalance: BigNumber.from(50),
          erc20Balance: BigNumber.from(0),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "redeems mix of staked and unstaked tickets, max uints",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: constants.MaxUint256,
        preferUnstaked: false,
        setup: {
          stakedBalance: constants.MaxUint256,
          erc20Balance: constants.MaxUint256,
          lockedAmount: 0
        }
      })
    },
    {
      description:
        "redeems mix of staked and unstaked tickets, max uints including locked",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: constants.MaxUint256,
        preferUnstaked: false,
        setup: {
          stakedBalance: constants.MaxUint256,
          erc20Balance: constants.MaxUint256,
          lockedAmount: constants.MaxUint256
        }
      })
    },
    {
      description: "redeems mix of staked and unstaked tickets, some locked",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        setup: {
          stakedBalance: BigNumber.from(20),
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
        preferUnstaked: false,
        setup: {
          stakedBalance: BigNumber.from(50),
          erc20Balance: BigNumber.from(0),
          lockedAmount: BigNumber.from(0)
        },
        revert: "TerminalUtility: UNAUTHORIZED"
      })
    },
    {
      description: "insufficient funds with no staked or unstaked tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        setup: {
          stakedBalance: BigNumber.from(0),
          erc20Balance: BigNumber.from(0),
          lockedAmount: BigNumber.from(0)
        },
        revert: "TicketBooth::redeem: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds with staked but no unstaked tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        setup: {
          stakedBalance: BigNumber.from(30),
          erc20Balance: BigNumber.from(0),
          lockedAmount: BigNumber.from(0)
        },
        revert: "TicketBooth::redeem: INSUFFICIENT_FUNDS"
      })
    },
    {
      description:
        "insufficient funds with staked tickets but not enough unstaked tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        setup: {
          stakedBalance: BigNumber.from(30),
          erc20Balance: BigNumber.from(10),
          lockedAmount: BigNumber.from(0)
        },
        revert: "TicketBooth::redeem: INSUFFICIENT_FUNDS"
      })
    },
    {
      description:
        "insufficient funds with no staked tickets and not enough unstaked tickets",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        setup: {
          stakedBalance: BigNumber.from(0),
          erc20Balance: BigNumber.from(10),
          lockedAmount: BigNumber.from(0)
        },
        revert: "TicketBooth::redeem: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds with staked tickets but locked",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        setup: {
          stakedBalance: BigNumber.from(50),
          erc20Balance: BigNumber.from(0),
          lockedAmount: BigNumber.from(20)
        },
        revert: "TicketBooth::redeem: INSUFFICIENT_FUNDS"
      })
    },
    {
      description:
        "insufficient funds with staked and unstaked tickets but locked",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: deployer.address,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        preferUnstaked: false,
        setup: {
          stakedBalance: BigNumber.from(50),
          erc20Balance: BigNumber.from(10),
          lockedAmount: BigNumber.from(20)
        },
        revert: "TicketBooth::redeem: INSUFFICIENT_FUNDS"
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
          setup: { stakedBalance, erc20Balance, lockedAmount }
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // If there should be an staked balance set up, print the necessary tickets before issuing a ticket.
        if (stakedBalance > 0) {
          // Print tickets to make up the balance.
          await this.contract
            .connect(caller)
            .print(holder, projectId, stakedBalance, false);
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
          const permissionIndex = 13;
          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, holder, projectId, permissionIndex)
            .returns(true);
          // Lock the specified amount of tickets.
          await this.contract
            .connect(caller)
            .lock(holder, projectId, lockedAmount);
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .redeem(holder, projectId, amount, preferUnstaked);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Redeem")
          .withArgs(
            holder,
            projectId,
            amount,
            stakedBalance.sub
              ? stakedBalance.sub(lockedAmount)
              : stakedBalance - lockedAmount,
            preferUnstaked,
            caller.address
          );

        // The expected total staked supply.
        let expectedStakedTotalSupply;
        if (preferUnstaked && erc20Balance > 0) {
          expectedStakedTotalSupply = stakedBalance.sub(
            amount > erc20Balance ? amount.sub(erc20Balance) : BigNumber.from(0)
          );
        } else {
          expectedStakedTotalSupply =
            stakedBalance.sub(amount) > lockedAmount
              ? stakedBalance.sub(amount)
              : lockedAmount;
        }

        // Get the stored staked supply.
        const storedStakedTotalSupply = await this.contract
          .connect(caller)
          .stakedTotalSupplyOf(projectId);

        // The expected should match what's stored.
        expect(storedStakedTotalSupply).to.equal(expectedStakedTotalSupply);

        // The expected balance of the holder.
        const expectedStakedBalance = expectedStakedTotalSupply;

        // Get the stored staked supply.
        const storedStakedBalance = await this.contract
          .connect(caller)
          .stakedBalanceOf(holder, projectId);

        // The expected should match what's stored.
        expect(storedStakedBalance).to.equal(expectedStakedBalance);

        // Get the stored lcoked amount.
        const storedLocked = await this.contract
          .connect(caller)
          .lockedBalanceOf(holder, projectId);

        // Locked shouldn't change.
        expect(storedLocked).to.equal(lockedAmount);

        if (erc20Balance > 0) {
          // Get the stored tickets.
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

          let expectedTicketBalance;
          if (preferUnstaked) {
            expectedTicketBalance =
              erc20Balance > amount ? erc20Balance.sub(amount) : 0;
          } else {
            expectedTicketBalance = erc20Balance.sub(
              amount > stakedBalance.sub(lockedAmount)
                ? amount.sub(stakedBalance.sub(lockedAmount))
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
          preferUnstaked,
          setup: { stakedBalance, erc20Balance, lockedAmount },
          revert
        } = failureTest.fn(this);

        // Caller must the controller to setup.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // If there should be an staked balance set up, print the necessary tickets before issuing a ticket.
        if (stakedBalance > 0) {
          // Print tickets to make up the balance.
          await this.contract
            .connect(caller)
            .print(holder, projectId, stakedBalance, false);
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
          // Get the permission index needed to set the payout mods on an owner's behalf.
          const permissionIndex = 13;

          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, holder, projectId, permissionIndex)
            .returns(true);
          // Lock the specified amount of tickets.
          await this.contract
            .connect(caller)
            .lock(holder, projectId, lockedAmount);
        }

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(controller);

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .redeem(holder, projectId, amount, preferUnstaked)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
