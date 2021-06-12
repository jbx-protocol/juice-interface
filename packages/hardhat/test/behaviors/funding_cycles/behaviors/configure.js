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
  duration: BigNumber.from(80),
  discountRate: BigNumber.from(180),
  fee: BigNumber.from(42),
  metadata: BigNumber.from(92),
  configureActiveFundingCycle: false,
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
          duration: BigNumber.from(42)
        },
        // Fast forward to a time well within the preconfigured duration.
        fastforward: BigNumber.from(24),
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
          duration: BigNumber.from(42)
        },
        // Fast forward to the last second of the preconfigured duration.
        fastforward: BigNumber.from(41),
        expectation: {
          configuredNumber: 2,
          configuredId: 2,
          initId: 2,
          basedOn: 1
        }
      })
    },
    ...(process.env.INCLUDE_TIME_EDGE_CASE_TEST
      ? [
          {
            description: "immediately after the first funding cycle",
            fn: testTemplate({
              preconfigure: {
                // Preconfigure the duration.
                duration: BigNumber.from(42)
              },
              // Fast forward to the first second of the cycle after the preconfigured one.
              fastforward: BigNumber.from(42),
              expectation: {
                configuredNumber: 2,
                configuredId: 2,
                initId: 2,
                basedOn: 1
              }
            })
          }
        ]
      : []),
    {
      description: "within the second funding cycle",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(42)
        },
        // Fast forward to a second with the cycle after the preconfigured one.
        fastforward: BigNumber.from(43),
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
          duration: BigNumber.from(42)
        },
        // Fast forward a multiple of the duration.
        fastforward: BigNumber.from(85),
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
          duration: BigNumber.from(42)
        },
        // Fast forward many multiples of the duration.
        fastforward: BigNumber.from(169),
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
          duration: BigNumber.from(42)
        },
        // Fast forward within the preconfigured duration.
        fastforward: BigNumber.from(40),
        expectation: {
          configuredNumber: 1,
          configuredId: 1,
          basedOn: 0
        }
      })
    },
    {
      description:
        "immediately after the first funding cycle, ignoring the option to configure the active one",
      fn: testTemplate({
        op: {
          // Allow the active funding cycle to be reconfigured. This shouldn't do anything.
          configureActiveFundingCycle: true
        },
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(42)
        },
        // Fast forward to the first second after the preconfigured cycle.
        fastforward: BigNumber.from(42),
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
        "shortly after the first funding cycle, configuring the active cycle",
      fn: testTemplate({
        op: {
          // Allow the active funding cycle to be reconfigured.
          configureActiveFundingCycle: true
        },
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(42)
        },
        // Fast forward to the first second after the preconfigured cycle.
        fastforward: BigNumber.from(43),
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
            .pow(24)
            .sub(1),
          discountRate: BigNumber.from(200),
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
          duration: BigNumber.from(42),
          ballot: {
            // Set the ballot duration shorter than the configuration duration.
            duration: BigNumber.from(30)
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
    ...(process.env.INCLUDE_TIME_EDGE_CASE_TEST
      ? [
          {
            description:
              "ballot duration from current time is preconfigured duration",
            fn: testTemplate({
              preconfigure: {
                // Preconfigure the duration.
                duration: BigNumber.from(42),
                ballot: {
                  // Set the ballot duration shorter than the configuration duration.
                  duration: BigNumber.from(30)
                }
              },
              // Fast forward to the time where the ballot would equal the preconfigured duration,
              // which is the first second where the proposed configuration could start.
              fastforward: BigNumber.from(12),
              expectation: {
                configuredNumber: 2,
                configuredId: 2,
                initId: 2,
                basedOn: 1
              }
            })
          }
        ]
      : []),
    {
      description: "ballot duration just less than duration",
      fn: testTemplate({
        preconfigure: {
          // Preconfigure the duration.
          duration: BigNumber.from(42),
          ballot: {
            // Set the ballot duration shorter than the configuration duration.
            duration: BigNumber.from(41)
          }
        },
        // Fast forward to the second before the ballot duration expires.
        fastforward: BigNumber.from(39),
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
          duration: BigNumber.from(42),
          ballot: {
            // Set the ballot duration to the same as the configuration duration.
            duration: BigNumber.from(42)
          }
        },
        // Fast forward to a few seconds before the ballot duration expires.
        fastforward: BigNumber.from(40),
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
          duration: BigNumber.from(42),
          ballot: {
            // Set the ballot duration longer than the configuration duration.
            duration: BigNumber.from(43)
          }
        },
        // Fast forward to a few seconds before the ballot duration expires.
        fastforward: BigNumber.from(40),
        expectation: {
          configuredNumber: 3,
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
          duration: BigNumber.from(42)
        },
        ops: [
          // Add a reconfiguration to the same project.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(293),
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
          duration: BigNumber.from(42)
        },
        ops: [
          // Add a reconfiguration to the same project that will expire before the duration.
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(293),
            discountRate: BigNumber.from(93),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              // Set the ballot duration shorter than the configuration duration.
              duration: BigNumber.from(10)
            }
          },
          {
            type: "fastforward",
            // Fast forward past the expired configuration.
            seconds: BigNumber.from(10)
          },
          // Add another reconfiguration
          {
            type: "configure",
            projectId: 1,
            target: BigNumber.from(10),
            currency: BigNumber.from(2),
            duration: BigNumber.from(293),
            discountRate: BigNumber.from(93),
            fee: BigNumber.from(30),
            metadata: BigNumber.from(5),
            configureActiveFundingCycle: false,
            ballot: {
              // Set the ballot duration shorter than the configuration duration.
              duration: BigNumber.from(10)
            }
          }
        ],
        // Fast forward a little bit more.
        fastforward: BigNumber.from(15),
        expectation: {
          configuredNumber: 2,
          configuredId: 2,
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
        revert: "JuiceTerminalUtility: UNAUTHORIZED",
        // below values copied from the template
        projectId: 1,
        target: BigNumber.from(120),
        currency: BigNumber.from(1),
        duration: BigNumber.from(80),
        discountRate: BigNumber.from(180),
        fee: BigNumber.from(42),
        metadata: BigNumber.from(92),
        configureActiveFundingCycle: false
      })
    },
    {
      description: "target is 0",
      fn: testTemplate({
        op: {
          target: BigNumber.from(0)
        },
        setup: {
          // no preconfiguration
          preconfigure: null
        },
        revert: "FundingCycles::configure: BAD_TARGET"
      })
    },
    {
      description: "duration is 0",
      fn: testTemplate({
        op: {
          duration: BigNumber.from(0)
        },
        setup: {
          // no preconfiguration
          preconfigure: null
        },
        revert: "FundingCycles::configure: BAD_DURATION"
      })
    },
    {
      description: "duration more than the max allowed",
      fn: testTemplate({
        op: {
          duration: BigNumber.from(2).pow(24)
        },
        setup: {
          // no preconfiguration
          preconfigure: null
        },
        revert: "FundingCycles::configure: BAD_DURATION"
      })
    },
    {
      description: "discount rate over 100%",
      fn: testTemplate({
        op: {
          discountRate: BigNumber.from(201)
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
        revert: ""
      })
    },
    {
      description: "non recurring",
      fn: testTemplate({
        preconfigure: {
          discountRate: BigNumber.from(0)
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
          discountRate,
          fee,
          metadata,
          configureActiveFundingCycle,
          setup: { preconfigure, ops = [] } = {},
          expectation
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.juiceTerminalDirectory.mock.terminals
          .withArgs(projectId)
          .returns(caller.address);

        let preconfigureBlockNumber;

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
              preconfigure.ballot.address,
              preconfigure.metadata,
              preconfigure.configureActiveFundingCycle
            );
          preconfigureBlockNumber = tx.blockNumber;

          if (preconfigure.ballot.duration !== undefined)
            await this.ballot.mock.duration.returns(
              preconfigure.ballot.duration
            );

          await this.setTimeMark(tx.blockNumber);
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
                  this.ballot.address,
                  op.metadata,
                  op.configureActiveFundingCycle
                );

              if (op.ballot)
                // eslint-disable-next-line no-await-in-loop
                await this.ballot.mock.duration.returns(op.ballot.duration);

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
            this.ballot.address,
            metadata,
            configureActiveFundingCycle
          );

        // Get the current timestamp after the transaction.
        const now = await this.getTimestamp(tx.blockNumber);

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
            this.ballot.address,
            caller.address
          );

        // Get a reference to the base weight.
        const baseWeight = await this.contract.BASE_WEIGHT();

        let expectedWeight = baseWeight;

        // Multiply the discount the amount of times specified.
        for (let i = 0; i < expectation.configuredNumber - 1; i += 1) {
          expectedWeight = expectedWeight
            .mul(preconfigure.discountRate)
            .div(200);
        }

        // Get the time when the configured funding cycle starts.
        let expectedStart;
        if (preconfigure) {
          expectedStart = expectedPreconfigureStart.add(
            preconfigure.duration.mul(expectation.configuredNumber - 1)
          );
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
          discountRate,
          fee,
          metadata,
          configureActiveFundingCycle,
          setup: { preconfigure } = {},
          revert
        } = failureTest.fn(this);

        // Mock the caller to be the project's controller for setup.
        await this.juiceTerminalDirectory.mock.terminals
          .withArgs(projectId)
          .returns(caller.address);

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
              preconfigure.ballot.address,
              preconfigure.metadata,
              preconfigure.configureActiveFundingCycle
            );
        }

        await this.juiceTerminalDirectory.mock.terminals
          .withArgs(projectId)
          .returns(controller);

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
              this.ballot.address,
              metadata,
              configureActiveFundingCycle
            )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
