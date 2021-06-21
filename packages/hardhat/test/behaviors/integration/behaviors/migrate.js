const { BigNumber, constants, utils } = require("ethers");

module.exports = async function() {
  const owner = this.deployer.address;
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

  const secondJuicer = await this.deployContract("Juicer", [
    this.contracts.projects.address,
    this.contracts.fundingCycles.address,
    this.contracts.ticketBooth.address,
    this.contracts.operatorStore.address,
    this.contracts.modStore.address,
    this.contracts.prices.address,
    this.contracts.terminalDirectory.address,
    this.contracts.governance.address
  ]);

  return [
    /** 
      Deploy a funding cycle. Expect the project's ID to be 1.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
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
    this.check({
      contract: this.contracts.projects,
      fn: "handleOf",
      args: [1],
      value: utils.formatBytes32String(handle)
    }),
    /** 
      Check that the project ID can be found using the handle.
    */
    this.check({
      contract: this.contracts.projects,
      fn: "projectFor",
      args: [utils.formatBytes32String(handle)],
      value: 1
    }),
    /** 
      Check that the uri got set.
    */
    this.check({
      contract: this.contracts.projects,
      fn: "uriOf",
      args: [1],
      value: uri
    }),
    /** 
      Check that the terminal got set.
    */
    this.check({
      contract: this.contracts.terminalDirectory,
      fn: "terminalOf",
      args: [1],
      value: this.contracts.juicer.address
    }),
    /** 
      Check that the funding cycle got set.
    */
    this.check({
      contract: this.contracts.fundingCycles,
      fn: "get",
      args: [1],
      value: [
        BigNumber.from(1),
        BigNumber.from(1),
        BigNumber.from(1),
        BigNumber.from(0),
        (await this.getTimestamp()).add(1),
        BigNumber.from(10).pow(19),
        constants.AddressZero,
        (await this.getTimestamp()).add(1),
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
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "pay",
      args: [1, this.addrs[2].address, "", false],
      value: paymentValue
    }),
    /** 
      The project's balance should match the payment just made.
    */
    this.check({
      contract: this.deployer.provider,
      fn: "getBalance",
      args: [this.contracts.juicer.address],
      value: paymentValue
    }),
    /** 
      Migrating to a new juicer shouldn't work because it hasn't been allowed yet.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "migrate",
      args: [1, secondJuicer.address],
      revert: "Juicer::migrate: NOT_ALLOWED"
    }),
    /** 
      Allow a migration to the new juicer.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.governance,
      fn: "allowMigration",
      args: [this.contracts.juicer.address, secondJuicer.address]
    }),
    /** 
      Migrate to the new juicer.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "migrate",
      args: [1, secondJuicer.address]
    }),
    /** 
      There should no longer be a balance in the old juicer.
    */
    this.check({
      contract: this.deployer.provider,
      fn: "getBalance",
      args: [this.contracts.juicer.address],
      value: 0
    }),
    /** 
      The balance should be entirely in the new Juicer.
    */
    this.check({
      contract: this.deployer.provider,
      fn: "getBalance",
      args: [secondJuicer.address],
      value: paymentValue
    }),
    /** 
      The terminal should be updated to the new juicer in the directory.
    */
    this.check({
      contract: this.contracts.terminalDirectory,
      fn: "terminalOf",
      args: [1],
      value: secondJuicer.address
    }),
    /** 
      Payments to the old Juicer should no longer be accepter.
    */
    this.executeFn({
      caller: this.deployer,
      contract: this.contracts.juicer,
      fn: "pay",
      args: [1, this.addrs[2].address, "", false],
      value: paymentValue,
      revert: "TerminalUtility: UNAUTHORIZED"
    }),
    /** 
      Payments to the new Juicer should be accepted.
    */
    this.executeFn({
      caller: this.deployer,
      contract: secondJuicer,
      fn: "pay",
      args: [1, this.addrs[2].address, "", false],
      value: paymentValue
    })
  ];
};

// function() {
//   describe("Cases", function() {
//     it("Intergated", async function() {
//       this.ops = ops;
//       const resolvedOps = await this.ops();
//       // eslint-disable-next-line no-restricted-syntax
//       for (const op of resolvedOps) {
//         // eslint-disable-next-line no-await-in-loop
//         await op();
//       }
//     });
//   });
// };
