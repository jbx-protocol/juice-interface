export const urlForIpfsHash = (hash: string | undefined) =>
  hash ? 'https://ipfs.infura.io/ipfs/' + hash : undefined
