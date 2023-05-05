import { Trans } from '@lingui/macro'
import Loading from 'components/Loading'
import template from 'lodash/template'
import { projectTagText } from 'models/project-tags'
import Image from 'next/image'
import { HomepageCard } from '../../HomepageCard'
import { ProjectCarousel } from '../../ProjectCarousel'
import { SectionHeading } from '../../SectionHeading'
import { useExploreCategories } from '../hooks/useExploreCategories'

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
