import pinataClient from '@pinata/sdk'

const PINATA_PINNER_KEY = process.env.NEXT_PUBLIC_PINATA_PINNER_KEY
const PINATA_PINNER_SECRET = process.env.NEXT_PUBLIC_PINATA_PINNER_SECRET

export const getPinata = () => {
  if (!PINATA_PINNER_KEY) {
    throw new Error('PINATA_PINNER_KEY is not set')
  }

  if (!PINATA_PINNER_SECRET) {
    throw new Error('PINATA_PINNER_SECRET is not set')
  }

  return pinataClient(PINATA_PINNER_KEY, PINATA_PINNER_SECRET)
}

export const getPinnedListByTag = (tag: string) => {
  const pinata = getPinata()
  return pinata.pinList({
    pageLimit: 1000,
    status: 'pinned',
    metadata: {
      keyvalues: {
        tag: {
          value: tag,
          op: 'eq',
        },
      },
    },
  })
}
