import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { useContext } from 'react'
import { encodeJb721DelegateMetadata } from 'utils/encodeJb721DelegateMetadata/encodeJb721DelegateMetadata'

export function useDelegateMetadata() {
  const { version: JB721DelegateVersion } = useContext(
    JB721DelegateContractsContext,
  )

  const { form: payProjectForm } = useContext(PayProjectFormContext)

  if (!payProjectForm?.payMetadata || !JB721DelegateVersion) return undefined

  return encodeJb721DelegateMetadata(
    payProjectForm?.payMetadata,
    JB721DelegateVersion,
  )
}
