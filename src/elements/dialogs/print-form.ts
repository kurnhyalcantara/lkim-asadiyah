/* eslint-disable max-len */
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior';
import { PolymerElement, html } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import { ReduxMixin } from '../../mixins/redux-mixin';
import { RootState } from '../../store';
import { closeDialog, openDialog } from '../../store/dialogs/actions';
import { DIALOGS } from '../../store/dialogs/types';
import 'plastic-image';
import '@polymer/paper-button';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/iron-icon';
import '../shared-styles';
import { printPdf } from '../../utils/pdf-print';
import { showToast } from '../../store/toast/actions';

class PrintForm extends ReduxMixin(mixinBehaviors([IronOverlayBehavior], PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles dialog-styles flex flex-alignment">

        :host {
          padding: 16px;
        }

        app-header {
          background: var(--primary-background-color);
        }

        .dialog-content {
          padding: 14px;
        }

        .header-content {
          text-align: center;
          font-weight: 900;
        }

        .header-logo {
          margin: 18px; 0;
        }

        .section-content {
          display: grid;
          grid-column-gap: 34px;
          grid-template-columns: 121px auto;
          margin: 24px 0;
        }

        paper-button {
          width: 100%;
        }

        .change-data {
          margin-bottom: 12px;
        }

        iron-icon {
          margin-right: 12px;
        }
      </style>
      <app-header-layout has-scrolling-region>
        <app-header slot="header" class="header" fixed="[[viewport.isTabletPlus]]">
          <iron-icon class="close-icon" icon="lkim:close" on-tap="_close"></iron-icon>
        </app-header>
        <div id="dialog-content" style="padding: 14px;">
          <div style="text-align: center; font-weight: 900;">
            <img class="header-logo" src="/images/manifest/icon-114.png" />
            <h1>{$ printForm.headerTitle $}</h1>
            <h3>{$ printForm.headerSubTitle $}</h3>
            <hr />
          </div>
          <div class="content">
            <div
              class="section-content"
              style="display: grid; grid-column-gap: 34px;
              grid-template-columns: 121px auto;
              margin: 24px 0;"
            >
              <div class="name">{$ daftarProviders.input.fullName.label $}:</div>
              <div class="value">[[user.nama_lengkap]]</div>
            </div>
            <div
              class="section-content"
              style="display: grid; grid-column-gap: 34px;
              grid-template-columns: 121px auto;
              margin: 24px 0;"
            >
              <div class="name">{$ daftarProviders.input.jenisKelamin.placeholder $}:</div>
              <div class="value">[[user.jenisKelamin]]</div>
            </div>
            <div
              class="section-content"
              style="display: grid; grid-column-gap: 34px;
            grid-template-columns: 121px auto;
            margin: 24px 0;"
            >
              <div class="name">{$ daftarProviders.input.tanggalLahir.label $}:</div>
              <div class="value">[[user.tanggalLahir]]</div>
            </div>
            <div
              class="section-content"
              style="display: grid; grid-column-gap: 34px;
            grid-template-columns: 121px auto;
            margin: 24px 0;"
            >
              <div class="name">{$ daftarProviders.input.alamatSekarang.label $}:</div>
              <div class="value">[[user.alamatSekarang]]</div>
            </div>
            <div
              class="section-content"
              style="display: grid; grid-column-gap: 34px;
            grid-template-columns: 121px auto;
            margin: 24px 0;"
            >
              <div class="name">{$ daftarProviders.input.noWa.label $}:</div>
              <div class="value">[[user.whatsapp]]</div>
            </div>
            <div
              class="section-content"
              style="display: grid; grid-column-gap: 34px;
            grid-template-columns: 121px auto;
            margin: 24px 0;"
            >
              <div class="name">{$ daftarProviders.input.instagram.label $}:</div>
              <div class="value">[[user.instagram]]</div>
            </div>
            <div
              class="section-content"
              style="display: grid; grid-column-gap: 34px;
            grid-template-columns: 121px auto;
            margin: 24px 0;"
            >
              <div class="name">{$ daftarProviders.input.fakultas.placeholder $}:</div>
              <div class="value">[[user.fakultas]]</div>
            </div>
            <div
              class="section-content"
              style="display: grid; grid-column-gap: 34px;
            grid-template-columns: 121px auto;
            margin: 24px 0;"
            >
              <div class="name">{$ daftarProviders.input.jurusan.placeholder $}:</div>
              <div class="value">[[user.jurusan]]</div>
            </div>
            <div
              class="section-content"
              style="display: grid; grid-column-gap: 34px;
            grid-template-columns: 121px auto;
            margin: 24px 0;"
            >
              <div class="name">{$ daftarProviders.input.semester.label $}:</div>
              <div class="value">[[user.semester]]</div>
            </div>
            <div
              class="section-content"
              style="display: grid; grid-column-gap: 34px;
            grid-template-columns: 121px auto;
            margin: 24px 0;"
            >
              <div class="name">{$ daftarProviders.input.email.label $}:</div>
              <div class="value">[[user.email]]</div>
            </div>
          </div>
          <div class="statement">
            <h4 style="font-weight: 600; text-decoration: underline; text-align: center;">
              Pernyataan
            </h4>
            <p>
              Yang bertanda tangan dibawah ini, calon peserta Pelatihan Karya Tulis Ilmiah yang
              diselenggarakan oleh LKIM IAI As'adiyah dengan ini menyatakan setuju terhadap beberapa
              ketentuan berikut ini :
            </p>
            <ol>
              <li>Hadir pada waktu pada hari dan waktu yang telah ditentukan</li>
              <li>Pada waktu pelatihan sedang berlangsung wajib men-silent-kan ponsel</li>
            </ol>
          </div>
          <div class="signplace" style="text-align: right; margin-top: 32px;">
            <div class="tanggal">Sengkang..................................................</div>
            <div class="label" style="margin: 38px 0;">Calon peserta</div>
            <div class="name" style="margin-top: 89px;">[[user.nama_lengkap]]</div>
          </div>
        </div>
        <div class="action-button" layout vertical center>
          <paper-button class="change-data" primary stroke on-click="_changeData"
            >Ubah Data</paper-button
          >
          <paper-button primary on-click="_printPdf">
            <iron-icon icon="icons:print"></iron-icon>
            <span>Download</span>
          </paper-button>
        </div>
      </app-header-layout>
    `;
  }
  static get is() {
    return 'print-form';
  }

  static get properties() {
    return {
      ui: {
        type: Object,
      },
      viewport: {
        type: Object,
      },
      credential: {
        type: Object,
      },
      user: {
        type: Object,
      },
    };
  }

  stateChanged(state: RootState) {
    this.setProperties({
      credential: state.credential,
      ui: state.ui,
      user: state.user,
      viewport: state.ui.viewport,
    });
  }

  ready() {
    super.ready();
    this.initialHeight = window.innerHeight;
    this.addEventListener('iron-resize', this._resize);
  }

  constructor() {
    super();
    this.addEventListener('iron-overlay-canceled', this._close);
  }

  static get observers() {
    return ['_credentialChanged(credential)'];
  }

  _credentialChanged(credential) {
    if (!credential.signedIn) {
      closeDialog();
    }
  }

  _close() {
    closeDialog();
  }

  _printPdf() {
    const domElement = this.shadowRoot.querySelector('#dialog-content');
    setTimeout(() => {
      printPdf(domElement);
    }, 10);
    showToast({
      message: 'Sedang memproses dokumen',
    });
  }

  _changeData() {
    openDialog(DIALOGS.EDITPROFILE, {
      email: this.user.email,
      namaLengkap: this.user.nama_lengkap,
      tanggalLahir: this.user.tanggalLahir,
      tempatLahir: this.user.tempatLahir,
      alamatSekarang: this.user.alamatSekarang,
      jenisKelamin: this.user.jenisKelamin,
      noWa: this.user.whatsapp,
      instagram: this.user.instagram,
      fakultas: this.user.fakultas,
      jurusan: this.user.jurusan,
      semester: this.user.semester,
    });
  }

  _resize(e) {
    if (this.keyboardOpened) {
      const header = this.shadowRoot.querySelector('.header');
      const headerHeight = header.offsetHeight;

      setTimeout(() => {
        requestAnimationFrame(() => {
          this.style.maxHeight = `${this.initialHeight}px`;
          this.style.top = `-${headerHeight}px`;
        });
      }, 10);
    }
  }
}

window.customElements.define(PrintForm.is, PrintForm);
