import { customElement } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';

@customElement('footer-nav')
export class FooterNav extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          margin: 0 20px;
        }

        .copyright {
          padding: 15px 0 0;
          float: left;
        }

        .coc {
          display: block;
        }

        .nav-inline {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer-logo {
          margin: 10px 30px 0 0;
          height: 24px;
          width: 120px;
          float: left;
        }

        a {
          color: var(--footer-text-color);
          padding-bottom: 2px;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        .footer-title {
          color: var(--default-primary-color);
          font-weight: 600;
        }

        @media (min-width: 768px) {
          :host {
            margin: 15px 0;
          }
        }

        @media (min-width: 505px) {
          .copyright {
            margin: 0;
            padding: 15px 0 0 0;
            float: right;
            text-align: right;
          }

          .coc {
            display: inline-flex;
          }
        }
      </style>

      <div class="nav-inline" layout flex>
        <div class="copyright">
          Copyright &copy; [[_getYear()]] by Kurniawan Alcantara
          <div>Koord Divisi Media Dana dan Kerjasama</div>
        </div>
      </div>
    `;
  }

  _getYear() {
    return new Date().getFullYear();
  }
}
