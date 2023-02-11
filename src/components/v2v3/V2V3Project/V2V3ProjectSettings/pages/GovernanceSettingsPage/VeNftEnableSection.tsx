import { t, Trans } from '@lingui/macro'
import { Button, Divider, Space } from 'antd'
import { useWallet } from 'hooks/Wallet'
import { useContext, useState } from 'react'

import VeNftSetupModal from 'components/veNft/VeNftSetupModal'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useLaunchVeNftTx } from 'hooks/veNft/transactor/LaunchVeNftTx'

import { featureFlagEnabled } from 'utils/featureFlags'

import {
  DEFAULT_LOCK_DURATIONS,
  VENFT_RESOLVER_ADDRESS,
} from 'constants/contracts/goerli/veNftProject'

import FormattedAddress from 'components/FormattedAddress'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { VeNftContext } from 'contexts/VeNft/VeNftContext'
import { emitSuccessNotification } from 'utils/notifications'

const VeNftEnableSection = () => {
  const { isConnected, connect } = useWallet()
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const { contractAddress: veNftContractAddress } = useContext(VeNftContext)
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
          emitSuccessNotification(
            t`VeNFT contract created successfully. Results will be indexed in a few moments.`,
          )
          setLoading(false)
        },
      },
    )

    if (!txSuccess) {
      setLoading(false)
    }
  }

  return (
    <Space direction="vertical" size="large" className="w-full">
      <>
        <section>
          {!veNftContractAddress ? (
            <>
              <h3>
                <Trans>Enable veNFT Governance</Trans>
              </h3>
              <p>
                <Trans>
                  Set up and launch veNFT governance for your project using
                  default veBanny assets and parameters.
                </Trans>
              </p>
              <Button type="primary" onClick={launchVeBanny} loading={loading}>
                <Trans>Enable veNFT</Trans>
              </Button>
            </>
          ) : (
            <>
              <h3>
                <Trans>veNFT Governance Enabled</Trans>
              </h3>
              <p>
                <span>
                  <Trans>Contract address:</Trans>{' '}
                  <FormattedAddress address={veNftContractAddress} />
                </span>
              </p>
            </>
          )}
        </section>
        {veNftCreatorEnabled && (
          <>
            <Divider />
            <section>
              <h3>
                <Trans>Enable veNFT Governance</Trans>
              </h3>
              <p>
                <Trans>
                  Set up and launch veNFT governance for your project using
                  custom assets and parameters. (Experimental, does not
                  currently launch)
                </Trans>
              </p>
              <Button type="primary" onClick={() => setSetupModalVisible(true)}>
                Launch Setup
              </Button>
            </section>
          </>
        )}
      </>
      {setupModalVisible && (
        <VeNftSetupModal
          open={setupModalVisible}
          onCancel={() => setSetupModalVisible(false)}
        />
      )}
    </Space>
  )
}

export default VeNftEnableSection
