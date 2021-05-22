import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior';
import { html, PolymerElement } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import { ReduxMixin } from '../../mixins/redux-mixin';
import { RootState } from '../../store';
import 'plastic-image';
import '@polymer/paper-input/paper-input';
import '@polymer/iron-icon';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import { closeDialog, openDialog } from '../../store/dialogs/actions';
import { DIALOGS } from '../../store/dialogs/types';
import { signOut } from '../../store/credential/actions';
import '../lkim-icons';
import '../shared-styles';

class ProfileDialog extends ReduxMixin(mixinBehaviors([IronOverlayBehavior], PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles dialog-styles flex flex-alignment">
        :host {
          --paper-input-container-underline: {
            display: none;
            height: 0;
          }
          --paper-input-container-underline-focus: {
            display: none;
            height: 0;
          }
        }
        
        app-header {
          background-color: var(--primary-background-color);
        }

        app-toolbar {
          min-height: 120px;
          background-color: var(--additional-background-color);
        }

        .dialog-header {
          text-align: center;
          position: relative;
        }

        app-toolbar,
        .dialog-content {
          padding: 12px 0;
        }

        .header-logo {
          width: 150px;
          height: 150px;
          background-color: var(--contrast-additional-background-color);
          border-radius: 50%;
          overflow: hidden;
          position: absolute;
          top: 25px;
          margin-bottom: 12px;
        }

        .dialog-content {
          margin: 100px 24px 32px;
        }

        .section-title {
          margin: 18px 0;
        }

        .section-title-icon {
          --iron-icon-width: 24px;
          margin-right: 24px;
        }

        .section-title-label {
          font-weight: 600;
        }

        .section-value {
          padding: 0 0 0 52px;
        }

        .title-value {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-bottom: 8px;
        }

        .content-value {
          font-size: 14px;
        } 

        .section-value:not(:last-of-type) {
          margin-bottom: 18px;
        }

        .action-button {
          padding: 10px 16px;
        }
        
        .action-button paper-button {
          margin-bottom: 12px;
          min-width: 75%;
        }

        .general-error {
          margin: 18px 0;
          text-align: center;
          font-size: 14px;
          color: var(--error-color);
        }
      </style>

      <app-header-layout has-scrolling-region>
        <app-header slot="header" class="header" fixed="[[viewport.isTabletPlus]]">
          <iron-icon class="close-icon" icon="lkim:close" on-tap="_close"></iron-icon>
        </app-header>
        <app-toolbar layout vertical center>
          <div class="dialog-header" layout vertical center>
            <plastic-image
              class="header-logo"
              sizing="cover"
              srcset="{$ profile.profileImage $}"
              alt="[[user.nama_lengkap]]"
            ></plastic-image>
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
          <div class="section-value">
            <div class="title-value">{$ daftarProviders.input.fullName.label $}</div>
            <div class="content-value">[[user.nama_lengkap]]</div>
          </div>
          <div class="section-value">
            <div class="title-value">{$ daftarProviders.input.jenisKelamin.placeholder $}</div>
            <div class="content-value">[[user.jenis_kelamin]]</div>
          </div>
          <div class="section-value">
            <div class="title-value">{$ daftarProviders.input.tanggalLahir.label $}</div>
            <div class="content-value">[[user.tanggal_lahir]]</div>
          </div>
          <div class="section-value">
            <div class="title-value">{$ daftarProviders.input.alamatSekarang.label $}</div>
            <div class="content-value">[[user.alamat_sekarang]]</div>
          </div>
          <div class="section-value">
            <div class="title-value">{$ daftarProviders.input.noWa.label $}</div>
            <div class="content-value">[[user.no_whatsapp]]</div>
          </div>
          <div class="section-value">
            <div class="title-value">{$ daftarProviders.input.instagram.label $}</div>
            <div class="content-value">[[user.instagram_id]]</div>
          </div>
          <div class="section-title">
            <iron-icon
              class="section-title-icon"
              icon="icons:{$ daftarProviders.title.jenjangStudi.icon $}"
            ></iron-icon>
            <span class="section-title-label">{$ daftarProviders.title.jenjangStudi.label $}</span>
          </div>
          <div class="section-value">
            <div class="title-value">{$ daftarProviders.input.fakultas.placeholder $}</div>
            <div class="content-value">[[user.fakultas]]</div>
          </div>
          <div class="section-value">
            <div class="title-value">{$ daftarProviders.input.jurusan.placeholder $}</div>
            <div class="content-value">[[user.jurusan]]</div>
          </div>
          <div class="section-value">
            <div class="title-value">{$ daftarProviders.input.semester.label $}</div>
            <div class="content-value">[[user.semester]]</div>
          </div>
          <div class="section-title">
            <iron-icon
              class="section-title-icon"
              icon="icons:{$ daftarProviders.title.infoAkun.icon $}"
            ></iron-icon>
            <span class="section-title-label">{$ daftarProviders.title.infoAkun.label $}</span>
          </div>
          <div class="section-value">
            <div class="title-value">{$ daftarProviders.input.email.label $}</div>
            <div class="content-value">[[user.email]]</div>
          </div>
        </div>
        <div class="action-button" layout vertical center>
          <paper-button
            class="button-change-data"
            on-click="_changeData"
            ga-on="click"
            ga-event-category="profile"
            ga-event-action="klik changeData"
            ga-event-label="changeData block"
            primary
          >
            {$ profile.actions.changeData $}
          </paper-button>
          <paper-button
            class="button-change-password"
            on-click="_changePassword"
            ga-on="click"
            ga-event-category="profile"
            ga-event-action="klik changePassword"
            ga-event-label="changePassword block"
            primary
            stroke
          >
            {$ profile.actions.changePassword $}
          </paper-button>
          <paper-button
            class="button-logout"
            on-click="_logout"
            ga-on="click"
            ga-event-category="profile"
            ga-event-action="klik logout"
            ga-event-label="logout block"
            danger
          >
            {$ profile.actions.logout $}
          </paper-button>
        </div>
      </app-header-layout>
    `;
  }

  static get is() {
    return 'profile-dialog';
  }

  static get properties() {
    return {
      ui: {
        type: Object,
      },
      viewport: {
        type: Object,
      },
      errorOccurred: {
        type: Boolean,
        value: false,
      },
      errorMessage: {
        type: String,
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
      viewport: state.ui.viewport
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
    return ['_handleDialogToggled(opened, data)', '_credentialChanged(credential)'];
  }

  _credentialChanged(credential) {
    if (!credential.signedIn) {
      closeDialog();
    }
  }

  _handleDialogToggled(opened, data) {
    if (data) {
      this.errorOccurred = data.errorOccurred;
      this.errorMessage = data.errorMessage;
    } else {
      data = {};
    }
  }

  _close() {
    closeDialog();
  }

  _logout() {
    signOut();
  }

  _changePassword() {
    openDialog(DIALOGS.CHANGEPASS, {});
  }

  _changeData() {
    openDialog(DIALOGS.EDITPROFILE, {
      email: this.user.email,
      namaLengkap: this.user.nama_lengkap,
      tanggalLahir: this.user.tanggal_lahir,
      tempatLahir: this.user.tempat_lahir,
      alamatSekarang: this.user.alamat_sekarang,
      jenisKelamin: this.user.jenis_kelamin,
      noWa: this.user.no_whatsapp,
      instagram: this.user.instagram_id,
      fakultas: this.user.fakultas,
      jurusan: this.user.jurusan,
      semester: this.user.semester
    });
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

window.customElements.define(ProfileDialog.is, ProfileDialog);
