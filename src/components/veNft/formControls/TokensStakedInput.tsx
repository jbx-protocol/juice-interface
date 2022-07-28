import { plural, t, Trans } from '@lingui/macro'
import { Form } from 'antd'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { BigNumber } from '@ethersproject/bignumber'
import { FormInstance } from 'rc-field-form'
import { useEffect } from 'react'
import { fromWad } from 'utils/formatNumber'

interface TokensStakedInputProps {
  form: FormInstance
  claimedBalance: BigNumber | undefined
  tokenSymbolDisplayText: string
  tokensStaked: string
  minTokensAllowedToStake: number
}

const TokensStakedInput = ({
  form,
  claimedBalance,
  tokenSymbolDisplayText,
  tokensStaked,
  minTokensAllowedToStake,
}: TokensStakedInputProps) => {
  const totalBalanceInWad = fromWad(claimedBalance)
  const unstakedTokens = claimedBalance
    ? parseInt(totalBalanceInWad) - parseInt(tokensStaked)
    : 0

  useEffect(() => {
    minTokensAllowedToStake &&
      form.setFieldsValue({ tokensStaked: minTokensAllowedToStake.toString() })
  }, [minTokensAllowedToStake, form])

  const validateTokensStaked = () => {
    const tokensStaked = parseInt(form.getFieldValue('tokensStaked'))
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
      <FormattedNumberInput
        name="tokensStaked"
        value={tokensStaked}
        onChange={val => {
          form.setFieldsValue({ tokensStaked: val })
        }}
      />
    </Form.Item>
  )
}

export default TokensStakedInput
