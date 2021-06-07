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
  projectId: 1,
  amount: BigNumber.from(20),
  setup: {
    preconfigure: {
      target: BigNumber.from(240),
      currency: BigNumber.from(0),
      duration: BigNumber.from(100),
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
            duration: BigNumber.from(80),
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
            duration: BigNumber.from(80),
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
          duration: BigNumber.from(42)
        },
        ops: [
          {
            type: "configure",
            projectId: 1,
            configureActiveFundingCycle: false,
            // Greater than the amount being tapped.
            target: BigNumber.from(120),
            ballot: {
              // This funding cycle (2) is approved.
              fundingCycleId: 2,
              state: BigNumber.from(0)
            },
            // The below values dont matter.
            currency: BigNumber.from(1),
            duration: BigNumber.from(80),
            discountRate: BigNumber.from(180),
            fee: BigNumber.from(42),
            metadata: BigNumber.from(92)
          }
        ],
        // Fast forward the full duration.
        fastforward: BigNumber.from(42),
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
          tappedId: 3,
          tappedNumber: 3,
          initNumber: 3,
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
          tappedId: 3,
          tappedNumber: 3,
          initNumber: 3,
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
          tappedId: 3,
          tappedNumber: 3,
          initNumber: 3,
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
          duration: BigNumber.from(42)
        },
        // Fast forward multiples of the duration.
        fastforward: BigNumber.from(126),
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
      description: "first configuration, discount rate 0",
      fn: testTemplate({
        op: {
          // Less than the preconfiguration, greater than the standby.
          amount: BigNumber.from(20),
          discountRate: BigNumber.from(0)
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
        revert: "FundingCycles::_tappable: NOT_FOUND"
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

        // Reconfigure must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);

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
              this.ballot.address,
              preconfigure.metadata,
              preconfigure.configureActiveFundingCycle
            );
          preconfigureBlockNumber = tx.blockNumber;
          await this.setTimeMark(tx.blockNumber);
        }

        // Get a reference to the timestamp right after the preconfiguration occurs.
        const expectedPreconfigureStart = await this.getTimestamp(
          preconfigureBlockNumber
        );

        // Mock the duration as 0.
        await this.ballot.mock.duration.returns(BigNumber.from(0));

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
                  this.ballot.address,
                  op.metadata,
                  op.configureActiveFundingCycle
                );

              // Mock the ballot state for this reconfiguration if needed.
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
          setup: { preconfigure, ops },
          revert
        } = failureTest.fn(this);
        // Reconfigure must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);

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
              this.ballot.address,
              preconfigure.metadata,
              preconfigure.configureActiveFundingCycle
            );
          await this.setTimeMark(tx.blockNumber);
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
              await this.fastforward(op.seconds.sub(1));
              break;
            default:
              break;
          }
        }

        await expect(
          this.contract.connect(caller).tap(projectId, amount)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
