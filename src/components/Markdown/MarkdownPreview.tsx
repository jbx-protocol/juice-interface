import { MarkdownPreviewProps } from '@uiw/react-markdown-preview'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import dynamic from 'next/dynamic'
import { useContext } from 'react'
import rehypeSanitize from 'rehype-sanitize'

const MDPreview = dynamic<MarkdownPreviewProps>(
  () => import('@uiw/react-markdown-preview').then(mod => mod.default),
  { ssr: false },
)

type Props = Omit<MarkdownPreviewProps, 'data-color-mode'>

export const MarkdownPreview = (props: Props) => {
  const { themeOption } = useContext(ThemeContext)

  return (
    <MDPreview
      className="bg-transparent"
      rehypePlugins={[rehypeSanitize]}
      wrapperElement={{
        'data-color-mode': themeOption,
      }}
      {...props}
    />
  )
}
