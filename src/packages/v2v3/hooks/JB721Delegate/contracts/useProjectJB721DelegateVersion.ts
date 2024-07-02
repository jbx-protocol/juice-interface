import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import { DEFAULT_JB_721_DELEGATE_VERSION } from 'packages/v2v3/hooks/defaultContracts/useDefaultJB721Delegate'
import {
  JB721DelegateVersion,
  V2V3ContractName,
} from 'packages/v2v3/models/contracts'
import { useContext } from 'react'

/**
 * Return the JB721Delegate version that should be used with the project's current JBController version.
 */
export function useProjectControllerJB721DelegateVersion() {
  const { versions } = useContext(V2V3ProjectContractsContext)
  const delegateVersion =
    versions.JBControllerVersion === V2V3ContractName.JBController
      ? JB721DelegateVersion.JB721DELEGATE_V3
      : DEFAULT_JB_721_DELEGATE_VERSION // the default delegate version for controller >= 3.1

  return delegateVersion
}
