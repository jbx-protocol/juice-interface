import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'

export function LegacyProjectTokensDescriptionHeading() {
  return (
    <span className="flex items-center gap-1">
      <Trans>Legacy balance</Trans>
      <TooltipIcon
        tip={
          <Trans>
            Your total token balance for this project's legacy tokens (V1 or V2
            tokens).
          </Trans>
        }
      />
    </span>
  )
}
