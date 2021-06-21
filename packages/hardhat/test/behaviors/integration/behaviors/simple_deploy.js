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

const ops = async ({ deployer, addrs, contracts, getTimestamp }) => {
  const owner = addrs[0].address;
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
    check({
      contract: contracts.projects,
      fn: "handleOf",
      args: [1],
      value: utils.formatBytes32String(handle)
    }),
    check({
      contract: contracts.projects,
      fn: "projectFor",
      args: [utils.formatBytes32String(handle)],
      value: 1
    }),
    check({
      contract: contracts.projects,
      fn: "uriOf",
      args: [1],
      value: uri
    }),
    check({
      contract: contracts.terminalDirectory,
      fn: "terminalOf",
      args: [1],
      value: contracts.juicer.address
    }),
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
