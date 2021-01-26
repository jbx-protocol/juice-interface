const truffleAssert = require("truffle-assertions");

exports.assertMoneyPoolCount = async (instance, count, message) => {
  const currentCount = (await instance.mpCount()).toNumber();
  assert.equal(currentCount, count, message);
};

exports.assertDuration = async (instance, address, duration, message) => {
  const currentDuration = (
    await instance.getMp(
      (await instance.latestMpNumber(address)).toNumber()
    )
  ).duration.toNumber();
  assert.equal(currentDuration, duration, message);
};

exports.assertSustainabilityTarget = async (
  instance,
  address,
  target,
  message
) => {
  const currentTarget = (
    await instance.getMp(
      (await instance.latestMpNumber(address)).toNumber()
    )
  ).target.toNumber();
  assert.equal(currentTarget, target, message);
};

exports.assertConfigureMoneyPoolEvent = async (
  tx,
  instance,
  creator, 
  target, 
  duration, 
  want,
  message
) => {
  const currentCount = (await instance.mpCount()).toString();
  truffleAssert.eventEmitted(tx, "ConfigureMp", (ev) => {
    return (
      ev.mpNumber.toString() === currentCount &&
      ev.owner === creator &&
      ev.target.toString() === target.toString() &&
      ev.duration.toString() === duration.toString() &&
      ev.want === want
    )
  }, message);
};

exports.assertSustainMoneyPoolEvent = async (
  tx,
  instance,
  creator,
  beneficiary,
  sustainer,
  amount,
  message
) => {
  const currentCount = (await instance.mpCount()).toString();
  truffleAssert.eventEmitted(tx, "SustainMp", (ev) => {
    return (
      ev.mpNumber.toString() === currentCount &&
      ev.owner === creator &&
      ev.beneficiary === beneficiary &&
      ev.sustainer === sustainer &&
      ev.amount.toString() === amount.toString() 
    )
  }, message);
};

exports.assertBalance = async (
  instance,
  address,
  amount,
  message,
  from
) => {
  const currentSustainment = (
    await instance.getMp(
      (await instance.latestMpNumber(address)).toNumber(), {
        from: from || address
      }
    )
  ).total.toNumber();
  assert.equal(currentSustainment, amount, message);
};

exports.assertSustainmentAmount = async (
  instance,
  address,
  sustainer,
  amount,
  message,
  from
) => {
  const currentAmount = (
    await instance.getSustainment((await instance.latestMpNumber(address)).toNumber(), sustainer, {
      from: from || address
    }
  )).toNumber();
  assert.equal(currentAmount, amount, message);
};

exports.assertRedistributionTrackerAmount = async (
  instance,
  address,
  sustainer,
  amount,
  message
) => {
  const currentAmount = (
    await instance.getTrackedRedistribution((await instance.latestMpNumber(address)).toNumber(), sustainer, {
      from: address
    }
  )).toNumber();
  assert.equal(currentAmount, amount, message);
};

exports.assertSustainabilityPoolAmount = async (
  instance,
  address,
  amount,
  message
) => {
  const currentAmount = (await instance.getTappableAmount((await instance.latestMpNumber(address)), { from: address })).toNumber();
  assert.equal(currentAmount, amount, message);
};

