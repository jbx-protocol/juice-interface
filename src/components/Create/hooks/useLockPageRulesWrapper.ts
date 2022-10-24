import { Rule, RuleObject } from 'antd/lib/form'
import { useCallback, useContext } from 'react'
import { PageContext } from '../components/Wizard/contexts/PageContext'

/**
 * A hook that returns a function wrapper that wraps all rules in a array and
 * soft locks the page if any of the rules fail.
 */
export const useLockPageRulesWrapper = () => {
  const { lockPageProgress, unlockPageProgress } = useContext(PageContext)

  const ruleWrapper = useCallback(
    (rule: Rule) => {
      return {
        ...rule,
        validator: async (r: RuleObject, v: unknown) => {
          if (typeof rule === 'function') {
            throw new Error('Unsupported use of RuleRender')
          }
          try {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            const validator = await rule.validator?.(r, v, () => {})
            unlockPageProgress?.()
            return validator
          } catch (e) {
            lockPageProgress?.()
            throw e
          }
        },
      }
    },
    [lockPageProgress, unlockPageProgress],
  )

  return useCallback((rules: Rule[]) => rules.map(ruleWrapper), [ruleWrapper])
}
