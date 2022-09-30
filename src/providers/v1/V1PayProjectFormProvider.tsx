import { PayProjectFormContext } from 'components/Project/PayProjectForm/PayProjectFormContext'
import V1PayButton from 'components/v1/V1Project/V1PayButton'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useContext } from 'react'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import { weightAmountPerbicent } from 'utils/v1/math'

export const V1PayProjectFormProvider: React.FC = ({ children }) => {
  const { currentFC, tokenSymbol, tokenAddress } = useContext(V1ProjectContext)

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
      }}
    >
      {children}
    </PayProjectFormContext.Provider>
  )
}
