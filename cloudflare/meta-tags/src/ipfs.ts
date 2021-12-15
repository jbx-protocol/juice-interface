const getIpfsCidUrl = (hash: string): string =>
  'https://jbx.mypinata.cloud/ipfs/' + hash

export type ProjectMetadata = Partial<{
  name: string
  description: string
  logoUri: string
  infoUri: string
}>

export const fetchProjectMetadata = async (
  uriHash: string,
): Promise<ProjectMetadata> => {
  const url = getIpfsCidUrl(uriHash)
  const response = await fetch(url)
  return await response.json()
}
