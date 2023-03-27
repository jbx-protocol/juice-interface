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
          <h1>Transaction receipt</h1>
          <p>Thanks for supporting <strong>{{ project_name }}</strong>.</p>
          <p>See complete on-chain transaction details:<br /><a href="{{ tx_url }}">{{ tx_name }}</a></p>
        </mj-text>

        <mj-table>
          <tr class="stroke-tertiary">
            <td style="padding: 12px">
              <div style="margin-bottom: 12px"><strong>Paid To</strong></div>
              <div>{{ project_name }}</div>
            </td>
            <td style="padding: 12px">
              <div style="margin-bottom: 12px"><strong>Timestamp</strong></div>
              <div>{{ timestamp }}</div>
            </td>
          </tr>
          <tr class="stroke-tertiary">
            <td style="padding: 12px">
              <div style="margin-bottom: 12px"><strong>Amount</strong></div>
              <div>{{ amount }}</div>
            </td>
            <td style="padding: 12px">
              <div style="margin-bottom: 12px"><strong>Paid By</strong></div>
              <div>{{ payer_name }}</div>
            </td>
          </tr>
        </mj-table>
        <mj-text>
          <p class="text-secondary">Juicebox is a community-owned fundraising platform for web3 creators. Help keep Juicebox alive and donate to the <a class="text-secondary" href="{{ juicebox_project_url }}">Juicebox project.</a></p>
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

</mjml>
`

const subjectTemplate =
  'Your Transaction Receipt: {{ project_name }} Contribution Details'

export const paymentReceiptTemplate = (templateData: PaymentTemplateData) => {
  const renderedBody = mustache.render(template, templateData)
  const subject = mustache.render(subjectTemplate, templateData)

  const htmlBody = mjml(renderedBody).html

  return {
    subject: he.decode(subject),
    htmlBody,
  }
}
