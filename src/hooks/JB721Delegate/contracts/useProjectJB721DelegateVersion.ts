import { JB721_DELEGATE_V3 } from 'constants/delegateVersions'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { DEFAULT_JB_721_DELEGATE_VERSION } from 'hooks/defaultContracts/useDefaultJB721Delegate'
import { JB_CONTROLLER_V_3_1 } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/useProjectController'
import { useContext } from 'react'

/**
 * Return the JB721Delegate version that should be used with the project's current JBController version.
 */
export function useProjectControllerJB721DelegateVersion() {
  const { versions } = useContext(V2V3ProjectContractsContext)
  const JB721DelegateVersion =
    versions.JBControllerVersion === JB_CONTROLLER_V_3_1
      ? DEFAULT_JB_721_DELEGATE_VERSION // the default delegate version for controller v3.1
      : JB721_DELEGATE_V3

  return JB721DelegateVersion
}
