import { Input, Modal, Space } from 'antd'
import { NFTDelegate } from 'models/v2/nftDelegate'
import { useState } from 'react'
import { chunkArray } from 'utils/chunkArray'

import DelegatePickerModalCard from './DelegatePickerModalCard'

type DelegatePickerModalProps = {
  visible: boolean
  currentDelegate?: string
  onCancel: VoidFunction
  onOk: (delegate?: NFTDelegate) => void
}

const fakeDelegates: NFTDelegate[] = [
  {
    address: 'tankbuttons.eth',
    totalDelegated: 500000,
  },
  {
    address: 'bunnybuttons.eth',
    totalDelegated: 100000,
  },
  {
    address: 'misos.eth',
    totalDelegated: 200000,
  },
  {
    address: 'johnnyD.eth',
    totalDelegated: 100000,
  },
  {
    address: 'peri.eth',
    totalDelegated: 190000,
  },
  {
    address: 'sage.eth',
    totalDelegated: 10000,
  },
]

export default function DelegatePickerModal({
  visible,
  currentDelegate,
  onCancel,
  onOk,
}: DelegatePickerModalProps) {
  const [selectedDelgate, setSelectedDelgate] = useState<
    NFTDelegate | undefined
  >(undefined)
  const [searchResults, setSearchResults] = useState(fakeDelegates)
  const gridWidth = 3
  const chunkedSearchResults = Array.from(chunkArray(searchResults, gridWidth))

  const onSearch = (value: string) => {
    setSearchResults([])
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={() => onOk(selectedDelgate)}
    >
      <h2>Delegates</h2>
      <Input.Search placeholder="Search name" allowClear onSearch={onSearch} />
      {searchResults.length > 0 &&
        chunkedSearchResults.map((chunk, idx) => {
          return (
            <Space key={`row${idx}`} direction="horizontal">
              {chunk.map((delegate, idx: number) => {
                return (
                  <DelegatePickerModalCard
                    delegate={delegate}
                    key={`card${idx}`}
                    onClick={() => setSelectedDelgate(delegate)}
                  />
                )
              })}
            </Space>
          )
        })}
    </Modal>
  )
}
