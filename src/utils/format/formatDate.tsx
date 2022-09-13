import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'

import { Tooltip } from 'antd'

import moment from 'moment'

export const formatDate = (
  dateMillis: BigNumberish,
  format = 'YYYY-MM-DD h:mma',
) => moment(BigNumber.from(dateMillis).toNumber()).format(format)

export const formatDateToUTC = (
  dateMillis: BigNumberish,
  format = 'YYYY-MM-DD h:mma UTC',
) => moment(BigNumber.from(dateMillis).toNumber()).utc().format(format)

export function formatHistoricalDate(dateMillis: BigNumberish) {
  return (
    <Tooltip title={`${formatDateToUTC(dateMillis)}`}>
      {t`${moment(BigNumber.from(dateMillis).toNumber()).fromNow(true)} ago`}
    </Tooltip>
  )
}

/**
 * Convert a date to Epoch time in seconds.
 * @param date
 * @returns Epoch time in seconds
 */
export const toDateSeconds = (date: Date) => {
  return Math.floor(date.valueOf() / 1000)
}
