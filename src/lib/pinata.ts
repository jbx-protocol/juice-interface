import pinataClient from '@pinata/sdk'

const PINATA_PINNER_KEY = process.env.PINATA_PINNER_KEY
const PINATA_PINNER_SECRET = process.env.PINATA_PINNER_SECRET

export const getPinata = () => {
  if (!PINATA_PINNER_KEY) {
    throw new Error('PINATA_PINNER_KEY is not set')
  }

  if (!PINATA_PINNER_SECRET) {
    throw new Error('PINATA_PINNER_SECRET is not set')
  }

  return pinataClient(PINATA_PINNER_KEY, PINATA_PINNER_SECRET)
}
