import { Col, Row, Button, Collapse, Space } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { LogoutOutlined } from '@ant-design/icons'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

import React, { useContext, useState } from 'react'
import { Trans } from '@lingui/macro'

import EtherscanLink from 'components/shared/EtherscanLink'

import Wallet from './Wallet'

export default function Account() {
  const { userAddress, signingProvider, onSelectWallet, onLogOut } =
    useContext(NetworkContext)

  const [activeKey, setActiveKey] = useState<0 | undefined>()

  const disconnectBtn = () => {
    return (
      <Button onClick={onLogOut} className="nav-dropdown-item">
        <LogoutOutlined />
        <div style={{ margin: '0 0 2px 13px' }}>
          <Trans>Disconnect</Trans>
        </div>
      </Button>
    )
  }

  return (
    <div className="accountDropdown">
      <Row gutter={10} align="middle">
        {!signingProvider ? (
          <div style={{ marginLeft: 15 }}>
            <Button onClick={onSelectWallet}>
              <Trans>Connect</Trans>
            </Button>
          </div>
        ) : (
          <React.Fragment>
            {userAddress && (
              <div style={{ marginTop: 0 }}>
                <Collapse style={{ border: 'none' }} activeKey={activeKey}>
                  <CollapsePanel
                    style={{
                      border: 'none',
                    }}
                    key={0}
                    showArrow={false}
                    header={
                      <Space
                        onClick={e => {
                          setActiveKey(activeKey === 0 ? undefined : 0)
                          e.stopPropagation()
                        }}
                      >
                        <Col>
                          <Wallet userAddress={userAddress}></Wallet>
                        </Col>
                      </Space>
                    }
                  >
                    <EtherscanLink
                      value={userAddress}
                      type="address"
                      showText={true}
                    />
                    {disconnectBtn()}
                  </CollapsePanel>
                </Collapse>
              </div>
            )}
          </React.Fragment>
        )}
      </Row>
    </div>
  )
}
