import {
  EnvelopeIcon,
  PhotoIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { Callout } from 'components/Callout'
import EthereumAddress from 'components/EthereumAddress'
import ExternalLink from 'components/ExternalLink'
import { usePayProjectModal } from 'components/ProjectDashboard/hooks/usePayProjectModal'
import { JuiceModal } from 'components/modals/JuiceModal'
import { twMerge } from 'tailwind-merge'
import { CartItemBadge } from '../Cart/components/CartItem/CartItemBadge'

export const PayProjectModal: React.FC = () => {
  const { open, totalAmount, userAddress, setOpen } = usePayProjectModal()
  return (
    <JuiceModal
      className="w-full max-w-xl"
      buttonPosition="stretch"
      title={t`Pay PyroDAO`}
      position="top"
      okText={t`Pay 2.4 ETH`}
      open={open}
      setOpen={setOpen}
    >
      <div className="flex flex-col divide-y divide-grey-200 dark:divide-slate-500">
        <div className="flex justify-between gap-3 py-3">
          <span className="font-medium">
            <Trans>Total amount</Trans>
          </span>
          <span>{totalAmount}</span>
        </div>

        <div className="py-6">
          <span className="font-medium">
            <Trans>Receive</Trans>
          </span>
          <div className="mt-2 flex justify-between gap-3">
            <span className="text-grey-500 dark:text-slate-200">
              <Trans>
                NFTs, tokens and rewards will be sent to{' '}
                <EthereumAddress
                  className="text-grey-900 dark:text-slate-100"
                  address={userAddress}
                />
              </Trans>
            </span>
            <a role="button">
              <Trans>Edit</Trans>
            </a>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-grey-300" />
                <span className="ml-3">PYRO Token</span>
                <CartItemBadge className="ml-2">
                  <Trans>Token</Trans>
                </CartItemBadge>
              </div>
              <div>1,200,000</div>
            </div>
          </div>
        </div>

        <div className="py-6">
          <span className="font-medium">
            <Trans>Message (optional)</Trans>
          </span>
          <div>
            <Input
              className="mt-1.5"
              placeholder="Attach an on-chain message to this payment"
            />
          </div>
          <Button
            className="mt-3 flex items-center gap-2"
            type="dashed"
            icon={<PhotoIcon className="h-5 w-5" />}
          >
            <Trans>Add image</Trans>
          </Button>
          <Callout
            collapsible
            className="mt-6 border border-bluebs-100 bg-bluebs-25 text-bluebs-700 dark:border-bluebs-800 dark:bg-bluebs-950 dark:text-bluebs-400"
            iconComponent={<EnvelopeIcon className="h-6 w-6" />}
          >
            <div>
              <div className="font-medium text-bluebs-700 dark:text-bluebs-300">
                <Trans>Message from PyroDAO</Trans>
              </div>
              <p className="mt-2">
                Lorem ipsum dolor sit amet consectetur. Aliquam vitae turpis sit
                consequat ultricies facilisis phasellus tempor dignissim.
                Blandit pellentesque sit a duis gravida molestie scelerisque at
                tempor. Sit nunc volutpat pharetra in. Vitae viverra pretium
                amet odio egestas nibh lectus consectetur sem. Dictum eget
                imperdiet tortor nisi neque. Quis nibh sodales nec consectetur
                at.
              </p>
            </div>
          </Callout>
          <div className="mt-6 flex gap-2">
            <input type="checkbox" />
            <span>
              <Trans>
                I accept the{' '}
                <ExternalLink href="https://docs.juicebox.money/dev/learn/risks">
                  risks
                </ExternalLink>{' '}
                associated with the Juicebox protocol.
              </Trans>
            </span>
          </div>
        </div>
      </div>
    </JuiceModal>
  )
}

const Input: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between rounded-lg border border-grey-300 px-3 py-2 shadow-sm dark:border-slate-600',
        className,
      )}
    >
      <input
        {...props}
        className={twMerge(
          'flex-1 bg-transparent outline-none dark:placeholder:text-slate-300',
        )}
      />
      <Tooltip title="TODO">
        <QuestionMarkCircleIcon className="h-4 w-4 text-grey-400 dark:text-slate-200" />
      </Tooltip>
    </div>
  )
}
