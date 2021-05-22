import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior';
import '@polymer/paper-button';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import 'plastic-image';
import { html, PolymerElement } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import { ReduxMixin } from '../../mixins/redux-mixin';
import { RootState, store } from '../../store';
import { closeDialog } from '../../store/dialogs/actions';
import { updateDataUser } from '../../store/signup/actions';
import '../lkim-icons';
import '../shared-styles';
import './dialog-styles'
import { showToast } from '../../store/toast/actions';
class EditProfileDialog extends ReduxMixin(mixinBehaviors([IronOverlayBehavior], PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles dialog-styles flex flex-alignment">
        :host {
          padding: 0;
          --paper-input-container-focus-color: var(--default-primary-color);
          --paper-input-container-color: var(--disabled-text-color);
          --paper-input-container-label: {
            padding: 4px 0;
            background: #fff;
            font-weight: 600;
          };
          --paper-input-container-font-family: var(--font-family);
        }

        app-header {
          background-color: var(--primary-background-color);
        }

        .dialog-header {
          background-color: var(--primary-background-color);
          border-bottom: 1px solid var(--divider-color);
        }

        app-toolbar {
          height: auto;
        }

        .close-icon {
          margin: 16px 18px;
          cursor: pointer;
          color: var(--secondary-text-color);
        }

        app-toolbar,
        .dialog-content {
          padding: 12px 0;
        }

        .header-logo {
          margin-bottom: 12px;
        }

        .container-title {
          font-size: 22px;
          color: var(--primary-text-color);
          text-align: center;
        }

        .container-title::after {
          height: 3px;
          width: 50px;
        }

        .info-register {
          padding: 18px 24px;
          background: var(--focused-color);
          border-radius: 12px;
          border: 1px solid var(--default-primary-color);
          font-size: 14px;
          color: var(--text-primary-color);
        }

        paper-input:not(:last-of-type),
        paper-dropdown-menu {
          margin-bottom: 24px;
        }

        .dialog-content,
        .info-register {
          margin: 0 24px;
        }

        .section-title {
          margin: 18px 0;
        }

        .section-title-icon {
          --iron-icon-width: 24px;
          margin-right: 24px;
        }
        
        .section-input {
          padding: 0 0 0 52px;
        }

        .section-title-label {
          font-weight: 600;
        }

        .action-buttons {
          margin: 32px 24px 24px;
        }

        .action-buttons paper-button {
          width: 100%;
        }

        .close-button {
          margin-top: 16px;
        }

        .general-error {
          margin: 18px 0;
          text-align: center;
          font-size: 14px;
          color: var(--error-color);
        }

        @media (min-width: 812px) {
          .action-buttons paper-button {
            width: 60%;
          }
        }

      </style>

      <app-header-layout has-scrolling-region>
        <app-header slot="header" class="header" fixed="[[viewport.isTabletPlus]]">
          <iron-icon class="close-icon" icon="lkim:close" on-tap="_closeDialog"></iron-icon>
        </app-header>
        <app-toolbar layout vertical center>
          <div class="dialog-header">
            <div class="container-title" layout vertical center>{$ editDataProviders.title $}</div>
          </div>
        </app-toolbar>
        <div class="dialog-content">
          <div class="section-title">
            <iron-icon
              class="section-title-icon"
              icon="icons:{$ daftarProviders.title.informasidiri.icon $}"
            ></iron-icon>
            <span class="section-title-label">{$ daftarProviders.title.informasidiri.label $}</span>
          </div>
          <div class="section-input">
            <paper-input
              id="namaLengkap"
              label="{$ daftarProviders.input.fullName.label $}"
              placeholder="{$ daftarProviders.input.fullName.placeholder $}"
              value="{{namaLengkapValue}}"
              autocomplete="on"
              always-float-label
              required
              auto-validate
            >
            </paper-input>
            <paper-dropdown-menu
              id="jenisKelaminDrop"
              label="{$ daftarProviders.input.jenisKelamin.placeholder $}"
              required
            >
              <paper-listbox slot="dropdown-content" selected="0">
                <paper-item>{$ daftarProviders.input.jenisKelamin.value.pria $}</paper-item>
                <paper-item>{$ daftarProviders.input.jenisKelamin.value.wanita $}</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>
            <paper-input
              id="tanggalLahir"
              type="date"
              label="{$ daftarProviders.input.tanggalLahir.label $}"
              placeholder="{$ daftarProviders.input.tanggalLahir.placeholder $}"
              value="{{tanggalLahirValue}}"
              autocomplete="on"
              always-float-label
              required
              auto-validate$="[[validate]]"
            >
            </paper-input>
            <paper-input
              id="tempatLahir"
              label="{$ daftarProviders.input.tempatLahir.label $}"
              placeholder="{$ daftarProviders.input.tempatLahir.placeholder $}"
              value="{{tempatLahirValue}}"
              autocomplete="on"
              always-float-label
              required
              auto-validate$="[[validate]]"
            >
            </paper-input>
            <paper-input
              id="alamatSekarang"
              label="{$ daftarProviders.input.alamatSekarang.label $}"
              placeholder="{$ daftarProviders.input.alamatSekarang.placeholder $}"
              value="{{alamatSekarangValue}}"
              autocomplete="on"
              always-float-label
              required
              auto-validate$="[[validate]]"
            >
            </paper-input>
            <paper-input
              id="noWa"
              label="{$ daftarProviders.input.noWa.label $}"
              placeholder="{$ daftarProviders.input.noWa.placeholder $}"
              value="{{noWaValue}}"
              autocomplete="on"
              always-float-label
              required
              pattern="[0-9]*"
              auto-validate$="[[validate]]"
            >
            </paper-input>
            <paper-input
              id="instagram"
              label="{$ daftarProviders.input.instagram.label $}"
              placeholder="{$ daftarProviders.input.instagram.placeholder $}"
              value="{{instagramValue}}"
              autocomplete="on"
              always-float-label
            >
            </paper-input>
          </div>
          <div class="section-title">
            <iron-icon
              class="section-title-icon"
              icon="icons:{$ daftarProviders.title.jenjangStudi.icon $}"
            ></iron-icon>
            <span class="section-title-label">{$ daftarProviders.title.jenjangStudi.label $}</span>
          </div>
          <div class="section-input">
            <paper-dropdown-menu
              id="fakultasDrop"
              label="{$ daftarProviders.input.fakultas.placeholder $}"
              required
            >
              <paper-listbox slot="dropdown-content" selected="0">
                <paper-item>{$ daftarProviders.input.fakultas.value.ftk $}</paper-item>
                <paper-item>{$ daftarProviders.input.fakultas.value.fudk $}</paper-item>
                <paper-item>{$ daftarProviders.input.fakultas.value.fsh $}</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>
            <paper-dropdown-menu
              id="jurusanDrop"
              label="{$ daftarProviders.input.jurusan.placeholder $}"
              required
            >
              <paper-listbox slot="dropdown-content" selected="0">
                <paper-item>{$ daftarProviders.input.jurusan.value.pai $}</paper-item>
                <paper-item>{$ daftarProviders.input.jurusan.value.tbi $}</paper-item>
                <paper-item>{$ daftarProviders.input.jurusan.value.afi $}</paper-item>
                <paper-item>{$ daftarProviders.input.jurusan.value.as $}</paper-item>
                <paper-item>{$ daftarProviders.input.jurusan.value.hes $}</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>
            <paper-input
              id="semester"
              label="{$ daftarProviders.input.semester.label $}"
              placeholder="{$ daftarProviders.input.semester.placeholder $}"
              value="{{semesterValue}}"
              autocomplete="on"
              always-float-label
              required
              pattern="[0-9]*"
              auto-validate$="[[validate]]"
            >
            </paper-input>
          </div>
          <div class="section-title">
            <iron-icon
              class="section-title-icon"
              icon="icons:{$ daftarProviders.title.infoAkun.icon $}"
            ></iron-icon>
            <span class="section-title-label">{$ daftarProviders.title.infoAkun.label $}</span>
          </div>
          <div class="section-input">
            <paper-input
              id="emailUser"
              label="{$ daftarProviders.input.email.label $}"
              placeholder="{$ daftarProviders.input.email.placeholder $}"
              value="{{emailValue}}"
              autocomplete="on"
              required
              auto-validate$="[[validate]]"
              error-message="{$ daftarProviders.input.email.errorOccured $}"
              always-float-label
            >
            </paper-input>
          </div>
          <div class="general-error" hidden$="[[!errorOccurred]]">
            [[errorMessage]]
          </div>
          <div class="action-buttons" layout vertical center>
            <paper-button
              on-click="_saveData"
              ga-on="click"
              ga-event-category="pendaftaran"
              ga-event-action="klik daftar"
              ga-event-label="daftar block"
              primary
            >
              {$ editDataProviders.action.submit $}
            </paper-button>
            <paper-button class="close-button" on-click="_closeDialog"
              >{$ cancel $}
            </paper-button>
          </div>
        </div>
      </app-header-layout>
    `;
  }

  static get is() {
    return 'editprofile-dialog';
  }

  private namaLengkapValue: string;
  private tanggalLahirValue: string;
  private tempatLahirValue: string;
  private alamatSekarangValue: string;
  private noWaValue: string;
  private instagramValue: string;
  private semesterValue: string;
  private emailValue: string;

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
      validate: {
        type: Boolean,
        value: true,
      },
      errorOccurred: {
        type: Boolean,
        value: false,
      },
      errorMessage: {
        type: String,
      },
      keyboardOpened: {
        type: Boolean,
        value: false,
      },
      data: {
        type: Object,
      },
      initialHeight: Number,
      namaLengkapValue: String,
      jenisKelaminValue: String,
      tanggalLahirValue: String,
      tempatLahirValue: String,
      alamatSekarangValue: String,
      noWaValue: String,
      instagramValue: String,
      fakultasValue: String,
      jurusanValue: String,
      semesterValue: String,
      emailValue: String,
    };
  }

  stateChanged(state: RootState) {
    this.setProperties({
      credential: state.credential,
      ui: state.ui,
      viewport: state.ui.viewport
    });
  }

  static get observers() {
    return ['_handleDialogToggled(opened, data)'];
  }

  ready() {
    super.ready();
    this.initialHeight = window.innerHeight;
    this.addEventListener('iron-resize', this._resize);
  }

  _handleDialogToggled(opened, data) {
    if (data) {
      const jenisKelaminInput = this.shadowRoot.querySelector('#jenisKelaminDrop');
      const fakultasInput = this.shadowRoot.querySelector('#fakultasDrop');
      const jurusanInput = this.shadowRoot.querySelector('#jurusanDrop');
      this.errorOccurred = data.errorOccurred;
      this.errorMessage = data.errorMessage;
      this.namaLengkapValue = data.namaLengkap;
      this.tanggalLahirValue = data.tanggalLahir;
      this.tempatLahirValue = data.tempatLahir;
      this.alamatSekarangValue = data.alamatSekarang;
      this.noWaValue = data.noWa;
      this.instagramValue = data.instagram;
      this.semesterValue = data.semester;
      this.emailValue = data.email;
      jurusanInput.value = data.jurusan;
      fakultasInput.value = data.fakultas;
      jenisKelaminInput.value = data.jenisKelamin
    } else {
      data = {};
    }
  }

  _validateEmail(email) {
    // https://stackoverflow.com/a/742588/26406
    const emailRegularExpression = /^[^@\s]+@[^@\s.]+\.[^@.\s]+$/;
    return emailRegularExpression.test(email);
  }

  _closeDialog() {
    closeDialog();
  }

  _saveData() {
    this.errorOccurred = false;
    const namaLengkapInput = this.shadowRoot.querySelector('#namaLengkap');
    const jenisKelaminInput = this.shadowRoot.querySelector('#jenisKelaminDrop');
    const tanggalLahirInput = this.shadowRoot.querySelector('#tanggalLahir');
    const tempatLahirInput = this.shadowRoot.querySelector('#tempatLahir');
    const alamatSekarangInput = this.shadowRoot.querySelector('#alamatSekarang');
    const noWaInput = this.shadowRoot.querySelector('#noWa');
    const instagramInput = this.shadowRoot.querySelector('#instagram');
    const fakultasInput = this.shadowRoot.querySelector('#fakultasDrop');
    const jurusanInput = this.shadowRoot.querySelector('#jurusanDrop');
    const semesterInput = this.shadowRoot.querySelector('#semester');
    const emailInput = this.shadowRoot.querySelector('#emailUser');
    
    if (!namaLengkapInput.validate() || !tanggalLahirInput.validate() || !tempatLahirInput.validate() || !alamatSekarangInput.validate() || !noWaInput.validate() || !instagramInput.validate() || !semesterInput.validate()) {
      this.errorOccurred = true;
      this.errorMessage = 'Harap periksa kembali data anda';
      return;
    }

    if (!emailInput.validate() || !this._validateEmail(emailInput.value)) {
      emailInput.invalid = true;
      this.errorOccurred = true;
      this.errorMessage = 'Format email salah!';
      return;
    }

    showToast({ message: 'Memproses...'});
    this._submit({
      firstFieldValue: this.namaLengkapValue,
      secondFieldValue: jenisKelaminInput.value,
      thirdFieldValue: this.tanggalLahirValue,
      fourthFieldValue: this.tempatLahirValue,
      fifthFieldValue: this.alamatSekarangValue,
      sixthFieldValue: this.noWaValue,
      seventhFieldValue: this.instagramValue,
      eighthFieldValue: fakultasInput.value,
      ninethFieldValue: jurusanInput.value,
      tenthFieldValue: this.semesterValue,
      email: this.emailValue,
    });
  }

  _submit(userData) {
    updateDataUser(userData, this.credential.uid);
  }

  _clear() {
    this.namaLengkapValue = '';
    this.tanggalLahirValue = '';
    this.tempatLahirValue = '';
    this.alamatSekarangValue = '';
    this.noWaValue = '';
    this.instagramValue = '';
    this.semesterValue = '';
    this.emailValue = '';
    this.passwordValue = '';
  }

  _resize(e) {
    if (this.keyboardOpened) {
      const header = this.shadowRoot.querySelector('.dialog-header');
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

window.customElements.define(EditProfileDialog.is, EditProfileDialog);
