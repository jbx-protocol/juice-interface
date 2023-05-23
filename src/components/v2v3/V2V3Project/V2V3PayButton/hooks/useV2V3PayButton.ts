import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import { PROJECT_PAGE } from 'constants/fathomEvents'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useWeiConverter from 'hooks/useWeiConverter'
import { trackFathomGoal } from 'lib/fathom'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useContext, useState } from 'react'

export const useV2V3PayButton = () => {
  const {
    fundingCycleMetadata,
    loading: { fundingCycleLoading, primaryETHTerminalLoading },
  } = useContext(V2V3ProjectContext)
  const { projectMetadata, isArchived } = useContext(ProjectMetadataContext)
  const { form: payProjectForm } = useContext(PayProjectFormContext)
  const { payInCurrency, payAmount } = payProjectForm ?? {}

  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)

  const onPayClick = useCallback(() => {
    setPayModalVisible(true)
    trackFathomGoal(PROJECT_PAGE.PAY_CTA)
  }, [])

  const onPayCancel = useCallback(() => {
    setPayModalVisible(false)
  }, [])

  const weiPayAmt = useWeiConverter<V2V3CurrencyOption>({
    currency: payInCurrency as V2V3CurrencyOption,
    amount: payAmount,
  })

  const customPayButtonText = projectMetadata?.payButton?.length
    ? projectMetadata.payButton
    : undefined

  return {
    isArchived,
    payIsPaused: fundingCycleMetadata?.pausePay,
    payModalVisible,
    onPayClick,
    onPayCancel,
    customPayButtonText,
    payInCurrency,
    weiPayAmt,
    fundingCycleLoading,
    primaryETHTerminalLoading,
  }
}
