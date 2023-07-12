export type MarkdownEditorAction =
  | { type: 'uploading' }
  | { type: 'progress'; progress: number }
  | { type: 'done' }
  | { type: 'error'; message: string }

export type MarkdownEditorState = {
  uploading: boolean
  progress: number
  error?: string
}

export const markdownReducer = (
  state: MarkdownEditorState,
  action: MarkdownEditorAction,
): MarkdownEditorState => {
  switch (action.type) {
    case 'uploading':
      return { ...state, uploading: true, progress: 0, error: undefined }
    case 'progress':
      return { ...state, progress: action.progress, error: undefined }
    case 'done':
      return { ...state, uploading: false, progress: 0, error: undefined }
    case 'error':
      return { ...state, error: action.message, uploading: false, progress: 0 }
  }
}
