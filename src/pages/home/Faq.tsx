import { Collapse } from 'antd'
import Image from 'next/image'
import QAs from './QAs'

export default function Faq() {
  return (
    <Collapse
      className="bg-transparent"
      defaultActiveKey={QAs.length ? 0 : undefined}
      accordion
    >
      {QAs().map((qa, i) => (
        <Collapse.Panel header={qa.q} key={i}>
          {qa.a && <div>{qa.a}</div>}
          {qa.img && (
            <Image
              src={qa.img.src}
              alt={qa.img.alt}
              width={qa.img.width}
              height={qa.img.height}
              loading="lazy"
            />
          )}
        </Collapse.Panel>
      ))}
    </Collapse>
  )
}
