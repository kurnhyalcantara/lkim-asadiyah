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
import { updateUserPassword } from '../../store/credential/actions';
import '../lkim-icons';
import '../shared-styles';
import { DIALOGS } from '../../store/dialogs/types';

class ChangePassDialog extends ReduxMixin(mixinBehaviors([IronOverlayBehavior], PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          margin: 0 auto;
          display: block;
          width: 85%;
          max-width: 420px;
          padding: 16px;
          background: var(--primary-background-color);
          border-radius: var(--border-radius);
          --paper-input-container-focus-color: var(--default-primary-color);
          --paper-input-container-color: var(--disabled-text-color);
          --paper-input-container-label: {
            padding: 4px 0;
            background: #fff;
            font-weight: 600;
          }
          --paper-input-container-font-family: var(--font-family);
        }

        .title-dialog {
          font-weight: 600;
          margin-bottom: 16px;
        }

        paper-input:not(:last-of-type) {
          margin-bottom: 24px;
        }

        .action-input iron-icon {
          margin-right: 12px;
          --iron-icon-width: 24px;
          --iron-icon-height: 24px;
        }

        .action-button {
          margin: 12px 0;
        }

        .general-error {
          margin: 18px 0;
          text-align: center;
          font-size: 14px;
          color: var(--error-color);
        }
      </style>
      <div class="dialog-content">
        <div class="title-dialog">{$ changePassword.title $}</div>
        <div class="action-input">
          <paper-input
            id="oldPassword"
            label="{$ changePassword.input.oldPasswordLabel $}"
            value="{{oldPassValue}}"
            type="password"
            always-float-label
            required
            auto-validate$="[[validate]]"
          >
            <iron-icon icon="icons:lock" slot="prefix"></iron-icon>
            <iron-icon icon="icons:visibility" slot="suffix" on-tap="_showOldPassword"></iron-icon>
          </paper-input>
          <paper-input
            id="newPassword"
            label="{$ changePassword.input.newPasswordLabel $}"
            placeholder="{$ changePassword.input.newPasswordPlaceholder $}"
            value="{{newPassValue}}"
            type="password"
            minlength="6"
            autocomplete="off"
            always-float-label
            required
            auto-validate$="[[validate]]"
          >
            <iron-icon icon="icons:lock" slot="prefix"></iron-icon>
            <iron-icon icon="icons:visibility" slot="suffix" on-tap="_showNewPassword"></iron-icon>
          </paper-input>
          <paper-input
            id="repeatPassword"
            label="{$ changePassword.input.repeatPasswordLabel $}"
            value="{{repeatPassValue}}"
            type="password"
            minlength="6"
            autocomplete="off"
            always-float-label
            required
            auto-validate$="[[validate]]"
          >
            <iron-icon icon="icons:lock" slot="prefix"></iron-icon>
            <iron-icon icon="icons:visibility" slot="suffix" on-tap="_showRepeatPassword"></iron-icon>
          </paper-input>
        </div>
        <div class="general-error" hidden$="[[!errorOccurred]]">[[errorMessage]]</div>
        <div class="action-button" layout horizontal justified>
          <paper-button class="cancel-button" on-click="_close" primary-text>
            {$ cancel $}
          </paper-button>
          <paper-button
            class="submit-button"
            on-click="_submit"
            primary
          >
            {$ changePassword.action.submit $}
          </paper-button>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'changepass-dialog';
  }

  private oldPassValue: string;
  private newPassValue: string;
  private repeatPassValue: string;
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
      oldPassValue: String,
      newPassValue: String,
      repeatPassValue: String,
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
    return ['_handleDialogToggled(opened, data)'];
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
    openDialog(DIALOGS.PROFILE);
  }

  _submit() {
    const repeatPasswordInput = this.shadowRoot.querySelector('#repeatPassword');
    if (this.newPassValue !== this.repeatPassValue) {
      repeatPasswordInput.invalid = true;
      this.errorOccurred = true;
      this.errorMessage = 'Password tidak cocok';
      return;
    }
    updateUserPassword(this.user.email, this.oldPassValue, this.newPassValue);
  }

  _showOldPassword() {
    const passField = this.shadowRoot.querySelector('#oldPassword');
    console.log(passField);
    passField.setAttribute('type', 'text');
  }

  _showNewPassword() {
    const passField = this.shadowRoot.querySelector('#newPassword');
    console.log(passField);
    passField.setAttribute('type', 'text');
  }

  _showRepeatPassword() {
    const passField = this.shadowRoot.querySelector('#repeatPassword');
    console.log(passField);
    passField.setAttribute('type', 'text');
  }

  _resize(e) {
    if (this.keyboardOpened) {
      const header = this.shadowRoot.querySelector('.title-dialog');
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

window.customElements.define(ChangePassDialog.is, ChangePassDialog);
