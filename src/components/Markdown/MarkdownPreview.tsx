import { MarkdownPreviewProps } from '@uiw/react-markdown-preview'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import dynamic from 'next/dynamic'
import { useContext } from 'react'

const MDPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then(mod => mod.default),
  { ssr: false },
)

type Props = Omit<MarkdownPreviewProps, 'data-color-mode'>

export const MarkdownPreview = (props: Props) => {
  const { themeOption } = useContext(ThemeContext)

  return (
    <MDPreview
      className="bg-transparent"
      wrapperElement={{
        'data-color-mode': themeOption,
      }}
      {...props}
    />
  )
}
