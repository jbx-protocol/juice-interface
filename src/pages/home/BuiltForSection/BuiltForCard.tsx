import { Col } from 'antd'
import Image from 'next/image'

export function BuiltForCard({
  imageSrc,
  imageAlt,
  heading,
  subheading,
}: {
  imageSrc: string | undefined
  imageAlt: string
  heading: string | JSX.Element
  subheading: string | JSX.Element
}) {
  return (
    <Col md={6} xs={24}>
      <div className="flex flex-col items-center">
        <Image
          src={imageSrc ?? ''}
          alt={imageAlt}
          width="180px"
          height="180px"
        />
        <h6 className="mt-4 text-2xl">{heading}</h6>
        <p className="text-center text-base">{subheading}</p>
      </div>
    </Col>
  )
}
