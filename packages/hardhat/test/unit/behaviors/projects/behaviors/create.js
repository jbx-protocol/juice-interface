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
        terminal: ethers.constants.AddressZero,
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
        terminal: ethers.constants.AddressZero,
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
        terminal: ethers.constants.AddressZero,
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
        terminal: ethers.constants.AddressZero,
        expectation: {
          projectId: 2
        },
        setup: {
          create: {
            owner: deployer.address,
            handle: ethers.utils.formatBytes32String("some-other-handle"),
            uri: "some-uri",
            terminal: ethers.constants.AddressZero
          }
        }
      })
    },
    {
      description: "with terminal",
      fn: async ({ deployer, deployMockLocalContractFn }) => {
        // Create a mock for a terminalV1.
        const operatorStore = await deployMockLocalContractFn("OperatorStore");
        const projects = await deployMockLocalContractFn("Projects", [
          operatorStore.address
        ]);
        const prices = await deployMockLocalContractFn("Prices");
        const terminalDirectory = await deployMockLocalContractFn(
          "TerminalDirectory",
          [projects.address]
        );
        const fundingCycles = await deployMockLocalContractFn("FundingCycles", [
          terminalDirectory.address
        ]);
        const ticketBooth = await deployMockLocalContractFn("TicketBooth", [
          projects.address,
          operatorStore.address,
          terminalDirectory.address
        ]);
        const modStore = await deployMockLocalContractFn("ModStore", [
          projects.address,
          operatorStore.address
        ]);

        // Deploy mock dependency contracts.
        const terminalV1 = await deployMockLocalContractFn("TerminalV1", [
          projects.address,
          fundingCycles.address,
          ticketBooth.address,
          operatorStore.address,
          modStore.address,
          prices.address,
          terminalDirectory.address
        ]);
        // make the mock terminalDirectory return a mock of the terminal directory.
        await terminalV1.mock.terminalDirectory
          .withArgs()
          .returns(terminalDirectory.address);

        // mock the set terminal function of the terminal directory.
        await terminalDirectory.mock.setTerminal
          .withArgs(1, terminalV1.address)
          .returns();

        return {
          caller: deployer,
          owner: deployer.address,
          handle: ethers.utils.formatBytes32String("some-handle"),
          uri: "",
          terminal: terminalV1.address,
          expectation: {
            projectId: 1
          }
        };
      }
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
        terminal: ethers.constants.AddressZero,
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
        terminal: ethers.constants.AddressZero,
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
        terminal: ethers.constants.AddressZero,
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
          terminal,
          setup: { create } = {},
          expectation: { projectId }
        } = await successTest.fn(this);

        // Setup by creating a project.
        if (create) {
          await this.contract
            .connect(caller)
            .create(create.owner, create.handle, create.uri, create.terminal);
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .create(owner, handle, uri, terminal);

        // Expect an event to have been emitted.
        expect(tx)
          .to.emit(this.contract, "Create")
          .withArgs(projectId, owner, handle, uri, terminal, caller.address);

        // Get the stored handle value.
        const storedHandle = await this.contract.handleOf(projectId);

        // Get the stored project value.
        const storedProject = await this.contract.projectFor(handle);

        // Get the stored uri value.
        const storedUri = await this.contract.uriOf(projectId);

        // Expect the stored values to equal the set values.
        expect(storedHandle).to.equal(handle);
        expect(storedProject).to.equal(projectId);
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
          terminal,
          setup: { create, transfer } = {},
          revert
        } = failureTest.fn(this);

        // Setup by creating a project.
        if (create) {
          await this.contract
            .connect(caller)
            .create(
              create.owner,
              create.handle,
              create.uri,
              this.constants.AddressZero
            );

          if (transfer) {
            await this.contract
              .connect(caller)
              .transferHandle(1, transfer.to, transfer.handle);
          }
        }

        // Execute the transaction.
        await expect(
          this.contract.connect(caller).create(owner, handle, uri, terminal)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
