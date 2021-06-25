/** 
  The governance of the Juicer can transfer its power to a new address.
  To do so, the governance must appoint a new address, and that address must accept the appointment.
*/
module.exports = async ({
  deployer,
  addrs,
  contracts,
  constants,
  executeFn,
  randomBigNumberFn
}) => {
  // Appoint a governance with a different address.
  const firstAppointedGovernance = addrs[1];

  // Appoint another governance with yet another address.
  const secondAppointedGovernance = addrs[2];

  return [
    /** 
      The initial governance can set a new fee.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "setFee",
        args: [
          contracts.juicer.address,
          randomBigNumberFn({ max: constants.MaxPercent })
        ]
      }),
    /** 
      Appoint a new governance.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "appointGovernance",
        args: [contracts.juicer.address, firstAppointedGovernance.address]
      }),
    /** 
      The appointed governance shouldn't yet be able to set a fee.
    */
    () =>
      executeFn({
        caller: firstAppointedGovernance,
        contract: contracts.juicer,
        fn: "setFee",
        args: [randomBigNumberFn({ max: constants.MaxPercent })],
        revert: "Juicer: UNAUTHORIZED"
      }),
    /** 
      The current governance should still be able to set a fee.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "setFee",
        args: [
          contracts.juicer.address,
          randomBigNumberFn({ max: constants.MaxPercent })
        ]
      }),
    /** 
      Appoint a different governance.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "appointGovernance",
        args: [contracts.juicer.address, secondAppointedGovernance.address]
      }),
    /** 
      The first appointed governance should no longer be able to accept.
    */
    () =>
      executeFn({
        caller: firstAppointedGovernance,
        contract: contracts.juicer,
        fn: "acceptGovernance",
        args: [],
        revert: "Juicer::acceptGovernance: UNAUTHORIZED"
      }),
    /** 
      Accept a new governance.
    */
    () =>
      executeFn({
        caller: secondAppointedGovernance,
        contract: contracts.juicer,
        fn: "acceptGovernance",
        args: []
      }),
    /** 
      The old governance should no longer be able to set a fee.
    */
    () =>
      executeFn({
        caller: deployer,
        contract: contracts.governance,
        fn: "setFee",
        args: [
          contracts.juicer.address,
          randomBigNumberFn({ max: constants.MaxPercent })
        ],
        revert: "Juicer: UNAUTHORIZED"
      }),
    /** 
      The new governance should be able to set a fee.
    */
    () =>
      executeFn({
        caller: secondAppointedGovernance,
        contract: contracts.juicer,
        fn: "setFee",
        args: [randomBigNumberFn({ max: constants.MaxPercent })]
      })
  ];
};
