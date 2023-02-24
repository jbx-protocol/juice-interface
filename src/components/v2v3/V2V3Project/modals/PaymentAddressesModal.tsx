import { plural, t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import CopyTextButton from 'components/buttons/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import TooltipLabel from 'components/TooltipLabel'
import useMobile from 'hooks/Mobile'
import { ETHERC20ProjectPayer } from 'models/subgraph-entities/v2/eth-erc20-project-payer'
import { isZeroAddress } from 'utils/address'
import { classNames } from 'utils/classNames'

export function PaymentAddressesModal({
  open,
  onCancel,
  projectPayers,
}: {
  open: boolean | undefined
  onCancel: VoidFunction | undefined
  projectPayers:
    | Pick<
        ETHERC20ProjectPayer,
        | 'address'
        | 'beneficiary'
        | 'memo'
        | 'preferAddToBalance'
        | 'preferClaimedTokens'
      >[]
    | undefined
}) {
  const isMobile = useMobile()

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      cancelText="Done"
      title={t`Payment Addresses`}
      okButtonProps={{ hidden: true }}
    >
      {projectPayers?.length ? (
        <Space direction="vertical" className="w-full">
          {projectPayers.map(p => (
            <div
              className="mb-2 border border-solid border-smoke-200 p-2 font-medium text-grey-500 dark:border-grey-600 dark:text-grey-300"
              key={p.address}
            >
              <Space direction="vertical" className="w-full">
                <div className="my-2 flex items-center text-base font-medium text-black dark:text-slate-100">
                  <span className="underline">
                    <EtherscanLink
                      value={p.address}
                      type={'address'}
                      truncated={isMobile ? true : false}
                      truncateTo={isMobile ? 8 : undefined}
                    />
                  </span>{' '}
                  <CopyTextButton value={p.address} />
                </div>
                <div className="flex justify-between">
                  <span>
                    <Trans>Mints tokens:</Trans>
                  </span>
                  <TooltipLabel
                    tip={
                      p.preferAddToBalance
                        ? t`Payments to this project won't mint new project tokens.`
                        : t`Payments to this project will mint new project tokens.`
                    }
                    label={
                      <span className="capitalize">
                        {(!p.preferAddToBalance).toString()}
                      </span>
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <Trans>Token beneficiary:</Trans>
                  {!isZeroAddress(p.beneficiary) ? (
                    <TooltipLabel
                      tip={
                        <Trans>
                          When the Payment Address receives a payment, project
                          tokens will be minted to this token beneficiary
                          address. The address that made the payment{' '}
                          <strong>won't receive any project tokens.</strong>
                        </Trans>
                      }
                      label={
                        <FormattedAddress
                          address={p.beneficiary}
                          truncateTo={3}
                        />
                      }
                    />
                  ) : (
                    <TooltipLabel
                      tip={t`New project tokens will be minted to the address that made the payment.`}
                      label={t`Default`}
                    />
                  )}
                </div>
                {p.preferClaimedTokens ? (
                  <div className="flex justify-between">
                    <span>
                      <Trans>Mints tokens as ERC-20:</Trans>
                    </span>
                    <TooltipLabel
                      tip={t`New project tokens are minted as ERC-20 tokens by default. Payments to this Payment Address will incur a higher gas fee than regular Juicebox payments.`}
                      label={
                        <span className="capitalize">
                          {p.preferClaimedTokens.toString()}
                        </span>
                      }
                    />
                  </div>
                ) : null}
                {p?.memo?.length ? (
                  <div className="flex justify-between">
                    <span>
                      <TooltipLabel
                        tip={t`Memos appear on the project's activity feed when the Payment Address receives a payment.`}
                        label={t`Memo`}
                      />
                      :
                    </span>
                    <div
                      className={classNames(
                        'text-right',
                        isMobile ? 'max-w-[75%]' : 'max-w-[385px]',
                      )}
                    >
                      "{p.memo}"
                    </div>
                  </div>
                ) : null}
              </Space>
            </div>
          ))}
        </Space>
      ) : null}

      {projectPayers ? (
        <div className="mt-5 text-center text-grey-400 dark:text-slate-200">
          {plural(projectPayers.length, {
            one: '# Payment Address',
            other: '# Payment Addresses',
          })}
        </div>
      ) : null}
    </Modal>
  )
}
