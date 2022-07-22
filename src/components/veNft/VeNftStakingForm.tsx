import { Trans } from '@lingui/macro'
import { Form, Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { shadowCard } from 'constants/styles/shadowCard'

const VeNftStakingForm = () => {
  const { theme } = useContext(ThemeContext)

  return (
    <Form layout="vertical" style={{ width: '100%' }}>
      <div style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}>
        <Space size="middle" direction="vertical">
          <h4>
            <Trans>
              Currently, only project tokens claimed as ERC-20 tokens can be
              staked for NFTs.
            </Trans>
          </h4>
        </Space>
      </div>
    </Form>
  )
}

export default VeNftStakingForm
