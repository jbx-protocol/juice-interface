import { Trans } from '@lingui/macro'
import Link from 'antd/lib/typography/Link'
import LanguageProvider from 'contexts/Language/LanguageProvider'
import { useContext } from 'react'
import { ThemeContext } from '../../contexts/Theme/ThemeContext'
import error500 from '/public/assets/error500.png'

const Custom500 = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <LanguageProvider>
      <div className="flex flex-col items-center justify-center p-6 md:p-40">
        <img
          src={error500.src}
          alt="Image"
          className="mb-6 h-64 w-64 object-center md:h-96 md:w-96"
        />
        <Trans>
          <p className="mb-6 text-sm text-grey-600 md:text-base">
            The servers are having an issue, please try again later!
          </p>
        </Trans>
        <Trans>
          <Link
            href="/"
            style={{ color: colors.text.action.primary }}
            className="text-sm md:text-base"
          >
            Back to home
          </Link>
        </Trans>
      </div>
    </LanguageProvider>
  )
}

export default Custom500
