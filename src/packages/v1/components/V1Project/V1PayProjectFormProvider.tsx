import { usePayProjectForm } from 'packages/v1/components/V1Project/PayProjectForm/hooks/usePayProjectForm'
import { PayProjectFormContext } from 'packages/v1/components/V1Project/PayProjectForm/payProjectFormContext'
import { V1PayButton } from 'packages/v1/components/V1Project/V1PayButton'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { decodeFundingCycleMetadata } from 'packages/v1/utils/fundingCycle'
import { weightAmountPerbicent } from 'packages/v1/utils/math'
import { useContext } from 'react'

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
