import { Col } from 'antd'
import Image from 'next/image'

export function WhyJuiceboxCard({
  bgClass,
  iconBgClass,
  iconSrc,
  iconAlt,
  heading,
  content,
}: {
  bgClass: string
  iconBgClass: string
  iconSrc: string
  iconAlt: string
  heading: string | JSX.Element
  content: string | JSX.Element
}) {
  return (
    <Col md={8} xs={24} className="h-full">
      <div className={`${bgClass} h-full rounded-lg p-6 text-center`}>
        <div className="flex w-full justify-center py-4">
          <div
            className={`h-14 w-14 rounded-full ${iconBgClass} flex items-center justify-center`}
          >
            <Image
              src={iconSrc}
              alt={iconAlt}
              width="32px"
              height="32px"
              className="m-auto"
            />
          </div>
        </div>
        <h6 className="text-primary text-2xl">{heading}</h6>
        <p className="text-primary text-sm">{content}</p>
      </div>
    </Col>
  )
}
