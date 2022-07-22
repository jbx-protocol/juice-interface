import { Trans } from '@lingui/macro'
import { Form, Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import Callout from 'components/Callout'

import { shadowCard } from 'constants/styles/shadowCard'

const VeNftStakingForm = () => {
  const { theme } = useContext(ThemeContext)

  return (
    <Form layout="vertical" style={{ width: '100%' }}>
      <div style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}>
        <Space size="middle" direction="vertical">
          <Callout>
            <Trans>
              Only project tokens claimed as ERC-20 tokens can be staked for
              NFTs.
            </Trans>
          </Callout>
        </Space>
      </div>
    </Form>
  )
}

export default VeNftStakingForm
