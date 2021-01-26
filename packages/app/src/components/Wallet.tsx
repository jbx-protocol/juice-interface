import React from 'react'

export default function Wallet({ address }: { address?: string }) {
  return address ? (
    <div>
      Wallet: <span>{address}</span>
    </div>
  ) : null
}
