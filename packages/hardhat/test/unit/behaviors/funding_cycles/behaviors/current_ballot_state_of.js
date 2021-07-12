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
  set,
  setup = {},
  preconfigure = {},
  fastforward,
  ops = [],
  expectation = {},
  revert
}) => ({ deployer, ballot }) => ({
  caller: deployer,
  projectId: BigNumber.from(1),
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
      ...preconfigure,
      ballot: {
        address: ballot.address,
        duration: BigNumber.from(0),
        ...preconfigure.ballot
      }
    },
    set,
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
  revert
});

const tests = {
  success: [
    {
      description: "first funding cycle",
      fn: testTemplate({
        expectation: {
          state: 3
        }
      })
    },
    {
      description: "during first funding cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        fastforward: BigNumber.from(6398),
        set: 1,
        expectation: {
          fundingCycleId: 2,
          state: 1
        }
      })
    },
    {
      description: "at the end of first funding cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            ballot: {
              // Active
              state: BigNumber.from(0),
              fundingCycleId: 2
            }
          }
        ],
        fastforward: BigNumber.from(86393),
        set: 1,
        expectation: {
          fundingCycleId: 2,
          state: 1
        }
      })
    },
    {
      description: "immediately at the start of the second funding cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            ballot: {
              // Active
              state: BigNumber.from(0),
              fundingCycleId: 2
            }
          }
        ],
        fastforward: BigNumber.from(86400),
        set: 1,
        expectation: {
          fundingCycleId: 2,
          state: 1
        }
      })
    },
    {
      description: "immediately after the first funding cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            ballot: {
              // Active
              state: BigNumber.from(0),
              fundingCycleId: 2
            }
          }
        ],
        fastforward: BigNumber.from(86401),
        set: 1,
        expectation: {
          fundingCycleId: 2,
          state: 1
        }
      })
    },
    {
      description: "shortly after the first funding cycle, approved ballot",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            ballot: {
              // Active
              state: BigNumber.from(0),
              fundingCycleId: 2
            }
          }
        ],
        fastforward: BigNumber.from(86400),
        set: 1,
        expectation: {
          fundingCycleId: 2,
          state: 1
        }
      })
    },
    {
      description: "many cycles after the first funding cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            ballot: {
              // Active
              state: BigNumber.from(0),
              fundingCycleId: 2
            }
          }
        ],
        fastforward: BigNumber.from(86400 * 4),
        expectation: {
          // Should have the state of the last configured ballot.
          state: 0
        }
      })
    },
    {
      description: "during first funding cycle, configuring the active cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: true,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            ballot: {
              // Active
              state: BigNumber.from(0),
              fundingCycleId: 2
            }
          }
        ],
        fastforward: BigNumber.from(86398),
        expectation: {
          // standby.
          state: 3
        }
      })
    },
    {
      description:
        "immediately after the first funding cycle, ignoring the option to configure the active one",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(1),
          configureActiveFundingCycle: true
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            ballot: {
              // Active
              state: BigNumber.from(0),
              fundingCycleId: 2
            }
          }
        ],
        fastforward: BigNumber.from(86400),
        set: 1,
        expectation: {
          fundingCycleId: 2,
          state: 1
        }
      })
    },
    {
      description: "first funding cycle, max values",
      fn: testTemplate({
        preconfigure: {
          target: constants.MaxUint256,
          currency: BigNumber.from(2)
            .pow(8)
            .sub(1),
          duration: BigNumber.from(2)
            .pow(16)
            .sub(1),
          cycleLimit: BigNumber.from(0),
          discountRate: BigNumber.from(201),
          fee: BigNumber.from(200),
          metadata: constants.MaxUint256
        },
        fastforward: BigNumber.from(80),
        expectation: {
          state: 3
        }
      })
    },
    {
      description: "adding other projects' funding cycles throughout",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(1)
        },
        ops: [
          {
            type: "configure",
            projectId: 1234,
            // The below properties don't affect this test.
            configureActiveFundingCycle: false,
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            ballot: {
              // Active
              state: BigNumber.from(0),
              fundingCycleId: 2
            }
          },
          {
            type: "fastforward",
            seconds: BigNumber.from(86390)
          },
          // Add another configuration for a different project.
          {
            type: "configure",
            projectId: 2345,
            // The below properties don't affect this test.
            configureActiveFundingCycle: false,
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92),
            ballot: {
              // Active
              state: BigNumber.from(0),
              fundingCycleId: 2
            }
          }
        ],
        fastforward: BigNumber.from(1),
        expectation: {
          state: 3
        }
      })
    },
    {
      description: "first configuration, with an active ballot",
      fn: testTemplate({
        preconfigure: {
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
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        // Fast forward past the full duration.
        fastforward: BigNumber.from(86401),
        expectation: {
          state: 1
        }
      })
    },
    {
      description: "first configuration, with a failed ballot",
      fn: testTemplate({
        preconfigure: {
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
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        // Fast forward past the full duration.
        fastforward: BigNumber.from(86401),
        expectation: {
          state: 2
        }
      })
    },
    {
      description: "first configuration, with a standby ballot",
      fn: testTemplate({
        preconfigure: {
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
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        // Fast forward past the full duration.
        fastforward: BigNumber.from(86401),
        expectation: {
          state: 3
        }
      })
    }
  ],
  failure: [
    {
      description: "project not found",
      fn: testTemplate({
        setup: {
          // No preconfigure
          preconfigure: null
        },
        revert: "FundingCycles::currentBallotStateOf: NOT_FOUND"
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
          setup: { preconfigure, set, ops = [] } = {},
          expectation
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        if (preconfigure) {
          // If a ballot was provided, mock the ballot contract with the provided properties.
          await this.ballot.mock.duration.returns(preconfigure.ballot.duration);

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

        // Do any other specified operations.
        for (let i = 0; i < ops.length; i += 1) {
          const op = ops[i];
          switch (op.type) {
            case "configure": {
              // Mock the project's controller status if needed.
              if (op.projectId !== projectId) {
                // Mock the caller to be the project's controller.
                // eslint-disable-next-line no-await-in-loop
                await this.terminalDirectory.mock.terminalOf
                  .withArgs(op.projectId)
                  .returns(caller.address);
              }
              // eslint-disable-next-line no-await-in-loop
              const tx = await this.contract.connect(caller).configure(
                op.projectId,
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

              break;
            }
            case "fastforward": {
              // Fast forward the clock if needed.
              // eslint-disable-next-line no-await-in-loop
              await this.fastforwardFn(op.seconds);
              break;
            }
            default:
              break;
          }
        }

        const storedQueued = await this.contract.queuedOf(projectId);

        if (expectation.fundingCycleId) {
          await this.ballot.mock.state
            .withArgs(expectation.fundingCycleId, storedQueued.configured)
            .returns(set);
        }

        // Execute the transaction.
        const storedCurrentBallotState = await this.contract.currentBallotStateOf(
          projectId
        );

        // Expect the stored values to match what's expected.
        expect(storedCurrentBallotState).to.equal(expectation.state);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, projectId, revert } = failureTest.fn(this);
        await expect(
          this.contract.connect(caller).currentBallotStateOf(projectId)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
