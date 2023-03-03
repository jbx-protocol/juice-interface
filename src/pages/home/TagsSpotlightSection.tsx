import ProjectTagSpotlight from 'pages/projects/ProjectTagSpotlight'

export default function TagsSpotlightSection() {
  return (
    <section className="my-10 mx-auto max-w-5xl">
      <ProjectTagSpotlight tag={'art'} />
      <ProjectTagSpotlight tag={'revenue'} />
    </section>
  )
}
