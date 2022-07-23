import React, { useContext } from 'react'

import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { t } from '@lingui/macro'

import VeNftHeaderSection from 'components/veNft/VeNftHeaderSection'
import VeNftStakingForm from 'components/veNft/VeNftStakingForm'
import VeNftOwnedTokensSection from 'components/veNft/VeNftOwnedTokensSection'
import VeNftSummaryStatsSection from 'components/veNft/VeNftSummaryStatsSection'

const VeNftContent = () => {
  const {
    tokenSymbol,
    tokenName,
    projectMetadata,
    veNft: { userTokens },
  } = useContext(V2ProjectContext)

  const tokenSymbolDisplayText = tokenSymbolText({ tokenSymbol })
  const projectName = projectMetadata?.name ?? t`Unknown Project`

  return (
    <>
      <VeNftHeaderSection
        tokenName={tokenName}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
        projectName={projectName}
      />
      <VeNftStakingForm tokenSymbolDisplayText={tokenSymbolDisplayText} />
      <VeNftOwnedTokensSection
        userTokens={userTokens}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
      />
      <VeNftSummaryStatsSection
        userTokens={userTokens}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
      />
    </>
  )
}

export default VeNftContent
