import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'

import moment from 'moment'

export const formatDate = (dateMillis: BigNumberish, format = 'M-D-YY h:mma') =>
  moment(BigNumber.from(dateMillis).toNumber()).format(format)

export const formatHistoricalDate = (dateMillis: BigNumberish) =>
  t`${moment(BigNumber.from(dateMillis).toNumber()).fromNow(true)} ago`
