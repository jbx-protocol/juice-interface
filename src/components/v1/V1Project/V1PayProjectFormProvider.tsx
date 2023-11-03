import { usePayProjectForm } from 'components/v1/V1Project/PayProjectForm/hooks/usePayProjectForm'
import { PayProjectFormContext } from 'components/v1/V1Project/PayProjectForm/payProjectFormContext'
import { V1PayButton } from 'components/v1/V1Project/V1PayButton'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useContext } from 'react'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import { weightAmountPerbicent } from 'utils/v1/math'

export const V1PayProjectFormProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const { currentFC, tokenSymbol, tokenAddress } = useContext(V1ProjectContext)

  const payProjectForm = usePayProjectForm()

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

  return (
    <PayProjectFormContext.Provider
      value={{
        PayButton: V1PayButton,
        reservedRate: fcMetadata?.reservedRate,
        weight: currentFC?.weight,
        weightingFn: weightAmountPerbicent,
        tokenSymbol,
        tokenAddress,
        form: payProjectForm,
      }}
    >
      {children}
    </PayProjectFormContext.Provider>
  )
}
