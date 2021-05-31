// const { ethers } = require("hardhat");
const { expect } = require("chai");
const {
  ethers: { BigNumber }
} = require("hardhat");

const tests = {
  success: [
    {
      description: "total balance of, just IOUs",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        issue: false,
        print: [
          {
            type: "IOU",
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
      description: "total balance of, IOUs and ERC20s",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectId: 1,
        issue: true,
        print: [
          {
            type: "IOU",
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
      description: "total balance of, IOUs and ERC20s with some transfered",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectId: 1,
        issue: true,
        print: [
          {
            type: "IOU",
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

        // Initialize the project's tickets to set the specified controller.
        // Initialize must be called by an admin, so first set the owner of the contract, which make the caller an admin.
        await this.contract.connect(caller).setOwnership(caller.address);
        await this.contract
          .connect(caller)
          .initialize(caller.address, projectId);

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
              case "IOU":
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
              .totalBalanceOf(balance.holder, projectId);

            // The expected should match what's stored.
            expect(storedBalanceOf).to.equal(balance.expected);
          })
        );
      });
    });
  });
};
