/**
 * Produce payment memo with the following schema:
 * <text memo> <NFTs> <sticker URLs>  <uploaded image URL>
 */
export const buildPaymentMemo = ({
  text = '',
  imageUrl,
  stickerUrls,
  nftUrls,
}: {
  text?: string
  imageUrl?: string
  stickerUrls?: string[]
  nftUrls?: string[]
}) => {
  let memo = `${text}`

  if (nftUrls?.length) {
    memo += `\n${nftUrls.join(' ')}`
  }

  if (stickerUrls?.length) {
    memo += `\n${stickerUrls.join(' ')}`
  }

  if (imageUrl) {
    memo += `\n${imageUrl}`
  }

  return memo
}
