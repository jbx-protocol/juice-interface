import { Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

export default function BondingCurveGraph() {
  const { colors } = useContext(ThemeContext).theme

  const graphContainerId = 'graph-container'

  const labelStyle: CSSProperties = {
    fontSize: '.7rem',
    fontWeight: 500,
    textAlign: 'center',
    position: 'absolute',
  }

  const graphSize = 180
  const graphPad = 50
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: graphSize,
          width: graphSize,
        }}
      >
        <div
          id={graphContainerId}
          style={{
            width: graphSize - graphPad,
            height: graphSize - graphPad,
          }}
        ></div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: graphPad / 2,
          left: graphPad / 2,
          width: graphSize - graphPad,
          height: graphSize - graphPad,
          borderLeft: '2px solid ' + colors.stroke.secondary,
          borderBottom: '2px solid ' + colors.stroke.secondary,
        }}
      ></div>

      <div
        style={{
          ...labelStyle,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        % <Trans>tokens redeemed</Trans>
      </div>

      <div
        style={{
          ...labelStyle,
          transform: 'rotate(-90deg)',
          bottom: 0,
          top: 0,
          left: 0,
          width: graphSize,
        }}
      >
        <Trans>Token redeem value</Trans>
      </div>
    </div>
  )
}
