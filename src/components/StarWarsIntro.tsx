import React, { useEffect, useMemo } from 'react'

const StarWarsIntro: React.FC<{ onClick: VoidFunction }> = ({ onClick }) => {
  useEffect(() => {
    // get element by id
    const galaxyFarAwayContainer = document.getElementById('galaxy-far-away')
    const timer = setTimeout(() => {
      galaxyFarAwayContainer?.classList.add('opacity-0')
    }, 9000)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    // Start crawler
    const crawler = document.querySelector('.crawl-new')
    const timer = setTimeout(() => {
      crawler?.classList.add('crawl-new-animation')
    }, 10000)
    return () => {
      clearTimeout(timer)
    }
  })

  useEffect(() => {
    const audio = document.querySelector('audio')
    audio?.play()
  }, [])

  const generateStars = () => {
    const stars = []

    for (let i = 0; i < 200; i++) {
      stars.push(
        <i
          key={i}
          className="absolute h-0.5 w-0.5 bg-white"
          style={{
            left: `${Math.floor(Math.random() * 100)}%`,
            top: `${Math.floor(Math.random() * 100)}%`,
            opacity: `${Math.random()}`,
          }}
        ></i>,
      )
    }

    return stars
  }

  const stars = useMemo(() => generateStars(), [])

  return (
    <>
      <audio preload="auto" autoPlay={true}>
        <source
          src="https://s.cdpn.io/1202/Star_Wars_original_opening_crawl_1977.ogg"
          type="audio/ogg"
        />
        <source
          src="https://s.cdpn.io/1202/Star_Wars_original_opening_crawl_1977.mp3"
          type="audio/mpeg"
        />
      </audio>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
        {stars}
        <div
          className="relative h-full w-full cursor-pointer overflow-hidden"
          style={{ perspective: '300px' }}
          onClick={onClick}
        >
          <div
            id="galaxy-far-away"
            className="absolute z-20 flex h-full w-full items-center justify-center bg-black"
          >
            <div className="fade-in-out-animation w-full max-w-lg transform-gpu px-2 text-4xl font-semibold leading-relaxed text-[#43a5cf]">
              A long time ago in a DAO far, far away...
            </div>
          </div>

          <div className="absolute z-10 flex h-full w-full items-center justify-center text-center">
            <h1 className="star-wars-header star-wars-logo-animation text-[30vw] leading-[0.8] text-[#FFE81F]">
              Juice
              <br />
              Box
            </h1>
          </div>

          <div className="fade"></div>
          <section className="star-wars">
            <div className="crawl-new">
              <div className="title">
                <p>Episode IV</p>
                <h1>Rise of the Degens</h1>
              </div>

              <p>
                In an era of economic turmoil, the once-renowned JUICEBOX, a
                crypto fundraising protocol on Ethereum, faces its greatest
                challenge. Amidst global decline and bearish sentiment, the
                protocol struggles to maintain its footing.
              </p>

              <p>
                Juicebox once fueled projects like ConstitutionDAO, MoonDAO, and
                AssangeDAO, amassing millions during the 2020 bear market. Now
                at a crossroads, grifters have come and gone, leaving the
                committed JUICEBOXDAO contributors to revive its former glory.
              </p>
              <p>
                As the bear market's shadows darken, JUICEBOXDAO must forge a
                new path of innovation and rebirth for the once-mighty
                protocol...
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default StarWarsIntro
