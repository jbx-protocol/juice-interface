import { Split } from 'models/v2/splits'

import SplitItem from './SplitItem'

export default function SplitList({ splits }: { splits: Split[] }) {
  return (
    <div>
      {splits
        .sort((a, b) => (a.percent < b.percent ? 1 : -1))
        .map(split => (
          <div
            key={split.beneficiary ?? '' + split.percent}
            style={{ marginBottom: 5 }}
          >
            <SplitItem split={split} />
          </div>
        ))}
    </div>
  )
}
