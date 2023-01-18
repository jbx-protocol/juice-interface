import { Button } from 'antd'
import { SectionHeading } from './SectionHeading'

export function NewsletterSection() {
  return (
    <section className="bg-juice-100">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <SectionHeading className="mb-4 text-4xl  text-black">
            Stay up to date
          </SectionHeading>
          <p className="text-gray-600 mb-6 text-center text-base">
            Subscribe to our newsletter to get the latest updates from the
            Juicebox ecosystem.
          </p>
          <Button
            size="large"
            type="primary"
            href="https://newsletter.juicebox.money"
            target="_blank"
            rel="noopener noreferrer"
          >
            Subscribe Now
          </Button>
        </div>
      </div>
    </section>
  )
}
