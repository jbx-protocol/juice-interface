const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "issues tickets, called by owner",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        permissionFlag: false
      })
    },
    {
      description: "issues tickets, called by operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectOwner: addrs[0].address,
        projectId: 1,
        permissionFlag: true
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
        permissionFlag: false,
        revert: "Operatable: UNAUTHORIZED"
      })
    },
    {
      description: "empty name",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        permissionFlag: false,
        useEmptyName: true,
        revert: "TicketBooth::issue: EMPTY_NAME"
      })
    },
    {
      description: "empty symbol",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        permissionFlag: false,
        useEmptySymbol: true,
        revert: "TicketBooth::issue: EMPTY_SYMBOL"
      })
    },
    {
      description: "tickets already issued",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        permissionFlag: false,
        preissue: true,
        revert: "TicketBooth::issue: ALREADY_ISSUED"
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
          permissionFlag
        } = successTest.fn(this);

        // Must make the caller the project owner in order to issue.
        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
          // Get the permission index needed to set the payout mods on an owner's behalf.
          const permissionIndex = 9;

          // Set the Operator store to return the permission flag.
          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, projectOwner, projectId, permissionIndex)
            .returns(permissionFlag);
        }

        const name = "doesnt";
        const symbol = "matter";

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .issue(projectId, name, symbol);

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "Issue")
          .withArgs(projectId, name, symbol, caller.address);

        // Get the stored ticket for the project.
        const storedTicketAddress = await this.contract
          .connect(caller)
          .ticketsOf(projectId);

        // Attach the address to the Tickets contract.
        const TicketFactory = await ethers.getContractFactory("Tickets");
        const StoredTicket = await TicketFactory.attach(storedTicketAddress);

        // Get the stored values for the issued tickets.
        const storedName = await StoredTicket.name();
        const storedSymbol = await StoredTicket.symbol();

        // The set values should equal the stored values.
        expect(name).to.equal(storedName);
        expect(symbol).to.equal(storedSymbol);
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
          permissionFlag,
          preissue,
          useEmptyName,
          useEmptySymbol,
          revert
        } = failureTest.fn(this);

        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // Issue tickets ahead of the opertion.
        if (preissue) {
          await expect(
            this.contract.connect(caller).issue(projectId, "doesnt", "matter")
          );
        }

        if (permissionFlag !== undefined) {
          const permissionIndex = 9;

          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, projectOwner, projectId, permissionIndex)
            .returns(permissionFlag);
        }

        await expect(
          this.contract
            .connect(caller)
            .issue(
              projectId,
              useEmptyName ? "" : "doesnt",
              useEmptySymbol ? "" : "matter"
            )
        ).to.be.revertedWith(revert);
      });
    });
  });
};
