import React, { useContext } from 'react'

import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { t } from '@lingui/macro'

import VeNftHeaderSection from 'components/veNft/VeNftHeaderSection'
import VeNftStakingForm from 'components/veNft/VeNftStakingForm'
import VeNftOwnedTokensSection from 'components/veNft/VeNftOwnedTokensSection'
import VeNftSummaryStatsSection from 'components/veNft/VeNftSummaryStatsSection'
import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'

const VeNftContent = () => {
  const { tokenSymbol, tokenName, projectMetadata } =
    useContext(V2ProjectContext)

  const tokenSymbolDisplayText = tokenSymbolText({ tokenSymbol })
  const projectName = projectMetadata?.name ?? t`Unknown Project`

  const lockDurationOptions = [
    BigNumber.from(1),
    BigNumber.from(7),
    BigNumber.from(30),
  ]

  return (
    <Space direction="vertical">
      <VeNftHeaderSection
        tokenName={tokenName}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
        projectName={projectName}
      />
      <VeNftStakingForm
        tokenSymbolDisplayText={tokenSymbolDisplayText}
        lockDurationOptions={lockDurationOptions}
      />
      <VeNftOwnedTokensSection />
      <VeNftSummaryStatsSection
        tokenSymbolDisplayText={tokenSymbolDisplayText}
      />
    </Space>
  )
}

export default VeNftContent
