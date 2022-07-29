import { Button, Col, Row, Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Plural, t, Trans } from '@lingui/macro'

import { SECONDS_IN_DAY } from 'constants/numbers'

export default function VeNftLockDurationOptionCard({
  lockDurationOption,
  onDelete,
}: {
  lockDurationOption: number
  onDelete: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const lockDurationOptionInDays = lockDurationOption / SECONDS_IN_DAY
  const lockDurationOptionLabel = () => {
    if (lockDurationOption > SECONDS_IN_DAY) {
      return (
        <Trans>
          {lockDurationOptionInDays}{' '}
          <Plural
            value={lockDurationOptionInDays}
            one={t`Day`}
            other={t`Days`}
          />
        </Trans>
      )
    } else {
      return (
        <Trans>
          {lockDurationOption}{' '}
          <Plural
            value={lockDurationOption}
            one={t`Second`}
            other={t`Seconds`}
          />
        </Trans>
      )
    }
  }
  return (
    <>
      <Row
        style={{
          background: colors.background.l0,
          border: `1px solid ${colors.stroke.tertiary}`,
          display: 'flex',
          width: '100%',
          cursor: 'pointer',
          padding: '15px 8px 15px 20px',
        }}
      >
        <Col
          md={16}
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Row
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 17,
              width: '100%',
            }}
          >
            <Col style={{ color: colors.text.action.primary }} md={7}></Col>
            <Col style={{ display: 'flex', fontWeight: 500 }} md={15}>
              <span>{lockDurationOptionLabel()}</span>
            </Col>
          </Row>
        </Col>
        <Col md={5}></Col>
        <Col md={3}>
          <Tooltip title={<Trans>Delete Option</Trans>}>
            <Button
              type="text"
              onClick={e => {
                onDelete()
                // prevent opening modal
                e.stopPropagation()
              }}
              icon={<DeleteOutlined />}
              style={{ height: 16, float: 'right' }}
            />
          </Tooltip>
        </Col>
      </Row>
    </>
  )
}
