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
}) => ({ deployer, ballot }) => ({
  caller: deployer,
  projectId: 1,
  setup: {
    preconfigure: {
      target: BigNumber.from(240),
      currency: BigNumber.from(0),
      duration: BigNumber.from(100),
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
      description: "first funding cycle",
      fn: testTemplate({
        expectation: {
          id: 1,
          number: 1
        }
      })
    },
    {
      description: "during first funding cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(80)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        fastforward: BigNumber.from(78),
        expectation: {
          number: 1,
          id: 1
        }
      })
    },
    {
      description: "at the end of first funding cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(80)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
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
        fastforward: BigNumber.from(79),
        expectation: {
          number: 1,
          id: 1
        }
      })
    },
    {
      description: "immediately at the start of the second funding cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(80)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
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
        fastforward: BigNumber.from(80),
        expectation: {
          number: 2,
          id: 2
        }
      })
    },
    {
      description: "immediately after the first funding cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(80)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
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
        fastforward: BigNumber.from(81),
        expectation: {
          number: 2,
          id: 2
        }
      })
    },
    {
      description: "shortly after the first funding cycle, approved ballot",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(80)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
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
        fastforward: BigNumber.from(80),
        expectation: {
          number: 2,
          id: 2
        }
      })
    },
    {
      description: "many cycles after the first funding cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(80)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
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
        fastforward: BigNumber.from(319),
        expectation: {
          number: 5,
          id: 0
        }
      })
    },
    {
      description: "during first funding cycle, configuring the active cycle",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(80)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: true,
            // The below properties don't affect this test.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
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
        fastforward: BigNumber.from(78),
        expectation: {
          number: 1,
          id: 1
        }
      })
    },
    {
      description:
        "immediately after the first funding cycle, ignoring the option to configure the active one",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(80),
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
            duration: BigNumber.from(80),
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
        fastforward: BigNumber.from(80),
        expectation: {
          number: 2,
          id: 2
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
            .pow(24)
            .sub(1),
          discountRate: BigNumber.from(200),
          fee: BigNumber.from(200),
          metadata: constants.MaxUint256
        },
        fastforward: BigNumber.from(80),
        expectation: {
          number: 1,
          id: 1
        }
      })
    },
    {
      description: "adding other projects' funding cycles throughout",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(80)
        },
        ops: [
          {
            type: "configure",
            projectId: 1234,
            // The below properties don't affect this test.
            configureActiveFundingCycle: false,
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
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
            seconds: BigNumber.from(35)
          },
          // Add another configuration for a different project.
          {
            type: "configure",
            projectId: 2345,
            // The below properties don't affect this test.
            configureActiveFundingCycle: false,
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
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
        fastforward: BigNumber.from(30),
        expectation: {
          number: 1,
          id: 1
        }
      })
    },
    {
      description: "first configuration, with an active ballot",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(42)
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
            duration: BigNumber.from(80),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        // Fast forward past the full duration.
        fastforward: BigNumber.from(52),
        expectation: {
          number: 3,
          id: 0
        }
      })
    },
    {
      description: "first configuration, with a failed ballot",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(42)
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
            duration: BigNumber.from(80),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        // Fast forward past the full duration.
        fastforward: BigNumber.from(52),
        expectation: {
          number: 3,
          id: 0
        }
      })
    },
    {
      description: "first configuration, with a standby ballot",
      fn: testTemplate({
        preconfigure: {
          duration: BigNumber.from(42)
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
            duration: BigNumber.from(80),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        // Fast forward past the full duration.
        fastforward: BigNumber.from(52),
        expectation: {
          number: 3,
          id: 0
        }
      })
    },
    {
      description: "first configuration, discount rate 0",
      fn: testTemplate({
        preconfigure: {
          target: BigNumber.from(140),
          discountRate: BigNumber.from(0)
        },
        expectation: {
          number: 1,
          id: 1
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
        revert: "FundingCycles::getCurrent: NOT_FOUND"
      })
    },
    {
      description: "non recurring",
      fn: testTemplate({
        preconfigure: {
          discountRate: BigNumber.from(0),
          duration: BigNumber.from(42)
        },
        fastforward: BigNumber.from(42),
        revert: "FundingCycles::_mockFundingCycleAfter: NON_RECURRING"
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
          setup: { preconfigure, ops = [] } = {},
          expectation
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminals
          .withArgs(projectId)
          .returns(caller.address);

        if (preconfigure) {
          // If a ballot was provided, mock the ballot contract with the provided properties.
          await this.ballot.mock.duration.returns(preconfigure.ballot.duration);

          const tx = await this.contract
            .connect(caller)
            .configure(
              projectId,
              preconfigure.target,
              preconfigure.currency,
              preconfigure.duration,
              preconfigure.discountRate,
              preconfigure.fee,
              this.ballot.address,
              preconfigure.metadata,
              preconfigure.configureActiveFundingCycle
            );

          await this.setTimeMark(tx.blockNumber);
        }

        // Mock the duration as 0.
        await this.ballot.mock.duration.returns(BigNumber.from(0));

        // Do any other specified operations.
        for (let i = 0; i < ops.length; i += 1) {
          const op = ops[i];
          switch (op.type) {
            case "configure": {
              if (op.projectId !== projectId) {
                // Mock the caller to be the project's controller.
                // eslint-disable-next-line no-await-in-loop
                await this.terminalDirectory.mock.terminals
                  .withArgs(op.projectId)
                  .returns(caller.address);
              }
              // eslint-disable-next-line no-await-in-loop
              const tx = await this.contract
                .connect(caller)
                .configure(
                  op.projectId,
                  op.target,
                  op.currency,
                  op.duration,
                  op.discountRate,
                  op.fee,
                  this.ballot.address,
                  op.metadata,
                  op.configureActiveFundingCycle
                );
              if (op.ballot) {
                // eslint-disable-next-line no-await-in-loop
                await this.ballot.mock.state
                  .withArgs(
                    op.ballot.fundingCycleId,
                    // eslint-disable-next-line no-await-in-loop
                    await this.getTimestamp(tx.blockNumber)
                  )
                  .returns(op.ballot.state);
              }

              break;
            }
            case "fastforward": {
              // Fast forward the clock if needed.
              // eslint-disable-next-line no-await-in-loop
              await this.fastforward(op.seconds);
              break;
            }
            default:
              break;
          }
        }

        // Execute the transaction.
        const storedCurrentFundingCycle = await this.contract.getCurrent(
          projectId
        );

        // Expect the stored values to match what's expected.
        expect(storedCurrentFundingCycle.id).to.equal(expectation.id);
        expect(storedCurrentFundingCycle.number).to.equal(expectation.number);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          projectId,
          setup: { preconfigure, ops } = {},
          revert
        } = failureTest.fn(this);

        if (preconfigure) {
          // Mock the caller to be the project's controller.
          await this.terminalDirectory.mock.terminals
            .withArgs(projectId)
            .returns(caller.address);

          // If a ballot was provided, mock the ballot contract with the provided properties.
          await this.ballot.mock.duration.returns(preconfigure.ballot.duration);

          const tx = await this.contract
            .connect(caller)
            .configure(
              projectId,
              preconfigure.target,
              preconfigure.currency,
              preconfigure.duration,
              preconfigure.discountRate,
              preconfigure.fee,
              this.ballot.address,
              preconfigure.metadata,
              preconfigure.configureActiveFundingCycle
            );

          await this.setTimeMark(tx.blockNumber);
        }

        // Do any other specified operations.
        for (let i = 0; i < ops.length; i += 1) {
          const op = ops[i];
          switch (op.type) {
            case "configure": {
              // eslint-disable-next-line no-await-in-loop
              const tx = await this.contract
                .connect(caller)
                .configure(
                  op.projectId,
                  op.target,
                  op.currency,
                  op.duration,
                  op.discountRate,
                  op.fee,
                  this.ballot.address,
                  op.metadata,
                  op.configureActiveFundingCycle
                );
              if (op.ballot) {
                // eslint-disable-next-line no-await-in-loop
                await this.ballot.mock.state
                  .withArgs(
                    op.ballot.fundingCycleId,
                    // eslint-disable-next-line no-await-in-loop
                    await this.getTimestamp(tx.blockNumber)
                  )
                  .returns(op.ballot.state);
              }

              break;
            }
            case "fastforward": {
              // Fast forward the clock if needed.
              // eslint-disable-next-line no-await-in-loop
              await this.fastforward(op.seconds);
              break;
            }
            default:
              break;
          }
        }

        await expect(
          this.contract.connect(caller).getCurrent(projectId)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
