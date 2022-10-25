import { t, Trans } from '@lingui/macro'
import { Divider, Modal, ModalProps, Space } from 'antd'
import TooltipLabel from 'components/TooltipLabel'
import { ReactNode, useMemo } from 'react'
import { formatAmount } from 'utils/formatAmount'
import { formatBoolean } from 'utils/formatBoolean'
import * as ProjectTokenForm from '../../hooks/ProjectTokenForm'

export const DefaultSettingsModal: React.FC<ModalProps> = props => {
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
    <Modal
      {...props}
      title={
        <div className="wizard-create">
          <h2>
            <Trans>Default Token Settings</Trans>
          </h2>
        </div>
      }
      cancelButtonProps={{ style: { display: 'none' } }}
      okText={t`Close`}
      destroyOnClose
    >
      {Object.entries(data).map(([key, { data, tooltip }], i) => (
        <>
          {i === 0 && <Divider style={{ margin: '0  0 1rem' }} />}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space size="small">
              <TooltipLabel label={key} tip={tooltip} />
            </Space>
            <span>{data}</span>
          </div>
          <Divider style={{ margin: '1rem 0' }} />
        </>
      ))}
    </Modal>
  )
}
