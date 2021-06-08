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
          IOUBalance: constants.MaxUint256.sub(1),
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
        revert: "Tickets::stake: NOT_FOUND"
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
        revert: "Tickets::stake: UNAUTHORIZED"
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
        revert: "Tickets::stake: INSUFFICIENT_FUNDS"
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

        // Initialize the project's tickets to set the specified controller.
        // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);
        await this.contract
          .connect(caller)
          .initialize(caller.address, projectId);

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
          // Get the permission index needed to set the payment mods on an owner's behalf.
          const permissionIndex = await this.contract
            .connect(caller)
            .stakePermissionIndex();

          // Set the Operator store to return the permission flag.
          // If setting to a project ID other than 0, the operator should not have permission to the 0th project.
          if (!personalOperator) {
            await this.operatorStore.mock.hasPermission
              .withArgs(holder, 0, caller.address, permissionIndex)
              .returns(false);
          }
          await this.operatorStore.mock.hasPermission
            .withArgs(
              holder,
              personalOperator ? 0 : projectId,
              caller.address,
              permissionIndex
            )
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

        // Get the stored project IOU balance for the holder.
        const storedIOUBalance = await this.contract
          .connect(caller)
          .IOUBalance(holder, projectId);

        // Expect the stored IOU balance to equal the expected value.
        expect(storedIOUBalance).to.equal(amount);

        // The expected total supply is the same as the balance.
        const expectedIOUTotalSupply = amount;

        // Get the stored project IOU total supply for the holder.
        const storedIOUTotalSupply = await this.contract
          .connect(caller)
          .IOUTotalSupply(projectId);

        // Expect the stored IOU total supply to equal the expected value.
        expect(storedIOUTotalSupply).to.equal(expectedIOUTotalSupply);

        // Get the stored ticket for the project.
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
          setup: { IOUBalance = BigNumber.from(0), erc20Balance, issue },
          revert
        } = failureTest.fn(this);

        // Initialize the project's tickets to set the specified controller.
        // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);
        await this.contract
          .connect(caller)
          .initialize(caller.address, projectId);

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
          // Get the permission index needed to set the payment mods on an owner's behalf.
          const permissionIndex = await this.contract
            .connect(caller)
            .stakePermissionIndex();

          // Set the Operator store to return the permission flag.
          // If setting to a project ID other than 0, the operator should not have permission to the 0th project.
          if (!personalOperator) {
            await this.operatorStore.mock.hasPermission
              .withArgs(holder, 0, caller.address, permissionIndex)
              .returns(false);
          }
          await this.operatorStore.mock.hasPermission
            .withArgs(
              holder,
              personalOperator ? 0 : projectId,
              caller.address,
              permissionIndex
            )
            .returns(permissionFlag);
        }

        if (IOUBalance > 0) {
          await this.contract
            .connect(caller)
            .print(holder, projectId, IOUBalance, false);
        }
        if (erc20Balance) {
          await this.contract
            .connect(caller)
            .print(holder, projectId, erc20Balance, true);
        }

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).stake(holder, projectId, amount)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
