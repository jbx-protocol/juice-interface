import { t, Trans } from '@lingui/macro'
import { Divider, Modal, ModalProps } from 'antd'
import { useMemo } from 'react'
import { formatAmount } from 'utils/formatAmount'
import { formatBoolean } from 'utils/formatBoolean'
import * as ProjectTokenForm from '../../hooks/ProjectTokenForm'

export const DefaultSettingsModal: React.FC<ModalProps> = props => {
  const data: Record<string, string> = useMemo(
    () => ({
      [t`Initial mint rate`]: `${formatAmount(
        ProjectTokenForm.DefaultSettings.initialMintRate,
      )} tokens / ETH`,
      [t`Reserved rate`]: `${ProjectTokenForm.DefaultSettings.reservedTokensPercentage}%`,
      [t`Discount rate`]: `${ProjectTokenForm.DefaultSettings.discountRate}%`,
      [t`Redemption rate`]: `${ProjectTokenForm.DefaultSettings.redemptionRate}%`,
      [t`Token minting`]: formatBoolean(
        ProjectTokenForm.DefaultSettings.tokenMinting,
      ),
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
      {Object.entries(data).map(([key, value], i) => (
        <>
          {i === 0 && <Divider style={{ margin: '0  0 1rem' }} />}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{key}</span>
            <span>{value}</span>
          </div>
          <Divider style={{ margin: '1rem 0' }} />
        </>
      ))}
    </Modal>
  )
}
