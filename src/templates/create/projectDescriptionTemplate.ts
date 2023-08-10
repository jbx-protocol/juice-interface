const _template = `
<p>
  Writing project descriptions can be tough, so here's a template to help you
  get started. Feel free to fill it out or delete it and write your own.
</p>
<p><br /></p>
<h2>About</h2>
<p><br /></p>
<p>
  Contributors are more likely to fund your project if they're passionate about
  your idea and feel like they can trust you. Here are a few suggestions for
  what to cover in this section:
</p>
<p><br /></p>
<ol>
  <li>
    Introduce the team behind your project and what you've worked on before
  </li>
  <li>Briefly describe your project and why you think it's important</li>
  <li>
    Provide a call to action for supporters and what they will help you achieve
  </li>
</ol>
<p><br /></p>
<p>
  Take a step back and ask yourself: if you were reading this for the first
  time, would you be ready to make a contribution?
</p>
<p><br /></p>
<h2>Details (optional)</h2>
<p><br /></p>
<p>
  If you need to add more details and/or context about your project, use this
  section to add additional information like:
</p>
<p><br /></p>
<ol>
  <li>
    How your project works (e.g. "open source software that helps you do x")
  </li>
  <li>Technical information</li>
  <li>Personal stories or other context</li>
</ol>
<p><br /></p>
<h2>Rewards</h2>
<p><br /></p>
<p>
  Use this section to talk about what contributors will receive for supporting
  your project. Maybe it's a unique artwork, a governance token, an NFT that
  unlocks membership or other benefits, or just a promise to be apart of
  something huge.
</p>
<p><br /></p>
<h2>The future</h2>
<p><br /></p>
<p>
  We all love roadmaps, so use this section to tell contributors about what's to
  come. Get them excited about your project's goals and how their support will
  help make a difference.
</p>
<p><br /></p>
<p>Here are some tips for creating a compelling roadmap:</p>
<p><br /></p>
<ul>
  <li>
    Be realistic about your timeline and add rough dates for past and future
    milestones
  </li>
  <li>
    Sprinkle in big and small milestones so that it appears more achievable to
    contributors
  </li>
  <li>
    Include an image of your roadmap, like a vertical timeline, to help make it
    more clear (click the image button above to upload)
  </li>
  <li>Be transparent about how funds will be used and where they'll go</li>
  <li>
    If your project fails or doesn't reach its goal, will you refund
    contributors? Let them know here.
  </li>
</ul>
<p><br /></p>
<h2>Risks &amp; challenges</h2>
<p><br /></p>
<p>
  Being open about the risks of your project is a great way to build trust with
  your audience. Even though your project might face certain obstacles,
  contributors tend to trust you more when you're transparent and honest about
  them.
</p>
<p><br /></p>
<ol>
  <li>What are the greatest obstacles facing your project?</li>
  <li>How will you overcome these challenges?</li>
</ol>
<p><br /></p>
<h2>Call to action</h2>
<p><br /></p>
<p>
  Lastly, finish with a strong call to action to motivate and inspire
  contributors to get excited about your project. Encourage them to get the word
  out and share with others who might be interested, even if they can't
  contribute directly themselves.
</p>
`

export const projectDescriptionTemplate = () =>
  _template.replace(/\n/g, '').trim()
