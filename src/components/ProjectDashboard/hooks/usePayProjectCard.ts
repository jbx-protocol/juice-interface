import { useMemo, useState } from 'react'

export const usePayProjectCard = () => {
  const [userInputAmount, setUserInputAmount] = useState({
    amount: '',
    currency: 'eth' as 'eth' | 'usd',
  })

  const tokensPerPay = useMemo(() => {
    // TODO: Calculate tokens per pay
    const tokens = Number(userInputAmount.amount)
    if (Number.isNaN(tokens)) {
      return 0
    }
    return tokens
  }, [userInputAmount.amount])

  return {
    tokensPerPay,
    userInputAmount,
    setUserInputAmount,
    formOnSubmit: () => {
      console.info('formOnSubmit')
    },
  }
}
