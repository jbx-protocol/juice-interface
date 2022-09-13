/**
 * Produce payment memo with the following schema:
 * <text memo> <sticker URLs> <uploaded image URL>
 */
export const buildPaymentMemo = ({
  text = '',
  imageUrl,
  stickerUrls,
}: {
  text?: string
  imageUrl?: string
  stickerUrls?: string[]
}) => {
  let memo = `${text}`

  if (stickerUrls?.length) {
    memo += `\n${stickerUrls.join(' ')}`
  }

  if (imageUrl) {
    memo += `\n${imageUrl}`
  }

  return memo
}
