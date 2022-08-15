import { Trans } from '@lingui/macro'
import { Button, Divider, Space } from 'antd'
import { useContext, useState } from 'react'
import { useWallet } from 'hooks/Wallet'

import VeNftSetupModal from 'components/veNft/VeNftSetupModal'
import { useLaunchVeNftTx } from 'hooks/veNft/transactor/LaunchVeNftTx'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { featureFlagEnabled } from 'utils/featureFlags'

import {
  DEFAULT_LOCK_DURATIONS,
  VENFT_RESOLVER_ADDRESS,
} from 'constants/veNft/veNftProject'

import { FEATURE_FLAGS } from 'constants/featureFlags'

const VeNftEnableSection = () => {
  const { isConnected, connect } = useWallet()
  const { tokenSymbol } = useContext(V2ProjectContext)
  const [loading, setLoading] = useState(false)
  const [setupModalVisible, setSetupModalVisible] = useState(false)
  const veNftCreatorEnabled = featureFlagEnabled(FEATURE_FLAGS.VENFT_CREATOR)

  const launchVeBannyTx = useLaunchVeNftTx()

  const launchVeBanny = async () => {
    if (!isConnected) {
      connect()
      return
    }

    setLoading(true)

    const txSuccess = await launchVeBannyTx(
      {
        name: 'Banny',
        symbol: `$ve${tokenSymbol}`,
        uriResolver: VENFT_RESOLVER_ADDRESS,
        lockDurationOptions: DEFAULT_LOCK_DURATIONS,
      },
      {
        onConfirmed: () => {
          setLoading(false)
        },
      },
    )

    if (!txSuccess) {
      setLoading(false)
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <>
        <section>
          <h3>
            <Trans>Enable veBanny Governance</Trans>
          </h3>
          <p>
            <Trans>
              Set up and launch veNFT governance for your project using default
              veBanny assets and parameters.
            </Trans>
          </p>
          <Button
            type="primary"
            size="small"
            onClick={launchVeBanny}
            loading={loading}
          >
            Launch veBanny
          </Button>
        </section>
        <Divider />
        {veNftCreatorEnabled && (
          <section>
            <h3>
              <Trans>Enable veNFT Governance</Trans>
            </h3>
            <p>
              <Trans>
                Set up and launch veNFT governance for your project using custom
                assets and parameters. (Experimental, does not currently launch)
              </Trans>
            </p>
            <Button
              type="primary"
              size="small"
              onClick={() => setSetupModalVisible(true)}
            >
              Launch Setup
            </Button>
          </section>
        )}
      </>
      {setupModalVisible && (
        <VeNftSetupModal
          visible={setupModalVisible}
          onCancel={() => setSetupModalVisible(false)}
        />
      )}
    </Space>
  )
}

export default VeNftEnableSection
