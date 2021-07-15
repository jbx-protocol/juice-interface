const {
  ethers: { BigNumber, constants }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "with nothing pre locked",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(50),
        setup: {
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    },
    {
      description: "with some pre locked",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(40),
        setup: {
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(10)
        }
      })
    },
    {
      description: "with max uints",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: constants.MaxUint256,
        setup: {
          stakedBalance: constants.MaxUint256,
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
        amount: BigNumber.from(50),
        setup: {
          permissionFlag: true,
          personalOperator: false,
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        }
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        holder: addrs[0].address,
        projectId: 1,
        amount: BigNumber.from(10),
        setup: {
          permissionFlag: false,
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Operatable: UNAUTHORIZED"
      })
    },
    {
      description: "insufficient funds, non locked",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(50),
        setup: {
          setOwner: true,
          stakedBalance: BigNumber.from(40),
          lockedAmount: BigNumber.from(0)
        },
        revert: "TicketBooth::lock: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds, some already locked",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(50),
        setup: {
          setOwner: true,
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(10)
        },
        revert: "TicketBooth::lock: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds, max uints",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: constants.MaxUint256,
        setup: {
          setOwner: true,
          stakedBalance: constants.MaxUint256,
          lockedAmount: constants.MaxUint256
        },
        revert: "TicketBooth::lock: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "amount is 0",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(0),
        setup: {
          setOwner: true,
          stakedBalance: constants.MaxUint256,
          lockedAmount: constants.MaxUint256
        },
        revert: "TicketBooth::lock: NO_OP"
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
          holder,
          projectId,
          amount,
          setup: {
            permissionFlag,
            personalOperator,
            stakedBalance,
            lockedAmount
          }
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
          // Get the permission index needed to set the payout mods on an owner's behalf.
          const permissionIndex = 13;

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

        // If there should be a staked balance set up, print the necessary tickets before issuing a ticket.
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
          .lock(holder, projectId, amount);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Lock")
          .withArgs(holder, projectId, amount, caller.address);

        // Get a reference to the stored amount locked.
        const storedLocked = await this.contract
          .connect(caller)
          .lockedBalanceOf(holder, projectId);

        // The expected locked is the previous locked plus the amount just locked.
        const expectedLocked = lockedAmount.add(amount);

        // The stored locked should equal the expected value.
        expect(storedLocked).to.equal(expectedLocked);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          holder,
          amount,
          projectId,
          setup: {
            permissionFlag,
            personalOperator,
            stakedBalance,
            lockedAmount
          },
          revert
        } = failureTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // Get the permission index needed to set the payout mods on an owner's behalf.
        const permissionIndex = 13;

        // If there should be an staked balance set up, print the necessary tickets before issuing a ticket.
        if (stakedBalance) {
          await this.contract
            .connect(caller)
            .print(holder, projectId, stakedBalance, false);
        }
        if (lockedAmount > 0) {
          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, holder, projectId, permissionIndex)
            .returns(true);
          // Lock the specified amount of tickets.
          await this.contract
            .connect(caller)
            .lock(holder, projectId, lockedAmount);
        }

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
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

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).lock(holder, projectId, amount)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
