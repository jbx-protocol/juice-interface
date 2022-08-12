// https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readyState
const READY_STATE_DONE = 2

/**
 * Read a given file and return its contents as a string.
 * @param file the File object to read.
 * @returns Promise, which resolves to a string containing the file contents.
 */
export const readFile = async (file: File): Promise<string | null> => {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onload = function (evt) {
      if (evt?.target?.readyState != READY_STATE_DONE) return resolve(null)
      if (evt?.target.error) {
        reject(evt.target.error)
        return
      }

      const content = evt.target.result as string | null

      resolve(content)
    }

    reader.readAsText(file)
  })
}
