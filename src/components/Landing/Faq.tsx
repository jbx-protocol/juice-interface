import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

import QAs from './QAs'

export default function Faq() {
  return (
    <Collapse defaultActiveKey={QAs.length ? 0 : undefined} accordion>
      {QAs().map((qa, i) => (
        <CollapsePanel header={qa.q} key={i}>
          {qa.a && qa.a.map((p, j) => <p key={j}>{p}</p>)}
          {qa.img && (
            <img
              src={qa.img.src}
              alt={qa.img.alt}
              style={{ maxWidth: '100%' }}
            />
          )}
        </CollapsePanel>
      ))}
    </Collapse>
  )
}
