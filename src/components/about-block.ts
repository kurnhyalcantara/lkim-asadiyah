import { css, customElement, html } from 'lit-element';
import { ThemedElement } from './themed-element';

@customElement('about-block')
export class AboutBlock extends ThemedElement {
  static get styles() {
    return [
      ...super.styles,
      css`
        .container {
          padding-top: 64px;
        }

        .content {
          display: grid;
          grid-gap: 32px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) {
          .content {
            grid-gap: 64px;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="container">
        <div class="content">
          <div>
            <h1 class="container-title">{$ aboutBlock.title $}</h1>
            <p>{$ aboutBlock.callToAction.profilOrganisasi.brief $}</p>
            <p>{$ aboutBlock.callToAction.agendaKegiatan.description $}</p>
            <a href="{$ aboutBlock.callToAction.agendaKegiatan.link $}">
              <paper-button class="animated icon-right">
                <span>{$ aboutBlock.callToAction.agendaKegiatan.label $}</span>
                <iron-icon icon="lkim:arrow-right-circle"></iron-icon>
              </paper-button>
            </a>
          </div>
          <div layout vertical center-center>
            <plastic-image
              srcset="{$ aboutBlock.logo.image $}"
              lazy-load
              preload
              fade
            ></plastic-image>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'about-block': AboutBlock;
  }
}
