import React, { useEffect, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

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

    for (let i = 0; i < 400; i++) {
      stars.push(
        <i
          key={i}
          className="absolute h-0.5 w-0.5 bg-white"
          style={{
            left: `${Math.floor(Math.random() * 100)}%`,
            top: `${Math.floor(Math.random() * 200)}%`,
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
      <div
        className="fixed inset-0 z-50 cursor-pointer bg-black"
        onClick={onClick}
      >
        <div
          className={twMerge(
            'relative flex h-[200%] items-center justify-center overflow-hidden',
            'final-animation',
          )}
        >
          {stars}
          <div
            className="relative h-full w-full cursor-pointer overflow-hidden"
            style={{ perspective: '300px' }}
          >
            <div
              id="galaxy-far-away"
              className="absolute z-20 flex h-full w-full items-center justify-center bg-black"
            >
              <div className="fade-in-out-animation absolute top-1/4 left-1/2  w-full max-w-lg -translate-y-1/2 -translate-x-1/2 transform-gpu px-2 text-4xl font-semibold leading-relaxed text-[#43a5cf]">
                A long time ago in a DAO far, far away...
              </div>
            </div>

            <div className="absolute z-10 flex h-1/2 w-full items-center justify-center text-center">
              <h1 className="star-wars-header star-wars-logo-animation text-[30vw] leading-[0.8] text-[#FFE81F]">
                Juice
                <br />
                Box
              </h1>
            </div>

            <div className="fade"></div>
            <section className="star-wars">
              <div className="crawl-new max-w-7xl px-2 md:px-0">
                <div className="title">
                  <p>Episode XXVII</p>
                  <h1 className="text-8xl font-extrabold">
                    The Juicebox Awakening
                  </h1>
                </div>

                <p>
                  JUICEBOX reigned supreme as the decentralized fundraising
                  platform of choice, amassing thousands of ETH from renowned
                  collectives like ConstitutionDAO, MoonDAO, and SharkDAO.
                </p>
                <p>
                  Alas, the bear market struck, and a new trend lured the DEGENS
                  to ChatGPT, where they peddled digital courses and remote
                  closing. Undaunted, the Juicebox team rallied, refining the
                  protocol and rapidly deploying new features, hoping to reclaim
                  their ardent supporters and infuse more memes into the
                  ever-expanding Juicebox universe.
                </p>
                <p>
                  As the Juicebox team pushed forward, the galaxy watched with
                  bated breath. Would their tireless efforts be enough to win
                  back the hearts of the DEGENS and secure their place among the
                  stars? The fate of the platform hung in the balance, teetering
                  on the edge of oblivion. The next chapter in the Juicebox saga
                  was about to unfold, and the future of decentralized
                  fundraising would be forever changed...
                </p>
              </div>
            </section>
          </div>
          <div className="absolute bottom-48 flex w-full items-center justify-center text-center text-4xl text-white">
            <img
              className="w-full max-w-3xl "
              src="/assets/images/star-wars/may-4th.png"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default StarWarsIntro
