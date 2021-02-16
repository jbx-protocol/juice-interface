import axios from 'axios'
import { useState } from 'react'
import { TxGasOption } from './../models/tx-gas-option'
import { usePoller } from './Poller'

export function useGasPrice(speed: TxGasOption) {
  const [gasPrice, setGasPrice] = useState<number>()

  const loadGasPrice = async () => {
    axios
      .get('https://ethgasstation.info/json/ethgasAPI.json')
      .then(response => {
        const newGasPrice = response.data[speed] * 100000000
        if (newGasPrice !== gasPrice) setGasPrice(newGasPrice)
      })
      .catch(error => console.log('Loading gas price', error))
  }

  usePoller(loadGasPrice, 30000)

  return gasPrice
}
