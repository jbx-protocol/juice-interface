const {
  ethers: { BigNumber, constants }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "transfers IOU tickets, called by holder",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: addrs[0].address,
        amount: BigNumber.from(50),
        setup: {
          IOUBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "transfers IOU tickets, called by personal operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        personalOperator: true,
        holder: addrs[0].address,
        recipient: addrs[1].address,
        amount: BigNumber.from(50),
        permissionFlag: true,
        setup: {
          IOUBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "transfers IOU tickets, called by project operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        personalOperator: false,
        holder: addrs[0].address,
        recipient: addrs[1].address,
        amount: BigNumber.from(50),
        permissionFlag: true,
        setup: {
          IOUBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "transfers IOU tickets, with locked amount",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: addrs[0].address,
        amount: BigNumber.from(10),
        setup: {
          IOUBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(40)
        }
      })
    },
    {
      description: "transfers IOU tickets, with max uints",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: addrs[0].address,
        amount: constants.MaxUint256,
        setup: {
          IOUBalance: constants.MaxUint256,
          lockedAmount: 0
        }
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: addrs[0].address,
        recipient: addrs[1].address,
        amount: BigNumber.from(50),
        permissionFlag: false,
        setup: {
          IOUBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Tickets::transfer: UNAUTHORIZED"
      })
    },
    {
      description: "zero address",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: constants.AddressZero,
        amount: BigNumber.from(50),
        setup: {
          IOUBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Tickets::transfer: ZERO_ADDRESS"
      })
    },
    {
      description: "sender is recipient",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: deployer.address,
        amount: BigNumber.from(50),
        setup: {
          IOUBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Tickets::transfer: IDENTITY"
      })
    },
    {
      description: "insufficient funds",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: addrs[0].address,
        amount: BigNumber.from(51),
        setup: {
          IOUBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Tickets::transfer: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds, with lock",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: addrs[0].address,
        amount: BigNumber.from(20),
        setup: {
          IOUBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(40)
        },
        revert: "Tickets::transfer: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds, with max uint lock",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: addrs[0].address,
        amount: constants.MaxUint256,
        setup: {
          IOUBalance: constants.MaxUint256,
          lockedAmount: constants.MaxUint256
        },
        revert: "Tickets::transfer: INSUFFICIENT_FUNDS"
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
          recipient,
          permissionFlag,
          setup: { IOUBalance, lockedAmount }
        } = successTest.fn(this);

        // Initialize the project's tickets to set the specified controller.
        // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);
        await this.contract
          .connect(caller)
          .initialize(caller.address, projectId);

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
          // Get the permission index needed to set the payment mods on an owner's behalf.
          const permissionIndex = await this.contract
            .connect(caller)
            .transferPermissionIndex();

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

        // If there should be an IOU balance set up, print the necessary tickets before issuing a ticket.
        if (IOUBalance) {
          await this.contract
            .connect(caller)
            .print(holder, projectId, IOUBalance, false);
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
          .transfer(holder, projectId, amount, recipient);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Transfer")
          .withArgs(holder, projectId, recipient, amount, caller.address);

        // The expected sender balance is the previous balance minus the amount transfered.
        const expectedSenderIOUBalance = IOUBalance.sub(amount);

        // Get the stored project IOU balance for the holder.
        const storedSenderIOUBalance = await this.contract
          .connect(caller)
          .IOUBalance(holder, projectId);

        // Expect the stored IOU balance to equal the expected value.
        expect(storedSenderIOUBalance).to.equal(expectedSenderIOUBalance);

        // The expected reciever balance is the transfered amount.
        const expectedRecipientIOUBalance = amount;

        // Get the stored project IOU balance for the receiver.
        const storedRecipientIOUBalance = await this.contract
          .connect(caller)
          .IOUBalance(recipient, projectId);

        // Expect the stored IOU balance to equal the expected value.
        expect(storedRecipientIOUBalance).to.equal(expectedRecipientIOUBalance);
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
          recipient,
          permissionFlag,
          setup: { IOUBalance, lockedAmount },
          revert
        } = failureTest.fn(this);

        // Initialize the project's tickets to set the specified controller.
        // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);
        await this.contract
          .connect(caller)
          .initialize(caller.address, projectId);

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
          // Get the permission index needed to set the payment mods on an owner's behalf.
          const permissionIndex = await this.contract
            .connect(caller)
            .transferPermissionIndex();

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

        // If there should be an IOU balance set up, print the necessary tickets before issuing a ticket.
        if (IOUBalance) {
          await this.contract
            .connect(caller)
            .print(holder, projectId, IOUBalance, false);
        }
        if (lockedAmount > 0) {
          // Lock the specified amount of tickets.
          await this.contract
            .connect(caller)
            .lock(holder, projectId, lockedAmount);
        }

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .transfer(holder, projectId, amount, recipient)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
