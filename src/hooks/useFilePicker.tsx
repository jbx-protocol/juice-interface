import { useCallback, useRef, useState } from 'react'

function useFilePicker({
  accept,
  onFileChange: _onFileChange,
}: {
  accept: string
  onFileChange?: (file: File | null) => void
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null
      setSelectedFile(file)
      _onFileChange?.(file)
    },
    [_onFileChange],
  )

  const openFilePicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const removeFile = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const FileInput = (
    <input
      type="file"
      accept={accept}
      onChange={onFileChange}
      style={{ display: 'none' }}
      ref={inputRef}
    />
  )

  return { selectedFile, FileInput, openFilePicker, removeFile }
}

export default useFilePicker
