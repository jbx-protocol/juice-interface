const { expect } = require("chai");
const { BigNumber, utils, constants } = require("ethers");

const tests = {
  success: [
    {
      description: "deposit for caller",
      fn: ({ deployer }) => ({
        caller: deployer,
        owner: deployer.address,
        metadata: {
          reservedRate: 200,
          bondingCurveRate: 200,
          reconfigurationBondingCurveRate: 200
        },
        paymentMods: [],
        ticketMods: []
      })
    },
    {
      description: "deposit for another address",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        owner: addrs[0].address,
        metadata: {
          reservedRate: 200,
          bondingCurveRate: 200,
          reconfigurationBondingCurveRate: 200
        },
        paymentMods: [],
        ticketMods: []
      })
    },
    {
      description: "deposit with mods",
      fn: async ({ deployer, deployMockLocalContract }) => ({
        caller: deployer,
        owner: deployer.address,
        metadata: {
          reservedRate: 200,
          bondingCurveRate: 200,
          reconfigurationBondingCurveRate: 200
        },
        paymentMods: [
          {
            // These values dont matter.
            preferUnstaked: false,
            percent: 200,
            lockedUntil: 1000,
            beneficiary: constants.AddressZero,
            allocator: (await deployMockLocalContract("ModAllocator")).address,
            projectId: 1,
            note: "banana"
          }
        ],
        ticketMods: [
          {
            // These values dont matter.
            preferUnstaked: false,
            percent: 200,
            lockedUntil: 1000,
            beneficiary: constants.AddressZero
          }
        ]
      })
    }
  ],
  failure: [
    {
      description: "reserved rate over 100%",
      fn: ({ deployer }) => ({
        caller: deployer,
        owner: deployer.address,
        metadata: {
          reservedRate: 201,
          bondingCurveRate: 200,
          reconfigurationBondingCurveRate: 200
        },
        paymentMods: [],
        ticketMods: [],
        revert:
          "Juicer::_validateAndPackFundingCycleMetadata: BAD_RESERVED_RATE"
      })
    },
    {
      description: "bonding curve rate over 100%",
      fn: ({ deployer }) => ({
        caller: deployer,
        owner: deployer.address,
        metadata: {
          reservedRate: 200,
          bondingCurveRate: 201,
          reconfigurationBondingCurveRate: 200
        },
        paymentMods: [],
        ticketMods: [],
        revert:
          "Juicer::_validateAndPackFundingCycleMetadata: BAD_BONDING_CURVE_RATE"
      })
    },
    {
      description: "reconfiguration bonding curve rate over 100%",
      fn: ({ deployer }) => ({
        caller: deployer,
        owner: deployer.address,
        metadata: {
          reservedRate: 200,
          bondingCurveRate: 200,
          reconfigurationBondingCurveRate: 201
        },
        paymentMods: [],
        ticketMods: [],
        revert:
          "Juicer::_validateAndPackFundingCycleMetadata: BAD_RECONFIGURATION_BONDING_CURVE_RATE"
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
          metadata,
          paymentMods,
          ticketMods
        } = await successTest.fn(this);
        const handle = utils.formatBytes32String("something");
        const uri = "some-uri";
        const properties = {
          target: 10,
          currency: 1,
          duration: 10,
          discountRate: 10,
          ballot: constants.AddressZero
        };

        const projectId = 42;
        const configured = 171717;
        let packedMetadata = BigNumber.from(0);
        packedMetadata = packedMetadata.add(
          metadata.reconfigurationBondingCurveRate
        );
        packedMetadata = packedMetadata.shl(8);
        packedMetadata = packedMetadata.add(metadata.bondingCurveRate);
        packedMetadata = packedMetadata.shl(8);
        packedMetadata = packedMetadata.add(metadata.reservedRate);
        packedMetadata = packedMetadata.shl(8);

        // Set a mock for creating a project.
        await this.projects.mock.create
          .withArgs(owner, handle, uri)
          .returns(projectId);
        // Set a mock for setting the terminal in the directory.
        await this.terminalDirectory.mock.setTerminal
          .withArgs(projectId, this.contract.address)
          .returns();

        // Set a mock for configuring a funding cycle.
        await this.fundingCycles.mock.configure
          .withArgs(projectId, properties, packedMetadata, 10, true)
          .returns({
            configured,
            id: 0,
            projectId: 0,
            number: 0,
            basedOn: 0,
            weight: 0,
            ballot: constants.AddressZero,
            start: 0,
            duration: 0,
            target: 0,
            currency: 0,
            fee: 0,
            discountRate: 0,
            tapped: 0,
            metadata: 0
          });

        if (paymentMods.length)
          // Set a mock for setting payment mods.
          await this.modStore.mock.setPaymentMods
            .withArgs(projectId, configured, paymentMods)
            .returns();

        if (ticketMods.length)
          // Set a mock for setting ticket mods.
          await this.modStore.mock.setTicketMods
            .withArgs(projectId, configured, ticketMods)
            .returns();

        // Execute the transaction.
        await this.contract
          .connect(caller)
          .deploy(
            owner,
            handle,
            uri,
            properties,
            metadata,
            paymentMods,
            ticketMods
          );
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, owner, metadata, revert } = failureTest.fn(this);
        const handle = utils.formatBytes32String("something");
        const uri = "some-uri";
        const properties = {
          target: 10,
          currency: 1,
          duration: 10,
          discountRate: 10,
          ballot: constants.AddressZero
        };

        const projectId = 42;
        const configured = 171717;
        let packedMetadata = BigNumber.from(0);
        packedMetadata = packedMetadata.add(
          metadata.reconfigurationBondingCurveRate
        );
        packedMetadata = packedMetadata.shl(8);
        packedMetadata = packedMetadata.add(metadata.bondingCurveRate);
        packedMetadata = packedMetadata.shl(8);
        packedMetadata = packedMetadata.add(metadata.reservedRate);
        packedMetadata = packedMetadata.shl(8);

        // Set a mock for creating a project.
        await this.projects.mock.create
          .withArgs(owner, handle, uri)
          .returns(projectId);
        // Set a mock for setting the terminal in the directory.
        await this.terminalDirectory.mock.setTerminal
          .withArgs(projectId, this.contract.address)
          .returns();

        // Set a mock for configuring a funding cycle.
        await this.fundingCycles.mock.configure
          .withArgs(projectId, properties, packedMetadata, 10, true)
          .returns({
            configured,
            id: 0,
            projectId: 0,
            number: 0,
            basedOn: 0,
            weight: 0,
            ballot: constants.AddressZero,
            start: 0,
            duration: 0,
            target: 0,
            currency: 0,
            fee: 0,
            discountRate: 0,
            tapped: 0,
            metadata: 0
          });

        // Execute the transaction.
        await expect(
          this.contract
            .connect(caller)
            .deploy(owner, handle, uri, properties, metadata, [], [])
        ).to.be.revertedWith(revert);
      });
    });
  });
};
