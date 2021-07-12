const {
  ethers: { BigNumber, constants }
} = require("hardhat");
const { expect } = require("chai");

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
  controller: deployer.address,
  projectId: 1,
  target: BigNumber.from(120),
  currency: BigNumber.from(1),
  duration: BigNumber.from(1),
  cycleLimit: BigNumber.from(0),
  discountRate: BigNumber.from(180),
  fee: BigNumber.from(42),
  metadata: BigNumber.from(92),
  configureActiveFundingCycle: false,
  setup: {
    preconfigure: {
      target: BigNumber.from(240),
      currency: BigNumber.from(0),
      duration: BigNumber.from(1),
      discountRate: BigNumber.from(120),
      cycleLimit: BigNumber.from(0),
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
        setup: {
          // no preconfiguration
          preconfigure: null
        },
        expectation: {
          configuredNumber: 1,
          configuredId: 1,
          initId: 1,
          basedOn: 0
        }
      })
    },
    {
      description: "during first funding cycle",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1)
        },
        // Fast forward to a time well within the preconfigured duration.
        fastforward: BigNumber.from(86390),
        expectation: {
          configuredNumber: 2,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "during first funding cycle with duration of 0",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(0)
        },
        expectation: {
          configuredNumber: 2,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description:
        "during first funding cycle with duration of 0, fastforwarded a bunch",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(0)
        },
        fastforward: BigNumber.from(12345678),
        expectation: {
          configuredNumber: 2,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "at the end of first funding cycle",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1)
        },
        // Fast forward to the last second of the preconfigured duration.
        fastforward: BigNumber.from(86399),
        expectation: {
          configuredNumber: 2,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "within the second funding cycle",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1)
        },
        // Fast forward to a second with the cycle after the preconfigured one.
        fastforward: BigNumber.from(86401),
        expectation: {
          configuredNumber: 3,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "a few cycles after the first funding cycle",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1)
        },
        // Fast forward a multiple of the duration.
        fastforward: BigNumber.from(86400 * 2 + 1),
        expectation: {
          configuredNumber: 4,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "many cycles after the first funding cycle",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1)
        },
        // Fast forward many multiples of the duration.
        fastforward: BigNumber.from(86400 * 4 + 1),
        expectation: {
          configuredNumber: 6,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "during first funding cycle, configuring the active cycle",
      fn: testTemplate({
        op: {
          // Allow the active funding cycle to be reconfigured.
          configureActiveFundingCycle: true
        },
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1)
        },
        // Fast forward within the preconfigured duration.
        fastforward: BigNumber.from(36390),
        expectation: {
          configuredNumber: 1,
          configuredId: 1,
          basedOn: 0
        }
      })
    },
    {
      description:
        "shortly after the first funding cycle, configuring the active cycle",
      fn: testTemplate({
        op: {
          // Allow the active funding cycle to be reconfigured.
          configureActiveFundingCycle: true
        },
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1)
        },
        // Fast forward to the first second after the preconfigured cycle.
        fastforward: BigNumber.from(86401),
        expectation: {
          configuredNumber: 2,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "first funding cycle, max values",
      fn: testTemplate({
        op: {
          target: constants.MaxUint256,
          currency: BigNumber.from(2)
            .pow(8)
            .sub(1),
          duration: BigNumber.from(2)
            .pow(16)
            .sub(1),
          discountRate: BigNumber.from(201),
          fee: BigNumber.from(200),
          metadata: constants.MaxUint256
        },
        setup: {
          // No preconfiguration
          preconfigure: null
        },
        expectation: {
          configuredNumber: 1,
          configuredId: 1,
          basedOn: 0
        }
      })
    },
    {
      description:
        "ballot duration from current time is before preconfigured duration",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1),
          ballot: {
            // Set the ballot duration shorter than the configuration duration.
            duration: BigNumber.from(86300)
          }
        },
        // Fast forward to the time before when the ballot would equal the preconfigured duration.
        fastforward: BigNumber.from(10),
        expectation: {
          configuredNumber: 2,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description:
        "ballot duration from current time is preconfigured duration",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1),
          ballot: {
            // Set the ballot duration shorter than the configuration duration.
            duration: BigNumber.from(86390)
          }
        },
        // Fast forward to the time where the ballot would equal the preconfigured duration,
        // which is the first second where the proposed configuration could start.
        fastforward: BigNumber.from(9),
        expectation: {
          configuredNumber: 2,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "ballot duration just less than duration",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1),
          ballot: {
            // Set the ballot duration shorter than the configuration duration.
            duration: BigNumber.from(86399)
          }
        },
        // Fast forward to the second before the ballot duration expires.
        fastforward: BigNumber.from(86398),
        expectation: {
          configuredNumber: 3,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "ballot duration same as funding cycle duration",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1),
          ballot: {
            // Set the ballot duration to the same as the configuration duration.
            duration: BigNumber.from(86400)
          }
        },
        // Fast forward to a seconds before the ballot duration expires.
        fastforward: BigNumber.from(86399),
        expectation: {
          configuredNumber: 3,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "ballot duration just over the funding cycle duration",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1),
          ballot: {
            // Set the ballot duration longer than the configuration duration.
            duration: BigNumber.from(86401)
          }
        },
        // Fast forward to one seconds before the funding cycle expires.
        fastforward: BigNumber.from(86400),
        expectation: {
          configuredNumber: 4,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "override a pending reconfiguration",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1)
        },
        ops: [
          // Add a reconfiguration to the same project.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(2),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(93),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false
          }
        ],
        expectation: {
          configuredNumber: 2,
          configuredId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "override a failed reconfiguration",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1),
          ballot: {
            // Set the ballot duration shorter than the configuration duration.
            duration: BigNumber.from(86390)
          }
        },
        ops: [
          // Add a reconfiguration to the same project that will expire before the duration.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(3),
            duration: BigNumber.from(2),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(93),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false
          },
          {
            type: "fastforward",
            // Fast forward past the expired configuration.
            seconds: BigNumber.from(86395)
          },
          // Add another reconfiguration
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(4),
            duration: BigNumber.from(2),
            discountRate: BigNumber.from(93),
            cycleLimit: BigNumber.from(0),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false
          }
        ],
        // Fast forward a little bit more.
        fastforward: BigNumber.from(10),
        expectation: {
          configuredNumber: 3,
          configuredId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "override a failed reconfiguration with a longer ballot",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1),
          ballot: {
            // Set the ballot duration shorter than the configuration duration.
            duration: BigNumber.from(86397)
          }
        },
        ops: [
          // Add a reconfiguration to the same project that will expire before the duration.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(3),
            duration: BigNumber.from(2),
            cycleLimit: BigNumber.from(0),
            discountRate: BigNumber.from(93),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false
          },
          {
            type: "fastforward",
            // Fast forward past the expired configuration.
            seconds: BigNumber.from(86395)
          },
          // Add another reconfiguration
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(4),
            duration: BigNumber.from(2),
            discountRate: BigNumber.from(93),
            cycleLimit: BigNumber.from(0),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false
          }
        ],
        // Fast forward a little bit more.
        fastforward: BigNumber.from(10),
        expectation: {
          configuredNumber: 4,
          configuredId: 2,
          basedOn: 1
        }
      })
    },
    {
      description: "within a cycle limit",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(10),
          ballot: {
            state: 0
          }
        },
        ops: [
          // Add a reconfiguration to the same project with a cycle limit.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(20),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              duration: BigNumber.from(0)
            },
            expectedCyclesUsed: 1
          }
        ],
        // Fast forward to within the cycle.
        fastforward: BigNumber.from(86400 * 11 - 1),
        op: {
          cycleLimit: 2
        },
        expectation: {
          configuredNumber: 3,
          configuredId: 3,
          basedOn: 2
        }
      })
    },
    {
      description: "after a cycle limit",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(1)
        },
        ops: [
          // Add a reconfiguration to the same project with a cycle limit.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(1),
            discountRate: BigNumber.from(20),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              duration: BigNumber.from(0)
            },
            expectedCyclesUsed: 1
          }
        ],
        // Fast forward to the cycle after the limit expires.
        fastforward: BigNumber.from(86400 * 2 + 2),
        expectation: {
          configuredNumber: 4,
          configuredId: 3,
          basedOn: 2
        }
      })
    },
    {
      description: "cycle limit with a way different duration",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(4)
        },
        ops: [
          // Add a reconfiguration to the same project with a cycle limit.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(1),
            discountRate: BigNumber.from(20),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              duration: BigNumber.from(0)
            },
            expectedCyclesUsed: 1
          }
        ],
        // Fast forward to the cycle after the limit expires.
        fastforward: BigNumber.from(86400 * 5 + 1),
        expectation: {
          configuredNumber: 4,
          configuredId: 3,
          basedOn: 2
        }
      })
    },
    {
      description: "cycle limit with a way different duration, way later",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(4)
        },
        ops: [
          // Add a reconfiguration to the same project with a cycle limit.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(1),
            discountRate: BigNumber.from(20),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              duration: BigNumber.from(0)
            },
            expectedCyclesUsed: 1
          }
        ],
        // Fast forward to the cycle after the limit expires.
        fastforward: BigNumber.from(86400 * 9 + 1),
        expectation: {
          configuredNumber: 5,
          configuredId: 3,
          basedOn: 2
        }
      })
    },
    {
      description: "large cycle limit with a way different duration",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(10)
        },
        ops: [
          // Add a reconfiguration to the same project with a cycle limit.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(20),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              duration: BigNumber.from(0)
            },
            expectedCyclesUsed: 5
          }
        ],
        // Fast forward to the cycle after the limit expires.
        fastforward: BigNumber.from(86400 * 20),
        expectation: {
          configuredNumber: 8,
          configuredId: 3,
          basedOn: 2
        }
      })
    },
    {
      description:
        "large cycle limit, many cycles later, with a way different duration",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(10)
        },
        ops: [
          // Add a reconfiguration to the same project with a cycle limit.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(20),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              duration: BigNumber.from(0)
            },
            expectedCyclesUsed: 5
          }
        ],
        // Fast forward to the cycle after the limit expires.
        fastforward: BigNumber.from(86400 * 40),
        expectation: {
          configuredNumber: 10,
          configuredId: 3,
          basedOn: 2
        }
      })
    },
    {
      description: "Reconfigure with a cycle limit within another limit",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(10)
        },
        ops: [
          // Add a reconfiguration to the same project with a cycle limit.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(20),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              duration: BigNumber.from(0)
            },
            expectedCyclesUsed: 5
          }
        ],
        // Fast forward to the cycle after the limit expires.
        fastforward: BigNumber.from(86400 * 40),
        expectation: {
          configuredNumber: 10,
          configuredId: 3,
          basedOn: 2
        }
      })
    },
    {
      description: "in the middle of a cycle limit",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(10)
        },
        ops: [
          // Add a reconfiguration to the same project with a cycle limit.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(20),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              duration: BigNumber.from(0)
            },
            expectedCyclesUsed: 4
          }
        ],
        // Fast forward to the cycle after the limit expires.
        fastforward: BigNumber.from(86400 * 13 + 1),
        expectation: {
          configuredNumber: 6,
          configuredId: 3,
          basedOn: 2
        }
      })
    },
    {
      description: "base on last good cycle if there ballot is active",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(10),
          ballot: {
            state: 1
          }
        },
        ops: [
          // Add a reconfiguration to the same project with a cycle limit.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(20),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              duration: BigNumber.from(0)
            },
            expectedCyclesUsed: 0
          }
        ],
        // Fast forward to within the cycle.
        fastforward: BigNumber.from(86400 * 11 - 2),
        op: {
          cycleLimit: 2
        },
        expectation: {
          configuredNumber: 3,
          configuredId: 3,
          basedOn: 1
        }
      })
    },
    {
      description: "base on last good cycle if there ballot failed",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(10),
          ballot: {
            state: 2
          }
        },
        ops: [
          // Add a reconfiguration to the same project with a cycle limit.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(1),
            cycleLimit: BigNumber.from(5),
            discountRate: BigNumber.from(20),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              duration: BigNumber.from(0)
            },
            expectedCyclesUsed: 0
          }
        ],
        // Fast forward to within the cycle.
        fastforward: BigNumber.from(86400 * 11 - 2),
        op: {
          cycleLimit: 2
        },
        expectation: {
          configuredNumber: 3,
          configuredId: 3,
          basedOn: 1
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
        // below values copied from the template
        projectId: 1,
        target: BigNumber.from(120),
        currency: BigNumber.from(1),
        duration: BigNumber.from(80),
        cycleLimit: BigNumber.from(0),
        discountRate: BigNumber.from(180),
        fee: BigNumber.from(42),
        metadata: BigNumber.from(92),
        configureActiveFundingCycle: false
      })
    },
    {
      description: "funding cycle limit is over 32",
      fn: testTemplate({
        op: {
          cycleLimit: 33
        },
        setup: {
          // no preconfiguration
          preconfigure: null
        },
        revert: "FundingCycles::configure: BAD_CYCLE_LIMIT"
      })
    },
    {
      description: "duration more than the max allowed",
      fn: testTemplate({
        op: {
          duration: BigNumber.from(2).pow(16)
        },
        setup: {
          // no preconfiguration
          preconfigure: null
        },
        revert: "FundingCycles::configure: BAD_DURATION"
      })
    },
    {
      description: "discount rate over limit",
      fn: testTemplate({
        op: {
          discountRate: BigNumber.from(202)
        },
        setup: {
          // no preconfiguration
          preconfigure: null
        },
        revert: "FundingCycles::configure: BAD_DISCOUNT_RATE"
      })
    },
    {
      description: "currency over max allowed",
      fn: testTemplate({
        op: {
          currency: BigNumber.from(2).pow(8)
        },
        setup: {
          // no preconfiguration
          preconfigure: null
        },
        revert: "FundingCycles::configure: BAD_CURRENCY"
      })
    },
    {
      description: "fee over 100%",
      fn: testTemplate({
        op: {
          fee: BigNumber.from(201)
        },
        setup: {
          // no preconfiguration
          preconfigure: null
        },
        revert: "FundingCycles::configure: BAD_FEE"
      })
    },
    {
      description: "non recurring",
      fn: testTemplate({
        preconfigure: {
          discountRate: BigNumber.from(201)
        },
        revert: "FundingCycles::_configurable: NON_RECURRING"
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
          cycleLimit,
          discountRate,
          fee,
          metadata,
          configureActiveFundingCycle,
          setup: { preconfigure, ops = [] } = {},
          expectation
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        let preconfigureBlockNumber;

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
              ballot: preconfigure.ballot.address
            },
            preconfigure.metadata,
            preconfigure.fee,
            preconfigure.configureActiveFundingCycle
          );
          preconfigureBlockNumber = tx.blockNumber;

          if (preconfigure.ballot.duration !== undefined)
            await this.ballot.mock.duration.returns(
              preconfigure.ballot.duration
            );

          if (preconfigure.ballot.state !== undefined)
            await this.ballot.mock.state.returns(preconfigure.ballot.state);

          await this.setTimeMarkFn(tx.blockNumber);
        }

        // Get a reference to the timestamp right after the preconfiguration occurs.
        const expectedPreconfigureStart = await this.getTimestampFn(
          preconfigureBlockNumber
        );

        const discountRatesToApply = [];
        const durationsToApply = [];

        // Do any other specified operations.
        for (let i = 0; i < ops.length; i += 1) {
          const op = ops[i];
          switch (op.type) {
            case "configure": {
              // eslint-disable-next-line no-await-in-loop
              await this.contract.connect(caller).configure(
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

              if (op.ballot)
                // eslint-disable-next-line no-await-in-loop
                await this.ballot.mock.duration.returns(op.ballot.duration);

              if (op.expectedCyclesUsed) {
                for (let j = 0; j < op.expectedCyclesUsed; j += 1) {
                  discountRatesToApply.push(op.discountRate);
                  durationsToApply.push(op.duration);
                }
              }
              break;
            }
            case "fastforward":
              // Fast forward the clock if needed.
              // Subtract 1 so that the next operations mined block is likely to fall on the intended timestamp.
              // eslint-disable-next-line no-await-in-loop
              await this.fastforwardFn(op.seconds.sub(1));
              break;
            default:
              break;
          }
        }

        // Execute the transaction.
        const tx = await this.contract.connect(caller).configure(
          projectId,
          {
            target,
            currency,
            duration,
            cycleLimit,
            discountRate,
            ballot: this.ballot.address
          },
          metadata,
          fee,
          configureActiveFundingCycle
        );

        // Get the current timestamp after the transaction.
        const now = await this.getTimestampFn(tx.blockNumber);

        // Expect two events to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Configure")
          .withArgs(
            expectation.configuredId,
            projectId,
            now,
            [
              target,
              currency,
              duration,
              cycleLimit,
              discountRate,
              this.ballot.address
            ],
            metadata,
            caller.address
          );

        // Get a reference to the base weight.
        const baseWeight = await this.contract.BASE_WEIGHT();

        let expectedWeight = baseWeight;

        // Multiply the discount the amount of times specified.
        for (
          let i = 0;
          i < expectation.configuredNumber - 1 - discountRatesToApply.length;
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
        if (preconfigure && preconfigure.duration > 0) {
          expectedStart = expectedPreconfigureStart.add(
            preconfigure.duration
              .mul(86400)
              .mul(expectation.configuredNumber - 1 - durationsToApply.length)
          );
          for (let i = 0; i < durationsToApply.length; i += 1) {
            expectedStart = expectedStart.add(durationsToApply[i].mul(86400));
          }
        } else {
          expectedStart = now;
        }

        // Expect an Init event if not configuring the same funding cycle again.
        if (expectation.initId) {
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
        expect(storedFundingCycle.ballot).to.equal(this.ballot.address);
        expect(storedFundingCycle.start).to.equal(expectedStart);
        expect(storedFundingCycle.configured).to.equal(now);
        expect(storedFundingCycle.cycleLimit).to.equal(cycleLimit);
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
          controller,
          projectId,
          target,
          currency,
          duration,
          cycleLimit,
          discountRate,
          fee,
          metadata,
          configureActiveFundingCycle,
          setup: { preconfigure } = {},
          revert
        } = failureTest.fn(this);

        // Mock the caller to be the project's controller for setup.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        if (preconfigure) {
          await this.contract.connect(caller).configure(
            projectId,
            {
              target: preconfigure.target,
              currency: preconfigure.currency,
              duration: preconfigure.duration,
              cycleLimit: preconfigure.cycleLimit,
              discountRate: preconfigure.discountRate,
              ballot: preconfigure.ballot.address
            },
            preconfigure.metadata,
            preconfigure.fee,
            preconfigure.configureActiveFundingCycle
          );
        }

        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(controller);

        await expect(
          this.contract.connect(caller).configure(
            projectId,
            {
              target,
              currency,
              duration,
              cycleLimit,
              discountRate,
              ballot: this.ballot.address
            },
            metadata,
            fee,
            configureActiveFundingCycle
          )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
