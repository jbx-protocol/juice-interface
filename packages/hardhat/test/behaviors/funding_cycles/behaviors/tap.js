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
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(20)
        },
        setup: {
          preconfigure: {
            // these configuration numbers aren't special.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            ballot: {
              address: ballot.address,
              duration: BigNumber.from(0)
            },
            metadata: BigNumber.from(92),
            configureActiveFundingCycle: false
          },
          ops: []
        }
      })
    },
    {
      description: "taps, first configuration, full amount",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        amount: BigNumber.from(120),
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(120)
        },
        setup: {
          preconfigure: {
            projectId: 1,
            // these configuration numbers aren't special.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            ballot: {
              address: ballot.address,
              duration: BigNumber.from(0)
            },
            metadata: BigNumber.from(92),
            configureActiveFundingCycle: false
          },
          ops: []
        }
      })
    },
    {
      description: "taps, second configuration",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        amount: BigNumber.from(140),
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(140)
        },
        setup: {
          preconfigure: {
            projectId: 1,
            // these configuration numbers aren't special.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            ballot: {
              address: ballot.address,
              duration: BigNumber.from(0)
            },
            metadata: BigNumber.from(92),
            configureActiveFundingCycle: false
          },
          ops: [
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
                address: ballot.address,
                duration: BigNumber.from(0)
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
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(120)
        },
        setup: {
          preconfigure: {
            projectId: 1,
            // these configuration numbers aren't special.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            ballot: {
              address: ballot.address,
              duration: BigNumber.from(0)
            },
            metadata: BigNumber.from(92),
            configureActiveFundingCycle: false
          },
          ops: [
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
                address: ballot.address,
                duration: BigNumber.from(0)
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
          expectation: {
            tappedId: 2,
            tappedNumber: 2,
            newTappedAmount: BigNumber.from(120)
          },
          setup: {
            preconfigure: {
              projectId: 1,
              target: BigNumber.from(100),
              currency: BigNumber.from(1),
              duration: fundingCycleDuration,
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address,
                duration: BigNumber.from(0)
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            },
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
                  address: ballot.address,
                  duration: BigNumber.from(0),
                  state: BigNumber.from(0),
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
        "taps, first configuration, with approved ballot but duration not through",
      fn: ({ deployer, ballot }) => {
        const fundingCycleDuration = BigNumber.from(80);
        return {
          caller: deployer,
          projectId: 1,
          amount: BigNumber.from(120),
          expectation: {
            tappedId: 1,
            tappedNumber: 1,
            initNumber: 1,
            basedOn: 0,
            newTappedAmount: BigNumber.from(120)
          },
          setup: {
            preconfigure: {
              projectId: 1,
              target: BigNumber.from(120),
              currency: BigNumber.from(1),
              duration: fundingCycleDuration,
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address,
                duration: fundingCycleDuration
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            },
            ops: [
              {
                type: "configure",
                projectId: 1,
                // these configuration numbers aren't special.
                target: BigNumber.from(100),
                currency: BigNumber.from(1),
                duration: BigNumber.from(80),
                discountRate: BigNumber.from(180),
                fee: BigNumber.from(42),
                ballot: {
                  address: ballot.address,
                  duration: fundingCycleDuration,
                  state: BigNumber.from(0),
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
        "taps, second configuration, with approved ballot and duration just through",
      fn: ({ deployer, ballot }) => {
        const fundingCycleDuration = BigNumber.from(80);
        return {
          caller: deployer,
          projectId: 1,
          amount: BigNumber.from(120),
          expectation: {
            tappedId: 2,
            tappedNumber: 2,
            basedOn: 0,
            newTappedAmount: BigNumber.from(120)
          },
          setup: {
            preconfigure: {
              projectId: 1,
              target: BigNumber.from(80),
              currency: BigNumber.from(1),
              duration: fundingCycleDuration,
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address,
                duration: fundingCycleDuration.sub(1)
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            },
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
                  address: ballot.address,
                  duration: fundingCycleDuration.sub(1),
                  state: BigNumber.from(0),
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
      description: "taps, first configuration, with active ballot",
      fn: ({ deployer, ballot }) => {
        const fundingCycleDuration = BigNumber.from(80);
        return {
          caller: deployer,
          projectId: 1,
          amount: BigNumber.from(120),
          expectation: {
            tappedId: 1,
            tappedNumber: 1,
            initNumber: 1,
            basedOn: 0,
            newTappedAmount: BigNumber.from(120)
          },
          setup: {
            preconfigure: {
              projectId: 1,
              target: BigNumber.from(120),
              currency: BigNumber.from(1),
              duration: fundingCycleDuration,
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address,
                duration: BigNumber.from(0)
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            },
            ops: [
              {
                type: "configure",
                projectId: 1,
                // these configuration numbers aren't special.
                target: BigNumber.from(100),
                currency: BigNumber.from(1),
                duration: BigNumber.from(80),
                discountRate: BigNumber.from(180),
                fee: BigNumber.from(42),
                ballot: {
                  address: ballot.address,
                  duration: BigNumber.from(0),
                  state: BigNumber.from(1),
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
      description: "taps, first configuration, with failed ballot",
      fn: ({ deployer, ballot }) => {
        const fundingCycleDuration = BigNumber.from(80);
        return {
          caller: deployer,
          projectId: 1,
          amount: BigNumber.from(120),
          expectation: {
            tappedId: 1,
            tappedNumber: 1,
            initNumber: 1,
            basedOn: 0,
            newTappedAmount: BigNumber.from(120)
          },
          setup: {
            preconfigure: {
              projectId: 1,
              target: BigNumber.from(120),
              currency: BigNumber.from(1),
              duration: fundingCycleDuration,
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address,
                duration: BigNumber.from(0)
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            },
            ops: [
              {
                type: "configure",
                projectId: 1,
                // these configuration numbers aren't special.
                target: BigNumber.from(100),
                currency: BigNumber.from(1),
                duration: BigNumber.from(80),
                discountRate: BigNumber.from(180),
                fee: BigNumber.from(42),
                ballot: {
                  address: ballot.address,
                  duration: BigNumber.from(0),
                  state: BigNumber.from(2),
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
      description: "taps, first configuration, with standby ballot",
      fn: ({ deployer, ballot }) => {
        const fundingCycleDuration = BigNumber.from(80);
        return {
          caller: deployer,
          projectId: 1,
          amount: BigNumber.from(120),
          expectation: {
            tappedId: 1,
            tappedNumber: 1,
            initNumber: 1,
            basedOn: 0,
            newTappedAmount: BigNumber.from(120)
          },
          setup: {
            preconfigure: {
              projectId: 1,
              target: BigNumber.from(120),
              currency: BigNumber.from(1),
              duration: fundingCycleDuration,
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address,
                duration: BigNumber.from(0)
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            },
            ops: [
              {
                type: "configure",
                projectId: 1,
                // these configuration numbers aren't special.
                target: BigNumber.from(100),
                currency: BigNumber.from(1),
                duration: BigNumber.from(80),
                discountRate: BigNumber.from(180),
                fee: BigNumber.from(42),
                ballot: {
                  address: ballot.address,
                  duration: BigNumber.from(0),
                  state: BigNumber.from(3),
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
      description: "taps, first configuration, a while later",
      fn: ({ deployer, ballot }) => {
        const fundingCycleDuration = BigNumber.from(80);
        return {
          caller: deployer,
          projectId: 1,
          amount: BigNumber.from(120),
          expectation: {
            tappedId: 2,
            tappedNumber: 4,
            initNumber: 4,
            basedOn: 1,
            newTappedAmount: BigNumber.from(120)
          },
          setup: {
            preconfigure: {
              projectId: 1,
              target: BigNumber.from(120),
              currency: BigNumber.from(1),
              duration: fundingCycleDuration,
              discountRate: BigNumber.from(180),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address,
                duration: BigNumber.from(0)
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            },
            ops: [
              {
                type: "fastforward",
                seconds: fundingCycleDuration.mul(3)
              }
            ]
          }
        };
      }
    },
    {
      description: "taps, first configuration, twice",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        amount: BigNumber.from(10),
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(120)
        },
        setup: {
          preconfigure: {
            projectId: 1,
            // these configuration numbers aren't special.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            ballot: {
              address: ballot.address,
              duration: BigNumber.from(0)
            },
            metadata: BigNumber.from(92),
            configureActiveFundingCycle: false
          },
          ops: [
            {
              projectId: 1,
              type: "tap",
              amount: BigNumber.from(110)
            }
          ]
        }
      })
    },
    {
      description: "taps, first configuration, discount rate 0",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        amount: BigNumber.from(20),
        expectation: {
          tappedId: 1,
          tappedNumber: 1,
          initNumber: 1,
          basedOn: 0,
          newTappedAmount: BigNumber.from(20)
        },
        setup: {
          preconfigure: {
            // these configuration numbers aren't special.
            target: BigNumber.from(120),
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
            discountRate: BigNumber.from(0),
            fee: BigNumber.from(42),
            ballot: {
              address: ballot.address,
              duration: BigNumber.from(0)
            },
            metadata: BigNumber.from(92),
            configureActiveFundingCycle: false
          },
          ops: []
        }
      })
    }
  ],
  failure: [
    {
      description: "project not found",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        amount: BigNumber.from(20),
        setup: {
          ops: []
        },
        revert: "FundingCycles::_tappable: NOT_FOUND"
      })
    },
    {
      description: "non recurring",
      fn: ({ deployer, ballot }) => {
        const fundingCycleDuration = BigNumber.from(80);
        return {
          caller: deployer,
          projectId: 1,
          amount: BigNumber.from(20),
          setup: {
            preconfigure: {
              target: BigNumber.from(120),
              currency: BigNumber.from(1),
              duration: fundingCycleDuration,
              discountRate: BigNumber.from(0),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address,
                duration: BigNumber.from(0)
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            },
            fastforward: {
              seconds: fundingCycleDuration
            }
          },
          revert: "FundingCycles::_tappable: NON_RECURRING"
        };
      }
    },
    {
      description: "insufficient funds",
      fn: ({ deployer, ballot }) => {
        const fundingCycleDuration = BigNumber.from(80);
        return {
          caller: deployer,
          projectId: 1,
          amount: BigNumber.from(120),
          setup: {
            preconfigure: {
              target: BigNumber.from(100),
              currency: BigNumber.from(1),
              duration: fundingCycleDuration,
              discountRate: BigNumber.from(0),
              fee: BigNumber.from(42),
              ballot: {
                address: ballot.address,
                duration: BigNumber.from(0)
              },
              metadata: BigNumber.from(92),
              configureActiveFundingCycle: false
            }
          },
          revert: "FundingCycles::tap: INSUFFICIENT_FUNDS"
        };
      }
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

        // Reconfigure must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);

        let preconfigureBlockNumber;

        if (preconfigure) {
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
        }

        // Get a reference to the timestamp right after the preconfiguration occurs.
        const expectedPreconfigureStart = await this.getTimestamp(
          preconfigureBlockNumber
        );

        for (let i = 0; i < ops.length; i += 1) {
          const op = ops[i];
          switch (op.type) {
            case "configure": {
              // eslint-disable-next-line no-await-in-loop
              const tx = await this.contract
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
              if (op.ballot) {
                // If a ballot was provided, mock the ballot contract with the provided properties.
                // eslint-disable-next-line no-await-in-loop
                await this.ballot.mock.duration.returns(op.ballot.duration);

                if (op.ballot.state !== undefined) {
                  // eslint-disable-next-line no-await-in-loop
                  await this.ballot.mock.state
                    .withArgs(
                      op.ballot.fundingCycleId,
                      // eslint-disable-next-line no-await-in-loop
                      await this.getTimestamp(tx.blockNumber)
                    )
                    .returns(op.ballot.state);
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
              await this.fastforward(op.seconds.sub(1));
              break;
            default:
              break;
          }
        }

        const tx = await this.contract.connect(caller).tap(projectId, amount);

        // Get the current timestamp after the transaction.
        const now = await this.getTimestamp(tx.blockNumber);

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
          for (let i = 0; i < expectation.initNumber - 1; i += 1) {
            expectedWeight = expectedWeight
              .mul(preconfigure.discountRate)
              .div(200);
          }

          // Get the time when the configured funding cycle starts.
          let expectedStart;
          if (preconfigure) {
            expectedStart = expectedPreconfigureStart.add(
              preconfigure.duration.mul(expectation.initNumber - 1)
            );
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
          projectId,
          amount,
          setup: { preconfigure, fastforward },
          revert
        } = failureTest.fn(this);
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
              preconfigure.ballot.address,
              preconfigure.metadata,
              preconfigure.configureActiveFundingCycle
            );
        }

        if (fastforward) {
          await this.fastforward(fastforward.seconds.sub(1));
        }
        await expect(
          this.contract.connect(caller).tap(projectId, amount)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
