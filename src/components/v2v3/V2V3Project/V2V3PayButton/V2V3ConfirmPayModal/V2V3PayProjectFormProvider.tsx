import { usePayProjectForm } from 'components/Project/PayProjectForm/hooks/usePayProjectForm'
import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import { V2V3PayButton } from 'components/v2v3/V2V3Project/V2V3PayButton/V2V3PayButton'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { weightAmountPermyriad } from 'utils/v2v3/math'

export const V2V3PayProjectFormProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const { fundingCycleMetadata, fundingCycle, tokenSymbol, tokenAddress } =
    useContext(V2V3ProjectContext)

  const payProjectForm = usePayProjectForm()

  return (
    <PayProjectFormContext.Provider
      value={{
        PayButton: V2V3PayButton,
        reservedRate: fundingCycleMetadata?.reservedRate.toNumber(),
        weight: fundingCycle?.weight,
        weightingFn: weightAmountPermyriad,
        tokenSymbol: tokenSymbol,
        tokenAddress: tokenAddress,
        form: payProjectForm,
      }}
    >
      {children}
    </PayProjectFormContext.Provider>
  )
}
