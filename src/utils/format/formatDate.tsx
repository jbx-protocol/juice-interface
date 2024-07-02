import { t } from '@lingui/macro'

import { Tooltip } from 'antd'

import moment from 'moment'
import { BigintIsh } from 'utils/bigNumbers'

export const formatDate = (
  dateMillis: BigintIsh,
  format = 'YYYY-MM-DD h:mma',
) => moment(Number(dateMillis)).format(format)

export const formatDateToUTC = (
  dateMillis: BigintIsh,
  format = 'YYYY-MM-DD h:mma UTC',
) => moment(Number(dateMillis)).utc().format(format)

export function formatHistoricalDate(dateMillis: BigintIsh) {
  return (
    <Tooltip title={`${formatDateToUTC(dateMillis)}`}>
      {t`${moment(Number(dateMillis)).fromNow(true)} ago`}
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
