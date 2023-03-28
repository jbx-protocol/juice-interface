import he from 'he'
import mjml from 'mjml'
import mustache from 'mustache'
import { PaymentTemplateData } from './paymentTemplateData'

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

      .rounded {
      border-radius: 4px;
      }

      .rounded-2xl {
      border-radius: 16px;
      }

      .bg-card {
      background-color: #f2f2f2;
      }

      .bg-primary {
      background-color: #5777eb;
      }

      .text-secondary {
      color: #a3a3a3;
      }

      .text-sm {
      font-size: 13px;
      }

      .text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
      }

      .text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
      }

      .stroke-tertiary {
      border-width: 1px;
      border-style: solid;
      border-color: #e5e5e5 !important;
      }

      .no-underline {
      text-decoration-line: none;
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

      .bg-card {
      background-color: #494361 !important;
      }
      }
    </mj-style>
  </mj-head>

  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image css-class="light-img" width="140px" height="32px" alt="Juicebox" src="https://juicebox.money/assets/juice-logo-full_black.png" />
        <!-- TODO: remember to change to png -->
        <mj-image css-class="dark-img" width="140px" height="32px" alt="Juicebox" src="https://juicebox.money/assets/juice-logo-full_white.png" />

        <mj-text>
          <p>Hola 👋</p>
          <p>There has been some recent activity on a Juicebox project you're subscribed to.</p>
        </mj-text>

        <mj-table css-class="rounded-2xl bg-card">
          <tr>
            <td style="padding: 12px">
              <h1 class="text-3xl">{{ project_name }}</h1>
            </td>
          </tr>
          <tr>
            <td class="text-2xl" style="padding: 12px">
              <div>Payment</div>
              <strong>{{ amount }} ETH</strong>
            </td>
            <td class="text-2xl" style="padding: 12px">
              <div>From</div>
              <strong>{{ payer_name }}</strong>
            </td>
          </tr>
        </mj-table>
        <mj-text align="center">
          <span class="text-secondary text-sm">{{ timestamp }}</span>
        </mj-text>

        <mj-spacer height="40px" />
        <mj-text align="center">
          <a class="rounded bg-primary no-underline" style="margin: 40px 0; padding: 14px 30px; color: white !important" href="{{ project_url }}" target="_blank" rel="noopener noreferrer">Go to project</a>
        </mj-text>
        <mj-spacer height="40px" />

        <mj-text>
          <p><strong>Why are you receiving this?</strong></p>
          <p>You subscribed to receive updates for {{ project_name }} on <a href="https://juicebox.money">Juicebox</a>. Don't want to see these emails? <a href="{{=<% %>=}}{{{ pm:unsubscribe }}}<%={{ }}=%>">Unsubscribe</a>
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section>
      <mj-column>
        <mj-text align="center">
          <p class="text-sm">© 2023 Juicebox. All rights reserved.</p>
        </mj-text>
      </mj-column>

    </mj-section>
  </mj-body>

</mjml>
`

const subjectTemplate =
  'A juicy update: {{ project_name }} project received a payment'

export const paymentReceivedTemplate = (templateData: PaymentTemplateData) => {
  const renderedBody = mustache.render(template, templateData)
  const subject = mustache.render(subjectTemplate, templateData)

  const htmlBody = mjml(renderedBody).html

  return {
    subject: he.decode(subject),
    htmlBody,
  }
}
