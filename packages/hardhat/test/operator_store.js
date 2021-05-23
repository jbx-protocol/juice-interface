const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity, createFixtureLoader } = require("ethereum-waffle");
const deployer = require("../scripts/deployer");

use(solidity);

const MONTH = 60 * 60 * 24 * 30; // 30 days

let caller;
let addr1;
let addr2;
let addrs;
let contracts;

// Deploy contracts once before running tests
// WARNING: For performance reasons, contracts are deployed only once before running
// tests. However, this does mean that state may be different for each test. Should
// revisit this to determine which contracts can be deployed once and which should be
// deployed before each test.
before(async () => {
  [caller, addr1, addr2, ...addrs] = await ethers.getSigners();
  contracts = await deployer();
});

describe("OperatorStore", () => {
  describe("addOperator()", () => {
    it("Should add an operator correctly", async () => {
      const projectId = 0;
      const operator = addr1;

      const permissionIndexes = [0, 7, 77];

      const tx = await contracts.operatorStore
        .connect(caller)
        .addOperator(projectId, operator.address, permissionIndexes);
      const receipt = await tx.wait();

      // Verify events
      expect(receipt.events).to.have.lengthOf(2);
      expect(receipt.events[0])
        .to.have.property("event")
        .that.equals("SetPackedPermissions");
      // expect(receipt.events[0].args)
      //   .to.have.property("account")
      //   .that.equals(caller.address);
      // expect(receipt.events[0].args)
      //   .to.have.property("projectId")
      //   .that.equals(projectId);
      // expect(receipt.events[0].args)
      //   .to.have.property("operator")
      //   .that.equals(operator.address);
      // expect(receipt.events[0].args)
      //   .to.have.property("packedPermission")
      //   .that.equals(ethers.BigNumber.from(2 + (2 ^ 7) + (2 ^ 77)));
      // expect(receipt.events[0].args)
      //   .to.have.property("caller")
      //   .that.equals(caller.address);

      expect(receipt.events[1])
        .to.have.property("event")
        .that.equals("AddOperator");

      // Verify  project
      // TODO: Is there a better way to get the projectId?
      // const projectId = event.args.projectId;
      // const identifiers = await contracts.projects.getIdentifier(projectId);
      // expect(identifiers.name).to.equal(name);
      // expect(identifiers.handle).to.equal(handle);
      // expect(identifiers.logoUri).to.equal(logoUri);
      // expect(identifiers.link).to.equal(link);

      // Verify budgetStore
      // TODO: Is there a better way to get the budgetId?
      // const budgetId = event.args.budget.id;
      // const budget = await contracts.budgetStore.getBudget(budgetId);
      // expect(budget.projectId).to.equal(projectId);
      // expect(budget.target).to.equal(target);
      // expect(budget.currency).to.equal(currency);
      // expect(budget.duration).to.equal(duration);
      // expect(budget.reserved).to.equal(reserved);
      // expect(budget.bondingCurveRate).to.equal(bondingCurveRate);
      // expect(budget.discountRate).to.equal(discountRate);
    });
  });
});
