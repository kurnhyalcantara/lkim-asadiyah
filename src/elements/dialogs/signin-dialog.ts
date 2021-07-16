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
import { signIn } from '../../store/credential/actions';
import '../lkim-icons';
import '../shared-styles';

class SigninDialog extends ReduxMixin(mixinBehaviors([IronOverlayBehavior], PolymerElement)) {
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

        .dialog-header {
          text-align: center;
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

        .dialog-content {
          margin: 0 24px;
        }

        .action-input {
          padding: 16px 16px;
          box-shadow: 1px 1px 1px var(--default-primary-color),
            -1px -1px 2px var(--default-primary-color);
          border-radius: 12px;
        }

        .action-button {
          margin-top: 22px;
        }

        paper-input:not(:last-of-type) {
          margin-bottom: 18px;
        }

        .action-login,
        .action-forgot-password {
          min-width: 75%;
        }

        .action-forgot-password {
          margin: 12px 0 48px;
        }

        .info-providers {
          color: var(--disabled-text-color);
        }

        .action-input iron-icon {
          margin-right: 12px;
          --iron-icon-width: 24px;
          --iron-icon-height: 24px;
        }

        .action-button iron-icon {
          margin-left: 8px;
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
              srcset="{$ signInProviders.logo $}"
              alt="{$ signInProviders.title $}"
            ></plastic-image>
            <div class="container-title" layout vertical center>{$ signInProviders.title $}</div>
            <div class="general-error" hidden$="[[!errorOccurred]]">[[errorMessage]]</div>
          </div>
        </app-toolbar>
        <div class="dialog-content" layout vertical justified>
          <div class="action-input">
            <paper-input
              id="email"
              label="{$ signInProviders.input.email $}"
              value="{{emailValue}}"
              no-label-float
            >
              <iron-icon icon="icons:mail" slot="prefix"></iron-icon>
            </paper-input>
            <paper-input
              id="password"
              label="{$ signInProviders.input.password $}"
              value="{{passValue}}"
              type="password"
              no-label-float
            >
              <iron-icon icon="icons:lock" slot="prefix"></iron-icon>
              <iron-icon
                icon="icons:[[visibilityPassword]]"
                slot="suffix"
                on-tap="_showPassword"
              ></iron-icon>
            </paper-input>
          </div>
          <div class="action-button" layout vertical center>
            <paper-button class="action-login" on-click="_signIn" primary>
              [[submitLogin]]
            </paper-button>
            <paper-button class="action-forgot-password" on-click="_forgotPassword" primary stroke>
              <span>Lupa Password</span>
              <iron-icon icon="icons:help"></iron-icon>
            </paper-button>
            <div class="info-providers">{$ signInProviders.info.p1 $}</div>
            <paper-button class="action-register" on-click="_newRegister">
              <span>{$ signInProviders.actions.newRegister $}</span>
              <iron-icon icon="lkim:arrow-right-circle"></iron-icon>
            </paper-button>
          </div>
        </div>
      </app-header-layout>
    `;
  }

  static get is() {
    return 'signin-dialog';
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
      submitLogin: {
        type: String,
        value: 'Login',
      },
      visibilityPassword: {
        type: String,
        value: 'visibility-off',
      },
      visibility: {
        type: Boolean,
        value: false,
      },
      data: {
        type: Object,
      },
      initialHeight: Number,
      emailValue: String,
      passValue: String,
    };
  }

  stateChanged(state: RootState) {
    this.setProperties({
      credential: state.credential,
      ui: state.ui,
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
    return ['_handleDialogToggled(opened, data)', '_credentialChanged(credential)'];
  }

  _credentialChanged(credential) {
    if (credential.signedIn) {
      this._clear();
      closeDialog();
    }
  }

  _handleDialogToggled(opened, data) {
    if (data) {
      this.errorOccurred = data.errorOccurred;
      this.errorMessage = data.errorMessage;
      this.submitLogin = data.submitLogin;
    } else {
      data = {};
    }
  }

  _close() {
    closeDialog();
  }

  _showPassword() {
    const passField = this.shadowRoot.querySelector('#password');
    if (!this.visibility) {
      this.visibility = true;
      this.visibilityPassword = 'visibility';
      passField.setAttribute('type', 'text');
    } else {
      this.visibility = false;
      this.visibilityPassword = 'visibility-off';
      passField.setAttribute('type', 'password');
    }
  }

  _newRegister() {
    openDialog(DIALOGS.SIGNUP, { submitLabel: 'Buat akun' });
  }

  _forgotPassword() {
    openDialog(DIALOGS.FORGOTPASS, { sendEmailSuccess: false, closeLabel: 'Batal' });
  }

  _signIn() {
    this.errorOccurred = false;
    this.submitLogin = 'Memproses...';
    signIn(this.emailValue, this.passValue);
  }

  _clear() {
    this.emailValue = '';
    this.passValue = '';
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

window.customElements.define(SigninDialog.is, SigninDialog);
