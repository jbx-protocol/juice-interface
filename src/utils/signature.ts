import { verifyMessage } from '@ambire/signature-validator'
import { JsonRpcSigner } from '@ethersproject/providers'
import { readProvider } from 'constants/readProvider'

export const verifyWallet = async (signer: JsonRpcSigner, message: string) => {
  if (!signer || !message) {
    return
  }
  const signature = await signer.signMessage(message)
  return signature
}

export const verifySignature = async (
  signer: string,
  message: string,
  signature: string,
) => {
  const isValidSig = await verifyMessage({
    signer,
    message,
    signature,
    provider: readProvider,
  })
  return isValidSig
}
