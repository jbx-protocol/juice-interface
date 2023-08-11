import { Collapse } from 'antd'
import QAs from './QAs'

export function FaqList() {
  const QAsList = QAs()

  return (
    <Collapse
      className="bg-transparent"
      defaultActiveKey={QAsList.length ? 0 : undefined}
      accordion
    >
      {QAsList.map((qa, i) => (
        <Collapse.Panel header={qa.q} key={i}>
          {qa.a && <div>{qa.a}</div>}
        </Collapse.Panel>
      ))}
    </Collapse>
  )
}
