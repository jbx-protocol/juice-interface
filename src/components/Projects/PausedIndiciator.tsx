import React from 'react'

import { Tooltip } from 'antd'
import { t } from '@lingui/macro'
import { V1TerminalVersion } from 'models/v1/terminals'
import { BigNumber } from 'ethers'
import { getTerminalName } from 'utils/v1/terminals'
import { paymentsPaused } from 'utils/paymentsPaused'
import { PauseCircleOutlined } from '@ant-design/icons'

import useCurrentFundingCycleOfProject from 'hooks/v1/contractReader/CurrentFundingCycleOfProject'

export default function PausedIndicator({
  projectId,
  terminalVersion,
}: {
  projectId?: BigNumber
  terminalVersion?: V1TerminalVersion
}) {
  console.log('rendering paused indicator')
  const terminalName = getTerminalName({
    version: terminalVersion,
  })
  // Gets the current FC so we can get projectPaymentsPaused
  const currentFC = useCurrentFundingCycleOfProject(projectId, terminalName)
  const projectPaymentsPaused = paymentsPaused(
    projectId,
    currentFC,
    terminalVersion,
  )

  if (projectPaymentsPaused) {
    return (
      <React.Fragment>
        <Tooltip title={t`Payments are paused`}>
          <PauseCircleOutlined />
        </Tooltip>
      </React.Fragment>
    )
  }
  return null
}
