import { Trans } from '@lingui/macro'
import { Button, Col, Form } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'

import { formActionBarContainerHeight } from './constants'
import DeployProjectButton from './DeployProjectButton'

export default function FormActionbar({
  children,
  isLastTab = false,
}: PropsWithChildren<{
  isLastTab?: boolean
}>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        height: formActionBarContainerHeight,
        background: colors.background.l0,
        display: 'flex',
        alignItems: 'center',
        zIndex: 1,
        boxShadow: '0px -5px 17px 0px ' + colors.background.l1,
      }}
    >
      <Col xs={24} md={12} style={{ marginLeft: '4rem' }}>
        <Form.Item style={{ marginBottom: 0 }}>
          {!isLastTab && (
            <Button
              htmlType="submit"
              type="primary"
              style={{ marginRight: '1rem' }}
            >
              {children ?? <Trans>Save and continue</Trans>}
            </Button>
          )}

          <DeployProjectButton type={isLastTab ? 'primary' : 'default'} />
        </Form.Item>
      </Col>
    </div>
  )
}
