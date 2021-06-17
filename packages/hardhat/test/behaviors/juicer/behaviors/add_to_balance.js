const {
  ethers: { BigNumber }
} = require("hardhat");

const { expect } = require("chai");
const { operatorStore } = require("../..");

const tests = {
  success: [
    // {
    //   description: "add with no yielder or preset balance",
    //   fn: ({ governance }) => ({
    //     caller: governance,
    //     projectId: 1,
    //     amount: BigNumber.from(1),
    //     expectation: {
    //       projectBalance: BigNumber.from(1),
    //       totalBalanceWithoutYield: BigNumber.from(1),
    //       totalBalanceWithYield: BigNumber.from(1)
    //     }
    //   })
    // },
    // {
    //   description: "add with no yielder and preset balance",
    //   fn: ({ governance }) => ({
    //     caller: governance,
    //     projectId: 1,
    //     amount: BigNumber.from(1),
    //     setup: {
    //       addToBalance: BigNumber.from(1)
    //     },
    //     expectation: {
    //       projectBalance: BigNumber.from(2),
    //       totalBalanceWithoutYield: BigNumber.from(2),
    //       totalBalanceWithYield: BigNumber.from(2)
    //     }
    //   })
    // },
    // {
    //   description: "add with yielder, all balance deposited, with no yield",
    //   fn: ({ governance }) => ({
    //     caller: governance,
    //     projectId: 1,
    //     amount: BigNumber.from(1),
    //     setup: {
    //       addToBalance: BigNumber.from(1),
    //       addYielder: true,
    //       yielderBalanceWithoutYield: BigNumber.from(1),
    //       yielderBalanceWithYield: BigNumber.from(1)
    //     },
    //     expectation: {
    //       projectBalance: BigNumber.from(2),
    //       totalBalanceWithoutYield: BigNumber.from(2),
    //       totalBalanceWithYield: BigNumber.from(2)
    //     }
    //   })
    // },
    // {
    //   description: "add with yielder, partial balance deposited, with no yield",
    //   fn: ({ governance }) => ({
    //     caller: governance,
    //     projectId: 1,
    //     amount: BigNumber.from(1),
    //     setup: {
    //       addToBalance: BigNumber.from(2),
    //       addYielder: true,
    //       yielderBalanceWithYield: BigNumber.from(1),
    //       yielderBalanceWithoutYield: BigNumber.from(1)
    //     },
    //     expectation: {
    //       projectBalance: BigNumber.from(3),
    //       totalBalanceWithYield: BigNumber.from(3),
    //       totalBalanceWithoutYield: BigNumber.from(3)
    //     }
    //   })
    // },
    // {
    //   description: "add with yielder, all balance deposited, with yield",
    //   fn: ({ governance }) => ({
    //     caller: governance,
    //     projectId: 1,
    //     amount: BigNumber.from(10).pow(18),
    //     setup: {
    //       addToBalance: BigNumber.from(10).pow(18),
    //       addYielder: true,
    //       yielderBalanceWithoutYield: BigNumber.from(10).pow(18),
    //       yielderBalanceWithYield: BigNumber.from(10)
    //         .pow(18)
    //         .mul(2)
    //     },
    //     expectation: {
    //       // jus confused cus the project should have it all.
    //       projectBalance: BigNumber.from(10)
    //         .pow(18)
    //         .mul(9)
    //         .div(4),
    //       totalBalanceWithoutYield: BigNumber.from(10)
    //         .pow(18)
    //         .mul(2),
    //       totalBalanceWithYield: BigNumber.from(10)
    //         .pow(18)
    //         .mul(3)
    //     }
    //   })
    // }
    // {
    //   description: "add with yielder, all balance deposited, with yield",
    //   fn: ({ governance }) => ({
    //     caller: governance,
    //     projectId: 1,
    //     amount: BigNumber.from(10).pow(18),
    //     setup: {
    //       addYielder: true,
    //       ops: [
    //         {
    //           projectId: 1,
    //           addToBalance: BigNumber.from(10).pow(18),
    //           yielderBalanceWithoutYield: BigNumber.from(10).pow(18),
    //           yielderBalanceWithYield: BigNumber.from(10)
    //             .pow(18)
    //             .mul(2)
    //         }
    //       ]
    //     },
    //     expectation: {
    //       projectBalance: BigNumber.from(10)
    //         .pow(18)
    //         .mul(3),
    //       totalBalanceWithoutYield: BigNumber.from(10)
    //         .pow(18)
    //         .mul(2),
    //       totalBalanceWithYield: BigNumber.from(10)
    //         .pow(18)
    //         .mul(3)
    //     }
    //   })
    // },
    {
      description:
        "add with yielder, multiproject, all balance deposited, with yield",
      fn: ({ governance }) => ({
        caller: governance,
        projectId: 1,
        amount: BigNumber.from(10).pow(6),
        setup: {
          addYielder: true,
          ops: [
            {
              projectId: 1,
              addToBalance: BigNumber.from(10).pow(6)
            },
            {
              projectId: 2,
              addToBalance: BigNumber.from(10).pow(6),
              yielderBalanceWithoutYield: BigNumber.from(10)
                .pow(6)
                .mul(2),
              yielderBalanceWithYield: BigNumber.from(10)
                .pow(6)
                .mul(4)
            }
          ]
        },
        expectation: {
          projectBalance: BigNumber.from(10)
            .pow(6)
            .mul(3),
          totalBalanceWithoutYield: BigNumber.from(10)
            .pow(6)
            .mul(2),
          totalBalanceWithYield: BigNumber.from(10)
            .pow(6)
            .mul(3)
        }
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer }) => ({
        caller: deployer,
        amount: BigNumber.from(1),
        revert: "Juicer: UNAUTHORIZED"
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
          setup: { addYielder, ops } = {},
          expectation: {
            projectBalance,
            totalBalanceWithoutYield,
            totalBalanceWithYield
          } = {}
        } = successTest.fn(this);

        let yielder;
        if (addYielder) {
          yielder = await this.deployMockLocalContract("ExampleYielder");
          await this.contract.connect(caller).setYielder(yielder.address);
          await yielder.mock.deposit.returns();
          await yielder.mock.deposited.returns(0);
          await yielder.mock.getCurrentBalance.returns(0);
        }
        let localBalance = BigNumber.from(0);
        for (let i = 0; i < ops.length; i += 1) {
          const op = ops[i];
          op.yielderBalanceWithoutYield = op.yielderBalanceWithoutYield || 0;
          op.yielderBalanceWithYield = op.yielderBalanceWithYield || 0;

          if (!op.addToBalance) return;
          console.log("a", { projectId: op.projectId });
          // eslint-disable-next-line no-await-in-loop
          await this.contract
            .connect(caller)
            .addToBalance(op.projectId, { value: op.addToBalance });

          console.log("b: ", {
            localBalance: localBalance.toNumber(),
            atb: op.addToBalance.toNumber()
          });
          localBalance = localBalance.add(op.addToBalance);
          console.log("c: ", localBalance.toNumber());
          if (yielder) {
            console.log("d");
            // eslint-disable-next-line no-await-in-loop
            await yielder.mock.getCurrentBalance.returns(
              op.yielderBalanceWithYield
            );
            console.log("e");
            if (op.yielderBalanceWithoutYield) {
              localBalance = localBalance.sub(op.yielderBalanceWithoutYield);
              console.log("f: ", {
                localBalance: localBalance.toNumber()
              });
              // eslint-disable-next-line no-await-in-loop
              await this.contract
                .connect(caller)
                .setTargetLocalWei(localBalance);
              console.log("g");
              // eslint-disable-next-line no-await-in-loop
              const b1 = await this.contract.provider.getBalance(
                this.contract.address
              );
              console.log({
                /* eslint-disable-next-line no-await-in-loop */
                balanceA: b1.toNumber()
              });
              // eslint-disable-next-line no-await-in-loop
              await this.contract.connect(caller).deposit();
              // eslint-disable-next-line no-await-in-loop
              const b2 = await this.contract.provider.getBalance(
                this.contract.address
              );
              console.log({
                balanceB: b2.toNumber()
              });
            }
          }
        }
        // if (addToBalance) {
        //   await this.contract
        //     .connect(caller)
        //     .addToBalance(projectId, { value: addToBalance });
        //   if (addYielder) {
        //     const yielder = await this.deployMockLocalContract(
        //       "ExampleYielder"
        //     );
        //     await this.contract.connect(caller).setYielder(yielder.address);
        //     await yielder.mock.deposited.returns(yielderBalanceWithoutYield);
        //     await yielder.mock.getCurrentBalance.returns(
        //       yielderBalanceWithYield
        //     );
        //     if (yielderBalanceWithoutYield) {
        //       await yielder.mock.deposit.returns();
        //       await this.contract
        //         .connect(caller)
        //         .setTargetLocalWei(addToBalance - yielderBalanceWithoutYield);
        //       console.log({
        //         balanceA: await this.contract.provider.getBalance(
        //           this.contract.address
        //         )
        //       });
        //       await this.contract.connect(caller).deposit();
        //       console.log({
        //         balanceB: await this.contract.provider.getBalance(
        //           this.contract.address
        //         )
        //       });
        //     }
        //   }
        // }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .addToBalance(projectId, { value: amount });

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "AddToBalance")
          .withArgs(projectId, amount, caller.address);

        // Get the stored balance.
        const storedBalanceOf = await this.contract.balanceOf(projectId);

        // Get the total stored balance.
        const storedBalance = await this.contract.balance();

        // Expect the stored value to equal whats expected.
        expect(storedBalanceOf).to.equal(projectBalance);

        // Expect the stored value to equal whats expected.
        expect(storedBalance.amountWithYield).to.equal(totalBalanceWithYield);

        // Expect the stored value to equal whats expected.
        expect(storedBalance.amountWithoutYield).to.equal(
          totalBalanceWithoutYield
        );
      });
    });
  });
  // describe("Failure cases", function() {
  //   tests.failure.forEach(function(failureTest) {
  //     it(failureTest.description, async function() {
  //       const { caller, amount, revert } = failureTest.fn(this);

  //       // Execute the transaction.
  //       await expect(
  //         this.contract.connect(caller).setTargetLocalWei(amount)
  //       ).to.be.revertedWith(revert);
  //     });
  //   });
  // });
};
