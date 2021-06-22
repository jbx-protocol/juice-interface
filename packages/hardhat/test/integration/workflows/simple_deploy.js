const { BigNumber, constants, utils } = require("ethers");

module.exports = async function() {
  const owner = this.addrs[0].address;
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

  let packedMetadata = BigNumber.from(0);
  packedMetadata = packedMetadata.add(reconfigurationBondingCurveRate);
  packedMetadata = packedMetadata.shl(8);
  packedMetadata = packedMetadata.add(bondingCurveRate);
  packedMetadata = packedMetadata.shl(8);
  packedMetadata = packedMetadata.add(reservedRate);
  packedMetadata = packedMetadata.shl(8);

  return [
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
    this.check({
      contract: this.contracts.projects,
      fn: "handleOf",
      args: [1],
      value: utils.formatBytes32String(handle)
    }),
    this.check({
      contract: this.contracts.projects,
      fn: "projectFor",
      args: [utils.formatBytes32String(handle)],
      value: 1
    }),
    this.check({
      contract: this.contracts.projects,
      fn: "uriOf",
      args: [1],
      value: uri
    }),
    this.check({
      contract: this.contracts.terminalDirectory,
      fn: "terminalOf",
      args: [1],
      value: this.contracts.juicer.address
    }),
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
    })
  ];
};
