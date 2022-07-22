import { t, Trans } from '@lingui/macro'
import { Form } from 'antd'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { BigNumber } from '@ethersproject/bignumber'
import { FormInstance } from 'rc-field-form'
import { useContext, useEffect } from 'react'
import { fromWad } from 'utils/formatNumber'
import { ThemeContext } from 'contexts/themeContext'

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
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
        t`You must stake at least ${minTokensAllowedToStake} tokens.`,
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
      rules={[
        {
          validator: validateTokensStaked,
        },
      ]}
      extra={
        <div style={{ color: colors.text.primary, marginBottom: 10 }}>
          <p style={{ float: 'left' }}>
            <Trans>{tokenSymbolDisplayText} to lock</Trans>
          </p>
          <p style={{ float: 'right' }}>
            <Trans>Remaining: {unstakedTokens}</Trans>
          </p>
        </div>
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
