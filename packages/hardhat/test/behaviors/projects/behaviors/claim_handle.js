const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "claim handle",
      fn: ({ deployer }) => ({
        caller: deployer,
        handle: ethers.utils.formatBytes32String("some-handle"),
        setup: {
          source: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-handle")
          },
          destination: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-other-handle")
          },
          transfer: {
            projectId: 1,
            to: deployer.address,
            newHandle: ethers.utils.formatBytes32String("some-new-handle")
          }
        }
      })
    },
    {
      description: "called by personal operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        handle: ethers.utils.formatBytes32String("some-handle"),
        setup: {
          source: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-handle")
          },
          destination: {
            owner: addrs[0].address,
            handle: ethers.utils.formatBytes32String("some-other-handle")
          },
          transfer: {
            projectId: 1,
            to: addrs[2].address,
            newHandle: ethers.utils.formatBytes32String("some-new-handle")
          },
          transferToPermissionFlag: true,
          transferToPersonalPermission: true,
          claimOntoPermissionFlag: true
        }
      })
    },
    {
      description: "called by project operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        handle: ethers.utils.formatBytes32String("some-handle"),
        setup: {
          source: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-handle")
          },
          destination: {
            owner: addrs[0].address,
            handle: ethers.utils.formatBytes32String("some-other-handle")
          },
          transfer: {
            projectId: 1,
            to: addrs[2].address,
            newHandle: ethers.utils.formatBytes32String("some-new-handle")
          },
          transferToPermissionFlag: true,
          transferToPersonalPermission: false,
          claimOntoPermissionFlag: true
        }
      })
    }
  ],
  failure: [
    {
      description: "unauthorized, transfered to inaccessible address",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        handle: ethers.utils.formatBytes32String("some-handle"),
        claimFor: addrs[3].address,
        setup: {
          source: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-handle")
          },
          destination: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-other-handle")
          },
          transfer: {
            projectId: 1,
            to: addrs[3].address,
            newHandle: ethers.utils.formatBytes32String("some-new-handle")
          },
          transferToPermissionFlag: false,
          transferToPersonalPermission: false
        },
        revert: "Operatable: UNAUTHORIZED"
      })
    },
    {
      description:
        "unauthorized, transfered to inaccessible address, cant operate project",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        handle: ethers.utils.formatBytes32String("some-handle"),
        claimFor: deployer.address,
        setup: {
          source: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-handle")
          },
          destination: {
            owner: addrs[3].address,
            handle: ethers.utils.formatBytes32String("some-other-handle")
          },
          transfer: {
            projectId: 1,
            to: deployer.address,
            newHandle: ethers.utils.formatBytes32String("some-new-handle")
          },
          transferToPermissionFlag: true,
          transferToPersonalPermission: false,
          claimOntoPermissionFlag: false
        },
        revert: "Operatable: UNAUTHORIZED"
      })
    },
    {
      description: "unauthorized, wrong for",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        handle: ethers.utils.formatBytes32String("some-handle"),
        claimFor: addrs[1].address,
        setup: {
          source: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-handle")
          },
          destination: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-other-handle")
          },
          transfer: {
            projectId: 1,
            to: deployer.address,
            newHandle: ethers.utils.formatBytes32String("some-new-handle")
          },
          transferToPermissionFlag: true,
          transferToPersonalPermission: true,
          claimOntoPermissionFlag: true
        },
        revert: "Projects::claimHandle: NOT_FOUND"
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
          handle,
          setup: {
            source,
            destination,
            transfer,
            transferToPermissionFlag,
            transferToPersonalPermission,
            claimOntoPermissionFlag
          } = {}
        } = successTest.fn(this);

        // Setup by creating a project that the handle will be transfered from.
        await this.contract
          .connect(caller)
          .create(source.owner, source.handle, "");

        // Setup by creating another project that the handle will be transfered to.
        await this.contract
          .connect(caller)
          .create(destination.owner, destination.handle, "");

        // Execute the transaction.
        await this.contract
          .connect(caller)
          .transferHandle(transfer.projectId, transfer.to, transfer.newHandle);

        const permissionIndex = 7;
        if (transferToPermissionFlag !== undefined) {
          // Flip the opposit of what what specified in the personal permissions to false.
          await this.operatorStore.mock.hasPermission
            .withArgs(
              transfer.to,
              transferToPersonalPermission ? 2 : 0,
              caller.address,
              permissionIndex
            )
            .returns(false);

          // Mock the caller to be the project's controller.
          await this.operatorStore.mock.hasPermission
            .withArgs(
              transfer.to,
              transferToPersonalPermission ? 0 : 2,
              caller.address,
              permissionIndex
            )
            .returns(transferToPermissionFlag);
        }
        if (claimOntoPermissionFlag !== undefined) {
          // Mock the caller to be the project's controller.
          await this.operatorStore.mock.hasPermission
            .withArgs(destination.owner, 2, caller.address, permissionIndex)
            .returns(claimOntoPermissionFlag);
        }

        const tx = await this.contract
          .connect(caller)
          .claimHandle(handle, transfer.to, 2);

        // Expect an event to have been emitted.
        expect(tx)
          .to.emit(this.contract, "ClaimHandle")
          .withArgs(transfer.to, 2, handle, caller.address);

        // Get the stored reverse handle lookup value.
        const storedReverseHandleLookup = await this.contract.reverseHandleLookup(
          2
        );

        // Get the stored handle resolver value.
        const storedHandleResolver = await this.contract.handleResolver(handle);

        // Expect the stored values to equal the set values.
        expect(storedReverseHandleLookup).to.equal(handle);
        expect(storedHandleResolver).to.equal(2);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          handle,
          claimFor,
          setup: {
            source,
            destination,
            transfer,
            transferToPermissionFlag,
            transferToPersonalPermission,
            claimOntoPermissionFlag
          } = {},
          revert
        } = failureTest.fn(this);

        // Setup by creating a project that the handle will be transfered from.
        await this.contract
          .connect(caller)
          .create(source.owner, source.handle, "");

        // Setup by creating another project that the handle will be transfered to.
        await this.contract
          .connect(caller)
          .create(destination.owner, destination.handle, "");

        // Execute the transaction.
        await this.contract
          .connect(caller)
          .transferHandle(transfer.projectId, transfer.to, transfer.newHandle);

        const permissionIndex = 7;
        if (transferToPermissionFlag !== undefined) {
          // Flip the opposit of what what specified in the personal permissions to false.
          await this.operatorStore.mock.hasPermission
            .withArgs(
              claimFor,
              transferToPersonalPermission ? 2 : 0,
              caller.address,
              permissionIndex
            )
            .returns(false);

          // Mock the caller to be the project's controller.
          await this.operatorStore.mock.hasPermission
            .withArgs(
              claimFor,
              transferToPersonalPermission ? 0 : 2,
              caller.address,
              permissionIndex
            )
            .returns(transferToPermissionFlag);
        }
        if (claimOntoPermissionFlag !== undefined) {
          // Mock the caller to be the project's controller.
          await this.operatorStore.mock.hasPermission
            .withArgs(destination.owner, 2, caller.address, permissionIndex)
            .returns(claimOntoPermissionFlag);
        }

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).claimHandle(handle, claimFor, 2)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
