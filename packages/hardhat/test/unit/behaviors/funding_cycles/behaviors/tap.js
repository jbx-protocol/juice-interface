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

const testTemplate = ({
  op = {},
  setup = {},
  preconfigure = {},
  fastforward,
  ops = [],
  expectation = {},
  revert
}) => ({ deployer }) => ({
  caller: deployer,
  controller: deployer.address,
  projectId: 1,
  amount: BigNumber.from(20),
  setup: {
    preconfigure: {
      target: BigNumber.from(240),
      currency: BigNumber.from(0),
      duration: BigNumber.from(1),
      cycleLimit: BigNumber.from(0),
      discountRate: BigNumber.from(120),
      fee: BigNumber.from(40),
      metadata: BigNumber.from(3),
      configureActiveFundingCycle: false,
      ...preconfigure
    },
    ops: [
      ...ops,
      ...(fastforward
        ? [
            {
              type: "fastforward",
              seconds: fastforward
            }
          ]
        : [])
    ],
    ...setup
  },
  expectation,
  ...op,
  revert
});
const tests = {
  success: [
    {
      description: "first configuration, partial amount",
      fn: testTemplate({
        op: {
          // Amount is a part of the target.
          amount: BigNumber.from(20)
        },
        preconfigure: {
          // Greater than the amount.
          target: BigNumber.from(120)
        },
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(20)
        }
      })
    },
    {
      description: "first configuration, full amount",
      fn: testTemplate({
        op: {
          // Amount is equal to the target.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // Equal to the amount.
          target: BigNumber.from(120)
        },
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(120)
        }
      })
    },
    {
      description: "second overriding configuration",
      fn: testTemplate({
        op: {
          // Bigger than the preconfiguration, less than the second configuration.
          amount: BigNumber.from(140)
        },
        preconfigure: {
          // Less than the amount being tapped. Should be overwritten.
          target: BigNumber.from(120)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: true,
            // Greater than the amount being tapped.
            target: BigNumber.from(150),
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(2),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(140)
        }
      })
    },
    {
      description: "first configuration, with a standby cycle",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the standby.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(120)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Less than the amount being tapped since this configuration shouldnt be tapped.
            target: BigNumber.from(50),
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(2),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(120)
        }
      })
    },
    {
      description: "second configuration, with approved ballot",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the standby.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // Less than the amount being tapped. Should be ignored.
          target: BigNumber.from(100),
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Greater than the amount being tapped.
            target: BigNumber.from(120),
            cycleLimit: BigNumber.from(0),
            ballot: {
              // This funding cycle (2) is approved.
              fundingCycleId: 2,
              state: BigNumber.from(0)
            },
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(2),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        // Fast forward the full duration.
        fastforward: BigNumber.from(86400),
        expectation: {
          tappedId: 2,
          tappedNumber: 2,
          newTappedAmount: BigNumber.from(120)
        }
      })
    },
    {
      description: "first configuration, with an active ballot",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the standby.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(140),
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Less than the amount being tapped. Should be ignored
            target: BigNumber.from(100),
            ballot: {
              // This funding cycle (2) is not yet approved.
              fundingCycleId: 2,
              state: BigNumber.from(1)
            },
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(2),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        // Fast forward past the full duration.
        fastforward: BigNumber.from(86401),
        expectation: {
          tappedId: 3,
          tappedNumber: 2,
          initNumber: 2,
          basedOn: 1,
          newTappedAmount: BigNumber.from(120)
        }
      })
    },
    {
      description: "first configuration, with a failed ballot",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the standby.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(140),
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Less than the amount being tapped. Should be ignored
            target: BigNumber.from(100),
            ballot: {
              // This funding cycle (2) is not yet approved.
              fundingCycleId: 2,
              state: BigNumber.from(2)
            },
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(2),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        // Fast forward past the full duration.
        fastforward: BigNumber.from(86401),
        expectation: {
          tappedId: 3,
          tappedNumber: 2,
          initNumber: 2,
          basedOn: 1,
          newTappedAmount: BigNumber.from(120)
        }
      })
    },
    {
      description: "first configuration, with a standby ballot",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the standby.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(140),
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Less than the amount being tapped. Should be ignored
            target: BigNumber.from(100),
            ballot: {
              // This funding cycle (2) is not yet approved.
              fundingCycleId: 2,
              state: BigNumber.from(3)
            },
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(2),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        // Fast forward past the full duration.
        fastforward: BigNumber.from(86401),
        expectation: {
          tappedId: 3,
          tappedNumber: 2,
          initNumber: 2,
          basedOn: 1,
          newTappedAmount: BigNumber.from(120)
        }
      })
    },
    {
      description: "first configuration, a while later",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the standby.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(140),
          duration: BigNumber.from(1)
        },
        // Fast forward multiples of the duration.
        fastforward: BigNumber.from(86400 * 3 + 1),
        expectation: {
          tappedId: 2,
          tappedNumber: 4,
          initNumber: 4,
          basedOn: 1,
          newTappedAmount: BigNumber.from(120)
        }
      })
    },
    {
      description: "first configuration, twice",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the standby.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(140)
        },
        ops: [
          {
            projectId: 1,
            type: "tap",
            // A partial amount.
            amount: BigNumber.from(20)
          }
        ],
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(140)
        }
      })
    },
    {
      description: "first configuration, non recurring",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the standby.
          amount: BigNumber.from(20),
          discountRate: BigNumber.from(201)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(140)
        },
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(20)
        }
      })
    },
    {
      description: "taps, first configuration, max uints",
      fn: testTemplate({
        op: {
          amount: constants.MaxUint256
        },
        preconfigure: {
          target: constants.MaxUint256
        },
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: constants.MaxUint256
        }
      })
    },
    {
      description: "during cycle limit",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the cycle limit.
          amount: BigNumber.from(100)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(140),
          duration: BigNumber.from(10)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Less than the amount being tapped. Should be ignored
            target: BigNumber.from(100),
            ballot: {
              // This funding cycle (2) is approved.
              fundingCycleId: 2,
              state: BigNumber.from(0)
            },
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            expectedCyclesUsed: 1
          }
        ],
        // Fast forward past the cycle limits.
        fastforward: BigNumber.from(86400 * 11 + 1),
        expectation: {
          tappedId: 3,
          tappedNumber: 3,
          initNumber: 3,
          basedOn: 2,
          newTappedAmount: BigNumber.from(100)
        }
      })
    },
    {
      description: "during last cycle of cycle limit",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the cycle limit.
          amount: BigNumber.from(100)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(140),
          duration: BigNumber.from(10)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Less than the amount being tapped. Should be ignored
            target: BigNumber.from(100),
            ballot: {
              // This funding cycle (2) is approved.
              fundingCycleId: 2,
              state: BigNumber.from(0)
            },
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            expectedCyclesUsed: 4
          }
        ],
        // Fast forward past the cycle limits.
        fastforward: BigNumber.from(86400 * 14 + 1),
        expectation: {
          tappedId: 3,
          tappedNumber: 6,
          initNumber: 6,
          basedOn: 2,
          newTappedAmount: BigNumber.from(100)
        }
      })
    },
    {
      description: "after cycle limit",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the cycle limit.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(140),
          duration: BigNumber.from(10)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Less than the amount being tapped. Should be ignored
            target: BigNumber.from(100),
            ballot: {
              // This funding cycle (2) is approved.
              fundingCycleId: 2,
              state: BigNumber.from(0)
            },
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            expectedCyclesUsed: 5
          }
        ],
        // Fast forward past the cycle limits.
        fastforward: BigNumber.from(86400 * 15 + 1),
        expectation: {
          tappedId: 3,
          tappedNumber: 7,
          initNumber: 7,
          basedOn: 2,
          newTappedAmount: BigNumber.from(120)
        }
      })
    },
    {
      description: "a while after cycle limit",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the cycle limit.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(140),
          duration: BigNumber.from(10)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Less than the amount being tapped. Should be ignored
            target: BigNumber.from(100),
            ballot: {
              // This funding cycle (2) is approved.
              fundingCycleId: 2,
              state: BigNumber.from(0)
            },
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            expectedCyclesUsed: 5
          }
        ],
        // Fast forward past the cycle limits.
        fastforward: BigNumber.from(86400 * 35 + 1),
        expectation: {
          tappedId: 3,
          tappedNumber: 9,
          initNumber: 9,
          basedOn: 2,
          newTappedAmount: BigNumber.from(120)
        }
      })
    },
    {
      description: "with second cycle limit during first",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the cycle limit.
          amount: BigNumber.from(200)
        },
        preconfigure: {
          // Greater than the amount being tapped.
          target: BigNumber.from(140),
          duration: BigNumber.from(10)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Less than the amount being tapped. Should be ignored
            target: BigNumber.from(100),
            ballot: {
              // This funding cycle (2) is approved.
              fundingCycleId: 2,
              state: BigNumber.from(0)
            },
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            expectedCyclesUsed: 1
          },
          {
            type: "fastforward",
            seconds: BigNumber.from(86400 * 11 + 1)
          },
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Less than the amount being tapped. Should be ignored
            target: BigNumber.from(200),
            ballot: {
              // This funding cycle (3) is approved.
              fundingCycleId: 3,
              state: BigNumber.from(0)
            },
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(2),
            cycleLimit: BigNumber.from(4),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            expectedCyclesUsed: 0
          }
        ],
        // Fast forward past the cycle limits.
        fastforward: BigNumber.from(86401),
        expectation: {
          tappedId: 3,
          tappedNumber: 4,
          newTappedAmount: BigNumber.from(200)
        }
      })
    },
    {
      description: "with duration of zero, right away",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the standby.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // At least the amount being tapped. Should be ignored.
          target: BigNumber.from(120),
          duration: BigNumber.from(0)
        },
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          newTappedAmount: BigNumber.from(120)
        }
      })
    },
    {
      description: "with duration of zero, a while later",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the standby.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          // At least the amount being tapped. Should be ignored.
          target: BigNumber.from(120),
          duration: BigNumber.from(0)
        },
        // Fast forward the full duration.
        fastforward: BigNumber.from(12345678),
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          newTappedAmount: BigNumber.from(120)
        }
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: addrs[0].address,
        setup: { preconfigure: null },
        revert: "TerminalUtility: UNAUTHORIZED",
        // below values copied from template
        projectId: 1,
        amount: BigNumber.from(20)
      })
    },
    {
      description: "project not found",
      fn: testTemplate({
        setup: {
          // No preconfigure
          preconfigure: null
        },
        revert: "FundingCycles::_tappable: NOT_FOUND"
      })
    },
    {
      description: "non recurring",
      fn: testTemplate({
        preconfigure: {
          discountRate: BigNumber.from(201),
          duration: BigNumber.from(1)
        },
        fastforward: BigNumber.from(86401),
        revert: "FundingCycles::_tappable: NON_RECURRING"
      })
    },
    {
      description: "insufficient funds, first tap",
      fn: testTemplate({
        op: {
          // More than the target.
          amount: BigNumber.from(120)
        },
        preconfigure: {
          target: BigNumber.from(100)
        },
        revert: "FundingCycles::tap: INSUFFICIENT_FUNDS"
      })
    },
    {
      description: "insufficient funds, subsequent tap",
      fn: testTemplate({
        op: {
          // More than the target when added to what's already tapped.
          amount: BigNumber.from(101),
          projectId: 1
        },
        preconfigure: {
          projectId: 1,
          target: BigNumber.from(100)
        },
        ops: [
          {
            type: "tap",
            projectId: 1,
            amount: BigNumber.from(20)
          }
        ],
        revert: "FundingCycles::tap: INSUFFICIENT_FUNDS"
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
          amount,
          setup: { preconfigure, ops = [] },
          expectation
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        let preconfigureBlockNumber;

        if (preconfigure) {
          const tx = await this.contract.connect(caller).configure(
            projectId,
            {
              target: preconfigure.target,
              currency: preconfigure.currency,
              duration: preconfigure.duration,
              cycleLimit: preconfigure.cycleLimit,
              discountRate: preconfigure.discountRate,
              ballot: this.ballot.address
            },
            preconfigure.metadata,
            preconfigure.fee,
            preconfigure.configureActiveFundingCycle
          );
          preconfigureBlockNumber = tx.blockNumber;
          await this.setTimeMarkFn(tx.blockNumber);
        }

        // Get a reference to the timestamp right after the preconfiguration occurs.
        const expectedPreconfigureStart = await this.getTimestampFn(
          preconfigureBlockNumber
        );

        // Mock the duration as 0.
        await this.ballot.mock.duration.returns(BigNumber.from(0));

        const discountRatesToApply = [];
        const durationsToApply = [];

        for (let i = 0; i < ops.length; i += 1) {
          const op = ops[i];
          switch (op.type) {
            case "configure": {
              // eslint-disable-next-line no-await-in-loop
              const tx = await this.contract.connect(caller).configure(
                projectId,
                {
                  target: op.target,
                  currency: op.currency,
                  duration: op.duration,
                  cycleLimit: op.cycleLimit,
                  discountRate: op.discountRate,
                  ballot: this.ballot.address
                },
                op.metadata,
                op.fee,
                op.configureActiveFundingCycle
              );

              // Mock the ballot state for this reconfiguration if needed.
              if (op.ballot) {
                // eslint-disable-next-line no-await-in-loop
                await this.ballot.mock.state
                  .withArgs(
                    op.ballot.fundingCycleId,
                    // eslint-disable-next-line no-await-in-loop
                    await this.getTimestampFn(tx.blockNumber)
                  )
                  .returns(op.ballot.state);
              }

              if (op.expectedCyclesUsed) {
                for (let j = 0; j < op.expectedCyclesUsed; j += 1) {
                  discountRatesToApply.push(op.discountRate);
                  durationsToApply.push(op.duration);
                }
              }

              break;
            }
            case "tap":
              // eslint-disable-next-line no-await-in-loop
              await this.contract.connect(caller).tap(op.projectId, op.amount);
              break;
            case "fastforward":
              // Subtract 1 so that the next operations mined block is likely to fall on the intended timestamp.
              // eslint-disable-next-line no-await-in-loop
              await this.fastforwardFn(op.seconds.sub(1));
              break;
            default:
              break;
          }
        }

        const tx = await this.contract.connect(caller).tap(projectId, amount);

        // Get the current timestamp after the transaction.
        const now = await this.getTimestampFn(tx.blockNumber);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Tap")
          .withArgs(
            expectation.tappedId,
            projectId,
            amount,
            expectation.newTappedAmount,
            caller.address
          );

        // Expect an Init event if not configuring the same funding cycle again.
        if (expectation.initNumber > 1) {
          // Get a reference to the base weight.
          const baseWeight = await this.contract.BASE_WEIGHT();

          let expectedWeight = baseWeight;

          // Multiply the discount the amount of times specified.
          for (
            let i = 0;
            i < expectation.initNumber - 1 - discountRatesToApply.length;
            i += 1
          ) {
            expectedWeight = expectedWeight
              .mul(BigNumber.from(1000).sub(preconfigure.discountRate))
              .div(1000);
          }
          for (let i = 0; i < discountRatesToApply.length; i += 1) {
            expectedWeight = expectedWeight
              .mul(BigNumber.from(1000).sub(discountRatesToApply[i]))
              .div(1000);
          }

          // Get the time when the configured funding cycle starts.
          let expectedStart;
          if (preconfigure) {
            expectedStart = expectedPreconfigureStart.add(
              preconfigure.duration
                .mul(86400)
                .mul(expectation.initNumber - 1 - durationsToApply.length)
            );
            for (let i = 0; i < durationsToApply.length; i += 1) {
              expectedStart = expectedStart.add(durationsToApply[i].mul(86400));
            }
          } else {
            expectedStart = now;
          }
          await expect(tx)
            .to.emit(this.contract, "Init")
            .withArgs(
              expectation.tappedId,
              projectId,
              expectation.initNumber,
              expectation.basedOn,
              expectedWeight,
              expectedStart
            );
        }

        // Get a reference to the funding cycle that was tapped.
        const tappedFundingCycle = await this.contract.get(
          expectation.tappedId
        );

        // Expect the stored values to match what's expected.
        expect(tappedFundingCycle.id).to.equal(expectation.tappedId);
        expect(tappedFundingCycle.projectId).to.equal(projectId);
        expect(tappedFundingCycle.number).to.equal(
          expectation.tappedNumber || 1
        );
        expect(tappedFundingCycle.tapped).to.equal(expectation.newTappedAmount);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          controller,
          projectId,
          amount,
          setup: { preconfigure, ops = [] },
          revert
        } = failureTest.fn(this);

        // Mock the caller to be the project's controller for setup.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        if (preconfigure) {
          const tx = await this.contract.connect(caller).configure(
            projectId,
            {
              target: preconfigure.target,
              currency: preconfigure.currency,
              duration: preconfigure.duration,
              cycleLimit: preconfigure.cycleLimit,
              discountRate: preconfigure.discountRate,
              ballot: this.ballot.address
            },
            preconfigure.metadata,
            preconfigure.fee,
            preconfigure.configureActiveFundingCycle
          );
          await this.setTimeMarkFn(tx.blockNumber);
        }

        for (let i = 0; i < ops.length; i += 1) {
          const op = ops[i];
          switch (op.type) {
            case "tap":
              // eslint-disable-next-line no-await-in-loop
              await this.contract.connect(caller).tap(op.projectId, op.amount);
              break;
            case "fastforward":
              // Subtract 1 so that the next operations mined block is likely to fall on the intended timestamp.
              // eslint-disable-next-line no-await-in-loop
              await this.fastforwardFn(op.seconds.sub(1));
              break;
            default:
              break;
          }
        }

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(controller);

        await expect(
          this.contract.connect(caller).tap(projectId, amount)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
