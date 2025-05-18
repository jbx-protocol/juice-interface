# How to do relayr transactions, example

Get a relayr quote. We need an array of transactions for each chain for deployERC20For. Important: the salt arg must be the same. Example: https://github.com/jbx-protocol/juice-interface/blob/fdcd0ea5dfd19805a1ee4458d58d23de671a2944/src/packages/v4/components/Create/hooks/DeployProject/hooks/useDeployOmnichainProject.ts#L35-L96,
Store the quote in state: https://github.com/jbx-protocol/juice-interface/blob/fdcd0ea5dfd19805a1ee4458d58d23de671a2944/src/packages/v4/components/Create/components/pages/ReviewDeploy/components/LaunchProjectModal/LaunchProjectModal.tsx#L171-L172,
Give a way for the user to select what chain to pay gas on,
Call sendRelayrTx with payment_info for selected gas chain. Example: https://github.com/jbx-protocol/juice-interface/blob/fdcd0ea5dfd19805a1ee4458d58d23de671a2944/src/packages/v4/components/Create/components/pages/ReviewDeploy/components/LaunchProjectModal/LaunchProjectModal.tsx#L198-L209,
Start polling to get tx status: getRelayrBundle.startPolling(txQuote.bundle_uuid),
Track the poll state, and do stuff when it's complete: https://github.com/jbx-protocol/juice-interface/blob/fdcd0ea5dfd19805a1ee4458d58d23de671a2944/src/packages/v4/components/Create/components/pages/ReviewDeploy/components/LaunchProjectModal/LaunchProjectModal.tsx#L218-L259
