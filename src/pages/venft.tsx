import React, { useState } from 'react'

import { Input } from 'antd'

import { layouts } from '../constants/styles/layouts'
import VeNftGuidance from '../components/VeNFT/VeNFTGuidance'
import VeNftController from '../components/VeNFT/VeNFTController'
import { useJuiceTheme } from '../hooks/JuiceTheme'

const TIER_COLORS = {
  10: '#F3C8FA',
  50: '#A0D2FF',
  100: '#A0FFBB',
  500: '#FFDFA0',
  1000: '#E6FFA0',
}
const TIER_KEYS = [10, 50, 100, 500, 1000] as const

const JBX_TIERS = {
  1: 1000,
  2: 2000,
  4: 4000,
  8: 8000,
  16: 16000,
  32: 32000,
  64: 64000,
  128: 128000,
  256: 256000,
  512: 512000,
  1024: 1024000,
  2048: 2048000,
}

interface Props {}

const VeNFTMintingPage: React.FC<Props> = () => {
  const theme = useJuiceTheme()
  const [selectedTierIndex, setSelectedTierIndex] = useState(0)
  const [jbxStake, setJbxStake] = useState(0)
  const selectedTier = TIER_KEYS[selectedTierIndex]

  const tierOptions = TIER_KEYS.map(tier => ({
    label: (
      <div>
        <div style={{ lineHeight: '18px' }}>{tier}</div>
        <div style={{ fontSize: 16 }}>days</div>
      </div>
    ),
    value: tier,
  }))

  const stakeOptions = Object.keys(JBX_TIERS).map(tier => ({
    label: (
      <div>
        <div style={{ lineHeight: '18px' }}>{tier}k</div>
      </div>
    ),
    value: tier,
  }))

  return (
    <div style={layouts.maxWidth}>
      <h1
        style={{
          fontSize: 32,
          textAlign: 'center',
          marginBottom: 40,
        }}
      >
        Lock JBX for voting PWR
      </h1>

      <VeNftGuidance />

      <div style={{ display: 'flex', marginBottom: 24 }}>
        <div style={{ flex: 1 }} />

        <div style={{ width: '40%' }}>
          <img
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: TIER_COLORS[selectedTier],
              borderRadius: '12px',
              transition: 'background-color 0.3s',
            }}
            src="/assets/completepeach 2.png"
          />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              height: '100%',
            }}
          >
            <VeNftController
              onChange={index => setSelectedTierIndex(index)}
              selectedIndex={selectedTierIndex}
              orientation="vertical"
              options={tierOptions}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 64,
        }}
      >
        <div
          style={{
            flex: 1,
            textAlign: 'right',
          }}
        >
          <span
            style={{
              fontSize: 32,
              lineHeight: '24px',
            }}
          >
            $JBX&nbsp;
          </span>
        </div>

        <div style={{ width: '40%' }}>
          <VeNftController
            onChange={index => setJbxStake(index)}
            selectedIndex={jbxStake}
            orientation="horizontal"
            options={stakeOptions}
          />
        </div>

        <div style={{ flex: 1 }} />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 128,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: 64,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Input
              style={{ width: 115, textAlign: 'center' }}
              disabled
              value={new Date().toLocaleDateString()}
            />
            <div style={{ marginTop: 4 }}>DATE</div>
          </div>
        </div>

        <div>
          <button
            type="button"
            style={{
              padding: '40px 24px',
              borderRadius: '100px',
              fontSize: 32,
              lineHeight: 1.5,
              border: 'none',
              backgroundColor: theme.theme.colors.background.brand.primary,
            }}
          >
            MINT
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            marginLeft: 64,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Input
              style={{ width: 115, textAlign: 'center' }}
              disabled
              value="100,000"
            />
            <div style={{ marginTop: 4 }}>JBX</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VeNFTMintingPage
