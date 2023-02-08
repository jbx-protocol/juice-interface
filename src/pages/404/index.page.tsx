import Link from 'antd/lib/typography/Link'
import { useContext } from 'react'
import { ThemeContext } from '../../contexts/themeContext'
import error404 from '/public/assets/error404.png'

const Custom404 = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-40">
      <img
        src={error404.src}
        alt="Image"
        className="mb-6 h-60 w-60 object-center md:h-80 md:w-80"
      />
      <p className="mb-6 text-sm text-grey-600 md:text-base">
        This page could not be found.
      </p>
      <Link
        href="/"
        style={{ color: colors.text.action.primary }}
        className="text-sm md:text-base"
      >
        Back to home
      </Link>
    </div>
  )
}

export default Custom404
