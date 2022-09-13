import { BigNumber } from '@ethersproject/bignumber'
import { plural, t, Trans } from '@lingui/macro'
import { Form, InputNumber } from 'antd'
import { FormInstance } from 'rc-field-form'
import { useEffect } from 'react'
import { fromWad } from 'utils/format/formatNumber'

interface TokensStakedInputProps {
  form: FormInstance
  tokenBalance: BigNumber | undefined
  tokenSymbolDisplayText: string
  tokensStaked: number
  minTokensAllowedToStake: number
}

const TokensStakedInput = ({
  form,
  tokenBalance,
  tokenSymbolDisplayText,
  tokensStaked,
  minTokensAllowedToStake,
}: TokensStakedInputProps) => {
  const totalBalanceInWad = fromWad(tokenBalance)
  const unstakedTokens = totalBalanceInWad
    ? parseInt(totalBalanceInWad) - tokensStaked
    : 0

  useEffect(() => {
    minTokensAllowedToStake &&
      form.setFieldsValue({ tokensStaked: minTokensAllowedToStake.toString() })
  }, [minTokensAllowedToStake, form])

  const validateTokensStaked = () => {
    const tokensStaked = form.getFieldValue('tokensStaked')
    if (tokensStaked < minTokensAllowedToStake) {
      return Promise.reject(
        plural(minTokensAllowedToStake, {
          one: 'You must stake at least # token.',
          other: 'You must stake at least # tokens.',
        }),
      )
    }
    if (tokensStaked > parseInt(totalBalanceInWad)) {
      return Promise.reject(t`You don't have enough tokens to stake.`)
    }
    return Promise.resolve()
  }

  return (
    <Form.Item
      name="tokensStaked"
      label={<Trans>{tokenSymbolDisplayText} to lock</Trans>}
      rules={[
        {
          validator: validateTokensStaked,
        },
      ]}
      extra={
        <Trans>
          {unstakedTokens} {tokenSymbolDisplayText} remaining
        </Trans>
      }
    >
      <InputNumber
        name="tokensStaked"
        value={tokensStaked}
        min={0}
        style={{ width: '100%' }}
        onChange={val => {
          form.setFieldsValue({ tokensStaked: val })
        }}
      />
    </Form.Item>
  )
}

export default TokensStakedInput
