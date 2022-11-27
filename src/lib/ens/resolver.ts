import { readProvider } from 'constants/readProvider'

export const resolveAddress = async (address: string) => {
  const name = await readProvider.lookupAddress(address)

  // Reverse lookup to check validity
  if (
    name &&
    (await readProvider.resolveName(name))?.toLowerCase() ===
      address.toLowerCase()
  ) {
    return name
  }
}
