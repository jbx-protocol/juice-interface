import { InformationCircleIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import MDEditor, {
  ICommand,
  MDEditorProps,
  TextState,
  commands,
} from '@uiw/react-md-editor'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import {
  ClipboardEventHandler,
  DragEventHandler,
  useCallback,
  useContext,
  useReducer,
} from 'react'
import rehypeSanitize from 'rehype-sanitize'
import { markdownReducer, processFile } from './utils'

// const MDEditor = dynamic<MDEditorProps>(
//   () => import('@uiw/react-md-editor').then(mod => mod.default),
//   { ssr: false },
// )

export type MarkdownEditorProps = Omit<MDEditorProps, 'data-color-mode'>

export const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { themeOption } = useContext(ThemeContext)
  const [state, dispatch] = useReducer(markdownReducer, {
    uploading: false,
    progress: 0,
  })

  const uploadImage: ICommand = {
    name: 'upload-image',
    keyCommand: 'upload-image',
    buttonProps: { 'aria-label': 'Upload image' },
    icon: <PhotoIcon className="h-3 w-3" />,
    execute: (state: TextState) => {
      const file = document.createElement('input')
      file.type = 'file'
      file.accept = 'image/*'
      file.onchange = async () => {
        if (!file.files) return
        const f = file.files[0]
        const caretPositionStart = state.selection.start || 0
        const caretPositionEnd = state.selection.end || 0
        await processFile(
          f,
          caretPositionStart,
          caretPositionEnd,
          props,
          dispatch,
        )
      }
      file.click()

      // let modifyText = `### ${state.selectedText}\n`
      // if (!state.selectedText) {
      //   modifyText = `### `
      // }
      // api.replaceSelection(modifyText)
    },
  }

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
      const file = e.clipboardData.files[0]
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
        commands={[
          commands.bold,
          commands.italic,
          commands.title,
          commands.quote,
          commands.link,
          uploadImage,
          commands.unorderedListCommand,
          commands.orderedListCommand,
        ]}
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
