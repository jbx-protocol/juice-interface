/** 
  Projects can deploy addresses that will forward funds received to the project's funding cycle.
*/

const { BigNumber } = require("ethers");

// The currency will be 0, which corresponds to ETH, preventing the need for currency price conversion.
const currency = 0;

module.exports = [
  {
    description: "Deploy a project",
    fn: async ({
      constants,
      contracts,
      executeFn,
      randomBigNumberFn,
      BigNumber,
      randomBytesFn,
      randomStringFn,
      randomSignerFn,
      incrementFundingCycleIdFn,
      incrementProjectIdFn,
      verifyBalanceFn,
    }) => {
      const expectedProjectId = incrementProjectIdFn();

      // Burn the unused funding cycle ID id.
      incrementFundingCycleIdFn();

      const owner = randomSignerFn();

      // Make the test case cleaner with a reserved rate of 0.
      const reservedRate = BigNumber.from(0);

      await executeFn({
        caller: randomSignerFn(),
        contract: contracts.terminalV1,
        fn: "deploy",
        args: [
          owner.address,
          randomBytesFn({
            // Make sure its unique by prepending the id.
            prepend: expectedProjectId.toString(),
          }),
          randomStringFn(),
          {
            target: randomBigNumberFn(),
            currency,
            duration: randomBigNumberFn({
              min: BigNumber.from(0),
              max: constants.MaxUint16,
            }),
            cycleLimit: randomBigNumberFn({
              max: constants.MaxCycleLimit,
            }),
            discountRate: randomBigNumberFn({ max: constants.MaxPercent }),
            ballot: constants.AddressZero,
          },
          {
            reservedRate,
            bondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent,
            }),
            reconfigurationBondingCurveRate: randomBigNumberFn({
              max: constants.MaxPercent,
            }),
          },
          [],
          [],
        ],
      });
      return { owner, reservedRate, expectedProjectId };
    },
  },
  {
    description:
      "Make sure the terminalV1 got set as the project's current terminal",
    fn: ({
      checkFn,
      contracts,
      randomSignerFn,
      local: { expectedProjectId },
    }) =>
      checkFn({
        caller: randomSignerFn(),
        contract: contracts.terminalDirectory,
        fn: "terminalOf",
        args: [expectedProjectId],
        expect: contracts.terminalV1.address,
      }),
  },
  {
    description: "Deploy a direct payment address",
    fn: ({
      executeFn,
      deployer,
      contracts,
      randomStringFn,
      local: { expectedProjectId },
    }) =>
      executeFn({
        caller: deployer,
        contract: contracts.proxyPaymentAddressManager,
        fn: "deployProxyPaymentAddress",
        args: [expectedProjectId, randomStringFn()],
      }),
  },
  {
    description: "Make a payment to the proxy payment address",
    fn: async ({
      contracts,
      randomBigNumberFn,
      BigNumber,
      getBalanceFn,
      randomSignerFn,
      local: { expectedProjectId },
    }) => {
      const [proxyPaymentAddress] =
        await contracts.proxyPaymentAddressManager.proxyPaymentAddressesOf(
          expectedProjectId
        );
      // An account that will be used to make payments.
      const payer = randomSignerFn();

      // Three payments will be made. Cant pay entire balance because some is needed for gas.
      // So, arbitrarily divide the balance so that all payments can be made successfully.
      const paymentValue = randomBigNumberFn({
        min: BigNumber.from(1),
        max: (await getBalanceFn(payer.address)).div(100),
      });

      await payer.sendTransaction({
        to: proxyPaymentAddress,
        value: paymentValue,
      });

      return { payer, paymentValue, proxyPaymentAddress };
    },
  },
  {
    description: "There should now be a balance in the proxy payment address",
    fn: ({ verifyBalanceFn, local: { paymentValue, proxyPaymentAddress } }) =>
      verifyBalanceFn({
        address: proxyPaymentAddress,
        expect: paymentValue,
      }),
  },
  {
    description: "Tap the proxy payment address",
    fn: async ({
      randomSignerFn,
      bindContractFn,
      local: { proxyPaymentAddress },
    }) => {
      // An account that will be used to make payments.
      const payer = randomSignerFn();

      const contract = await bindContractFn({
        contractName: "ProxyPaymentAddress",
        address: proxyPaymentAddress,
        signerOrProvider: payer,
      });

      await contract.tap();

      return { payer, proxyPaymentAddress };
    },
  },
  {
    description: "The balance should be empty in the proxy payment address",
    fn: ({ verifyBalanceFn, local: { paymentValue, proxyPaymentAddress } }) =>
      verifyBalanceFn({
        address: proxyPaymentAddress,
        expect: BigNumber.from(0),
      }),
  },
  // TODO: to be continued
];
