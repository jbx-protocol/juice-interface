import useProjectOwner from 'hooks/v2v3/contractReader/ProjectOwner'
import { verifyMessage } from 'ethers/lib/utils'
import { SignatureLike } from '@ethersproject/bytes'

export default function verifyV2V3OwnerSignature(
  projectId: number,
  message: string,
  signature: SignatureLike,
) {
  const { data: projectOwnerAddress } = useProjectOwner(projectId)
  const signatureAddress = verifyMessage(message, signature)

  return projectOwnerAddress === signatureAddress
}
