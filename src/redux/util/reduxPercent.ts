export const toReduxPercent = (percent: number) => (percent * 100).toString()
export const fromReduxPercent = (percent: string) => parseFloat(percent) / 100
