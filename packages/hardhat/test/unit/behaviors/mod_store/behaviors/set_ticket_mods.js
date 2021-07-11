const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "set one ticket mod, called by owner, max percent",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            beneficiary: deployer.address,
            percent: 10000,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "set one ticket mod, beneficiary is different from caller",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            beneficiary: addrs[0].address,
            percent: 10000,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "set many ticket mods, called by owner",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            beneficiary: deployer.address,
            percent: 100,
            preferUnstaked: false,
            lockedUntil: 0
          },
          {
            beneficiary: deployer.address,
            percent: 50,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "set one ticket mod, called by operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectOwner: addrs[0].address,
        projectId: 1,
        configuration: 10,
        permissionFlag: true,
        mods: [
          {
            beneficiary: deployer.address,
            percent: 100,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "lock passed",
      fn: ({ deployer, testStart }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              beneficiary: deployer.address,
              percent: 200,
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(10)
        },
        mods: [
          {
            beneficiary: deployer.address,
            // different properties.
            percent: 100,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "lock and included with different unstaked preferences",
      fn: ({ deployer, testStart }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              beneficiary: deployer.address,
              percent: 100,
              preferUnstaked: true,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(9)
        },
        mods: [
          {
            beneficiary: deployer.address,
            percent: 100,
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          },
          {
            beneficiary: deployer.address,
            percent: 100,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "lock and included with longer lock",
      fn: ({ deployer, testStart }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              beneficiary: deployer.address,
              percent: 100,
              preferUnstaked: true,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(9)
        },
        mods: [
          {
            beneficiary: deployer.address,
            percent: 100,
            preferUnstaked: false,
            lockedUntil: testStart.add(11)
          },
          {
            beneficiary: deployer.address,
            percent: 100,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "not locked with different configurations",
      fn: ({ deployer, addrs, testStart }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 11,
          mods: [
            {
              beneficiary: addrs[0].address,
              percent: 200,
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            beneficiary: deployer.address,
            percent: 200,
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          }
        ],
        revert: "ModStore::setTicketMods: SOME_LOCKED"
      })
    },
    {
      description: "not locked with different projects",
      fn: ({ deployer, addrs, testStart }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 11,
          configuration: 10,
          mods: [
            {
              beneficiary: addrs[0].address,
              percent: 200,
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            beneficiary: deployer.address,
            percent: 200,
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          }
        ],
        revert: "ModStore::setTicketMods: SOME_LOCKED"
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: addrs[0].address,
        projectOwner: addrs[0].address,
        projectId: 1,
        configuration: 10,
        mods: [],
        permissionFlag: false,
        revert: "Operatable: UNAUTHORIZED"
      })
    },
    {
      description: "no mods",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [],
        revert: "ModStore::setTicketMods: NO_OP"
      })
    },
    {
      description: "locked with difference beneficiaries",
      fn: ({ deployer, addrs, testStart }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              beneficiary: addrs[0].address,
              percent: 200,
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            beneficiary: deployer.address,
            percent: 200,
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          }
        ],
        revert: "ModStore::setTicketMods: SOME_LOCKED"
      })
    },
    {
      description: "locked with different percents",
      fn: ({ deployer, testStart }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              beneficiary: deployer.address,
              percent: 200,
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            beneficiary: deployer.address,
            percent: 100,
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          }
        ],
        revert: "ModStore::setTicketMods: SOME_LOCKED"
      })
    },
    {
      description: "locked with shorter locked until values",
      fn: ({ deployer, testStart }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              beneficiary: deployer.address,
              percent: 200,
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            beneficiary: deployer.address,
            percent: 200,
            preferUnstaked: false,
            lockedUntil: testStart.add(9)
          }
        ],
        revert: "ModStore::setTicketMods: SOME_LOCKED"
      })
    },
    {
      description: "no beneficiary",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            beneficiary: ethers.constants.AddressZero,
            percent: 100,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ],
        revert: "ModStore::setTicketMods: ZERO_ADDRESS"
      })
    },
    {
      description: "mod percent over 100%",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            beneficiary: deployer.address,
            percent: 10010,
            preferUnstaked: false,
            lockedUntil: 0
          },
          {
            beneficiary: deployer.address,
            percent: 50,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ],
        revert: "ModStore::setTicketMods: BAD_TOTAL_PERCENT"
      })
    },
    {
      description: "mod percent over 100% with locked",
      fn: ({ deployer, testStart }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              beneficiary: deployer.address,
              percent: 10000,
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(9)
        },
        mods: [
          {
            beneficiary: deployer.address,
            percent: 10000,
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          },
          {
            beneficiary: deployer.address,
            percent: 100,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ],
        revert: "ModStore::setTicketMods: BAD_TOTAL_PERCENT"
      })
    },
    {
      description: "mod percent is 0%",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            beneficiary: deployer.address,
            percent: 0,
            preferUnstaked: false,
            lockedUntil: 0
          },
          {
            beneficiary: deployer.address,
            percent: 50,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ],
        revert: "ModStore::setTicketMods: BAD_MOD_PERCENT"
      })
    },
    {
      description: "total percents over 100%",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            beneficiary: deployer.address,
            percent: 9000,
            preferUnstaked: false,
            lockedUntil: 0
          },
          {
            beneficiary: deployer.address,
            percent: 1010,
            preferUnstaked: false,
            lockedUntil: 0
          }
        ],
        revert: "ModStore::setTicketMods: BAD_TOTAL_PERCENT"
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
          projectOwner,
          projectId,
          configuration,
          mods,
          setup,
          permissionFlag
        } = successTest.fn(this);

        // Set the Projects mock to return the projectOwner.
        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // Mock the caller to be the project's controller for setup.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
          const permissionIndex = 15;

          // Set the Operator store to return the permission flag.
          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, projectOwner, projectId, permissionIndex)
            .returns(permissionFlag);
        }

        if (setup) {
          if (setup.mods) {
            if (setup.projectId !== projectId) {
              // Set the Projects mock to return the projectOwner.
              await this.projects.mock.ownerOf
                .withArgs(setup.projectId)
                .returns(projectOwner);
              // Mock the caller to be the project's controller for setup.
              await this.terminalDirectory.mock.terminalOf
                .withArgs(setup.projectId)
                .returns(caller.address);
            }
            // Execute the transaction.
            await this.contract
              .connect(caller)
              .setTicketMods(setup.projectId, setup.configuration, setup.mods);
          }
          if (setup.fastforward) {
            // Fast forward the clock if needed.
            // Subtract 1 so that the next operations mined block is likely to fall on the intended timestamp.
            // eslint-disable-next-line no-await-in-loop
            await this.fastforwardFn(setup.fastforward.sub(1));
          }
        }
        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .setTicketMods(projectId, configuration, mods);

        // Get the stored ticket mods value.
        const storedTicketMods = await this.contract.ticketModsOf(
          projectId,
          configuration
        );

        // Expect an event to have been emitted for each mod.
        await Promise.all(
          storedTicketMods.map(mod =>
            expect(tx)
              .to.emit(this.contract, "SetTicketMod")
              .withArgs(projectId, configuration, mod, caller.address)
          )
        );

        // Expect there to be the same number of stored mods.
        expect(mods.length).equal(storedTicketMods.length);

        // Expect the stored mods values to match.
        mods.forEach((mod, i) => {
          expect(storedTicketMods[i].beneficiary).to.equal(mod.beneficiary);
          expect(storedTicketMods[i].percent).to.equal(mod.percent);
          expect(storedTicketMods[i].preferUnstaked).to.equal(
            mod.preferUnstaked
          );
          expect(storedTicketMods[i].lockedUntil).to.equal(mod.lockedUntil);
        });
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          controller,
          projectOwner,
          projectId,
          configuration,
          mods,
          permissionFlag,
          setup,
          revert
        } = failureTest.fn(this);

        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // Mock the caller to be the project's controller for setup.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(controller);

        if (permissionFlag !== undefined) {
          const permissionIndex = 15;

          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, projectOwner, projectId, permissionIndex)
            .returns(permissionFlag);
        }
        if (setup) {
          if (setup.mods) {
            await this.contract
              .connect(caller)
              .setTicketMods(setup.projectId, setup.configuration, setup.mods);
          }
          if (setup.fastforward) {
            await this.fastforwardFn(setup.fastforward.sub(1));
          }
        }

        await expect(
          this.contract
            .connect(caller)
            .setTicketMods(projectId, configuration, mods)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
