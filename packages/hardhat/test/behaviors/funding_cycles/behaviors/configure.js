const {
  ethers: { BigNumber }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "reconfigure, first funding cycle",
      fn: ({ deployer, ballot }) => {
        return {
          caller: deployer,
          projectId: 1,
          target: BigNumber.from(120),
          currency: BigNumber.from(1),
          duration: BigNumber.from(80),
          discountRate: BigNumber.from(180),
          fee: BigNumber.from(42),
          ballot: ballot.address,
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: false
        };
      }
    },
    {
      description: "reconfigure, during first funding cycle",
      fn: ({ deployer, ballot }) => {
        const preconfigureDuration = BigNumber.from(40);
        const preconfigureDiscountRate = BigNumber.from(120);
        return {
          caller: deployer,
          projectId: 1,
          target: BigNumber.from(120),
          currency: BigNumber.from(1),
          duration: BigNumber.from(80),
          discountRate: BigNumber.from(180),
          fee: BigNumber.from(42),
          ballot: ballot.address,
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: false,
          setup: {
            preconfigure: {
              target: BigNumber.from(240),
              currency: BigNumber.from(0),
              duration: preconfigureDuration,
              discountRate: preconfigureDiscountRate,
              fee: BigNumber.from(40),
              ballot: ballot.address,
              metadata: BigNumber.from(3),
              configureActiveFundingCycle: false
            },
            fastforward: preconfigureDuration.sub(2)
          },
          expectedConfiguredNumber: 2,
          expectedStartTimeDistance: preconfigureDuration,
          expectedWeightFactor: 1
        };
      }
    },
    {
      description: "reconfigure, at the end of first funding cycle",
      fn: ({ deployer, ballot }) => {
        const preconfigureDuration = BigNumber.from(40);
        const preconfigureDiscountRate = BigNumber.from(120);
        return {
          caller: deployer,
          projectId: 1,
          target: BigNumber.from(120),
          currency: BigNumber.from(1),
          duration: BigNumber.from(80),
          discountRate: BigNumber.from(180),
          fee: BigNumber.from(42),
          ballot: ballot.address,
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: false,
          setup: {
            preconfigure: {
              target: BigNumber.from(240),
              currency: BigNumber.from(0),
              duration: preconfigureDuration,
              discountRate: preconfigureDiscountRate,
              fee: BigNumber.from(40),
              ballot: ballot.address,
              metadata: BigNumber.from(3),
              configureActiveFundingCycle: false
            },
            fastforward: preconfigureDuration.sub(1)
          },
          expectedConfiguredNumber: 2,
          expectedStartTimeDistance: preconfigureDuration,
          expectedWeightFactor: 1
        };
      }
    },
    {
      description: "reconfigure, immediately after the first funding cycle",
      fn: ({ deployer, ballot }) => {
        const preconfigureDuration = BigNumber.from(40);
        const preconfigureDiscountRate = BigNumber.from(120);
        return {
          caller: deployer,
          projectId: 1,
          target: BigNumber.from(120),
          currency: BigNumber.from(1),
          duration: BigNumber.from(80),
          discountRate: BigNumber.from(180),
          fee: BigNumber.from(42),
          ballot: ballot.address,
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: false,
          setup: {
            preconfigure: {
              target: BigNumber.from(240),
              currency: BigNumber.from(0),
              duration: preconfigureDuration,
              discountRate: preconfigureDiscountRate,
              fee: BigNumber.from(40),
              ballot: ballot.address,
              metadata: BigNumber.from(3),
              configureActiveFundingCycle: false
            },
            fastforward: preconfigureDuration
          },
          expectedConfiguredNumber: 2,
          expectedStartTimeDistance: preconfigureDuration,
          expectedWeightFactor: 1
        };
      }
    },
    {
      description: "reconfigure, shortly after the first funding cycle",
      fn: ({ deployer, ballot }) => {
        const preconfigureDuration = BigNumber.from(40);
        const preconfigureDiscountRate = BigNumber.from(120);
        return {
          caller: deployer,
          projectId: 1,
          target: BigNumber.from(120),
          currency: BigNumber.from(1),
          duration: BigNumber.from(80),
          discountRate: BigNumber.from(180),
          fee: BigNumber.from(42),
          ballot: ballot.address,
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: false,
          setup: {
            preconfigure: {
              target: BigNumber.from(240),
              currency: BigNumber.from(0),
              duration: preconfigureDuration,
              discountRate: preconfigureDiscountRate,
              fee: BigNumber.from(40),
              ballot: ballot.address,
              metadata: BigNumber.from(3),
              configureActiveFundingCycle: false
            },
            fastforward: preconfigureDuration.add(1)
          },
          expectedConfiguredNumber: 3,
          expectedStartTimeDistance: preconfigureDuration.mul(2),
          expectedWeightFactor: 2
        };
      }
    },
    {
      description: "reconfigure, a few cycles after the first funding cycle",
      fn: ({ deployer, ballot }) => {
        const preconfigureDuration = BigNumber.from(40);
        const preconfigureDiscountRate = BigNumber.from(120);
        return {
          caller: deployer,
          projectId: 1,
          target: BigNumber.from(120),
          currency: BigNumber.from(1),
          duration: BigNumber.from(80),
          discountRate: BigNumber.from(180),
          fee: BigNumber.from(42),
          ballot: ballot.address,
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: false,
          setup: {
            preconfigure: {
              target: BigNumber.from(240),
              currency: BigNumber.from(0),
              duration: preconfigureDuration,
              discountRate: preconfigureDiscountRate,
              fee: BigNumber.from(40),
              ballot: ballot.address,
              metadata: BigNumber.from(3),
              configureActiveFundingCycle: false
            },
            fastforward: preconfigureDuration.add(preconfigureDuration)
          },
          expectedConfiguredNumber: 4,
          expectedStartTimeDistance: preconfigureDuration.mul(3),
          expectedWeightFactor: 3
        };
      }
    },
    {
      description: "reconfigure, many cycles after the first funding cycle",
      fn: ({ deployer, ballot }) => {
        const preconfigureDuration = BigNumber.from(40);
        const preconfigureDiscountRate = BigNumber.from(120);
        return {
          caller: deployer,
          projectId: 1,
          target: BigNumber.from(120),
          currency: BigNumber.from(1),
          duration: BigNumber.from(80),
          discountRate: BigNumber.from(180),
          fee: BigNumber.from(42),
          ballot: ballot.address,
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: false,
          setup: {
            preconfigure: {
              target: BigNumber.from(240),
              currency: BigNumber.from(0),
              duration: preconfigureDuration,
              discountRate: preconfigureDiscountRate,
              fee: BigNumber.from(40),
              ballot: ballot.address,
              metadata: BigNumber.from(3),
              configureActiveFundingCycle: false
            },
            fastforward: preconfigureDuration.mul(4)
          },
          expectedConfiguredNumber: 6,
          expectedStartTimeDistance: preconfigureDuration.mul(5),
          expectedWeightFactor: 5
        };
      }
    }
  ],
  failure: [
    {
      description: "index out of bounds",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 0,
        operator: addrs[0],
        permissionIndexes: [256],
        revert: "OperatorStore::_packedPermissions: INDEX_OUT_OF_BOUNDS"
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
          target,
          currency,
          duration,
          discountRate,
          fee,
          ballot,
          metadata,
          configureActiveFundingCycle,
          setup: { preconfigure, fastforward } = {},
          expectedConfiguredNumber,
          expectedStartTimeDistance,
          expectedWeightFactor
        } = successTest.fn(this);

        // Reconfigure must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);

        if (preconfigure) {
          await this.contract
            .connect(caller)
            .configure(
              projectId,
              preconfigure.target,
              preconfigure.currency,
              preconfigure.duration,
              preconfigure.discountRate,
              preconfigure.fee,
              preconfigure.ballot,
              preconfigure.metadata,
              preconfigure.configureActiveFundingCycle
            );
        }

        // Get a reference to the timestamp right after the preconfiguration occurs.
        const expectedPreconfigureStart = await this.getTimestamp();

        // Fast forward the clock if needed.
        if (fastforward) await this.fastforward(fastforward);

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .configure(
            projectId,
            target,
            currency,
            duration,
            discountRate,
            fee,
            ballot,
            metadata,
            configureActiveFundingCycle
          );

        // Get the current timestamp after the transaction.
        const now = await this.getTimestamp();

        // Get a reference to the base weight.
        const baseWeight = await this.contract.BASE_WEIGHT();

        // Expect two events to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Configure")
          .withArgs(
            preconfigure ? 2 : 1,
            projectId,
            now,
            target,
            currency,
            duration,
            discountRate,
            metadata,
            ballot,
            caller.address
          );

        let expectedWeight = baseWeight;
        if (expectedWeightFactor) {
          for (let i = 0; i < expectedWeightFactor; i += 1) {
            expectedWeight = expectedWeight
              .mul(preconfigure.discountRate)
              .div(200);
          }
        }

        await expect(tx)
          .to.emit(this.contract, "Init")
          .withArgs(
            preconfigure ? 2 : 1,
            projectId,
            preconfigure ? expectedConfiguredNumber : 1,
            preconfigure ? 1 : 0,
            expectedWeight,
            preconfigure
              ? expectedPreconfigureStart.add(expectedStartTimeDistance)
              : now
          );

        // Get a reference to the base weight.
        const storedFundingCycle = await this.contract.get(
          preconfigure ? 2 : 1
        );

        // Expect the stored values to match what's expected.
        expect(storedFundingCycle.id).to.equal(preconfigure ? 2 : 1);
        expect(storedFundingCycle.projectId).to.equal(projectId);
        expect(storedFundingCycle.number).to.equal(
          preconfigure ? expectedConfiguredNumber : 1
        );
        expect(storedFundingCycle.previous).to.equal(preconfigure ? 1 : 0);
        expect(storedFundingCycle.weight).to.equal(expectedWeight);
        expect(storedFundingCycle.ballot).to.equal(ballot);
        expect(storedFundingCycle.start).to.equal(
          preconfigure
            ? expectedPreconfigureStart.add(expectedStartTimeDistance)
            : now
        );
        expect(storedFundingCycle.configured).to.equal(now);
        expect(storedFundingCycle.duration).to.equal(duration);
        expect(storedFundingCycle.target).to.equal(target);
        expect(storedFundingCycle.currency).to.equal(currency);
        expect(storedFundingCycle.fee).to.equal(fee);
        expect(storedFundingCycle.discountRate).to.equal(discountRate);
        expect(storedFundingCycle.tapped).to.equal(0);
        expect(storedFundingCycle.metadata).to.equal(metadata);
      });
    });
  });
  // describe("Failure cases", function() {
  //   tests.failure.forEach(function(failureTest) {
  //     it(failureTest.description, async function() {
  //       const {
  //         caller,
  //         projectId,
  //         operator,
  //         permissionIndexes,
  //         revert
  //       } = failureTest.fn(this);
  //       await expect(
  //         this.contract
  //           .connect(caller)
  //           .setOperator(projectId, operator.address, permissionIndexes)
  //       ).to.be.revertedWith(revert);
  //     });
  //   });
  // });
};
