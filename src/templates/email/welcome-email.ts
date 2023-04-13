import he from 'he'
import mjml from 'mjml'

const template = `
<mjml>
  <mj-head>
    <mj-raw>
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
    </mj-raw>

    <mj-style>
      h1 {
      font-size: 21px;
      }

      a {
      color: black !important;
      }

      body {
      background-color: white;
      color: black;
      }

      p,
      ul,
      ol,
      blockquote {
      margin: 0.4em 0 1.1875em;
      font-size: 16px;
      line-height: 1.625;
      }

      .dark-img {
      display: none;
      }

      .text-secondary {
      color: #a3a3a3;
      }

      .font-sm {
      font-size: 13px;
      }

      .stroke-tertiary {
      border-width: 1px;
      border-style: solid;
      border-color: #e5e5e5 !important;
      }

      :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
      }

      @media (prefers-color-scheme: dark) {

      body {
      background-color: #201e29 !important;
      color: white !important;
      }

      p,
      a,
      ul,
      ol,
      blockquote,
      h1,
      h2,
      h3,
      span,
      table {
      color: white !important;
      }

      .darkmode {
      background-color: #20272D !important;
      }

      /* Used to hide light image on dark mode */
      .light-img {
      display: none !important;
      }

      .dark-img {
      display: block !important;
      }

      .text-secondary {
      color: #A29FB7 !important;
      }

      .stroke-tertiary {
      border-color: #5F5C7A !important;
      }
      }
    </mj-style>
  </mj-head>

  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image css-class="light-img" width="140px" height="32px" alt="Juicebox" src="https://juicebox.money/assets/juice-logo-full_black.png" />
        <mj-image css-class="dark-img" width="140px" height="32px" alt="Juicebox" src="https://juicebox.money/assets/juice-logo-full_white.png" />

        <mj-text>
          <p>Welcome to Juicebox!</p>
          <p>Juicebox is an open-source web3 funding protocol.</p>
          <p>Juicebox gives you all the tools to configure, launch and fund your very own project, your way. It's fun, flexible, most importantly, <a href="https://docs.juicebox.money/dao/">community owned</a>.</p>
          <p>Here are some useful resources:</p>
          <ul>
            <li><a href="https://juicebox.money/create">Create a project</a> with our easy-to-use project builder.</li>
            <li><a href="https://juicebox.money/projects">Explore projects</a> to see how communities are using Juicebox to fund their dreams.</li>
            <li><a href="https://docs.juicebox.money/">Read the docs</a> to learn tips for making your project a success.</li>
          </ul>
          <p>Have questions? Connect with our community of devs and project creators <a href="https://discord.com/invite/wFTh4QnDzk">on Discord</a>.</p>
          <p>Happy funding!!</p>
          <br />
          <p>With love,</p>
          <p>Peel (the front end team for Juicebox)</p>
        </mj-text>

      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section>
      <mj-column>
        <mj-text align="center">
          <p class="font-sm">© 2023 Juicebox. All rights reserved.</p>
        </mj-text>
      </mj-column>

    </mj-section>
  </mj-body>

</mjml>`

const subjectTemplate = 'Welcome to Juicebox!'

export const welcomeEmailTemplate = () => {
  const renderedBody = template
  const subject = subjectTemplate

  const htmlBody = mjml(renderedBody, {
    validationLevel: 'strict',
  }).html

  return {
    subject: he.decode(subject),
    htmlBody,
  }
}
