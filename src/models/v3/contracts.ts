import { Contract } from '@ethersproject/contracts'

export enum V3ContractName {
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

  JBTiered721DelegateProjectDeployer = 'JBTiered721DelegateProjectDeployer',
  JBTiered721DelegateStore = 'JBTiered721DelegateStore',
}

export type V3Contracts = Record<V3ContractName, Contract>
