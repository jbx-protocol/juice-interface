import * as ProjectTokenForm from '../hooks/useProjectTokenForm'

import {
    CASH_OUT_TAX_RATE_EXPLANATION,
    DISCOUNT_RATE_EXPLANATION,
    MINT_RATE_EXPLANATION,
    OWNER_MINTING_EXPLANATION,
    RESERVED_RATE_EXPLANATION,
} from 'components/strings'
import { ReactNode, useMemo } from 'react'

import { t } from '@lingui/macro'
import { Divider } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import { formatAmount } from 'utils/format/formatAmount'
import { formatBoolean } from 'utils/format/formatBoolean'

export const DefaultSettings: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const data: Record<string, { data: string; tooltip: ReactNode }> = useMemo(
    () => ({
      [t`Total issuance rate`]: {
        data: `${formatAmount(
          ProjectTokenForm.DefaultSettings.initialMintRate,
        )} tokens / ETH`,
        tooltip: MINT_RATE_EXPLANATION,
      },
      [t`Reserved percent`]: {
        data: `${ProjectTokenForm.DefaultSettings.reservedTokensPercentage}%`,
        tooltip: RESERVED_RATE_EXPLANATION,
      },
      [t`Issuance cut percent`]: {
        data: `${ProjectTokenForm.DefaultSettings.discountRate}%`,
        tooltip: DISCOUNT_RATE_EXPLANATION,
      },
      [t`Cash out tax rate`]: {
        data: `${ProjectTokenForm.DefaultSettings.redemptionRate}%`,
        tooltip: CASH_OUT_TAX_RATE_EXPLANATION,
      },
      [t`Owner token minting`]: {
        data: formatBoolean(ProjectTokenForm.DefaultSettings.tokenMinting),
        tooltip: OWNER_MINTING_EXPLANATION,
      },
    }),
    [],
  )
  return (
    <>
      {Object.entries(data).map(([key, { data: text, tooltip }], i) => (
        <div key={key}>
          {i === 0 && <Divider className="m-0 mb-4" />}
          <div className="flex justify-between">
            <TooltipLabel label={key} tip={tooltip} />
            <span>{text}</span>
          </div>
          {i < Object.entries(data).length - 1 && <Divider className="my-4" />}
        </div>
      ))}
    </>
  )
}
