import { Trans } from '@lingui/macro'
import { Button, Col, Form } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { floatingSaveContainerHeight } from './constants'

import DeployProjectButton from './DeployProjectButton'

export default function FloatingSaveButton({
  text,
  onClick,
}: {
  text?: string
  onClick?: VoidFunction
}) {
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
        height: floatingSaveContainerHeight,
        background: colors.background.l0,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0px -5px 17px 0px ' + colors.background.l1,
      }}
    >
      <Col xs={24} md={12} style={{ marginLeft: '3rem' }}>
        <Form.Item style={{ marginBottom: 0 }}>
          {/* If no text given, can assume it’s the last tab 
          in which case we want to show the review and deploy button */}
          {text ? (
            <Button
              htmlType="submit"
              type="primary"
              onClick={() => {
                if (onClick) onClick()
                window.scrollTo(0, 0)
              }}
            >
              <Trans>{text}</Trans>
            </Button>
          ) : (
            <DeployProjectButton />
          )}
        </Form.Item>
      </Col>
    </div>
  )
}
