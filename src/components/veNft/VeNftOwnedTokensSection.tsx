import { Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import React, { useContext } from 'react'

import { shadowCard } from 'constants/styles/shadowCard'

const VeNftOwnedTokensSection = () => {
  const { theme } = useContext(ThemeContext)
  return (
    <div style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}>
      <h3>
        <Trans>You don't own any veNFTs!</Trans>
      </h3>
    </div>
  )
}

export default VeNftOwnedTokensSection
