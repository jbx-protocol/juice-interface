import { t, Trans } from '@lingui/macro'
import { Divider, Space } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import { ReactNode, useMemo } from 'react'
import { formatAmount } from 'utils/formatAmount'
import { formatBoolean } from 'utils/formatBoolean'
import * as ProjectTokenForm from '../../hooks/ProjectTokenForm'

export const DefaultSettings: React.FC = () => {
  const data: Record<string, { data: string; tooltip: ReactNode }> = useMemo(
    () => ({
      [t`Initial mint rate`]: {
        data: `${formatAmount(
          ProjectTokenForm.DefaultSettings.initialMintRate,
        )} tokens / ETH`,
        tooltip: (
          <Trans>
            Tokens <strong>contributors will receive</strong> when they
            contribute 1 ETH.
          </Trans>
        ),
      },
      [t`Reserved rate`]: {
        data: `${ProjectTokenForm.DefaultSettings.reservedTokensPercentage}%`,
        tooltip: (
          <Trans>
            Tokens <strong>reserved for the project</strong> when 1 ETH is
            contributed.
          </Trans>
        ),
      },
      [t`Discount rate`]: {
        data: `${ProjectTokenForm.DefaultSettings.discountRate}%`,
        tooltip: (
          <Trans>
            Contributors will receive <strong>no extra tokens</strong> this
            funding cycle.
          </Trans>
        ),
      },
      [t`Redemption rate`]: {
        data: `${ProjectTokenForm.DefaultSettings.redemptionRate}%`,
        tooltip: (
          <Trans>
            Determines the <strong>amount of overflow</strong> each token can be
            redeemed for.
          </Trans>
        ),
      },
      [t`Token minting`]: {
        data: formatBoolean(ProjectTokenForm.DefaultSettings.tokenMinting),
        tooltip: (
          <Trans>
            The project owner <strong>cannot manually mint</strong> any amount
            of tokens to any address.
          </Trans>
        ),
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
            <Space size="small">
              <TooltipLabel label={key} tip={tooltip} />
            </Space>
            <span>{text}</span>
          </div>
          {i < Object.entries(data).length - 1 && <Divider className="my-4" />}
        </div>
      ))}
    </>
  )
}
