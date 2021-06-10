const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "set one payment mod, called by owner, max percent",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 200,
            note: "sup",
            preferConverted: false
          }
        ]
      })
    },
    {
      description: "set one payment mod, beneficiary is different from caller",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: addrs[0].address,
            percent: 200,
            note: "sup",
            preferConverted: false
          }
        ]
      })
    },
    {
      description: "set many payment mods, called by owner",
      fn: ({ deployer, modAllocator }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 100,
            note: "sup",
            preferConverted: false
          },
          {
            allocator: modAllocator.address,
            projectId: 2,
            beneficiary: ethers.constants.AddressZero,
            percent: 50,
            note: "",
            preferConverted: false
          }
        ]
      })
    },
    {
      description: "set one payment mod, called by operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectOwner: addrs[0].address,
        projectId: 1,
        permissionFlag: true,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 100,
            note: "sup",
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
        revert: "Operatable: UNAUTHORIZED"
      })
    },
    {
      description: "no mods",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        mods: [],
        revert: "ModStore::setPaymentMods: NO_OP"
      })
    },
    {
      description: "no allocator or beneficiary",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: ethers.constants.AddressZero,
            percent: 100,
            note: "sup",
            preferConverted: false
          }
        ],
        revert: "ModStore::setPaymentMods: ZERO_ADDRESS"
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
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 210,
            note: "sup",
            preferConverted: false
          },
          {
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            beneficiary: deployer.address,
            percent: 50,
            note: "",
            preferConverted: false
          }
        ],
        revert: "ModStore::setPaymentMods: BAD_TOTAL_PERCENT"
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
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 0,
            note: "sup",
            preferConverted: false
          },
          {
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            beneficiary: deployer.address,
            percent: 50,
            note: "",
            preferConverted: false
          }
        ],
        revert: "ModStore::setPaymentMods: BAD_MOD_PERCENT"
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
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 180,
            note: "sup",
            preferConverted: false
          },
          {
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            beneficiary: deployer.address,
            percent: 50,
            note: "",
            preferConverted: false
          }
        ],
        revert: "ModStore::setPaymentMods: BAD_TOTAL_PERCENT"
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
          // Get the permission index needed to set the payment mods on an owner's behalf.
          const permissionIndex = await this.contract
            .connect(caller)
            .setPaymentModsPermissionIndex();

          // Set the Operator store to return the permission flag.
          await this.operatorStore.mock.hasPermission
            .withArgs(projectOwner, projectId, caller.address, permissionIndex)
            .returns(permissionFlag);
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .setPaymentMods(projectId, mods);

        // Get the stored payment mods value.
        const storedProjectMods = await this.contract.paymentMods(projectId);

        // Expect an event to have been emitted for each mod.
        await Promise.all(
          storedProjectMods.map(mod =>
            expect(tx)
              .to.emit(this.contract, "SetPaymentMod")
              .withArgs(projectId, mod, caller.address)
          )
        );

        // Expect there to be the same number of stored mods.
        expect(mods.length).equal(storedProjectMods.length);

        // Expect the stored mods values to match.
        mods.forEach((mod, i) => {
          expect(storedProjectMods[i].allocator).to.equal(mod.allocator);
          expect(storedProjectMods[i].beneficiary).to.equal(mod.beneficiary);
          expect(storedProjectMods[i].percent).to.equal(mod.percent);
          expect(storedProjectMods[i].preferConverted).to.equal(
            mod.preferConverted
          );
          expect(storedProjectMods[i].projectId).to.equal(mod.projectId);
          expect(storedProjectMods[i].note).to.equal(mod.note);
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
            .setPaymentModsPermissionIndex();

          await this.operatorStore.mock.hasPermission
            .withArgs(projectOwner, projectId, caller.address, permissionIndex)
            .returns(permissionFlag);
        }

        await expect(
          this.contract.connect(caller).setPaymentMods(projectId, mods)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
