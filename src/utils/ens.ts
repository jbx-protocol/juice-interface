const STAMP_FYI_BASE_URL = 'https://cdn.stamp.fyi'

export function ensAvatarUrlForAddress(
  address: string,
  { size }: { size?: number } = {},
) {
  let url = `${STAMP_FYI_BASE_URL}/avatar/${address}`
  if (size) {
    url += `?s=${size}`
  }
  return url
}
