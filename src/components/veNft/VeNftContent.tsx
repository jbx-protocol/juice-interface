import React, { useContext } from 'react'
import VeNftHeader from 'components/veNft/VeNftHeader'

import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { t } from '@lingui/macro'

const VeNftContent = () => {
  const { tokenSymbol, tokenName, projectMetadata } =
    useContext(V2ProjectContext)

  const tokenSymbolDisplayText = tokenSymbolText({ tokenSymbol })
  const projectName = projectMetadata?.name ?? t`Unknown Project`

  return (
    <>
      <VeNftHeader
        tokenName={tokenName}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
        projectName={projectName}
      />
    </>
  )
}

export default VeNftContent
