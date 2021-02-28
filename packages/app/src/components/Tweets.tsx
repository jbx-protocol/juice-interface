import { Col, Row } from 'antd'
import React, { CSSProperties, useEffect } from 'react'

export default function Tweets() {
  const embedClassName = 'twitter-embed'

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    document.getElementsByClassName(embedClassName)[0].appendChild(script)
  }, [])

  const colProps = {
    xs: 24,
    lg: 8,
    style: {
      textAlign: 'center',
    } as CSSProperties,
  }

  return (
    <div style={{ margin: '0 auto' }}>
      <Row className={embedClassName} gutter={15}>
        <Col {...colProps}>
          <blockquote className="twitter-tweet" data-theme="dark">
            <p lang="en" dir="ltr">
              &quot;But, how will this great idea make money?&quot;<br></br>
              Dumbest question of all time. Deprecated by Juice.
            </p>
            &mdash; jovritt (@jovritt){' '}
            <a href="https://twitter.com/jovritt/status/1365765245990547461?ref_src=twsrc%5Etfw">
              February 27, 2021
            </a>
          </blockquote>{' '}
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charSet="utf-8"
          ></script>
        </Col>
        <Col {...colProps}>
          <blockquote className="twitter-tweet" data-theme="dark">
            <p lang="en" dir="ltr">
              The web2 world is a home for companies willing to run shitty ads,
              game pricing models and hack growth in pursuit of shareholder
              profits. <br></br>Web3 will be built on common goods that provide
              value as efficiently as possible, funded through{' '}
              <a href="https://twitter.com/doworkgetjuice?ref_src=twsrc%5Etfw">
                @doworkgetjuice
              </a>{' '}
              on{' '}
              <a href="https://twitter.com/optimismPBC?ref_src=twsrc%5Etfw">
                @optimismPBC
              </a>
              .{' '}
              <a href="https://twitter.com/hashtag/dework?src=hash&amp;ref_src=twsrc%5Etfw">
                #dework
              </a>
            </p>
            &mdash; Ty (@peripheralist){' '}
            <a href="https://twitter.com/peripheralist/status/1365887761232846848?ref_src=twsrc%5Etfw">
              February 28, 2021
            </a>
          </blockquote>
        </Col>
        <Col {...colProps}>
          <blockquote className="twitter-tweet" data-theme="dark">
            <p lang="en" dir="ltr">
              “The task is…not so much to see what no one has yet seen; but to
              think what nobody has yet thought, about that which everybody
              sees” —Erwin Schrödinger{' '}
              <a href="https://twitter.com/hashtag/DeWork?src=hash&amp;ref_src=twsrc%5Etfw">
                #DeWork
              </a>{' '}
              <a href="https://twitter.com/doworkgetjuice?ref_src=twsrc%5Etfw">
                @doworkgetjuice
              </a>{' '}
              <a href="https://twitter.com/search?q=%24ETH&amp;src=ctag&amp;ref_src=twsrc%5Etfw">
                $ETH
              </a>
            </p>
            &mdash; Naseon Mieos (@NMieos){' '}
            <a href="https://twitter.com/NMieos/status/1365439312775503876?ref_src=twsrc%5Etfw">
              February 26, 2021
            </a>
          </blockquote>{' '}
        </Col>
      </Row>
    </div>
  )
}
