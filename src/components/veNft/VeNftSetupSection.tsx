import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useState } from 'react'

import VeNftSetupModal from 'components/veNft/VeNftSetupModal'

const VeNftSetupSection = () => {
  const [setupModalVisible, setSetupModalVisible] = useState(false)

  return (
    <>
      <section>
        <h3>
          <Trans>Enable veNFT Governance</Trans>
        </h3>
        <p>
          <Trans>Set up and launch veNFT governance for your project.</Trans>
        </p>
        <Button
          type="primary"
          size="small"
          onClick={() => setSetupModalVisible(true)}
        >
          Launch Setup
        </Button>
      </section>
      {setupModalVisible && (
        <VeNftSetupModal
          visible={setupModalVisible}
          onCancel={() => setSetupModalVisible(false)}
        />
      )}
    </>
  )
}

export default VeNftSetupSection
