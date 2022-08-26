import { Trans } from '@lingui/macro'
import { Button, Divider, Space } from 'antd'
import { useContext, useState } from 'react'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useLaunchVeNftTx } from 'hooks/veNft/transactor/LaunchVeNftTx'

import FormattedAddress from 'components/FormattedAddress'

import {
  DEFAULT_LOCK_DURATIONS,
  VENFT_RESOLVER_ADDRESS,
} from 'constants/veNft/veNftProject'
import { useWallet } from 'hooks/Wallet'

const VeNftEnableSection = () => {
  const { chainUnsupported, isConnected, changeNetworks, connect } = useWallet()
  const {
    tokenSymbol,
    veNft: { contractAddress: veNftContractAddress },
  } = useContext(V2ProjectContext)
  const [loading, setLoading] = useState(false)

  const launchVeBannyTx = useLaunchVeNftTx()

  const launchVeBanny = async () => {
    if (chainUnsupported) {
      await changeNetworks()
      return
    }
    if (!isConnected) {
      await connect()
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
          {!veNftContractAddress ? (
            <Button
              type="primary"
              size="small"
              onClick={launchVeBanny}
              loading={loading}
            >
              <Trans>Launch veBanny</Trans>
            </Button>
          ) : (
            <span>
              <Trans>Contract address:</Trans>{' '}
              <FormattedAddress address={veNftContractAddress} />
            </span>
          )}
        </section>
        <Divider />
      </>
    </Space>
  )
}

export default VeNftEnableSection
