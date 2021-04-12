import moment from 'moment'

export const formatDate = (dateMillis: number, format = 'M-DD-YYYY h:mma') =>
  moment(dateMillis).format(format)
