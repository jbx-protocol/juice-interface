import React from 'react'

export default function KeyValRow(key: string, value: any) {
  const label = (text: string) => (
    <label
      style={{
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 'small',
      }}
    >
      {text}
    </label>
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        paddingBottom: 2,
        paddingTop: 2,
      }}
    >
      <div>{label(key)}</div>
      <div style={{ overflow: 'hidden', wordWrap: 'break-word' }}>{value}</div>
    </div>
  )
}
