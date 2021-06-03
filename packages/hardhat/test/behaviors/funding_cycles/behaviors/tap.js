const {
  ethers: { BigNumber, constants }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "taps, first configuration",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        amount: BigNumber.from(20),
        expectedFundingCycleId: 1,
        expectedNewTappedAmount: BigNumber.from(20),
        setup: {
          ops: [
            {
              type: "configure",
              projectId: 1,
              // these configuration numbers aren't special.
              target: BigNumber.from(120),
              currency: BigNumber.from(1),
              duration: BigNumber.from(80),
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            }
          ]
        }
      })
    },
    {
      description: "taps, first configuration, full amount",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        amount: BigNumber.from(120),
        expectedFundingCycleId: 1,
        expectedNewTappedAmount: BigNumber.from(120),
        setup: {
          ops: [
            {
              type: "configure",
              projectId: 1,
              // these configuration numbers aren't special.
              target: BigNumber.from(120),
              currency: BigNumber.from(1),
              duration: BigNumber.from(80),
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            }
          ]
        }
      })
    },
    {
      description: "taps, second configuration",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        amount: BigNumber.from(140),
        expectedFundingCycleId: 1,
        expectedNewTappedAmount: BigNumber.from(140),
        setup: {
          ops: [
            {
              type: "configure",
              projectId: 1,
              // these configuration numbers aren't special.
              target: BigNumber.from(120),
              currency: BigNumber.from(1),
              duration: BigNumber.from(80),
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            },
            {
              type: "configure",
              projectId: 1,
              // these configuration numbers aren't special.
              target: BigNumber.from(150),
              currency: BigNumber.from(1),
              duration: BigNumber.from(80),
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: true
            }
          ]
        }
      })
    },
    {
      description: "taps, first configuration, with a standby",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        amount: BigNumber.from(120),
        expectedFundingCycleId: 1,
        expectedNewTappedAmount: BigNumber.from(120),
        setup: {
          ops: [
            {
              type: "configure",
              projectId: 1,
              // these configuration numbers aren't special.
              target: BigNumber.from(120),
              currency: BigNumber.from(1),
              duration: BigNumber.from(80),
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            },
            {
              type: "configure",
              projectId: 1,
              // these configuration numbers aren't special.
              target: BigNumber.from(50),
              currency: BigNumber.from(1),
              duration: BigNumber.from(80),
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            }
          ]
        }
      })
    },
    {
      description: "taps, second configuration, with approved ballot",
      fn: ({ deployer, ballot }) => {
        const fundingCycleDuration = BigNumber.from(80);
        return {
          caller: deployer,
          projectId: 1,
          amount: BigNumber.from(120),
          expectedFundingCycleId: 2,
          expectedNewTappedAmount: BigNumber.from(120),
          setup: {
            ops: [
              {
                type: "configure",
                projectId: 1,
                target: BigNumber.from(100),
                currency: BigNumber.from(1),
                duration: fundingCycleDuration,
                discountRate: BigNumber.from(180),
                fee: BigNumber.from(42),
                ballot: {
                  address: ballot.address
                },
                metadata: BigNumber.from(92),
                configureActiveFundingCycle: false
              },
              {
                type: "configure",
                projectId: 1,
                // these configuration numbers aren't special.
                target: BigNumber.from(120),
                currency: BigNumber.from(1),
                duration: BigNumber.from(80),
                discountRate: BigNumber.from(180),
                fee: BigNumber.from(42),
                ballot: {
                  address: ballot.address,
                  state: 0,
                  fundingCycleId: 2
                },
                metadata: BigNumber.from(92),
                configureActiveFundingCycle: false
              },
              {
                type: "fastforward",
                seconds: fundingCycleDuration
              }
            ]
          }
        };
      }
    },
    {
      description:
        "taps, second cycle of first configuration, with active ballot",
      fn: ({ deployer, ballot }) => {
        const fundingCycleDuration = BigNumber.from(80);
        return {
          caller: deployer,
          projectId: 1,
          amount: BigNumber.from(100),
          expectedFundingCycleId: 3,
          expectedNewTappedAmount: BigNumber.from(100),
          setup: {
            ops: [
              {
                type: "configure",
                projectId: 1,
                target: BigNumber.from(100),
                currency: BigNumber.from(1),
                duration: fundingCycleDuration,
                discountRate: BigNumber.from(180),
                fee: BigNumber.from(42),
                ballot: {
                  address: ballot.address
                },
                ballotState: "ballot",
                metadata: BigNumber.from(92),
                configureActiveFundingCycle: false
              },
              {
                type: "configure",
                projectId: 1,
                // these configuration numbers aren't special.
                target: BigNumber.from(20),
                currency: BigNumber.from(1),
                duration: BigNumber.from(80),
                discountRate: BigNumber.from(180),
                fee: BigNumber.from(42),
                ballot: {
                  address: ballot.address,
                  state: 1,
                  fundingCycleId: 2
                },
                metadata: BigNumber.from(92),
                configureActiveFundingCycle: false
              },
              {
                type: "fastforward",
                seconds: fundingCycleDuration.add(1)
              }
            ]
          }
        };
      }
    }
    // {
    //   description: "reconfigure, first funding cycle",
    //   fn: ({ deployer, ballot }) => {
    //     return {
    //       caller: deployer,
    //       projectId: 1,
    //       // these configuration numbers aren't special.
    //       target: BigNumber.from(120),
    //       currency: BigNumber.from(1),
    //       duration: BigNumber.from(80),
    //       discountRate: BigNumber.from(180),
    //       fee: BigNumber.from(42),
    //       ballot: ballot.address,
    //       metadata: BigNumber.from(92),
    //       configureActiveFundingCycle: false
    //     };
    //   }
    // },
    // {
    //   description: "reconfigure, during first funding cycle",
    //   fn: ({ deployer, ballot }) => {
    //     const preconfigureDuration = BigNumber.from(40);
    //     const preconfigureDiscountRate = BigNumber.from(120);
    //     return {
    //       caller: deployer,
    //       projectId: 1,
    //       // these configuration numbers aren't special.
    //       target: BigNumber.from(120),
    //       currency: BigNumber.from(1),
    //       duration: BigNumber.from(80),
    //       discountRate: BigNumber.from(180),
    //       fee: BigNumber.from(42),
    //       ballot: ballot.address,
    //       metadata: BigNumber.from(92),
    //       configureActiveFundingCycle: false,
    //       setup: {
    //         preconfigure: {
    //           // these configuration numbers aren't special.
    //           target: BigNumber.from(240),
    //           currency: BigNumber.from(0),
    //           duration: preconfigureDuration,
    //           discountRate: preconfigureDiscountRate,
    //           fee: BigNumber.from(40),
    //           ballot: ballot.address,
    //           metadata: BigNumber.from(3),
    //           configureActiveFundingCycle: false
    //         },
    //         fastforward: preconfigureDuration.sub(2)
    //       },
    //       expectedConfiguredNumber: 2,
    //       expectedStartTimeDistance: preconfigureDuration,
    //       expectedWeightFactor: 1
    //     };
    //   }
    // },
    // {
    //   description: "reconfigure, at the end of first funding cycle",
    //   fn: ({ deployer, ballot }) => {
    //     const preconfigureDuration = BigNumber.from(40);
    //     const preconfigureDiscountRate = BigNumber.from(120);
    //     return {
    //       caller: deployer,
    //       projectId: 1,
    //       target: BigNumber.from(120),
    //       currency: BigNumber.from(1),
    //       duration: BigNumber.from(80),
    //       discountRate: BigNumber.from(180),
    //       fee: BigNumber.from(42),
    //       ballot: ballot.address,
    //       metadata: BigNumber.from(92),
    //       configureActiveFundingCycle: false,
    //       setup: {
    //         preconfigure: {
    //           target: BigNumber.from(240),
    //           currency: BigNumber.from(0),
    //           duration: preconfigureDuration,
    //           discountRate: preconfigureDiscountRate,
    //           fee: BigNumber.from(40),
    //           ballot: ballot.address,
    //           metadata: BigNumber.from(3),
    //           configureActiveFundingCycle: false
    //         },
    //         fastforward: preconfigureDuration.sub(1)
    //       },
    //       expectedConfiguredNumber: 2,
    //       expectedStartTimeDistance: preconfigureDuration,
    //       expectedWeightFactor: 1
    //     };
    //   }
    // },
    // {
    //   description: "reconfigure, immediately after the first funding cycle",
    //   fn: ({ deployer, ballot }) => {
    //     const preconfigureDuration = BigNumber.from(40);
    //     const preconfigureDiscountRate = BigNumber.from(120);
    //     return {
    //       caller: deployer,
    //       projectId: 1,
    //       target: BigNumber.from(120),
    //       currency: BigNumber.from(1),
    //       duration: BigNumber.from(80),
    //       discountRate: BigNumber.from(180),
    //       fee: BigNumber.from(42),
    //       ballot: ballot.address,
    //       metadata: BigNumber.from(92),
    //       configureActiveFundingCycle: false,
    //       setup: {
    //         preconfigure: {
    //           target: BigNumber.from(240),
    //           currency: BigNumber.from(0),
    //           duration: preconfigureDuration,
    //           discountRate: preconfigureDiscountRate,
    //           fee: BigNumber.from(40),
    //           ballot: ballot.address,
    //           metadata: BigNumber.from(3),
    //           configureActiveFundingCycle: false
    //         },
    //         fastforward: preconfigureDuration
    //       },
    //       expectedConfiguredNumber: 2,
    //       expectedStartTimeDistance: preconfigureDuration,
    //       expectedWeightFactor: 1
    //     };
    //   }
    // },
    // {
    //   description: "reconfigure, shortly after the first funding cycle",
    //   fn: ({ deployer, ballot }) => {
    //     const preconfigureDuration = BigNumber.from(40);
    //     const preconfigureDiscountRate = BigNumber.from(120);
    //     return {
    //       caller: deployer,
    //       projectId: 1,
    //       target: BigNumber.from(120),
    //       currency: BigNumber.from(1),
    //       duration: BigNumber.from(80),
    //       discountRate: BigNumber.from(180),
    //       fee: BigNumber.from(42),
    //       ballot: ballot.address,
    //       metadata: BigNumber.from(92),
    //       configureActiveFundingCycle: false,
    //       setup: {
    //         preconfigure: {
    //           target: BigNumber.from(240),
    //           currency: BigNumber.from(0),
    //           duration: preconfigureDuration,
    //           discountRate: preconfigureDiscountRate,
    //           fee: BigNumber.from(40),
    //           ballot: ballot.address,
    //           metadata: BigNumber.from(3),
    //           configureActiveFundingCycle: false
    //         },
    //         fastforward: preconfigureDuration.add(1)
    //       },
    //       expectedConfiguredNumber: 3,
    //       expectedStartTimeDistance: preconfigureDuration.mul(2),
    //       expectedWeightFactor: 2
    //     };
    //   }
    // },
    // {
    //   description: "reconfigure, a few cycles after the first funding cycle",
    //   fn: ({ deployer, ballot }) => {
    //     const preconfigureDuration = BigNumber.from(40);
    //     const preconfigureDiscountRate = BigNumber.from(120);
    //     return {
    //       caller: deployer,
    //       projectId: 1,
    //       target: BigNumber.from(120),
    //       currency: BigNumber.from(1),
    //       duration: BigNumber.from(80),
    //       discountRate: BigNumber.from(180),
    //       fee: BigNumber.from(42),
    //       ballot: ballot.address,
    //       metadata: BigNumber.from(92),
    //       configureActiveFundingCycle: false,
    //       setup: {
    //         preconfigure: {
    //           target: BigNumber.from(240),
    //           currency: BigNumber.from(0),
    //           duration: preconfigureDuration,
    //           discountRate: preconfigureDiscountRate,
    //           fee: BigNumber.from(40),
    //           ballot: ballot.address,
    //           metadata: BigNumber.from(3),
    //           configureActiveFundingCycle: false
    //         },
    //         fastforward: preconfigureDuration.add(preconfigureDuration)
    //       },
    //       expectedConfiguredNumber: 4,
    //       expectedStartTimeDistance: preconfigureDuration.mul(3),
    //       expectedWeightFactor: 3
    //     };
    //   }
    // },
    // {
    //   description: "reconfigure, many cycles after the first funding cycle",
    //   fn: ({ deployer, ballot }) => {
    //     const preconfigureDuration = BigNumber.from(40);
    //     const preconfigureDiscountRate = BigNumber.from(120);
    //     return {
    //       caller: deployer,
    //       projectId: 1,
    //       target: BigNumber.from(120),
    //       currency: BigNumber.from(1),
    //       duration: BigNumber.from(80),
    //       discountRate: BigNumber.from(180),
    //       fee: BigNumber.from(42),
    //       ballot: ballot.address,
    //       metadata: BigNumber.from(92),
    //       configureActiveFundingCycle: false,
    //       setup: {
    //         preconfigure: {
    //           target: BigNumber.from(240),
    //           currency: BigNumber.from(0),
    //           duration: preconfigureDuration,
    //           discountRate: preconfigureDiscountRate,
    //           fee: BigNumber.from(40),
    //           ballot: ballot.address,
    //           metadata: BigNumber.from(3),
    //           configureActiveFundingCycle: false
    //         },
    //         fastforward: preconfigureDuration.mul(4)
    //       },
    //       expectedConfiguredNumber: 6,
    //       expectedStartTimeDistance: preconfigureDuration.mul(5),
    //       expectedWeightFactor: 5
    //     };
    //   }
    // },
    // {
    //   description:
    //     "reconfigure, during first funding cycle, configuring the active cycle",
    //   fn: ({ deployer, ballot }) => {
    //     const preconfigureDuration = BigNumber.from(40);
    //     const preconfigureDiscountRate = BigNumber.from(120);
    //     return {
    //       caller: deployer,
    //       projectId: 1,
    //       target: BigNumber.from(120),
    //       currency: BigNumber.from(1),
    //       duration: BigNumber.from(80),
    //       discountRate: BigNumber.from(180),
    //       fee: BigNumber.from(42),
    //       ballot: ballot.address,
    //       metadata: BigNumber.from(92),
    //       configureActiveFundingCycle: true,
    //       setup: {
    //         preconfigure: {
    //           target: BigNumber.from(240),
    //           currency: BigNumber.from(0),
    //           duration: preconfigureDuration,
    //           discountRate: preconfigureDiscountRate,
    //           fee: BigNumber.from(40),
    //           ballot: ballot.address,
    //           metadata: BigNumber.from(3),
    //           configureActiveFundingCycle: false
    //         },
    //         fastforward: preconfigureDuration.sub(2),
    //         expectedConfiguredNumber: 1
    //       }
    //     };
    //   }
    // },
    // {
    //   description:
    //     "reconfigure, immediately after the first funding cycle, ignoring the option to configure the active one",
    //   fn: ({ deployer, ballot }) => {
    //     const preconfigureDuration = BigNumber.from(40);
    //     const preconfigureDiscountRate = BigNumber.from(120);
    //     return {
    //       caller: deployer,
    //       projectId: 1,
    //       target: BigNumber.from(120),
    //       currency: BigNumber.from(1),
    //       duration: BigNumber.from(80),
    //       discountRate: BigNumber.from(180),
    //       fee: BigNumber.from(42),
    //       ballot: ballot.address,
    //       metadata: BigNumber.from(92),
    //       configureActiveFundingCycle: true,
    //       setup: {
    //         preconfigure: {
    //           target: BigNumber.from(240),
    //           currency: BigNumber.from(0),
    //           duration: preconfigureDuration,
    //           discountRate: preconfigureDiscountRate,
    //           fee: BigNumber.from(40),
    //           ballot: ballot.address,
    //           metadata: BigNumber.from(3),
    //           configureActiveFundingCycle: false
    //         },
    //         fastforward: preconfigureDuration
    //       },
    //       expectedConfiguredNumber: 2,
    //       expectedStartTimeDistance: preconfigureDuration,
    //       expectedWeightFactor: 1
    //     };
    //   }
    // },
    // {
    //   description: "reconfigure, first funding cycle, max values",
    //   fn: ({ deployer, ballot }) => {
    //     return {
    //       caller: deployer,
    //       projectId: 1,
    //       target: constants.MaxUint256,
    //       currency: BigNumber.from(2)
    //         .pow(8)
    //         .sub(1),
    //       duration: BigNumber.from(2)
    //         .pow(24)
    //         .sub(1),
    //       discountRate: BigNumber.from(200),
    //       fee: BigNumber.from(200),
    //       ballot: ballot.address,
    //       metadata: constants.MaxUint256,
    //       configureActiveFundingCycle: false
    //     };
    //   }
    // }
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
          amount,
          setup: { ops = [] },
          expectedFundingCycleId,
          expectedNewTappedAmount
        } = successTest.fn(this);

        // Reconfigure must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);

        for (let i = 0; i < ops.length; i += 1) {
          const op = ops[i];
          switch (op.type) {
            case "configure":
              // eslint-disable-next-line no-await-in-loop
              await this.contract
                .connect(caller)
                .configure(
                  projectId,
                  op.target,
                  op.currency,
                  op.duration,
                  op.discountRate,
                  op.fee,
                  op.ballot.address,
                  op.metadata,
                  op.configureActiveFundingCycle
                );
              if (op.ballot.state !== undefined) {
                // eslint-disable-next-line no-await-in-loop
                await this.ballot.mock.state
                  // eslint-disable-next-line no-await-in-loop
                  .withArgs(op.ballot.fundingCycleId, await this.getTimestamp())
                  .returns(op.ballot.state);
              }

              break;
            case "tap":
              // eslint-disable-next-line no-await-in-loop
              await this.contract.connect(caller).tap(op.projectId, op.amount);
              break;
            case "fastforward":
              // eslint-disable-next-line no-await-in-loop
              await this.fastforward(op.seconds);
              break;
            default:
              break;
          }
        }

        const tx = await this.contract.connect(caller).tap(projectId, amount);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Tap")
          .withArgs(
            expectedFundingCycleId,
            projectId,
            amount,
            expectedNewTappedAmount,
            caller.address
          );

        // // Get the current timestamp after the transaction.
        // const now = await this.getTimestamp();

        // // Get a reference to the base weight.
        // const baseWeight = await this.contract.BASE_WEIGHT();

        // let expectedWeight = baseWeight;

        // // Multiply the discount the amount of times specified.
        // if (expectedWeightFactor) {
        //   for (let i = 0; i < expectedWeightFactor; i += 1) {
        //     expectedWeight = expectedWeight
        //       .mul(preconfigure.discountRate)
        //       .div(200);
        //   }
        // }

        // const expectedConfiguredIndex =
        //   preconfigure &&
        //   (preconfigure.duration <= fastforward || !configureActiveFundingCycle)
        //     ? 2
        //     : 1;

        // // Get the time when the configured funding cycle starts.
        // let expectedStart;
        // if (preconfigure) {
        //   expectedStart =
        //     expectedConfiguredIndex === 1
        //       ? expectedPreconfigureStart
        //       : expectedPreconfigureStart.add(expectedStartTimeDistance);
        // } else {
        //   expectedStart = now;
        // }

        // // Expect an Init event if not configuring the same funding cycle again.
        // if (expectedConfiguredIndex > 1) {
        //   await expect(tx)
        //     .to.emit(this.contract, "Init")
        //     .withArgs(
        //       expectedConfiguredIndex,
        //       projectId,
        //       preconfigure ? expectedConfiguredNumber : 1,
        //       expectedConfiguredIndex - 1,
        //       expectedWeight,
        //       expectedStart
        //     );
        // }

        // // Get a reference to the funding cycle that was stored.
        // const storedFundingCycle = await this.contract.get(
        //   expectedConfiguredIndex
        // );

        // // Expect the stored values to match what's expected.
        // expect(storedFundingCycle.id).to.equal(expectedConfiguredIndex);
        // expect(storedFundingCycle.projectId).to.equal(projectId);
        // expect(storedFundingCycle.number).to.equal(
        //   expectedConfiguredIndex > 1 ? expectedConfiguredNumber : 1
        // );
        // expect(storedFundingCycle.previous).to.equal(
        //   expectedConfiguredIndex - 1
        // );
        // expect(storedFundingCycle.weight).to.equal(expectedWeight);
        // expect(storedFundingCycle.ballot).to.equal(ballot);
        // expect(storedFundingCycle.start).to.equal(expectedStart);
        // expect(storedFundingCycle.configured).to.equal(now);
        // expect(storedFundingCycle.duration).to.equal(duration);
        // expect(storedFundingCycle.target).to.equal(target);
        // expect(storedFundingCycle.currency).to.equal(currency);
        // expect(storedFundingCycle.fee).to.equal(fee);
        // expect(storedFundingCycle.discountRate).to.equal(discountRate);
        // expect(storedFundingCycle.tapped).to.equal(0);
        // expect(storedFundingCycle.metadata).to.equal(metadata);
      });
    });
  });
  // describe("Failure cases", function() {
  //   tests.failure.forEach(function(failureTest) {
  //     it(failureTest.description, async function() {
  //       const {
  //         caller,
  //         projectId,
  //         target,
  //         currency,
  //         duration,
  //         discountRate,
  //         fee,
  //         ballot,
  //         metadata,
  //         configureActiveFundingCycle,
  //         revert
  //       } = failureTest.fn(this);
  //       // Reconfigure must be called by an admin, so first set the owner of the contract, which make the caller an admin.
  //       await this.contract.connect(caller).setOwnership(caller.address);

  //       await expect(
  //         this.contract
  //           .connect(caller)
  //           .configure(
  //             projectId,
  //             target,
  //             currency,
  //             duration,
  //             discountRate,
  //             fee,
  //             ballot,
  //             metadata,
  //             configureActiveFundingCycle
  //           )
  //       ).to.be.revertedWith(revert);
  //     });
  //   });
  // });
};
