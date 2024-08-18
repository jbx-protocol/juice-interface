import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import moment from 'moment'

export const formatDate = (dateMillis: number, format = 'YYYY-MM-DD h:mma') =>
  moment(dateMillis).format(format)

export const formatDateToUTC = (
  dateMillis: number,
  format = 'YYYY-MM-DD h:mma UTC',
) => moment(dateMillis).utc().format(format)

export function formatHistoricalDate(dateMillis: number) {
  return (
    <Tooltip title={`${formatDateToUTC(dateMillis)}`}>
      {t`${moment(dateMillis).fromNow(true)} ago`}
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
