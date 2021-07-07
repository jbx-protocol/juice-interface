const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "claim handle",
      fn: ({ deployer }) => ({
        caller: deployer,
        handle: ethers.utils.formatBytes32String("some-handle"),
        claimFor: deployer.address,
        setup: {
          source: {
            owner: deployer,
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
        claimFor: addrs[2].address,
        setup: {
          source: {
            owner: deployer,
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
        claimFor: addrs[2].address,
        setup: {
          source: {
            owner: deployer,
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
    },
    {
      description:
        "claim handle to a random other address after challenge expired",
      fn: ({ deployer, addrs }) => ({
        caller: addrs[6],
        handle: ethers.utils.formatBytes32String("some-handle"),
        claimFor: addrs[6].address,
        setup: {
          challengeHandle: ethers.utils.formatBytes32String("some-handle"),
          fastforward: ethers.BigNumber.from(31536000),
          source: {
            owner: deployer,
            handle: ethers.utils.formatBytes32String("some-handle")
          },
          destination: {
            owner: addrs[6].address,
            handle: ethers.utils.formatBytes32String("some-other-handle")
          }
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
      description: "unauthorized, wrong for and challenge not expired",
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
        revert: "Projects::claimHandle: UNAUTHORIZED"
      })
    },
    {
      description:
        "claim handle to a random other address but challenge not yet expired",
      fn: ({ deployer, addrs }) => ({
        caller: addrs[6],
        handle: ethers.utils.formatBytes32String("some-handle"),
        claimFor: addrs[6].address,
        setup: {
          challengeHandle: ethers.utils.formatBytes32String("some-handle"),
          fastforward: ethers.BigNumber.from(31535998),
          source: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-handle")
          },
          destination: {
            owner: addrs[6].address,
            handle: ethers.utils.formatBytes32String("some-other-handle")
          }
        },
        revert: "Projects::claimHandle: UNAUTHORIZED"
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
          claimFor,
          setup: {
            source,
            destination,
            transfer,
            transferToPermissionFlag,
            transferToPersonalPermission,
            claimOntoPermissionFlag,
            challengeHandle,
            fastforward
          } = {}
        } = successTest.fn(this);

        // Setup by creating a project that the handle will be transfered from.
        await this.contract
          .connect(caller)
          .create(
            source.owner.address,
            source.handle,
            "",
            this.constants.AddressZero
          );
        // Setup by creating another project that the handle will be transfered to.
        await this.contract
          .connect(caller)
          .create(
            destination.owner,
            destination.handle,
            "",
            this.constants.AddressZero
          );

        if (transfer) {
          // Execute the transaction.
          await this.contract
            .connect(source.owner)
            .transferHandle(
              transfer.projectId,
              transfer.to,
              transfer.newHandle
            );
        }

        const permissionIndex = 7;
        if (transferToPermissionFlag !== undefined) {
          // Flip the opposit of what what specified in the personal permissions to false.
          await this.operatorStore.mock.hasPermission
            .withArgs(
              caller.address,
              claimFor,
              transferToPersonalPermission ? 2 : 0,
              permissionIndex
            )
            .returns(false);

          // Mock the caller to be the project's controller.
          await this.operatorStore.mock.hasPermission
            .withArgs(
              caller.address,
              claimFor,
              transferToPersonalPermission ? 0 : 2,
              permissionIndex
            )
            .returns(transferToPermissionFlag);
        }
        if (claimOntoPermissionFlag !== undefined) {
          // Mock the caller to be the project's controller.
          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, destination.owner, 2, permissionIndex)
            .returns(claimOntoPermissionFlag);
        }

        // Challenge the handle if needed.
        if (challengeHandle) {
          const tx = await this.contract
            .connect(caller)
            .challengeHandle(challengeHandle);
          await this.setTimeMarkFn(tx.blockNumber);
        }

        // Fastforward if needed.
        // The next transaction will happen one second after.
        if (fastforward) await this.fastforwardFn(fastforward);

        const tx = await this.contract
          .connect(caller)
          .claimHandle(handle, claimFor, 2);

        // Expect an event to have been emitted.
        expect(tx)
          .to.emit(this.contract, "ClaimHandle")
          .withArgs(claimFor, 2, handle, caller.address);

        // Get the stored handle value.
        const storedHandle = await this.contract.handleOf(2);

        // Get the stored project value.
        const storedProject = await this.contract.projectFor(handle);

        // Get the stored challenge expiry of.
        const storedChallengeExpiryOf = await this.contract.challengeExpiryOf(
          handle
        );

        // Expect the stored values to equal the set values.
        expect(storedHandle).to.equal(handle);
        expect(storedProject).to.equal(2);
        expect(storedChallengeExpiryOf).to.equal(0);
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
            claimOntoPermissionFlag,
            challengeHandle,
            fastforward
          } = {},
          revert
        } = failureTest.fn(this);

        // Setup by creating a project that the handle will be transfered from.
        await this.contract
          .connect(caller)
          .create(source.owner, source.handle, "", this.constants.AddressZero);

        // Setup by creating another project that the handle will be transfered to.
        await this.contract
          .connect(caller)
          .create(
            destination.owner,
            destination.handle,
            "",
            this.constants.AddressZero
          );

        if (transfer) {
          // Execute the transaction.
          await this.contract
            .connect(caller)
            .transferHandle(
              transfer.projectId,
              transfer.to,
              transfer.newHandle
            );
        }

        const permissionIndex = 7;
        if (transferToPermissionFlag !== undefined) {
          // Flip the opposit of what what specified in the personal permissions to false.
          await this.operatorStore.mock.hasPermission
            .withArgs(
              caller.address,
              claimFor,
              transferToPersonalPermission ? 2 : 0,
              permissionIndex
            )
            .returns(false);

          // Mock the caller to be the project's controller.
          await this.operatorStore.mock.hasPermission
            .withArgs(
              caller.address,
              claimFor,
              transferToPersonalPermission ? 0 : 2,
              permissionIndex
            )
            .returns(transferToPermissionFlag);
        }
        if (claimOntoPermissionFlag !== undefined) {
          // Mock the caller to be the project's controller.
          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, destination.owner, 2, permissionIndex)
            .returns(claimOntoPermissionFlag);
        }

        // Challenge the handle if needed.
        if (challengeHandle) {
          const tx = await this.contract
            .connect(caller)
            .challengeHandle(challengeHandle);
          await this.setTimeMarkFn(tx.blockNumber);
        }

        // Fastforward if needed.
        // The next transaction will happen one second after.
        if (fastforward) await this.fastforwardFn(fastforward);

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).claimHandle(handle, claimFor, 2)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
