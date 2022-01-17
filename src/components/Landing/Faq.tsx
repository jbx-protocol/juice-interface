import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { Trans } from '@lingui/macro'

import QAs from './QAs'

export default function Faq() {
  return (
    <Collapse defaultActiveKey={QAs.length ? 0 : undefined} accordion>
      {QAs().map((qa, i) => (
        <CollapsePanel header={qa.q} key={i}>
          {qa.a &&
            qa.a.map((p, j) => (
              <p key={j}>
                <Trans>{p}</Trans>
              </p>
            ))}
          {qa.img && <img src={qa.img.src} alt={qa.img.alt} />}
        </CollapsePanel>
      ))}
    </Collapse>
  )
}
