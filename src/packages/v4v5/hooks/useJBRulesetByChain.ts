import {
  JBChainId
} from '@bananapus/nana-sdk-core'
import {
  useJBProjectId,
  useJBRuleset
} from '@bananapus/nana-sdk-react'

export function useJBRulesetByChain(chainId: JBChainId | undefined) {
  const { projectId } = useJBProjectId(chainId)
  return useJBRuleset({
    projectId,
    chainId,
  })
}
