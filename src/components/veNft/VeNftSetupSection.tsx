import { Trans } from '@lingui/macro'
import { Button, Divider } from 'antd'
import { useContext, useState } from 'react'

import VeNftSetupModal from 'components/veNft/VeNftSetupModal'
import { useLaunchVeNftTx } from 'hooks/veNft/transactor/LaunchVeNftTx'
import { NetworkContext } from 'contexts/networkContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import {
  DEFAULT_LOCK_DURATIONS,
  VENFT_RESOLVER_ADDRESS,
} from 'constants/veNft/veNftProject'

const VeNftSetupSection = () => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const { tokenSymbol } = useContext(V2ProjectContext)
  const [loading, setLoading] = useState(false)
  const [setupModalVisible, setSetupModalVisible] = useState(false)

  const launchVeBannyTx = useLaunchVeNftTx()

  const launchVeBanny = async () => {
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
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
