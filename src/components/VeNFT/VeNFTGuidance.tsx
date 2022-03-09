import React from 'react'

interface Props {}

const VeNftGuidance: React.FC<Props> = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 400,
        margin: '0 auto 32px',
      }}
    >
      <div>VeBanny</div>
      <div
        style={{
          padding: '8px 12px',
          border: '1px solid',
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        0001
      </div>
      <div style={{ fontSize: 64, lineHeight: '32px' }}>=</div>
      <div
        style={{
          padding: '8px 12px',
          border: '1px solid',
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        0.25
      </div>
      <div>Voting PWR</div>
    </div>
  )
}

export default VeNftGuidance
