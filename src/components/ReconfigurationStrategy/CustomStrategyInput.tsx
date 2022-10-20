import * as constants from '@ethersproject/constants'
import { Trans } from '@lingui/macro'
import { Form, Input } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { useWallet } from 'hooks/Wallet'
import { FormItemInput } from 'models/formItemInput'
import { MouseEventHandler } from 'react'

export const CustomStrategyInput: React.FC<
  FormItemInput<string> & { onClick?: MouseEventHandler }
> = ({ value, onChange, onClick }) => {
  const { chain } = useWallet()
  return (
    <div>
      <Form.Item
        extra={
          <Trans>
            The address of any smart contract deployed on{' '}
            {chain?.name ?? 'mainnet'} that implements{' '}
            <ExternalLink
              onClick={e => e.stopPropagation()}
              href="https://github.com/jbx-protocol/juice-contracts-v1/blob/main/contracts/FundingCycles.sol"
            >
              this interface
            </ExternalLink>
            .
          </Trans>
        }
      >
        <Input
          style={{ maxWidth: 400 }}
          value={value}
          placeholder={constants.AddressZero}
          onChange={e => onChange?.(e.target.value.toLowerCase())}
          onClick={onClick}
        />
      </Form.Item>
    </div>
  )
}
