import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'

import { Tooltip } from 'antd'

import moment from 'moment'

export const formatDate = (dateMillis: BigNumberish, format = 'M-D-YY h:mma') =>
  moment(BigNumber.from(dateMillis).toNumber()).format(format)

export function formatHistoricalDate(dateMillis: BigNumberish) {
  return (
    <Tooltip title={`${formatDate(dateMillis)} UTC`}>
      {t`${moment(BigNumber.from(dateMillis).toNumber()).fromNow(true)} ago`}
    </Tooltip>
  )
}
