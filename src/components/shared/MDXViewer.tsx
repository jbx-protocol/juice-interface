import { useEffect, useState } from 'react'
import * as runtime from 'react/jsx-runtime.js'
import { compile, run } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'
import { MDXComponents, MDXContent } from 'mdx/types'
import { YouTube } from 'mdx-embed'

// Not sure why MDXComponents doesn't work here
const components: MDXComponents | any = {
  YouTube,
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
          setState(s => ({ ...s, MDX })),
        )
        .catch(err => setState(s => ({ ...s, error: err.toString() })))
    }
  }, [content])

  return state
}

export default function MDXViewer({ children }: { children: string }) {
  const { MDX, error } = useMdx(children)
  if (error) {
    return <code>{error}</code>
  }
  if (!MDX) {
    return <pre>compiling mdx...</pre>
  }
  return <MDX components={components} />
}
