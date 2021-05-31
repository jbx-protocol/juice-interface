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
          IOUBalance: BigNumber.from(50),
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
          IOUBalance: BigNumber.from(50),
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
          IOUBalance: constants.MaxUint256,
          lockedAmount: constants.MaxUint256
        }
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(10),
        setup: { setOwner: false },
        revert: "Administrated: UNAUTHORIZED"
      })
    },
    {
      description: "insufficient funds, none locked",
      fn: ({ deployer }) => ({
        caller: deployer,
        holder: deployer.address,
        projectId: 1,
        amount: BigNumber.from(50),
        setup: {
          setOwner: true,
          IOUBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(0)
        },
        revert: "Tickets::unlock: INSUFFICIENT_FUNDS"
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
          IOUBalance: BigNumber.from(50),
          lockedAmount: BigNumber.from(40)
        },
        revert: "Tickets::unlock: INSUFFICIENT_FUNDS"
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
          IOUBalance: constants.MaxUint256,
          lockedAmount: constants.MaxUint256.sub(BigNumber.from(1))
        },
        revert: "Tickets::unlock: INSUFFICIENT_FUNDS"
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
          IOUBalance: constants.MaxUint256,
          lockedAmount: constants.MaxUint256
        },
        revert: "Tickets::unlock: NO_OP"
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
          setup: { IOUBalance, lockedAmount }
        } = successTest.fn(this);
        // Initialize the project's tickets to be able to print as part of setup.
        // Initial and lock must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);
        await this.contract
          .connect(caller)
          .initialize(caller.address, projectId);

        if (IOUBalance > 0) {
          // Add to the ticket balance so that they can be locked.
          await this.contract
            .connect(caller)
            .initialize(caller.address, projectId);
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
          .unlock(holder, projectId, amount);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Unlock")
          .withArgs(holder, projectId, amount, caller.address);

        // Get a reference to the stored amount locked.
        const storedLocked = await this.contract
          .connect(caller)
          .locked(holder, projectId);

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
          holder,
          amount,
          projectId,
          setup: { setOwner, IOUBalance, lockedAmount },
          revert
        } = failureTest.fn(this);

        if (setOwner) {
          // Initialize the project's tickets to be able to print as part of setup.
          // Initial and lock must be called by an admin, so first set the owner of the contract, which make the caller an admin.
          await this.contract.connect(caller).setOwnership(caller.address);
        }

        if (IOUBalance > 0) {
          // Add to the ticket balance so that they can be locked.
          await this.contract
            .connect(caller)
            .initialize(caller.address, projectId);
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
          this.contract.connect(caller).unlock(holder, projectId, amount)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
