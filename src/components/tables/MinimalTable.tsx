type MinimalTableRow = {
  key: string
  value: string | number | boolean | JSX.Element
}

type MinimalTableProps = {
  sections: MinimalTableRow[][]
}

/**
 *
 * @param sections Nested array of rows in sections. Sections are spaced apart. Rows within a section render inline key-value pairs.
 */
export default function MinimalTable({ sections }: MinimalTableProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
      {sections.map(s => (
        <div key={s[0].key}>
          {s.map(r => (
            <div key={r.key}>
              <span className="font-medium">{r.key}:</span>{' '}
              <span className="text-grey-500 dark:text-grey-400">
                {typeof r.value === 'boolean'
                  ? r.value
                    ? 'Yes'
                    : 'No'
                  : r.value === undefined
                  ? '--'
                  : r.value}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
