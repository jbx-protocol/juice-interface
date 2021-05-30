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
        mods: [
          {
            beneficiary: deployer.address,
            percent: 200,
            preferConverted: false
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
        mods: [
          {
            beneficiary: addrs[0].address,
            percent: 200,
            preferConverted: false
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
        mods: [
          {
            beneficiary: deployer.address,
            percent: 100,
            preferConverted: false
          },
          {
            beneficiary: deployer.address,
            percent: 50,
            preferConverted: false
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
        permissionFlag: true,
        mods: [
          {
            beneficiary: deployer.address,
            percent: 100,
            preferConverted: false
          }
        ]
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectOwner: addrs[0].address,
        projectId: 1,
        mods: [],
        permissionFlag: false,
        revert: "ModStore::setTicketMods: UNAUTHORIZED"
      })
    },
    {
      description: "no mods",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        mods: [],
        revert: "ModStore::setTicketMods: NO_OP"
      })
    },
    {
      description: "no beneficiary",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        mods: [
          {
            beneficiary: ethers.constants.AddressZero,
            percent: 100,
            preferConverted: false
          }
        ],
        revert: "ModStore::setTicketMods: ZERO_ADDRESS"
      })
    },
    {
      description: "mod percent over 100%",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        mods: [
          {
            beneficiary: deployer.address,
            percent: 210,
            preferConverted: false
          },
          {
            beneficiary: deployer.address,
            percent: 50,
            preferConverted: false
          }
        ],
        revert: "ModStore::setTicketMods: BAD_TOTAL_PERCENT"
      })
    },
    {
      description: "mod percent is 0%",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        mods: [
          {
            beneficiary: deployer.address,
            percent: 0,
            preferConverted: false
          },
          {
            beneficiary: deployer.address,
            percent: 50,
            preferConverted: false
          }
        ],
        revert: "ModStore::setTicketMods: BAD_MOD_PERCENT"
      })
    },
    {
      description: "total percents over 100%",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        mods: [
          {
            beneficiary: deployer.address,
            percent: 180,
            preferConverted: false
          },
          {
            beneficiary: deployer.address,
            percent: 50,
            preferConverted: false
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
          mods,
          permissionFlag
        } = successTest.fn(this);

        // Set the Projects mock to return the projectOwner.
        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
          // Get the permission index needed to set the ticket mods on an owner's behalf.
          const permissionIndex = await this.contract
            .connect(caller)
            .setTicketModsPermissionIndex();

          // Set the Operator store to return the permission flag.
          await this.operatorStore.mock.hasPermission
            .withArgs(projectOwner, projectId, caller.address, permissionIndex)
            .returns(permissionFlag);
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .setTicketMods(projectId, mods);

        // Get the stored ticket mods value.
        const storedTicketMods = await this.contract.ticketMods(projectId);

        // Expect an event to have been emitted for each mod.
        await Promise.all(
          storedTicketMods.map(mod =>
            expect(tx)
              .to.emit(this.contract, "SetTicketMod")
              .withArgs(projectId, mod, caller.address)
          )
        );

        // Expect there to be the same number of stored mods.
        expect(mods.length).equal(storedTicketMods.length);

        // Expect the stored mods values to match.
        mods.forEach((mod, i) => {
          expect(storedTicketMods[i].beneficiary).to.equal(mod.beneficiary);
          expect(storedTicketMods[i].percent).to.equal(mod.percent);
          expect(storedTicketMods[i].preferConverted).to.equal(
            mod.preferConverted
          );
        });
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          projectOwner,
          projectId,
          mods,
          permissionFlag,
          revert
        } = failureTest.fn(this);

        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        if (permissionFlag !== undefined) {
          const permissionIndex = await this.contract
            .connect(caller)
            .setTicketModsPermissionIndex();

          await this.operatorStore.mock.hasPermission
            .withArgs(projectOwner, projectId, caller.address, permissionIndex)
            .returns(permissionFlag);
        }

        await expect(
          this.contract.connect(caller).setTicketMods(projectId, mods)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
