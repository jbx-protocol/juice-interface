const {
  ethers: { BigNumber, constants }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "called by holder",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: addrs[0].address,
        amount: BigNumber.from(50),
        setup: {
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "called by personal operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: addrs[0].address,
        recipient: addrs[1].address,
        amount: BigNumber.from(50),
        setup: {
          personalOperator: true,
          permissionFlag: true,
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "called by project operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: addrs[0].address,
        recipient: addrs[1].address,
        amount: BigNumber.from(50),
        setup: {
          personalOperator: false,
          permissionFlag: true,
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "with locked amount",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: addrs[0].address,
        amount: BigNumber.from(10),
        setup: {
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(40)
        }
      })
    },
    {
      description: "with max uints",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: addrs[0].address,
        amount: constants.MaxUint256,
        setup: {
          stakedBalance: constants.MaxUint256,
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
        setup: {
          permissionFlag: false,
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Operatable: UNAUTHORIZED"
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
        revert: "TicketBooth::transfer: ZERO_ADDRESS"
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
        revert: "TicketBooth::transfer: IDENTITY"
      })
    },
    {
      description: "zero amount",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        holder: deployer.address,
        recipient: addrs[0].address,
        amount: BigNumber.from(0),
        revert: "TicketBooth::transfer: NO_OP"
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
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        },
        revert: "TicketBooth::transfer: INSUFFICIENT_FUNDS"
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
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(40)
        },
        revert: "TicketBooth::transfer: INSUFFICIENT_FUNDS"
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
          stakedBalance: constants.MaxUint256,
          lockedAmount: constants.MaxUint256
        },
        revert: "TicketBooth::transfer: INSUFFICIENT_FUNDS"
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
          recipient,
          setup: {
            stakedBalance,
            lockedAmount,
            personalOperator,
            permissionFlag
          }
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
          // Get the permission index needed to set the payout mods on an owner's behalf.
          const permissionIndex = 12;

          // Set the Operator store to return the permission flag.
          // If setting to a project ID other than 0, the operator should not have permission to the 0th project.
          await this.operatorStore.mock.hasPermission
            .withArgs(
              caller.address,
              holder,
              personalOperator ? projectId : 0,
              permissionIndex
            )
            .returns(false);
          await this.operatorStore.mock.hasPermission
            .withArgs(
              caller.address,
              holder,
              personalOperator ? 0 : projectId,
              permissionIndex
            )
            .returns(permissionFlag);
        }

        // If there should be staked balance set up, print the necessary tickets before issuing a ticket.
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
          .transfer(holder, projectId, amount, recipient);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Transfer")
          .withArgs(holder, projectId, recipient, amount, caller.address);

        // The expected sender balance is the previous balance minus the amount transfered.
        const expectedSenderStakedBalance = stakedBalance.sub(amount);

        // Get the stored project's staked balance for the holder.
        const storedSenderStakedBalance = await this.contract
          .connect(caller)
          .stakedBalanceOf(holder, projectId);

        // Expect the stored project's staked balance to equal the expected value.
        expect(storedSenderStakedBalance).to.equal(expectedSenderStakedBalance);

        // The expected reciever balance is the transfered amount.
        const expectedRecipientStakedBalance = amount;

        // Get the stored project's staked balance for the receiver.
        const storedRecipientStakedBalance = await this.contract
          .connect(caller)
          .stakedBalanceOf(recipient, projectId);

        // Expect the stored staked balance to equal the expected value.
        expect(storedRecipientStakedBalance).to.equal(
          expectedRecipientStakedBalance
        );
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
          setup: { permissionFlag, stakedBalance, lockedAmount } = {},
          revert
        } = failureTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
          // Get the permission index needed to set the payout mods on an owner's behalf.
          const permissionIndex = 12;

          // Set the Operator store to return the permission flag.
          // If setting to a project ID other than 0, the operator should not have permission to the 0th project.
          await this.operatorStore.mock.hasPermission
            .withArgs(
              caller.address,
              holder,
              personalOperator ? projectId : 0,
              permissionIndex
            )
            .returns(false);

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
