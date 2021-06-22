const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "deploy one address",
      fn: ({ deployer }) => ({
        caller: deployer,
        ops: [
          {
            projectId: 1,
            memo: "some-memo"
          }
        ],
        expectations: [
          {
            projectId: 1,
            memos: ["some-memo"]
          }
        ]
      })
    },
    {
      description: "deploy many addresses to one project",
      fn: ({ deployer }) => ({
        caller: deployer,
        ops: [
          {
            projectId: 1,
            memo: "some-memo"
          },
          {
            projectId: 1,
            memo: "some-other-memo"
          }
        ],
        expectations: [
          {
            projectId: 1,
            memos: ["some-memo", "some-other-memo"]
          }
        ]
      })
    },
    {
      description: "deploy many addresses to many project",
      fn: ({ deployer }) => ({
        caller: deployer,
        ops: [
          {
            projectId: 1,
            memo: "some-memo"
          },
          {
            projectId: 1,
            memo: "some-other-memo"
          },
          {
            projectId: 2,
            memo: "yet-another-memo"
          },
          {
            projectId: 2,
            memo: "yet-some-other-memo"
          }
        ],
        expectations: [
          {
            projectId: 1,
            memos: ["some-memo", "some-other-memo"]
          },
          {
            projectId: 2,
            memos: ["yet-another-memo", "yet-some-other-memo"]
          }
        ]
      })
    }
  ],
  failure: [
    {
      description: "zero project",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 0,
        memo: "some-memo",
        revert: "TerminalDirectory::deployAddress: ZERO_PROJECT"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, ops, expectations } = successTest.fn(this);

        await Promise.all(
          ops.map(async op => {
            // Execute the transaction.
            const tx = await this.contract
              .connect(caller)
              .deployAddress(op.projectId, op.memo);

            // Expect an event to have been emitted.
            await expect(tx)
              .to.emit(this.contract, "DeployAddress")
              .withArgs(op.projectId, op.memo, caller.address);
          })
        );

        // Attach the address to the Tickets contract.
        const DirectPaymentAddressFactory = await ethers.getContractFactory(
          "DirectPaymentAddress"
        );

        expectations.forEach(async expectation => {
          // Get the stored addresses for the project.
          const storedAddresses = await this.contract
            .connect(caller)
            .addressesOf(expectation.projectId);
          storedAddresses.forEach(async (address, i) => {
            const StoredDirectPaymentAddress = await DirectPaymentAddressFactory.attach(
              address
            );
            const storedProjectId = await StoredDirectPaymentAddress.projectId();
            const storedTerminalDirectory = await StoredDirectPaymentAddress.terminalDirectory();
            const storedMemo = await StoredDirectPaymentAddress.memo();

            expect(storedProjectId).to.equal(expectation.projectId);
            expect(storedTerminalDirectory).to.equal(this.contract.address);
            expect(storedMemo).to.equal(expectation.memos[i]);
          });
        });
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, projectId, memo, revert } = failureTest.fn(this);

        await expect(
          this.contract.connect(caller).deployAddress(projectId, memo)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
