import { useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'

export default function V2BugNotice() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  // This copy has not been prepped for translations due to being a hot fix that is likely to change.

  return (
    <div
      style={{
        padding: 20,
        color: colors.text.warn,
        border: `1px solid ${colors.stroke.warn}`,
      }}
    >
      <h2 style={{ color: colors.text.warn }}>Heads up</h2>
      <p>
        A minor bug has been found in the V2 Juicebox protocol contracts. The
        contracts have been fixed and will be redeployed soon.{' '}
        <b>No funds are in danger</b> and projects are unlikely to be affected.
      </p>
      <p>
        While the current V2 contracts are being deprecated, creating new
        Juicebox projects has been temporarily disabled on the juicebox.money
        app. Payments to V2 projects with a 0 treasury balance have also been
        disabled. <a href="/v2-bug-updates">More details</a>
      </p>
    </div>
  )
}
