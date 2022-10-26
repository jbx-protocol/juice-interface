const IPFS_OPEN_GATEWAY_HOSTNAME = 'jbx-open.mypinata.cloud' // restricted to juicebox.money domains.
const PINATA_PUBLIC_GATEWAY_HOSTNAME = 'gateway.pinata.cloud' // heavily rate-limited, shouldn't be used.

export const DEFAULT_PINATA_GATEWAY =
  process.env.NODE_ENV === 'development'
    ? PINATA_PUBLIC_GATEWAY_HOSTNAME
    : IPFS_OPEN_GATEWAY_HOSTNAME
export const IPFS_GATEWAY_HOSTNAME =
  process.env.NEXT_PUBLIC_PINATA_GATEWAY_HOSTNAME || DEFAULT_PINATA_GATEWAY
