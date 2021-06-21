const { expect } = require("chai");
const { BigNumber, constants, utils } = require("ethers");

const executeFn = ({
  condition,
  caller,
  contract,
  fn,
  args = [],
  value = 0,
  events = [],
  revert
}) => async () => {
  if (condition !== undefined && !condition) return;
  const normalizedArgs = typeof args === "function" ? await args() : args;
  const promise = contract.connect(caller)[fn](...normalizedArgs, { value });
  if (revert) {
    await expect(promise).to.be.revertedWith(revert);
    return;
  }
  if (events.length === 0) {
    await promise;
    return;
  }
  const tx = await promise;
  await tx.wait();
  events.forEach(event =>
    expect(tx)
      .to.emit(contract, event.name)
      .withArgs(...event.args)
  );
};

const check = ({ condition, contract, fn, args, value }) => async () => {
  if (condition !== undefined && !condition) return;
  const storedVal = await contract[fn](...args);
  expect(storedVal).to.deep.equal(value);
};

const ops = async ({
  deployer,
  addrs,
  contracts,
  getTimestamp,
  deployContract
}) => {
  const owner = deployer.address;
  const handle = "some-handle";
  const uri = "some-uri";

  const paymentMods = [];
  const ticketMods = [];

  const target = BigNumber.from(10)
    .pow(18)
    .mul(1000);
  const currency = BigNumber.from(1);
  const duration = BigNumber.from(10000);
  const discountRate = BigNumber.from(180);
  const ballot = constants.AddressZero;

  const reservedRate = 20;
  const bondingCurveRate = 140;
  const reconfigurationBondingCurveRate = 140;

  const paymentValue = BigNumber.from(10)
    .pow(18)
    .mul(200);

  let packedMetadata = BigNumber.from(0);
  packedMetadata = packedMetadata.add(reconfigurationBondingCurveRate);
  packedMetadata = packedMetadata.shl(8);
  packedMetadata = packedMetadata.add(bondingCurveRate);
  packedMetadata = packedMetadata.shl(8);
  packedMetadata = packedMetadata.add(reservedRate);
  packedMetadata = packedMetadata.shl(8);

  const secondJuicer = await deployContract("Juicer", [
    contracts.projects.address,
    contracts.fundingCycles.address,
    contracts.ticketBooth.address,
    contracts.operatorStore.address,
    contracts.modStore.address,
    contracts.prices.address,
    contracts.terminalDirectory.address,
    contracts.governance.address
  ]);

  return [
    /** 
      Deploy a funding cycle. Expect the project's ID to be 1.
    */
    executeFn({
      caller: deployer,
      contract: contracts.juicer,
      fn: "deploy",
      args: [
        owner,
        utils.formatBytes32String(handle),
        uri,
        {
          target,
          currency,
          duration,
          discountRate,
          ballot
        },
        {
          reservedRate,
          bondingCurveRate,
          reconfigurationBondingCurveRate
        },
        paymentMods,
        ticketMods
      ]
    }),
    /** 
      Check that the handle got set.
    */
    check({
      contract: contracts.projects,
      fn: "handleOf",
      args: [1],
      value: utils.formatBytes32String(handle)
    }),
    /** 
      Check that the project ID can be found using the handle.
    */
    check({
      contract: contracts.projects,
      fn: "projectFor",
      args: [utils.formatBytes32String(handle)],
      value: 1
    }),
    /** 
      Check that the uri got set.
    */
    check({
      contract: contracts.projects,
      fn: "uriOf",
      args: [1],
      value: uri
    }),
    /** 
      Check that the terminal got set.
    */
    check({
      contract: contracts.terminalDirectory,
      fn: "terminalOf",
      args: [1],
      value: contracts.juicer.address
    }),
    /** 
      Check that the funding cycle got set.
    */
    check({
      contract: contracts.fundingCycles,
      fn: "get",
      args: [1],
      value: [
        BigNumber.from(1),
        BigNumber.from(1),
        BigNumber.from(1),
        BigNumber.from(0),
        (await getTimestamp()).add(1),
        BigNumber.from(10).pow(19),
        constants.AddressZero,
        (await getTimestamp()).add(1),
        duration,
        target,
        currency,
        BigNumber.from(10),
        discountRate,
        BigNumber.from(0),
        packedMetadata
      ]
    }),
    /** 
      Make a payment to the project.
    */
    executeFn({
      caller: deployer,
      contract: contracts.juicer,
      fn: "pay",
      args: [1, addrs[2].address, "", false],
      value: paymentValue
    }),
    /** 
      The project's balance should match the payment just made.
    */
    check({
      contract: deployer.provider,
      fn: "getBalance",
      args: [contracts.juicer.address],
      value: paymentValue
    }),
    /** 
      Migrating to a new juicer shouldn't work because it hasn't been allowed yet.
    */
    executeFn({
      caller: deployer,
      contract: contracts.juicer,
      fn: "migrate",
      args: [1, secondJuicer.address],
      revert: "Juicer::migrate: NOT_ALLOWED"
    }),
    /** 
      Allow a migration to the new juicer.
    */
    executeFn({
      caller: deployer,
      contract: contracts.governance,
      fn: "allowMigration",
      args: [contracts.juicer.address, secondJuicer.address]
    }),
    /** 
      Migrate to the new juicer.
    */
    executeFn({
      caller: deployer,
      contract: contracts.juicer,
      fn: "migrate",
      args: [1, secondJuicer.address]
    }),
    /** 
      There should no longer be a balance in the old juicer.
    */
    check({
      contract: deployer.provider,
      fn: "getBalance",
      args: [contracts.juicer.address],
      value: 0
    }),
    /** 
      The balance should be entirely in the new Juicer.
    */
    check({
      contract: deployer.provider,
      fn: "getBalance",
      args: [secondJuicer.address],
      value: paymentValue
    }),
    /** 
      The terminal should be updated to the new juicer in the directory.
    */
    check({
      contract: contracts.terminalDirectory,
      fn: "terminalOf",
      args: [1],
      value: secondJuicer.address
    }),
    /** 
      Payments to the old Juicer should no longer be accepter.
    */
    executeFn({
      caller: deployer,
      contract: contracts.juicer,
      fn: "pay",
      args: [1, addrs[2].address, "", false],
      value: paymentValue,
      revert: "TerminalUtility: UNAUTHORIZED"
    }),
    /** 
      Payments to the new Juicer should be accepted.
    */
    executeFn({
      caller: deployer,
      contract: secondJuicer,
      fn: "pay",
      args: [1, addrs[2].address, "", false],
      value: paymentValue
    })
  ];
};

module.exports = function() {
  describe("Success cases", function() {
    it("Intergated", async function() {
      const resolvedOps = await ops(this);
      // eslint-disable-next-line no-restricted-syntax
      for (const op of resolvedOps) {
        // eslint-disable-next-line no-await-in-loop
        await op();
      }
    });
  });
};
