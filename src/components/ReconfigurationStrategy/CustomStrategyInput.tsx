import { Trans } from '@lingui/macro'
import { Form, Input } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { constants } from 'ethers'

import { useWallet } from 'hooks/Wallet'
import { FormItemInput } from 'models/formItemInput'
import { NetworkName } from 'models/networkName'
import { MouseEventHandler } from 'react'
import { helpPagePath } from 'utils/routes'

export const CustomStrategyInput: React.FC<
  React.PropsWithChildren<
    FormItemInput<string> & { onClick?: MouseEventHandler }
  >
> = ({ value, onChange, onClick }) => {
  const { chain } = useWallet()
  return (
    <div>
      <Form.Item
        extra={
          <Trans>
            The address of a custom{' '}
            <ExternalLink
              onClick={e => e.stopPropagation()}
              href={helpPagePath(`/dev/learn/glossary/ballot/`)}
            >
              ballot smart contract
            </ExternalLink>{' '}
            deployed to {chain?.name ?? NetworkName.mainnet}.
          </Trans>
        }
      >
        <Input
          className="font-normal"
          value={value}
          placeholder={constants.AddressZero}
          onChange={e => onChange?.(e.target.value.toLowerCase())}
          onClick={onClick}
        />
      </Form.Item>
    </div>
  )
}
