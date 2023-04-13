import { Col } from 'antd'

export function WhyJuiceboxCard({
  bgClass,
  iconBgClass,
  icon,
  heading,
  content,
}: {
  bgClass: string
  iconBgClass: string
  icon: JSX.Element
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
            {icon}
          </div>
        </div>
        <h6 className="text-primary text-2xl dark:text-grey-900">{heading}</h6>
        <p className="text-primary text-sm dark:text-grey-900">{content}</p>
      </div>
    </Col>
  )
}
