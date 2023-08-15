import { pinFile } from 'lib/api/ipfs'
import { DeltaStatic, Sources } from 'quill'
import { useCallback, useEffect, useRef } from 'react'
import ReactQuill, { UnprivilegedEditor } from 'react-quill'
import { ipfsGatewayUrl } from 'utils/ipfs'

export type RichEditorProps = {
  value?: string
  onChange?: (value: string) => void
}

export const RichEditor: React.FC<RichEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<ReactQuill>(null)

  useEffect(() => {
    // @ts-ignore
    quillRef.current
      .getEditor()
      .getModule('toolbar')
      .addHandler('image', () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        input.onchange = async () => {
          if (!input.files || !input?.files?.length || !input?.files?.[0])
            return
          // @ts-ignore
          const editor = quillRef?.current?.getEditor()
          const file = input.files[0]
          const { Hash } = await pinFile(file)
          const url = ipfsGatewayUrl(Hash)

          // @ts-ignore
          const range = editor.getSelection(true)
          // @ts-ignore
          editor.insertEmbed(range.index, 'image', url)
        }
      })
  }, [quillRef])

  useEffect(() => {
    const root = quillRef.current?.getEditor().root
    if (!root) return

    const event = async (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files[0])
        return

      for (const file of e.dataTransfer.files) {
        if (!file.type.match('image.*')) {
          continue
        }
        const { Hash } = await pinFile(file)
        const url = ipfsGatewayUrl(Hash)
        // @ts-ignore
        const editor = quillRef?.current?.getEditor()
        // @ts-ignore
        const range = editor.getSelection(true)
        // @ts-ignore
        editor.insertEmbed(range.index, 'image', url)
      }
    }

    root.addEventListener('drop', event)
    return () => {
      root.removeEventListener('drop', event)
    }
  }, [quillRef])

  useEffect(() => {
    const root = quillRef.current?.getEditor().root
    if (!root) return

    const event = async (e: ClipboardEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (
        !e.clipboardData ||
        !e.clipboardData.files ||
        !e.clipboardData.files[0]
      ) {
        // standard paste - strip formatting
        const text = e.clipboardData?.getData('text/plain')
        if (text) {
          // @ts-ignore
          const editor = quillRef?.current?.getEditor()
          // @ts-ignore
          const range = editor.getSelection(true)
          // @ts-ignore
          editor.insertText(range.index, text)
        }
        return
      }

      for (const file of e.clipboardData.files) {
        if (!file.type.match('image.*')) {
          continue
        }
        const { Hash } = await pinFile(file)
        const url = ipfsGatewayUrl(Hash)
        // @ts-ignore
        const editor = quillRef?.current?.getEditor()
        // @ts-ignore
        const range = editor.getSelection(true)
        // @ts-ignore
        editor.insertEmbed(range.index, 'image', url)
      }
    }

    root.addEventListener('paste', event)
    return () => {
      root.removeEventListener('paste', event)
    }
  }, [quillRef])

  const handleChange = useCallback(
    (
      value: string,
      delta: DeltaStatic,
      source: Sources,
      editor: UnprivilegedEditor,
    ) => {
      // 1 is not a bug, this is the default value of the editor being empty
      if (editor.getLength() > 1) {
        onChange?.(editor.getHTML())
      } else {
        onChange?.('')
      }
    },
    [onChange],
  )

  return (
    <ReactQuill
      className="mb-6 flex max-h-[80vh] min-h-[224px] flex-col md:max-h-[100vh]"
      value={value}
      onChange={handleChange}
      ref={quillRef}
      modules={{
        toolbar: {
          container: [
            'bold',
            'italic',
            { header: 1 },
            { header: 2 },
            'blockquote',
            'link',
            'image',
            { list: 'ordered' },
            { list: 'bullet' },
            'code-block',
          ],
        },
      }}
    />
  )
}
