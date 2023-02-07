import { LeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import Link from 'antd/lib/typography/Link'
import React, { useContext } from 'react'
import { ThemeContext } from '../../contexts/themeContext'
import error404 from '/public/assets/error404.png'

const Custom404 = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div className="flex flex-col items-center justify-center p-20">
      <img src={error404.src} alt="Image" className="mb-6 h-80 w-80" />
      <h1 className="mb-6 text-2xl text-base font-medium md:text-2xl">
        Oops, something went wrong!
      </h1>
      <p className="mb-6  text-grey-600">This page could not be found.</p>
      <Link href="/">
        <Button
          type="link"
          style={{ color: colors.text.action.primary }}
          size="large"
          icon={<LeftOutlined />}
        >
          Back to home
        </Button>
      </Link>
    </div>
  )
}

export default Custom404
