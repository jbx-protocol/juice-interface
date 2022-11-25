type MinimalTableRow = {
  key: string
  value: string | number | boolean | JSX.Element
}

export type MinimalTableProps = {
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
              <strong>{r.key}:</strong>{' '}
              {typeof r.value === 'boolean'
                ? r.value
                  ? 'Yes'
                  : 'No'
                : r.value}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
