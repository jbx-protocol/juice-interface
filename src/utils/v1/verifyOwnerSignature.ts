import useOwnerOfProject from 'hooks/v1/contractReader/OwnerOfProject'
import { verifyMessage } from 'ethers/lib/utils'
import { SignatureLike } from '@ethersproject/bytes'

export default function verifyV1OwnerSignature(
  projectId: number,
  message: string,
  signature: SignatureLike,
) {
  const projectOwnerAddress = useOwnerOfProject(projectId)
  const signatureAddress = verifyMessage(message, signature)

  return projectOwnerAddress === signatureAddress
}
