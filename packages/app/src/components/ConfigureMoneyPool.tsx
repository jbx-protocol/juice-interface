import { Contract } from '@ethersproject/contracts'
import { useState } from 'react'
import Web3 from 'web3'

import { ContractName } from '../constants/contract-name'
import { Transactor } from '../models/transactor'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import KeyValRow from './KeyValRow'

export default function ConfigureMoneyPool({
  transactor,
  contracts,
}: {
  transactor?: Transactor
  contracts?: Record<ContractName, Contract>
}) {
  const [target, setTarget] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [title, setTitle] = useState<string>()
  const [link, setLink] = useState<string>()
  const [bias, setBias] = useState<number>(100)
  const [beneficiaryAddress, setBeneficiaryAddress] = useState<string>()
  const [beneficiaryAllocation, setBeneficiaryAllocation] = useState<number>(0)
  const [ownerAllocation, setOwnerAllocation] = useState<number>(0)

  const eth = new Web3(Web3.givenProvider).eth

  function onSubmit() {
    if (!transactor || !contracts?.Controller || !contracts?.Token) return

    const _target = eth.abi.encodeParameter('uint256', target)
    // Contracts created during development use seconds for duration
    const _duration = eth.abi.encodeParameter('uint256', duration * SECONDS_IN_DAY)
    const _title = title && Web3.utils.utf8ToHex(title)
    const _link = link && Web3.utils.utf8ToHex(link)
    const _bias = eth.abi.encodeParameter('uint256', bias)
    const _ownerAllocation = eth.abi.encodeParameter('uint256', ownerAllocation)
    const _beneficiaryAllocation = eth.abi.encodeParameter('uint256', beneficiaryAllocation)
    const _beneficiaryAddress = beneficiaryAddress ?? '0'

    console.log('🧃 Calling Controller.configureMp(...)', {
      _target,
      _duration,
      want: contracts.Token.address,
      _title,
      _link,
      _bias,
      _ownerAllocation,
      _beneficiaryAllocation,
      _beneficiaryAddress,
    })

    transactor(
      contracts.Controller.configureMp(
        _target,
        _duration,
        contracts.Token.address,
        _title,
        _link,
        _bias,
        _ownerAllocation,
        _beneficiaryAllocation,
        _beneficiaryAddress,
      ),
    )
  }

  if (!transactor || !contracts) return null

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
    >
      {KeyValRow(
        'Title',
        <input
          onChange={e => setTitle(e.target.value)}
          type="text"
          name="title"
          id="duration"
          placeholder="Money pool title"
        />,
      )}
      {KeyValRow(
        'Link',
        <input
          onChange={e => setLink(e.target.value)}
          type="text"
          name="link"
          id="duration"
          placeholder="http://your-money-pool.io"
        />,
      )}
      {KeyValRow(
        'Sustainability target',
        <span>
          <input
            onChange={e => setTarget(parseFloat(e.target.value))}
            style={{ marginRight: 10 }}
            type="number"
            name="target"
            id="target"
            placeholder="1500"
          />
          DAI
        </span>,
      )}
      {KeyValRow(
        'Bias (70-130)',
        <span>
          <input
            onChange={e => setBias(parseFloat(e.target.value))}
            style={{
              width: 145,
              marginRight: 10,
            }}
            type="number"
            max="130"
            min="70"
            name="bias"
            id="bias"
            placeholder="100"
            defaultValue={bias}
          />
          %
        </span>,
      )}
      {KeyValRow(
        'Duration',
        <input
          onChange={e => setDuration(parseFloat(e.target.value))}
          style={{ marginRight: 10 }}
          type="number"
          name="duration"
          id="duration"
          placeholder="30"
        />,
      )}
      {KeyValRow(
        'Reserve surplus for owner',
        <span>
          <input
            onChange={e => setOwnerAllocation(parseFloat(e.target.value))}
            style={{ marginRight: 10 }}
            type="number"
            name="ownerAllocation"
            id="ownerAllocation"
            placeholder="0"
            defaultValue={ownerAllocation}
          />
          %
        </span>,
      )}
      {KeyValRow(
        'Reserve surplus for beneficiary',
        <span>
          <input
            onChange={e => setBeneficiaryAllocation(parseFloat(e.target.value))}
            style={{ marginRight: 10 }}
            type="number"
            name="beneficiaryAllocation"
            id="beneficiaryAllocation"
            placeholder="0"
            defaultValue={beneficiaryAllocation}
          />
          %
        </span>,
      )}
      {KeyValRow(
        'Beneficiary address',
        <input
          onChange={e => setBeneficiaryAddress(e.target.value)}
          type="text"
          name="beneficiaryAddress"
          id="beneficiaryAddress"
          placeholder="0x01a2b3c..."
        />,
      )}
      <button style={{ marginTop: 20 }} type="submit">
        Submit
      </button>
    </form>
  )
}
