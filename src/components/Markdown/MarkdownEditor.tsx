import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { MDEditorProps } from '@uiw/react-md-editor'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import dynamic from 'next/dynamic'
import {
  ClipboardEventHandler,
  DragEventHandler,
  useCallback,
  useContext,
  useReducer,
} from 'react'
import rehypeSanitize from 'rehype-sanitize'
import { markdownReducer } from './utils/markdownEditorReducer'
import { processFile } from './utils/processFile'

const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor').then(mod => mod.default),
  { ssr: false },
)

export type MarkdownEditorProps = Omit<MDEditorProps, 'data-color-mode'>

export const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { themeOption } = useContext(ThemeContext)
  const [state, dispatch] = useReducer(markdownReducer, {
    uploading: false,
    progress: 0,
  })

  const handleDrop: DragEventHandler<HTMLTextAreaElement> = useCallback(
    async e => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const caretPositionStart = (e.target as any).selectionStart
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const caretPositionEnd = (e.target as any).selectionEnd
      await processFile(
        file,
        caretPositionStart,
        caretPositionEnd,
        props,
        dispatch,
      )
    },
    [props],
  )

  const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = useCallback(
    async e => {
      const file = e.clipboardData.items[0]?.getAsFile()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const caretPositionStart = (e.target as any).selectionStart
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const caretPositionEnd = (e.target as any).selectionEnd
      await processFile(
        file,
        caretPositionStart,
        caretPositionEnd,
        props,
        dispatch,
      )
    },
    [props],
  )

  return (
    <>
      <MDEditor
        textareaProps={{
          disabled: state.uploading,
        }}
        // @ts-ignore
        onDrop={handleDrop}
        // @ts-ignore
        onPaste={handlePaste}
        data-color-mode={themeOption}
        height={200}
        {...props}
        previewOptions={{
          rehypePlugins: [rehypeSanitize],
        }}
      />
      {!state.uploading ? (
        <div className="py-3 text-xs text-grey-500 dark:text-slate-200">
          {state.error ? (
            <span className="text-error-500 dark:text-error-400">
              {state.error}
            </span>
          ) : (
            <>
              <InformationCircleIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
              <Trans>
                Attach files by dragging & dropping, or pasting from the
                clipboard.
              </Trans>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="h-1 w-20 rounded-full bg-grey-300">
            <div
              className="h-full rounded-full bg-bluebs-500"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <span>{state.progress}%</span>
        </div>
      )}
    </>
  )
}
