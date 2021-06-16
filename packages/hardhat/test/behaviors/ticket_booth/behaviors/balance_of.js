// const { ethers } = require("hardhat");
const { expect } = require("chai");
const {
  ethers: { BigNumber }
} = require("hardhat");

const tests = {
  success: [
    {
      description: "total balance of, just staked tickets",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        issue: false,
        print: [
          {
            type: "staked",
            holder: deployer.address,
            amount: BigNumber.from(50)
          }
        ],
        balances: [
          {
            holder: deployer.address,
            expected: BigNumber.from(50)
          }
        ]
      })
    },
    {
      description: "total balance of, staked and unstaked tickets",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        issue: true,
        print: [
          {
            type: "staked",
            holder: deployer.address,
            amount: BigNumber.from(50)
          },
          {
            type: "ERC20",
            holder: deployer.address,
            amount: BigNumber.from(50)
          }
        ],
        balances: [
          {
            holder: deployer.address,
            expected: BigNumber.from(100)
          }
        ]
      })
    },
    {
      description:
        "total balance of, staked and unstaked tickets with some transfered",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        issue: true,
        print: [
          {
            type: "staked",
            holder: deployer.address,
            amount: BigNumber.from(50)
          },
          {
            type: "ERC20",
            holder: deployer.address,
            amount: BigNumber.from(50)
          }
        ],
        transfer: {
          holder: deployer.address,
          amount: BigNumber.from(30),
          recipient: addrs[0].address
        },
        balances: [
          {
            holder: deployer.address,
            expected: BigNumber.from(70)
          },
          {
            holder: addrs[0].address,
            expected: BigNumber.from(30)
          }
        ]
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
          issue,
          print,
          transfer,
          balances
        } = successTest.fn(this);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        if (issue) {
          // Issue tickets.
          // Must make the caller the project owner in order to issue.
          await this.projects.mock.ownerOf
            .withArgs(projectId)
            .returns(caller.address);
          await this.contract
            .connect(caller)
            .issue(projectId, "doesnt", "matter");
        }

        await Promise.all(
          print.map(async p => {
            switch (p.type) {
              case "staked":
                // Print tickets to make up the balance.
                await this.contract
                  .connect(caller)
                  .print(p.holder, projectId, p.amount, false);
                break;
              case "ERC20":
                // Print tickets to make up the balance.
                await this.contract
                  .connect(caller)
                  .print(p.holder, projectId, p.amount, true);
                break;
              default:
                break;
            }
          })
        );
        if (transfer) {
          // Lock the specified amount of tickets.
          await this.contract
            .connect(caller)
            .transfer(
              transfer.holder,
              projectId,
              transfer.amount,
              transfer.recipient
            );
        }

        await Promise.all(
          balances.map(async balance => {
            // Execute the transaction.
            const storedBalanceOf = await this.contract
              .connect(caller)
              .balanceOf(balance.holder, projectId);

            // The expected should match what's stored.
            expect(storedBalanceOf).to.equal(balance.expected);
          })
        );
      });
    });
  });
};
