import { Contract } from '@ethersproject/contracts'

export enum V2ContractName {
  JBController = 'JBController',
  JBDirectory = 'JBDirectory',
  JBETHPaymentTerminal = 'JBETHPaymentTerminal',
  JBFundingCycleStore = 'JBFundingCycleStore',
  JBOperatorStore = 'JBOperatorStore',
  JBPrices = 'JBPrices',
  JBProjects = 'JBProjects',
  JBSplitsStore = 'JBSplitsStore',
  JBTokenStore = 'JBTokenStore',
  JBSingleTokenPaymentTerminalStore = 'JBSingleTokenPaymentTerminalStore',
  JBETHERC20ProjectPayerDeployer = 'JBETHERC20ProjectPayerDeployer',

  JBProjectHandles = 'JBProjectHandles',
  PublicResolver = 'PublicResolver',

  JBVeNftDeployer = 'JBVeNftDeployer',
  JBVeTokenUriResolver = 'JBVeTokenUriResolver',

  JBV1TokenPaymentTerminal = 'JBV1TokenPaymentTerminal',

  DeprecatedJBController = 'DeprecatedJBController',
  DeprecatedJBSplitsStore = 'DeprecatedJBSplitsStore',
  DeprecatedJBDirectory = 'DeprecatedJBDirectory',
  JBTieredLimitedNFTRewardDataSourceProjectDeployer = 'JBTieredLimitedNFTRewardDataSourceProjectDeployer',
}

export type V2Contracts = Record<V2ContractName, Contract>
