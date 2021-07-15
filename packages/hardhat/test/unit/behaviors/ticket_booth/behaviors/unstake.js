const {
  ethers: { BigNumber, constants, getContractFactory }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "called by holder",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        amount: BigNumber.from(50),
        setup: {
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "with leftovers",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        amount: BigNumber.from(50),
        setup: {
          stakedBalance: BigNumber.from(150),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "with leftovers and lock",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        amount: BigNumber.from(50),
        setup: {
          stakedBalance: BigNumber.from(150),
          lockedAmount: BigNumber.from(50)
        }
      })
    },
    {
      description: "uses all tickets up to lock",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        amount: BigNumber.from(50),
        setup: {
          stakedBalance: BigNumber.from(150),
          lockedAmount: BigNumber.from(100)
        }
      })
    },
    {
      description: "max uints",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        amount: constants.MaxUint256,
        setup: {
          stakedBalance: constants.MaxUint256,
          lockedAmount: 0
        }
      })
    },
    {
      description: "called by personal operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        personalOperator: true,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        permissionFlag: true,
        setup: { stakedBalance: BigNumber.from(50) }
      })
    },
    {
      description: "called by non personal operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        personalOperator: false,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        permissionFlag: true,
        setup: { stakedBalance: BigNumber.from(50) }
      })
    }
  ],
  failure: [
    {
      description: "overflow",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        amount: BigNumber.from(2),
        setup: {
          stakedBalance: BigNumber.from(2),
          erc20Balance: constants.MaxUint256.sub(1),
          issue: true
        },
        revert: ""
      })
    },
    {
      description: "tickets not yet issued",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        amount: BigNumber.from(50),
        setup: {
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0),
          issue: false
        },
        revert: "TicketBooth::unstake: NOT_FOUND"
      })
    },
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: addrs[0].address,
        amount: BigNumber.from(50),
        permissionFlag: false,
        setup: {
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0),
          issue: true
        },
        revert: "Operatable: UNAUTHORIZED"
      })
    },
    {
      description: "insufficient balance",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        amount: BigNumber.from(500),
        setup: {
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0),
          issue: true
        },
        revert: "TicketBooth::unstake: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient balance due to lock",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        amount: BigNumber.from(10),
        setup: {
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(47),
          issue: true
        },
        revert: "TicketBooth::unstake: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient balance due to lock, max uints",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        amount: constants.MaxUint256,
        setup: {
          stakedBalance: constants.MaxUint256,
          lockedAmount: constants.MaxUint256,
          issue: true
        },
        revert: "TicketBooth::unstake: INSUFFICIENT_FUNDS"
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
          personalOperator,
          projectId,
          holder,
          amount,
          permissionFlag,
          setup: { stakedBalance, lockedAmount }
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // Issue ERC-20s if needed.
        // Must make the caller the project owner in order to issue.
        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(caller.address);
        await this.contract
          .connect(caller)
          .issue(projectId, "doesnt", "matter");

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
          // Get the permission index needed to set the payout mods on an owner's behalf.
          const permissionIndex = 11;

          // Set the Operator store to return the permission flag.
          // If setting to a project ID other than 0, the operator should not have permission to the 0th project.
          if (!personalOperator) {
            await this.operatorStore.mock.hasPermission
              .withArgs(caller.address, holder, 0, permissionIndex)
              .returns(false);
          }
          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, holder, projectId, permissionIndex)
            .returns(permissionFlag);
        }

        // If there should be an staked balance set up, print the necessary tickets before issuing a ticket.
        if (stakedBalance) {
          await this.contract
            .connect(caller)
            .print(holder, projectId, stakedBalance, false);
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
          .unstake(holder, projectId, amount);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Unstake")
          .withArgs(holder, projectId, amount, caller.address);

        // The expected balance is the previous balance minus the amount unstaked.
        const expectedStakedBalance = stakedBalance.sub(amount);

        // Get the stored project staked balance for the holder.
        const storedStakedBalance = await this.contract
          .connect(caller)
          .stakedBalanceOf(holder, projectId);

        // Expect the stored staked balance to equal the expected value.
        expect(storedStakedBalance).to.equal(expectedStakedBalance);

        // The expected total supply is the same as the balance.
        const expectedStakedTotalSupply = expectedStakedBalance;

        // Get the stored project staked total supply for the holder.
        const storedStakedTotalSupply = await this.contract
          .connect(caller)
          .stakedTotalSupplyOf(projectId);

        // Expect the stored staked total supply to equal the expected value.
        expect(storedStakedTotalSupply).to.equal(expectedStakedTotalSupply);

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

        // There should now be a balance of tickets for the holder.
        expect(storedTicketBalance).to.equal(amount);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          personalOperator,
          projectId,
          holder,
          amount,
          permissionFlag,
          setup: { stakedBalance, erc20Balance = 0, lockedAmount, issue },
          revert
        } = failureTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // Issue ERC-20s if needed.
        // Must make the caller the project owner in order to issue.
        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(caller.address);

        // Issue tickets ahead of the opertion.
        if (issue) {
          await expect(
            this.contract.connect(caller).issue(projectId, "doesnt", "matter")
          );
        }

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
          // Get the permission index needed to set the payout mods on an owner's behalf.
          const permissionIndex = 11;

          // Set the Operator store to return the permission flag.
          // If setting to a project ID other than 0, the operator should not have permission to the 0th project.
          if (!personalOperator) {
            await this.operatorStore.mock.hasPermission
              .withArgs(caller.address, holder, 0, permissionIndex)
              .returns(false);
          }
          await this.operatorStore.mock.hasPermission
            .withArgs(
              caller.address,
              holder,
              personalOperator ? 0 : projectId,
              permissionIndex
            )
            .returns(permissionFlag);
        }

        // If there should be an staked balance set up, print the necessary tickets before issuing a ticket.
        if (stakedBalance) {
          await this.contract
            .connect(caller)
            .print(holder, projectId, stakedBalance, false);
        }
        if (erc20Balance > 0) {
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
        await expect(
          this.contract.connect(caller).unstake(holder, projectId, amount)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
