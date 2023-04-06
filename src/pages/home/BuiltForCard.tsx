import { Col } from 'antd'

export function BuildForCard({
  imageSrc,
  imageAlt,
  heading,
  subheading,
}: {
  imageSrc: string
  imageAlt: string
  heading: string | JSX.Element
  subheading: string | JSX.Element
}) {
  return (
    <Col md={6} xs={24}>
      <div className="flex flex-col items-center">
        <img src={imageSrc} alt={imageAlt} />
        <h6 className="mt-4 text-2xl">{heading}</h6>
        <p className="text-center text-base">{subheading}</p>
      </div>
    </Col>
  )
}
