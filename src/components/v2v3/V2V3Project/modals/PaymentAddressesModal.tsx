import { plural, t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import CopyTextButton from 'components/buttons/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import TooltipLabel from 'components/TooltipLabel'
import useMobile from 'hooks/Mobile'
import { ETHERC20ProjectPayer } from 'models/subgraph-entities/v2/eth-erc20-project-payer'
import { isZeroAddress } from 'utils/address'

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
      title={t`Project payer addresses`}
      okButtonProps={{ hidden: true }}
    >
      <Trans>
        Any ETH sent to these project payer addresses will be forwarded to the
        project. This makes it easier to pay the project from third-party tools.
      </Trans>
      {projectPayers?.length ? (
        <div className="flex flex-col gap-2">
          {projectPayers.map(p => (
            <div
              className="mb-2 border border-smoke-200 p-2 font-medium text-grey-500 dark:border-grey-600 dark:text-grey-300"
              key={p.address}
            >
              <div className="flex flex-col gap-2">
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
                        ? t`Payments made through this address won't mint this project's tokens.`
                        : t`Payments made through this address will mint this project's tokens.`
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
                          Project tokens will be minted to this beneficiary
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
                      tip={t`Project tokens will be minted to the address that made the payment.`}
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
                      tip={t`Project tokens will be minted as ERC-20 tokens by default, incurring slightly higher gas fees.`}
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
                        tip={t`Memos appear on the project's activity feed when a payment is made through this address.`}
                        label={t`Memo`}
                      />
                      :
                    </span>
                    <div className="max-w-[75%] text-right md:max-w-[385px]">
                      "{p.memo}"
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {projectPayers ? (
        <div className="mt-5 text-center text-grey-400 dark:text-slate-200">
          {plural(projectPayers.length, {
            one: '# project payer address',
            other: '# project payer addresses',
          })}
        </div>
      ) : null}
    </Modal>
  )
}
