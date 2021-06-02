const {
  ethers: { BigNumber }
} = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    // {
    //   description: "reconfigure, first funding cycle",
    //   fn: ({ deployer, ballot }) => ({
    //     caller: deployer,
    //     projectId: 1,
    //     target: BigNumber.from(1),
    //     currency: BigNumber.from(1),
    //     duration: BigNumber.from(10),
    //     discountRate: BigNumber.from(200),
    //     fee: BigNumber.from(5),
    //     ballot: ballot.address,
    //     metadata: BigNumber.from(0),
    //     configureActiveFundingCycle: false
    //   })
    // },
    {
      description: "reconfigure, future funding cycle",
      fn: ({ deployer, ballot }) => ({
        caller: deployer,
        projectId: 1,
        target: BigNumber.from(1),
        currency: BigNumber.from(1),
        duration: BigNumber.from(10),
        discountRate: BigNumber.from(100),
        fee: BigNumber.from(5),
        ballot: ballot.address,
        metadata: BigNumber.from(0),
        configureActiveFundingCycle: false,
        setup: { preconfigure: true },
        fastforward: 50
      })
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
          setup: { preconfigure } = {},
          fastforward
        } = successTest.fn(this);

        // Reconfigure must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);

        let now;
        if (preconfigure) {
          await this.contract
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
              false
            );
          // Get a reference to now.
          now = await this.getTimestamp();
          await this.fastforward(fastforward);
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
            ballot,
            metadata,
            configureActiveFundingCycle
          );

        // const fundingCycleNumber =
        //   1 + (preconfigure ? fastforward % duration : 0);

        // Get the stored packed permissions value.
        const ogStoredFundingCycle = await this.contract.get(1);
        const storedFundingCycle = await this.contract.get(2);

        console.log({
          now: now.toNumber(),
          newNow: (await this.getTimestamp()).toNumber(),
          ogStart: ogStoredFundingCycle.start.toNumber(),
          start: storedFundingCycle.start.toNumber(),
          startDiff:
            storedFundingCycle.start.toNumber() -
            ogStoredFundingCycle.start.toNumber(),
          rate: ogStoredFundingCycle.discountRate.toNumber(),
          ogWeight: ogStoredFundingCycle.weight
            .div(BigNumber.from(10).pow(16))
            .toNumber(),
          weight: storedFundingCycle.weight
            .div(BigNumber.from(10).pow(16))
            .toNumber()
        });

        // if (
        //   !configureActiveFundingCycle &&
        //   preconfigure &&
        //   fundingCycleNumber === 1
        // )
        //   fundingCycleNumber = 2;

        // console.log({ fundingCycleNumber });

        // // Expect an event to have been emitted.
        // await expect(tx)
        //   .to.emit(this.contract, "Configure")
        //   .withArgs(
        //     fundingCycleNumber,
        //     projectId,
        //     now,
        //     target,
        //     currency,
        //     duration,
        //     discountRate,
        //     metadata,
        //     ballot,
        //     caller.address
        //   );

        // // Get the stored packed permissions value.

        // const baseWeight = await this.contract.BASE_WEIGHT();

        // const weight = preconfigure
        //   ? baseWeight.mul((discountRate / 200) ** (fastforward % duration))
        //   : baseWeight;

        // console.log({ mul: (discountRate / 200) ** (fastforward % duration) });

        // let start = preconfigure
        //   ? now.add(duration.mul(fastforward % duration))
        //   : now;

        // if (preconfigure && configureActiveFundingCycle && start === now) {
        //   start = start.add(duration);
        // }

        // console.log({ start, now, multiplier: fastforward % duration });

        // // Expect the stored values to match what's expected.
        // expect(storedFundingCycle.id).to.equal(fundingCycleNumber);
        // expect(storedFundingCycle.projectId).to.equal(projectId);
        // expect(storedFundingCycle.number).to.equal(preconfigure ? 2 : 1);
        // expect(storedFundingCycle.previous).to.equal(preconfigure ? 1 : 0);
        // expect(storedFundingCycle.weight).to.equal(weight);
        // expect(storedFundingCycle.ballot).to.equal(ballot);
        // expect(storedFundingCycle.start).to.equal(start);
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
