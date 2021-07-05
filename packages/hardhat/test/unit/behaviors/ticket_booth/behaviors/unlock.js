const {
  ethers: { BigNumber, constants }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "unlock all",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(50),
        setup: {
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(50)
        }
      })
    },
    {
      description: "unlock some",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(40),
        setup: {
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(50)
        }
      })
    },
    {
      description: "unlock with max uints",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: constants.MaxUint256,
        setup: {
          stakedBalance: constants.MaxUint256,
          lockedAmount: constants.MaxUint256
        }
      })
    }
  ],
  failure: [
    {
      description: "insufficient funds, none locked",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(50),
        setup: {
          setOwner: true,
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        },
        revert: "TicketBooth::unlock: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds, some locked",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(50),
        setup: {
          setOwner: true,
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(40),
          lockedBy: deployer
        },
        revert: "TicketBooth::unlock: INSUFFICIENT_FUNDS"
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
          lockedAmount: constants.MaxUint256.sub(BigNumber.from(1)),
          lockedBy: deployer
        },
        revert: "TicketBooth::unlock: INSUFFICIENT_FUNDS"
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
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        },
        revert: "TicketBooth::unlock: NO_OP"
      })
    },
    {
      description: "unlocked by wrong operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        unlocker: addrs[0],
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(40),
        setup: {
          setOwner: true,
          stakedBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(40)
        },
        revert: "TicketBooth::unlock: INSUFFICIENT_FUNDS"
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
          setup: { stakedBalance, lockedAmount }
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        if (stakedBalance > 0) {
          // Add to the ticket balance so that they can be locked.
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
          .unlock(holder, projectId, amount);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Unlock")
          .withArgs(holder, projectId, amount, caller.address);

        // Get a reference to the stored amount locked.
        const storedLocked = await this.contract
          .connect(caller)
          .lockedBalanceOf(holder, projectId);

        // The expected locked is the previous locked plus the amount just locked.
        const expectedLocked = lockedAmount.sub(amount);

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
          unlocker,
          holder,
          amount,
          projectId,
          setup: { stakedBalance, lockedAmount },
          revert
        } = failureTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        if (stakedBalance > 0) {
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
            .connect(unlocker || caller)
            .unlock(holder, projectId, amount)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
