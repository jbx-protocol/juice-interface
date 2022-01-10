import { useEffect, useState } from 'react'
import * as runtime from 'react/jsx-runtime.js'
import { compile, run } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import { MDXComponents, MDXContent } from 'mdx/types'
import { YouTube } from 'mdx-embed'
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary'

const htmlElements = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
  'em',
  'strong',
  'code',
  'hr',
  'ol',
  'ul',
  'li',
  'table',
  'tr',
  'td',
  'img',
]

function buildEmptyMarkdownComponents(elements: string[]) {
  // Reduce all elements to return just a string (this overrides the markdown -> html components)
  return elements.reduce(
    (acc: { [key: string]: any }, key: string) => ({
      ...acc,
      [key]: (props: { children: string }) => props.children || '',
    }),
    {},
  )
}

// Not sure why MDXComponents doesn't work here
const components: MDXComponents | any = {
  YouTube,
  ...buildEmptyMarkdownComponents(htmlElements),
  // More embeds can be added here.
  // They will be available in Markdown as <YouTube youTubeId="..." />
}

function useMdx(content: string) {
  const [state, setState] = useState<{
    MDX: MDXContent | null
    error: string | null
  }>({
    MDX: null,
    error: null,
  })

  useEffect(() => {
    if (content) {
      // Compile markdown into a React component
      compile(content, {
        outputFormat: 'function-body',
        remarkPlugins: [remarkGfm, remarkMdx],
      })
        .then(({ value }) => run(value, runtime))
        .then(({ default: MDX }: { default: MDXContent }) =>
          setState(s => ({ ...s, MDX, error: null })),
        )
        .catch(err =>
          setState(s => ({ ...s, MDX: null, error: err.toString() })),
        )
    }
  }, [content])

  return state
}

type IProps = {
  children: string
}
function MDXViewer({ children }: IProps) {
  const { MDX, error } = useMdx(children)
  if (error) {
    return <code>{error}</code>
  }
  if (!MDX) {
    return <pre>compiling mdx...</pre>
  }
  return <MDX components={components} />
}

export default function MDXWithErrorBoundary({ children }: IProps) {
  return (
    <ErrorBoundary>
      <MDXViewer>{children}</MDXViewer>
    </ErrorBoundary>
  )
}
