const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function() {
  let myContract;

  describe("Juice", function() {
    it("Should deploy Juice", async function() {
      await ethers.getContractFactory("Juice");

      myContract = await Juice.deploy();
    });

    describe("setPurpose()", function() {
      it("Should be able to set a new purpose", async function() {
        const newPurpose = "Test Purpose";

        await myContract.setPurpose(newPurpose);
        expect(await myContract.purpose()).to.equal(newPurpose);
      });
    });
  });
});
