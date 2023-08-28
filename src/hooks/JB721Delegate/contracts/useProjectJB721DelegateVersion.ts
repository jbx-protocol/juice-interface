import { JB721_DELEGATE_V3 } from 'constants/delegateVersions'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { DEFAULT_JB_721_DELEGATE_VERSION } from 'hooks/defaultContracts/useDefaultJB721Delegate'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'

/**
 * Return the JB721Delegate version that should be used with the project's current JBController version.
 */
export function useProjectControllerJB721DelegateVersion() {
  const { versions } = useContext(V2V3ProjectContractsContext)
  const JB721DelegateVersion =
    versions.JBControllerVersion === V2V3ContractName.JBController3_1
      ? DEFAULT_JB_721_DELEGATE_VERSION // the default delegate version for controller v3.1
      : JB721_DELEGATE_V3

  return JB721DelegateVersion
}
