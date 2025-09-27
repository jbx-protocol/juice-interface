export enum V4OperatorPermission {
  'ROOT' = 1, // All permissions across every contract. Very dangerous. BE CAREFUL!

  // Used by `nana-core`
  'QUEUE_RULESETS' = 2, // Permission to call `JBController.queueRulesetsOf` and `JBController.launchRulesetsFor`.
  'REDEEM_TOKENS' = 3, // Permission to call `JBMultiTerminal.redeemTokensOf`.
  'SEND_PAYOUTS' = 4, // Permission to call `JBMultiTerminal.sendPayoutsOf`.
  'MIGRATE_TERMINAL' = 5, // Permission to call `JBMultiTerminal.migrateBalanceOf`.
  'SET_PROJECT_URI' = 6, // Permission to call `JBController.setUriOf`.
  'DEPLOY_ERC20' = 7, // Permission to call `JBController.deployERC20For`.
  'SET_TOKEN' = 8, // Permission to call `JBController.setTokenFor`.
  'MINT_TOKENS' = 9, // Permission to call `JBController.mintTokensOf`.
  'BURN_TOKENS' = 10, // Permission to call `JBController.burnTokensOf`.
  'CLAIM_TOKENS' = 11, // Permission to call `JBController.claimTokensFor`.
  'TRANSFER_CREDITS' = 12, // Permission to call `JBController.transferCreditsFrom`.
  'SET_CONTROLLER' = 13, // Permission to call `JBDirectory.setControllerOf`.
  'SET_TERMINALS' = 14, // Permission to call `JBDirectory.setTerminalsOf`.
  'SET_PRIMARY_TERMINAL' = 15, // Permission to call `JBDirectory.setPrimaryTerminalOf`.
  'USE_ALLOWANCE' = 16, // Permission to call `JBMultiTerminal.useAllowanceOf`.
  'SET_SPLIT_GROUPS' = 17, // Permission to call `JBController.setSplitGroupsOf`.
  'ADD_PRICE_FEED' = 18, // Permission to call `JBPrices.addPriceFeedFor`.
  'ADD_ACCOUNTING_CONTEXTS' = 19, // Permission to call `JBMultiTerminal.addAccountingContextsFor`.

  // Used by `nana-721-hook`
  'ADJUST_721_TIERS' = 20, // Permission to call `JB721TiersHook.adjustTiers`.
  'SET_721_METADATA' = 21, // Permission to call `JB721TiersHook.setMetadata`.
  'MINT_721' = 22, // Permission to call `JB721TiersHook.mintFor`.

  // Used by `nana-buyback-hook`
  'SET_BUYBACK_TWAP' = 23, // Permission to call `JBBuybackHook.setTwapWindowOf` and `JBBuybackHook.setTwapSlippageToleranceOf`.
  'SET_BUYBACK_POOL' = 24, // Permission to call `JBBuybackHook.setPoolFor`.

  // Used by `nana-swap-terminal`
  'ADD_SWAP_TERMINAL_POOL' = 25, // Permission to call `JBSwapTerminal.addDefaultPool`.
  'ADD_SWAP_TERMINAL_TWAP_PARAMS' = 26, // Permission to call `JBSwapTerminal.addTwapParamsFor`.

  // Used by `nana-suckers`
  'MAP_SUCKER_TOKEN' = 27, // Permission to call `BPSucker.mapToken`.
  'DEPLOY_SUCKERS' = 28, // Permission to call `BPSuckerRegistry.deploySuckersFor`.
}
