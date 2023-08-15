import { Trans } from '@lingui/macro'
import { HomepageCard } from 'components/Home/HomepageCard'
import { useExploreCategories } from 'components/Home/JuicyPicksSection/hooks/useExploreCategories'
import { ProjectCarousel } from 'components/Home/ProjectCarousel'
import { SectionHeading } from 'components/Home/SectionHeading'
import Loading from 'components/Loading'
import template from 'lodash/template'
import { projectTagText } from 'models/project-tags'
import Image from 'next/image'

export const ExploreCategories = () => {
  const { tags, isLoading } = useExploreCategories()
  return (
    <div>
      <SectionHeading
        className="mb-12"
        heading={<Trans>Explore categories</Trans>}
        subheading={
          <Trans>
            Whether it's a fundraiser or NFT project, we've got you covered.
          </Trans>
        }
      />

      {isLoading ? (
        <Loading size="large" />
      ) : (
        <ProjectCarousel
          items={tags.map(tag => (
            <HomepageCard
              key={tag}
              title={projectTagText[tag]()}
              img={
                <Image
                  className="h-full w-full object-cover object-center"
                  src={CategoryImagePath({ tag })}
                  alt={tag}
                  loading="lazy"
                  height={240}
                  width={280}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              }
              href={CategoryLink({ tag })}
            />
          ))}
        />
      )}
    </div>
  )
}

const CategoryImagePath = template(
  '/assets/images/home/categories/<%= tag %>.jpg',
)

const CategoryLink = template('/projects?tab=all&search=&tags=<%= tag %>')
