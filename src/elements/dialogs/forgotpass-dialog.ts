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
import { openDialog } from '../../store/dialogs/actions';
import { sendEmailForgotPassword } from '../../store/credential/actions';
import { validateEmail } from '../../utils/functions';
import '../lkim-icons';
import '../shared-styles';
import { DIALOGS } from '../../store/dialogs/types';

class ForgotPassDialog extends ReduxMixin(mixinBehaviors([IronOverlayBehavior], PolymerElement)) {
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

        .container-title-dialog {
          text-align: center;
        }

        .container-title {
          font-size: 22px;
        }

        .info-container,
        .info-success {
          margin: 16px 0;
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
          margin: 16px 0;
        }

        .action-button paper-button {
          min-width: 75%;
          margin-bottom: 16px;
        }

        .general-error {
          margin: 18px 0;
          text-align: center;
          font-size: 14px;
          color: var(--error-color);
        }
      </style>
      <div class="dialog-content-input">
        <div class="container-title-dialog">
          <div class="container-title" layout vertical center>{$ forgotPasswordDialog.title $}</div>
          <p class="info-container" hidden$="[[sendEmailSuccess]]">
            {$ forgotPasswordDialog.info $}
          </p>
          <p class="success-container" hidden$="[[!sendEmailSuccess]]">
            {$ forgotPasswordDialog.successInfo $}
          </p>
        </div>
        <div class="action-input" hidden$="[[sendEmailSuccess]]">
          <paper-input
            id="emailInput"
            label="{$ forgotPasswordDialog.yourEmail $}"
            value="{{emailValue}}"
            always-float-label
            required
            auto-validate$="[[validate]]"
          >
            <iron-icon icon="icons:mail" slot="prefix"></iron-icon>
          </paper-input>
        </div>
        <div class="general-error" hidden$="[[!errorOccurred]]">[[errorMessage]]</div>
        <div class="action-button" layout vertical center>
          <paper-button
            class="submit-button"
            on-click="_changePassword"
            hidden$="[[sendEmailSuccess]]"
            primary
          >
            {$ forgotPasswordDialog.submit $}
          </paper-button>
          <paper-button class="cancel-button" on-click="_close" primary-text>
            [[closeLabel]]
          </paper-button>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'forgotpass-dialog';
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
      sendEmailSuccess: {
        type: Boolean,
        value: false,
      },
      closeLabel: {
        type: String,
        value: '{$ cancel $}',
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
    return ['_handleDialogToggled(opened, data)'];
  }

  _handleDialogToggled(opened, data) {
    if (data) {
      this.errorOccurred = data.errorOccurred;
      this.errorMessage = data.errorMessage;
      this.sendEmailSuccess = data.sendEmailSuccess;
      this.closeLabel = data.closeLabel;
    } else {
      data = {};
    }
  }

  _close() {
    openDialog(DIALOGS.SIGNIN, { submitLogin: 'Login' });
  }

  _changePassword() {
    this.errorOccurred = false;
    const emailInput = this.shadowRoot.querySelector('#emailInput');
    if (!emailInput.validate() || !validateEmail(emailInput.value)) {
      emailInput.invalid = true;
      this.errorOccurred = true;
      this.errorMessage = 'Format email salah';
      return;
    }

    sendEmailForgotPassword(emailInput.value);
  }

  _resize(e) {
    if (this.keyboardOpened) {
      const header = this.shadowRoot.querySelector('.dialog-content-input');
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

window.customElements.define(ForgotPassDialog.is, ForgotPassDialog);
