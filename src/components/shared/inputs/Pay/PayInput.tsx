import { useContext, useState } from 'react'
import { BigNumber } from 'ethers'

import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { CurrencyContext } from 'contexts/currencyContext'

import ConfirmPayOwnerModal from 'components/v1/V1Project/modals/ConfirmPayOwnerModal'
import PayWarningModal from 'components/v1/V1Project/modals/PayWarningModal'
import AmountToWei from 'utils/AmountToWei'
import { TransactorInstance } from 'hooks/Transactor'

import PayInputSubText from './PayInputSubText'

export type PayButtonProps = {
  payAmount: string
  payInCurrency: number
  onClick: () => void
}

export default function PayInput({
  PayButton,
  payProjectTx,
}: {
  PayButton: (props: PayButtonProps) => JSX.Element | null
  payProjectTx: TransactorInstance<{
    note: string
    preferUnstaked: boolean
    value: BigNumber
  }> // TODO: make type
}) {
  const {
    currencyMetadata,
    currencies: { currencyUSD, currencyETH },
  } = useContext(CurrencyContext)

  const [payAmount, setPayAmount] = useState<string>('0')
  const [payInCurrency, setPayInCurrency] = useState<number>(currencyETH)
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const togglePayInCurrency = () => {
    const newPayInCurrency =
      payInCurrency === currencyETH ? currencyUSD : currencyETH
    setPayInCurrency(newPayInCurrency)
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
      }}
    >
      <div style={{ flex: 1, marginRight: 10 }}>
        <FormattedNumberInput
          placeholder="0"
          onChange={val => {
            setPayAmount(val ?? '0')
          }}
          value={payAmount}
          min={0}
          accessory={
            <InputAccessoryButton
              withArrow={true}
              content={currencyMetadata[payInCurrency ?? currencyETH].name}
              onClick={togglePayInCurrency}
            />
          }
        />
        <PayInputSubText
          payInCurrency={payInCurrency ?? currencyETH}
          amount={payAmount}
        />
      </div>

      <div style={{ textAlign: 'center', minWidth: 150 }}>
        <PayButton
          onClick={() => setPayWarningModalVisible(true)}
          payAmount={payAmount}
          payInCurrency={payInCurrency}
        />
      </div>
      <PayWarningModal
        visible={payWarningModalVisible}
        onOk={() => {
          setPayWarningModalVisible(false)
          setPayModalVisible(true)
        }}
        onCancel={() => setPayWarningModalVisible(false)}
      />
      <ConfirmPayOwnerModal
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={AmountToWei({ currency: payInCurrency, amount: payAmount })}
        payProjectTx={payProjectTx}
      />
    </div>
  )
}
