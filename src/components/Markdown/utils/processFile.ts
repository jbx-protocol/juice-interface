import { pinFile } from 'lib/api/ipfs'
import { ipfsGatewayUrl, percentFromUploadProgressEvent } from 'utils/ipfs'
import { MarkdownEditorProps } from '../MarkdownEditor'
import { MarkdownEditorAction } from './markdownEditorReducer'

export const processFile = async (
  file: File | null,
  start: number,
  end: number,
  props: MarkdownEditorProps,
  dispatch: React.Dispatch<MarkdownEditorAction>,
) => {
  if (!file) return
  // Disallow SVG files because they can contain XML and JavaScript for
  // executing malicious code
  if (!file.type.match('image.*') || file.type === 'image/svg+xml') {
    dispatch({ type: 'error', message: 'Only images are supported' })
    return
  }
  dispatch({ type: 'uploading' })
  try {
    const { Hash } = await pinFile(file, e => {
      const percent = percentFromUploadProgressEvent(e)
      dispatch({ type: 'progress', progress: percent })
    })
    const url = ipfsGatewayUrl(Hash)
    const markdownInput = `![${file.name}](${url})\n`
    props.onChange?.(textValue(markdownInput, start, end, props.value))
    dispatch({ type: 'done' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    dispatch({ type: 'error', message: e.message })
  }
}

export const textValue = (
  insertString: string,
  start: number,
  end: number,
  sentence: string | undefined,
) => {
  const len = sentence?.length ?? 0
  const pos = start

  const front = sentence?.slice(0, pos)
  const back = sentence?.slice(pos, len)

  sentence = [front, insertString, back].filter(Boolean).join('')

  return sentence
}
