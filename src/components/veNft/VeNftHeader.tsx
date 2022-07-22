import { Trans } from '@lingui/macro'
import React from 'react'

interface VeNftHeaderProps {
  tokenName: string | undefined
  tokenSymbolDisplayText: string
  projectName: string
}

const VeNftHeader = ({
  tokenName,
  tokenSymbolDisplayText,
  projectName,
}: VeNftHeaderProps) => {
  return (
    <>
      <h1>
        <Trans>Lock {tokenName} for Voting Power</Trans>
      </h1>
      <p>
        <Trans>
          Stake {tokenName} ({tokenSymbolDisplayText}) tokens in exchange for
          voting weight. In return, you will impact {projectName} governance and
          receive a choice governance NFT.
        </Trans>
      </p>
    </>
  )
}

export default VeNftHeader
