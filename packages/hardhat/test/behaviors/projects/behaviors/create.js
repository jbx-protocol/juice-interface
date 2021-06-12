const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "no uri, caller is owner",
      fn: ({ deployer }) => ({
        caller: deployer,
        owner: deployer.address,
        handle: ethers.utils.formatBytes32String("some-handle"),
        uri: "",
        expectation: {
          projectId: 1
        }
      })
    },
    {
      description: "no uri, caller is not owner",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        owner: addrs[0].address,
        handle: ethers.utils.formatBytes32String("some-handle"),
        uri: "",
        expectation: {
          projectId: 1
        }
      })
    },
    {
      description: "with uri",
      fn: ({ deployer }) => ({
        caller: deployer,
        owner: deployer.address,
        handle: ethers.utils.formatBytes32String("some-handle"),
        uri: "some-uri",
        expectation: {
          projectId: 1
        }
      })
    },
    {
      description: "second project",
      fn: ({ deployer }) => ({
        caller: deployer,
        owner: deployer.address,
        handle: ethers.utils.formatBytes32String("some-handle"),
        uri: "some-uri",
        expectation: {
          projectId: 2
        },
        setup: {
          create: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-other-handle"),
            uri: "some-uri"
          }
        }
      })
    }
  ],
  failure: [
    {
      description: "no handle",
      fn: ({ deployer }) => ({
        caller: deployer,
        owner: deployer.address,
        handle: ethers.utils.formatBytes32String(""),
        uri: "",
        revert: "Projects::create: EMPTY_HANDLE"
      })
    },
    {
      description: "handle taken",
      fn: ({ deployer }) => ({
        caller: deployer,
        owner: deployer.address,
        handle: ethers.utils.formatBytes32String("some-handle"),
        uri: "some-uri",
        setup: {
          create: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-handle"),
            uri: "some-uri"
          }
        },
        revert: "Projects::create: HANDLE_TAKEN"
      })
    },
    {
      description: "handle being transfered",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        owner: deployer.address,
        handle: ethers.utils.formatBytes32String("some-handle"),
        uri: "some-uri",
        setup: {
          create: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-handle"),
            uri: "some-uri"
          },
          transfer: {
            owner: deployer.address,
            to: addrs[0].address,
            handle: ethers.utils.formatBytes32String("some-new-handle")
          }
        },
        revert: "Projects::create: HANDLE_TAKEN"
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
          owner,
          handle,
          uri,
          setup: { create } = {},
          expectation: { projectId }
        } = successTest.fn(this);

        // Setup by creating a project.
        if (create) {
          await this.contract
            .connect(caller)
            .create(create.owner, create.handle, create.uri);
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .create(owner, handle, uri);

        // Expect an event to have been emitted.
        expect(tx)
          .to.emit(this.contract, "Create")
          .withArgs(projectId, owner, handle, uri, caller.address);

        // Get the stored reverse handle lookup value.
        const storedReverseHandleLookup = await this.contract.reverseHandleLookup(
          projectId
        );

        // Get the stored handle resolver value.
        const storedHandleResolver = await this.contract.handleResolver(handle);

        // Get the stored uri value.
        const storedUri = await this.contract.uri(projectId);

        // Expect the stored values to equal the set values.
        expect(storedReverseHandleLookup).to.equal(handle);
        expect(storedHandleResolver).to.equal(projectId);
        expect(storedUri).to.equal(uri);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          owner,
          handle,
          uri,
          setup: { create, transfer } = {},
          revert
        } = failureTest.fn(this);

        // Setup by creating a project.
        if (create) {
          await this.contract
            .connect(caller)
            .create(create.owner, create.handle, create.uri);

          if (transfer) {
            await this.contract
              .connect(caller)
              .transferHandle(1, transfer.to, transfer.handle);
          }
        }

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).create(owner, handle, uri)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
