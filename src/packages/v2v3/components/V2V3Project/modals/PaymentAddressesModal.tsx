import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { plural, t, Trans } from '@lingui/macro'
import { Modal, Tooltip } from 'antd'
import CopyTextButton from 'components/buttons/CopyTextButton'
import { Callout } from 'components/Callout/Callout'
import EthereumAddress from 'components/EthereumAddress'
import EtherscanLink from 'components/EtherscanLink'
import TooltipLabel from 'components/TooltipLabel'
import { Etherc20ProjectPayersQuery } from 'generated/graphql'
import useMobile from 'hooks/useMobile'
import { isZeroAddress } from 'utils/address'
import { formatBoolean } from 'utils/format/formatBoolean'

export function PaymentAddressesModal({
  open,
  onCancel,
  projectPayers,
}: {
  open: boolean | undefined
  onCancel: VoidFunction | undefined
  projectPayers: Etherc20ProjectPayersQuery['etherc20ProjectPayers'] | undefined
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
      <p>
        <Trans>
          Any ETH sent to these project payer addresses will be forwarded to the
          project. This makes it easier to pay the project from third-party
          tools.
        </Trans>
      </p>

      {projectPayers?.length ? (
        <div className="flex flex-col gap-2">
          {projectPayers.map(p => (
            <div
              className="mb-2 rounded-lg bg-smoke-100 p-5 dark:bg-slate-500"
              key={p.address}
            >
              <div className="flex flex-col gap-2">
                <div className="my-2 flex items-center gap-x-2 text-base font-medium text-black dark:text-slate-100">
                  <EtherscanLink
                    value={p.address}
                    type={'address'}
                    truncated={isMobile}
                    truncateTo={8}
                  />
                  <CopyTextButton value={p.address} />
                </div>

                {!p.preferAddToBalance ? (
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
                          <EthereumAddress
                            address={p.beneficiary}
                            className="font-medium"
                          />
                        }
                      />
                    ) : (
                      <TooltipLabel
                        tip={t`Project tokens will be minted to the address that made the payment.`}
                        label={
                          <span className="font-medium">
                            <Trans>Payer's address</Trans>
                          </span>
                        }
                      />
                    )}
                  </div>
                ) : null}

                {p.preferClaimedTokens ? (
                  <div className="flex justify-between">
                    <span>
                      <Trans>Mints tokens as ERC-20:</Trans>
                    </span>
                    <TooltipLabel
                      tip={t`Project tokens will be minted as ERC-20 tokens by default, incurring slightly higher gas fees.`}
                      label={
                        <span className="font-medium capitalize">
                          {formatBoolean(p.preferClaimedTokens)}
                        </span>
                      }
                    />
                  </div>
                ) : null}

                {p.memo && p.memo.length > 0 ? (
                  <Tooltip
                    title={t`Memos appear on the project's activity feed when a payment is made through this address.`}
                  >
                    <div>
                      <Callout
                        className="bg-smoke-300 dark:bg-slate-400"
                        iconComponent={<EnvelopeIcon className="h-5 w-5" />}
                      >
                        {p.memo}
                      </Callout>
                    </div>
                  </Tooltip>
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
