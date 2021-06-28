const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "different uri",
      fn: ({ deployer }) => ({
        caller: deployer,
        uri: "some-uri",
        setup: {
          create: {
            owner: deployer.address
          }
        }
      })
    },
    {
      description: "called by operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        uri: "some-uri",
        setup: {
          create: {
            owner: addrs[0].address
          },
          permissionFlag: true
        }
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        uri: "some-uri",
        setup: {
          create: {
            owner: addrs[0].address
          },
          permissionFlag: false
        },
        revert: "Operatable: UNAUTHORIZED"
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
          uri,
          setup: { create, permissionFlag } = {}
        } = successTest.fn(this);

        // Setup by creating a project.
        await this.contract
          .connect(caller)
          .create(
            create.owner,
            ethers.utils.formatBytes32String("some-handle"),
            "",
            this.constants.AddressZero
          );
        if (permissionFlag !== undefined) {
          const permissionIndex = 6;

          // Mock the caller to be the project's controller.
          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, create.owner, 1, permissionIndex)
            .returns(permissionFlag);
        }

        // Execute the transaction.
        const tx = await this.contract.connect(caller).setUri(1, uri);

        // Expect an event to have been emitted.
        expect(tx)
          .to.emit(this.contract, "SetUri")
          .withArgs(1, uri, caller.address);

        // Get the stored uri value.
        const storedUri = await this.contract.uriOf(1);

        // Expect the stored values to equal the set values.
        expect(storedUri).to.equal(uri);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          uri,
          setup: { create, permissionFlag } = {},
          revert
        } = failureTest.fn(this);

        // Setup by creating a project.
        await this.contract
          .connect(caller)
          .create(
            create.owner,
            ethers.utils.formatBytes32String("some-handle"),
            "",
            this.constants.AddressZero
          );

        if (permissionFlag !== undefined) {
          const permissionIndex = 6;

          // Mock the caller to be the project's controller.
          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, create.owner, 1, permissionIndex)
            .returns(permissionFlag);
        }

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).setUri(1, uri)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
