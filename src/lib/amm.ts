export const generateAMMLink = ({
  mode,
  baseLink,
  tokenAddress,
}: {
  mode: 'buy' | 'redeem'
  baseLink: string
  tokenAddress: string
}) => {
  switch (mode) {
    case 'buy':
      return `${baseLink}/swap?inputCurrency=ETH&outputCurrency=${tokenAddress}`
    case 'redeem':
      return `${baseLink}/swap?inputCurrency=${tokenAddress}&outputCurrency=ETH`
    default:
      break
  }
}
