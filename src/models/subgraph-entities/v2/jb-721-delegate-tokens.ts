import {
  parseParticipantJson,
  ParticipantJson,
  Participant,
} from '../vX/participant'

// TODO incomplete type, add the rest of the fields.
export interface JB721DelegateToken {
  tokenId: string
  address: string
  tokenUri: string
  owner: Partial<Participant>
}

export type JB721DelegateTokenJson = Partial<
  Record<Exclude<keyof JB721DelegateToken, 'owner'>, string> & {
    owner: ParticipantJson
  }
>

export const parseJB721DelegateTokens = (
  j: JB721DelegateTokenJson,
): Partial<JB721DelegateToken> => {
  return {
    tokenId: j.tokenId,
    address: j.address,
    owner: j.owner ? parseParticipantJson(j.owner) : undefined,
    tokenUri: j.tokenUri,
  }
}
