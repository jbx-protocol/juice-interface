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
          erc20Balance: BigNumber.from(50)
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
          erc20Balance: BigNumber.from(150)
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
          erc20Balance: constants.MaxUint256
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
        setup: { erc20Balance: BigNumber.from(50) }
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
        setup: { erc20Balance: BigNumber.from(50) }
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
          stakedBalance: constants.MaxUint256.sub(1),
          erc20Balance: BigNumber.from(2),
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
          erc20Balance: BigNumber.from(50),
          issue: false
        },
        revert: "TicketBooth::stake: NOT_FOUND"
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
          erc20Balance: BigNumber.from(50),
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
          erc20Balance: BigNumber.from(50),
          issue: true
        },
        revert: "TicketBooth::stake: INSUFFICIENT_FUNDS"
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
          setup: { erc20Balance }
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // Issue ERC-20s.
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
          const permissionIndex = 10;

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

        if (erc20Balance > 0) {
          await this.contract
            .connect(caller)
            .print(holder, projectId, erc20Balance, true);
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .stake(holder, projectId, amount);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Stake")
          .withArgs(holder, projectId, amount, caller.address);

        // Get the stored project's staked balance for the holder.
        const storedStakedBalance = await this.contract
          .connect(caller)
          .stakedBalanceOf(holder, projectId);

        // Expect the stored staked balance to equal the expected value.
        expect(storedStakedBalance).to.equal(amount);

        // The expected total supply is the same as the balance.
        const expectedStakedTotalSupply = amount;

        // Get the stored project's staked total supply for the holder.
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
        expect(storedTicketBalance).to.equal(erc20Balance.sub(amount));
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
          setup: { stakedBalance = BigNumber.from(0), erc20Balance, issue },
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
          const permissionIndex = 10;

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

        // These were sporadically given a "run out of gas" error, so the limit was icreased.
        if (stakedBalance > 0) {
          await this.contract
            .connect(caller)
            .print(holder, projectId, stakedBalance, false, {
              gasLimit: 100000
            });
        }
        if (erc20Balance) {
          await this.contract
            .connect(caller)
            .print(holder, projectId, erc20Balance, true, {
              gasLimit: 100000
            });
        }

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).stake(holder, projectId, amount)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
