import { Trans } from '@lingui/macro'
import React from 'react'

interface VeNftHeaderSectionProps {
  tokenName: string | undefined
  tokenSymbolDisplayText: string
  projectName: string
}

const VeNftHeaderSection = ({
  tokenName,
  tokenSymbolDisplayText,
  projectName,
}: VeNftHeaderSectionProps) => {
  return (
    <>
      <h1>
        <Trans>Lock ${tokenSymbolDisplayText} for Voting Power</Trans>
      </h1>
      <p>
        <Trans>
          Lock {tokenName} ({tokenSymbolDisplayText}) tokens in exchange for
          voting weight. In return, you'll impact {projectName} governance and
          receive a choice governance NFT.
        </Trans>
      </p>
    </>
  )
}

export default VeNftHeaderSection
