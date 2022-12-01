import { DeleteOutlined } from '@ant-design/icons'
import { Plural, t, Trans } from '@lingui/macro'
import { Button, Col, Row, Tooltip } from 'antd'

import { SECONDS_IN_DAY } from 'constants/numbers'

export default function VeNftLockDurationOptionCard({
  lockDurationOption,
  onDelete,
}: {
  lockDurationOption: number
  onDelete: VoidFunction
}) {
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
      <Row className="flex w-full cursor-pointer border border-solid border-smoke-200 bg-smoke-25 py-4 pr-2 pl-5 dark:border-grey-600 dark:bg-slate-800">
        <Col className="flex flex-col justify-center" md={16}>
          <Row className="flex w-full items-center text-base">
            <Col className="text-haze-400 dark:text-haze-300 " md={7}></Col>
            <Col className="flex font-medium" md={15}>
              <span>{lockDurationOptionLabel()}</span>
            </Col>
          </Row>
        </Col>
        <Col md={5}></Col>
        <Col md={3}>
          <Tooltip title={<Trans>Delete Option</Trans>}>
            <Button
              className="float-right h-4"
              type="text"
              onClick={e => {
                onDelete()
                // prevent opening modal
                e.stopPropagation()
              }}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </Col>
      </Row>
    </>
  )
}
