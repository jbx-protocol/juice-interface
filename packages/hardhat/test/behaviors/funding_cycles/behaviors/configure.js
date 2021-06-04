const {
  ethers: { BigNumber, constants }
} = require("hardhat");
const { expect } = require("chai");

/** 
  These tests rely on time manipulation quite a bit, which as far as i understand is hard to do precisely. 
  Ideally, the tests could mock the block.timestamp to preset numbers, but instead 
  they rely on 'fastforwarding' the time between operations. Fastforwarding creates a
  high probability that the subsequent operation will fall on a block with the intended timestamp,
  but there's a small chance that there's an off-by-one error. 

  If anyone has ideas on how to mitigate this, please let me know.
*/

const nullBallot = constants.AddressZero;

const tests = {
  success: [
    {
      description: "reconfigure, first funding cycle",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        // these configuration numbers aren't special.
        target: BigNumber.from(120),
        currency: BigNumber.from(1),
        duration: BigNumber.from(80),
        discountRate: BigNumber.from(180),
        fee: BigNumber.from(42),
        metadata: BigNumber.from(92),
        configureActiveFundingCycle: false,
        expectation: {
          configuredNumber: 1,
          configuredId: 1,
          basedOn: 0
        }
      })
    },
    {
      description: "reconfigure, during first funding cycle",
      fn: ({ deployer, ballot }) => {
        const preconfigureDuration = BigNumber.from(40);
        const preconfigureDiscountRate = BigNumber.from(120);
        return {
          caller: deployer,
          projectId: 1,
          // these configuration numbers aren't special.
          target: BigNumber.from(120),
          currency: BigNumber.from(1),
          duration: BigNumber.from(80),
          discountRate: BigNumber.from(180),
          fee: BigNumber.from(42),
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: false,
          setup: {
            preconfigure: {
              // these configuration numbers aren't special.
              target: BigNumber.from(240),
              currency: BigNumber.from(0),
              duration: preconfigureDuration,
              discountRate: preconfigureDiscountRate,
              fee: BigNumber.from(40),
              ballot: ballot.address,
              metadata: BigNumber.from(3),
              configureActiveFundingCycle: false
            },
            ballot: { duration: BigNumber.from(0) },
            fastforward: preconfigureDuration.sub(2)
          },
          expectation: {
            configuredNumber: 2,
            configuredId: 2,
            startTimeDistance: preconfigureDuration,
            basedOn: 1,
            weightFactor: 1
          }
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
            ballot: { duration: BigNumber.from(0) },
            ops: [
              {
                type: "fastforward",
                seconds: preconfigureDuration.sub(1)
              }
            ]
          },
          expectation: {
            configuredNumber: 2,
            configuredId: 2,
            startTimeDistance: preconfigureDuration,
            basedOn: 1,
            weightFactor: 1
          }
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
            ballot: { duration: BigNumber.from(0) },
            ops: [
              {
                type: "fastforward",
                seconds: preconfigureDuration
              }
            ]
          },
          expectation: {
            configuredNumber: 2,
            configuredId: 2,
            startTimeDistance: preconfigureDuration,
            basedOn: 1,
            weightFactor: 1
          }
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
            ballot: { duration: BigNumber.from(0) },
            ops: [
              {
                type: "fastforward",
                seconds: preconfigureDuration.add(1)
              }
            ]
          },
          expectation: {
            configuredNumber: 3,
            configuredId: 2,
            startTimeDistance: preconfigureDuration.mul(2),
            basedOn: 1,
            weightFactor: 2
          }
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
            ballot: { duration: BigNumber.from(0) },
            ops: [
              {
                type: "fastforward",
                seconds: preconfigureDuration.add(preconfigureDuration)
              }
            ]
          },
          expectation: {
            configuredNumber: 4,
            configuredId: 2,
            startTimeDistance: preconfigureDuration.mul(3),
            basedOn: 1,
            weightFactor: 3
          }
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
            ballot: { duration: BigNumber.from(0) },
            ops: [
              {
                type: "fastforward",
                seconds: preconfigureDuration.mul(4)
              }
            ]
          },
          expectation: {
            configuredNumber: 6,
            configuredId: 2,
            startTimeDistance: preconfigureDuration.mul(5),
            basedOn: 1,
            weightFactor: 5
          }
        };
      }
    },
    {
      description:
        "reconfigure, during first funding cycle, configuring the active cycle",
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
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: true,
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
            ballot: { duration: BigNumber.from(0) },
            ops: [
              {
                type: "fastforward",
                seconds: preconfigureDuration.sub(2)
              }
            ]
          },
          expectation: {
            configuredNumber: 1,
            configuredId: 1,
            basedOn: 0
          }
        };
      }
    },
    {
      description:
        "reconfigure, immediately after the first funding cycle, ignoring the option to configure the active one",
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
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: true,
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
            ballot: { duration: BigNumber.from(0) },
            ops: [
              {
                type: "fastforward",
                seconds: preconfigureDuration
              }
            ]
          },
          expectation: {
            configuredNumber: 2,
            configuredId: 2,
            startTimeDistance: preconfigureDuration,
            basedOn: 1,
            weightFactor: 1
          }
        };
      }
    },
    {
      description: "reconfigure, first funding cycle, max values",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        target: constants.MaxUint256,
        currency: BigNumber.from(2)
          .pow(8)
          .sub(1),
        duration: BigNumber.from(2)
          .pow(24)
          .sub(1),
        discountRate: BigNumber.from(200),
        fee: BigNumber.from(200),
        ballot: ballot.address,
        metadata: constants.MaxUint256,
        configureActiveFundingCycle: false,
        expectation: {
          configuredNumber: 1,
          configuredId: 1,
          basedOn: 0
        }
      })
    },
    {
      description:
        "reconfigure, adding other projects' funding cycles throughout",
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
            ballot: { duration: BigNumber.from(0) },
            ops: [
              // Add another configuration for a different project.
              {
                type: "configure",
                projectId: 1234,
                target: BigNumber.from(140),
                currency: BigNumber.from(1),
                duration: BigNumber.from(293),
                discountRate: BigNumber.from(93),
                fee: BigNumber.from(30),
                ballot: nullBallot,
                metadata: BigNumber.from(5),
                configureActiveFundingCycle: false
              },
              {
                type: "fastforward",
                seconds: preconfigureDuration.div(2).sub(1)
              },
              // Add another configuration for a different project.
              {
                type: "configure",
                projectId: 2345,
                target: BigNumber.from(140),
                currency: BigNumber.from(1),
                duration: BigNumber.from(293),
                discountRate: BigNumber.from(193),
                fee: BigNumber.from(30),
                ballot: nullBallot,
                metadata: BigNumber.from(5),
                configureActiveFundingCycle: false
              },
              {
                type: "fastforward",
                seconds: preconfigureDuration.div(2).sub(1)
              }
            ]
          },
          expectation: {
            configuredNumber: 2,
            configuredId: 4,
            weightFactor: 1,
            startTimeDistance: preconfigureDuration,
            basedOn: 1
          }
        };
      }
    },
    {
      description: "reconfigure, ballot duration just less than duration",
      fn: ({ deployer, ballot }) => {
        const preconfigureDuration = BigNumber.from(40);
        const preconfigureDiscountRate = BigNumber.from(120);
        return {
          caller: deployer,
          projectId: 1,
          // these configuration numbers aren't special.
          target: BigNumber.from(120),
          currency: BigNumber.from(1),
          duration: BigNumber.from(80),
          discountRate: BigNumber.from(180),
          fee: BigNumber.from(42),
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: false,
          setup: {
            preconfigure: {
              // these configuration numbers aren't special.
              target: BigNumber.from(240),
              currency: BigNumber.from(0),
              duration: preconfigureDuration,
              discountRate: preconfigureDiscountRate,
              fee: BigNumber.from(40),
              ballot: ballot.address,
              metadata: BigNumber.from(3),
              configureActiveFundingCycle: false
            },
            ballot: { duration: preconfigureDuration.sub(1) },
            fastforward: preconfigureDuration.sub(2)
          },
          expectation: {
            configuredNumber: 2,
            configuredId: 2,
            startTimeDistance: preconfigureDuration,
            basedOn: 1,
            weightFactor: 1
          }
        };
      }
    },
    {
      description:
        "reconfigure, ballot duration same as funding cycle duration",
      fn: ({ deployer, ballot }) => {
        const preconfigureDuration = BigNumber.from(40);
        const preconfigureDiscountRate = BigNumber.from(120);
        return {
          caller: deployer,
          projectId: 1,
          // these configuration numbers aren't special.
          target: BigNumber.from(120),
          currency: BigNumber.from(1),
          duration: BigNumber.from(80),
          discountRate: BigNumber.from(180),
          fee: BigNumber.from(42),
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: false,
          setup: {
            preconfigure: {
              // these configuration numbers aren't special.
              target: BigNumber.from(240),
              currency: BigNumber.from(0),
              duration: preconfigureDuration,
              discountRate: preconfigureDiscountRate,
              fee: BigNumber.from(40),
              ballot: ballot.address,
              metadata: BigNumber.from(3),
              configureActiveFundingCycle: false
            },
            ballot: { duration: preconfigureDuration },
            fastforward: preconfigureDuration.sub(2)
          },
          expectation: {
            configuredNumber: 3,
            configuredId: 2,
            startTimeDistance: preconfigureDuration.mul(2),
            basedOn: 1,
            weightFactor: 2
          }
        };
      }
    },
    {
      description:
        "reconfigure, ballot duration just over the funding cycle duration",
      fn: ({ deployer, ballot }) => {
        const preconfigureDuration = BigNumber.from(40);
        const preconfigureDiscountRate = BigNumber.from(120);
        return {
          caller: deployer,
          projectId: 1,
          // these configuration numbers aren't special.
          target: BigNumber.from(120),
          currency: BigNumber.from(1),
          duration: BigNumber.from(80),
          discountRate: BigNumber.from(180),
          fee: BigNumber.from(42),
          metadata: BigNumber.from(92),
          configureActiveFundingCycle: false,
          setup: {
            preconfigure: {
              // these configuration numbers aren't special.
              target: BigNumber.from(240),
              currency: BigNumber.from(0),
              duration: preconfigureDuration,
              discountRate: preconfigureDiscountRate,
              fee: BigNumber.from(40),
              ballot: ballot.address,
              metadata: BigNumber.from(3),
              configureActiveFundingCycle: false
            },
            ballot: { duration: preconfigureDuration.add(1) },
            fastforward: preconfigureDuration.sub(2)
          },
          expectation: {
            configuredNumber: 3,
            configuredId: 2,
            startTimeDistance: preconfigureDuration.mul(2),
            basedOn: 1,
            weightFactor: 2
          }
        };
      }
    }
  ],
  failure: [
    {
      description: "target is 0",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        target: BigNumber.from(0),
        currency: BigNumber.from(1),
        duration: BigNumber.from(80),
        discountRate: BigNumber.from(180),
        fee: BigNumber.from(42),
        ballot: ballot.address,
        metadata: BigNumber.from(92),
        configureActiveFundingCycle: false,
        revert: "FundingCycles::configure: BAD_TARGET"
      })
    },
    {
      description: "duration is 0",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        target: BigNumber.from(10),
        currency: BigNumber.from(1),
        duration: BigNumber.from(0),
        discountRate: BigNumber.from(180),
        fee: BigNumber.from(42),
        ballot: ballot.address,
        metadata: BigNumber.from(92),
        configureActiveFundingCycle: false,
        revert: "FundingCycles::configure: BAD_DURATION"
      })
    },
    {
      description: "duration more than the max allowed",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        target: BigNumber.from(10),
        currency: BigNumber.from(1),
        duration: BigNumber.from(2).pow(24),
        discountRate: BigNumber.from(180),
        fee: BigNumber.from(42),
        ballot: ballot.address,
        metadata: BigNumber.from(92),
        configureActiveFundingCycle: false,
        revert: "FundingCycles::configure: BAD_DURATION"
      })
    },
    {
      description: "discount rate over 100%",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        target: BigNumber.from(10),
        currency: BigNumber.from(1),
        duration: BigNumber.from(100),
        discountRate: BigNumber.from(201),
        fee: BigNumber.from(42),
        ballot: ballot.address,
        metadata: BigNumber.from(92),
        configureActiveFundingCycle: false,
        revert: "FundingCycles::configure: BAD_DISCOUNT_RATE"
      })
    },
    {
      description: "currency over max allowed",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        target: BigNumber.from(10),
        currency: BigNumber.from(2).pow(8),
        duration: BigNumber.from(100),
        discountRate: BigNumber.from(80),
        fee: BigNumber.from(42),
        ballot: ballot.address,
        metadata: BigNumber.from(92),
        configureActiveFundingCycle: false,
        revert: "FundingCycles::configure: BAD_CURRENCY"
      })
    },
    {
      description: "fee over 100%",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        target: BigNumber.from(10),
        currency: BigNumber.from(2).pow(8),
        duration: BigNumber.from(100),
        discountRate: BigNumber.from(80),
        fee: BigNumber.from(201),
        ballot: ballot.address,
        metadata: BigNumber.from(92),
        configureActiveFundingCycle: false,
        revert: ""
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
          metadata,
          configureActiveFundingCycle,
          setup: { preconfigure, ballot, ops = [] } = {},
          expectation
        } = successTest.fn(this);

        // Reconfigure must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);

        // If a ballot was provided, mock the ballot contract with the provided properties.
        if (ballot) await this.ballot.mock.duration.returns(ballot.duration);

        let preconfigureBlockNumber;

        if (preconfigure) {
          const tx = await this.contract
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
          preconfigureBlockNumber = tx.blockNumber;
        }

        // Get a reference to the timestamp right after the preconfiguration occurs.
        const expectedPreconfigureStart = await this.getTimestamp(
          preconfigureBlockNumber
        );

        // Do any other specified operations.
        for (let i = 0; i < ops.length; i += 1) {
          const op = ops[i];
          switch (op.type) {
            case "configure": {
              // eslint-disable-next-line no-await-in-loop
              await this.contract
                .connect(caller)
                .configure(
                  op.projectId,
                  op.target,
                  op.currency,
                  op.duration,
                  op.discountRate,
                  op.fee,
                  op.ballot,
                  op.metadata,
                  op.configureActiveFundingCycle
                );

              break;
            }
            case "fastforward":
              // Fast forward the clock if needed.
              // Subtract 1 so that the next operations mined block is likely to fall on the intended timestamp.
              // eslint-disable-next-line no-await-in-loop
              await this.fastforward(op.seconds.sub(1));
              break;
            default:
              break;
          }
        }

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
            nullBallot,
            metadata,
            configureActiveFundingCycle
          );

        // Get the current timestamp after the transaction.
        const now = await this.getTimestamp(tx.blockNumber);

        // Get a reference to the base weight.
        const baseWeight = await this.contract.BASE_WEIGHT();

        let expectedWeight = baseWeight;

        // Multiply the discount the amount of times specified.
        if (expectation.weightFactor) {
          for (let i = 0; i < expectation.weightFactor; i += 1) {
            expectedWeight = expectedWeight
              .mul(preconfigure.discountRate)
              .div(200);
          }
        }

        // Get the time when the configured funding cycle starts.
        let expectedStart;
        if (preconfigure) {
          expectedStart = !expectation.startTimeDistance
            ? expectedPreconfigureStart
            : expectedPreconfigureStart.add(expectation.startTimeDistance);
        } else {
          expectedStart = now;
        }

        // Expect two events to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Configure")
          .withArgs(
            expectation.configuredId,
            projectId,
            now,
            target,
            currency,
            duration,
            discountRate,
            metadata,
            nullBallot,
            caller.address
          );

        // Expect an Init event if not configuring the same funding cycle again.
        if (expectation.configuredId > 1) {
          await expect(tx)
            .to.emit(this.contract, "Init")
            .withArgs(
              expectation.configuredId,
              projectId,
              expectation.configuredNumber,
              expectation.basedOn,
              expectedWeight,
              expectedStart
            );
        }

        // Get a reference to the funding cycle that was stored.
        const storedFundingCycle = await this.contract.get(
          expectation.configuredId
        );

        // Expect the stored values to match what's expected.
        expect(storedFundingCycle.id).to.equal(expectation.configuredId);
        expect(storedFundingCycle.projectId).to.equal(projectId);
        expect(storedFundingCycle.number).to.equal(
          expectation.configuredNumber
        );
        expect(storedFundingCycle.basedOn).to.equal(expectation.basedOn);
        expect(storedFundingCycle.weight).to.equal(expectedWeight);
        expect(storedFundingCycle.ballot).to.equal(nullBallot);
        expect(storedFundingCycle.start).to.equal(expectedStart);
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
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
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
          revert
        } = failureTest.fn(this);
        // Reconfigure must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);

        await expect(
          this.contract
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
            )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
