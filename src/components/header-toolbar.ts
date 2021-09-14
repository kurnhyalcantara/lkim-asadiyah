import { PaperMenuButton } from "@polymer/paper-menu-button";
import { css, customElement, html, property } from "lit-element";
import { RootState, store } from "../store";
import { openDialog } from "../store/dialogs/actions";
import { DIALOGS } from "../store/dialogs/types";
import { requestPermission, unsubscribe } from "../store/notifications/actions";
import { NOTIFICATIONS_STATUS } from "../store/notifications/types";
import { initialRoutingState, RoutingState } from "../store/routing/state";
import { showToast } from "../store/toast/actions";
import { TempAny } from "../temp-any";
import { ThemedElement } from "./themed-element";

@customElement('header-toolbar')
export class HeaderToolbar extends ThemedElement {
  $: any;
  static get styles() {
    return [
      ...super.styles,
      css`
      :host {
        --iron-icon-fill-color: currentColor;
        display: block;
        z-index: 1;
        background-color: var(--primary-background-color);
        transition: background-color var(--animation), border-bottom-color var(--animation),
          color var(--animation);
        color: var(--primary-text-color);
        box-shadow: var(--box-shadow-header);
      }

      app-toolbar {
        margin: 0 auto;
        padding: 0 16px;
        height: auto;
        max-width: var(--max-container-width);
      }

      .toolbar-logo {
        margin: 0 12px 0 8px;
        z-index: 1;
      }

      .toolbar-title {
        color: var(--default-primary-color);
        font-weight: 600;
      }

      .nav-items {
        --paper-tabs-selection-bar-color: var(--default-primary-color);
        --paper-tabs: {
          height: 64px;
        }
      }

      .nav-item a {
        padding: 0 14px;
        color: inherit;
        text-transform: uppercase;
      }

      .login-button {
        margin-top: 12px;
        padding: 10px 24px;
      }

      .profile-image {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-position: center;
        background-size: cover;
      }

      .dropdown-panel {
        padding: 24px;
        max-width: 300px;
        background: #fff;
        font-size: 16px;
        color: var(--primary-text-color);
      }

      .dropdown-panel p {
        margin-top: 0;
      }

      .dropdown-panel .panel-actions {
        margin: 0 -16px -16px 0;
      }

      .profile-details .profile-image {
        margin-right: 16px;
        width: 48px;
        height: 48px;
      }

      .profile-name,
      .profile-email {
        font-size: 14px;
        display: block;
        white-space: nowrap;
        color: var(--secondary-text-color);
      }

      .profile-action {
        margin-top: 4px;
        text-transform: uppercase;
        color: var(--default-primary-color);
        font-size: 14px;
        cursor: pointer;
      }

      paper-button iron-icon {
        margin-right: 8px;
        --iron-icon-fill-color: var(--hero-font-color);
      }

      @media (min-width: 640px) {
        app-toolbar {
          padding: 0 36px;
          height: initial;
        }

        .toolbar-title {
          font-size: 16px;
        }
      }
      `,
    ]
  }

  render() {
    return html`
      <app-toolbar class="header">
        <div layout horizontal center flex>
          <paper-icon-button
            icon="lkim:menu"
            hidden$="[[viewport.isLaptopPlus]]"
            aria-label="menu"
            on-click="_openDrawer"
          ></paper-icon-button>
          <plastic-image
            class="toolbar-logo"
            srcset="/images/logo.png"
            alt="{$ title $}"
          ></plastic-image>
          <a class="toolbar-title" href="/" layout horizontal>{$ title $}</a>
        </div>

        <paper-tabs
          class="nav-items"
          selected="[[route.route]]"
          attr-for-selected="name"
          hidden$="[[!viewport.isLaptopPlus]]"
          role="navigation"
          noink
        >
          {% for nav in navigation %}
          <paper-tab name="{$ nav.route $}" class="nav-item" link>
            <a href="{$ nav.permalink $}" layout vertical center-center>{$ nav.label $}</a>
          </paper-tab>
          {% endfor %}

          <a on-click="_signIn" link hidden$="[[credential.signedIn]]">
            <paper-button class="login-button" primary>{$ logIn $}</paper-button>
          </a>
        </paper-tabs>

        <paper-menu-button
          id="notificationsMenu"
          class="notifications-menu"
          vertical-align="top"
          horizontal-align="right"
          no-animations
        >
          <paper-icon-button
            icon="lkim:[[_getNotificationsIcon(notifications.status)]]"
            slot="dropdown-trigger"
          ></paper-icon-button>
          <div class="dropdown-panel" slot="dropdown-content">
            <div hidden$="[[_hideNotificationBlock(notifications.status, 'DEFAULT')]]">
              <p>{$ notifications.default $}</p>
              <div class="panel-actions" layout horizontal end-justified>
                <paper-button primary-text on-click="_toggleNotifications"
                  >{$ notifications.subscribe $}</paper-button
                >
              </div>
            </div>
            <div hidden$="[[_hideNotificationBlock(notifications.status, 'GRANTED')]]">
              <p>{$ notifications.enabled $}</p>
              <div class="panel-actions" layout horizontal end-justified>
                <paper-button primary-text on-click="_toggleNotifications"
                  >{$ notifications.unsubscribe $}</paper-button
                >
              </div>
            </div>
            <div hidden$="[[_hideNotificationBlock(notifications.status, 'DENIED')]]">
              <p>{$ notifications.blocked $}</p>
              <div class="panel-actions" layout horizontal end-justified>
                <a href="{$ notifications.enable.link $}" target="_blank" rel="noopener noreferrer">
                  <paper-button primary-text on-click="_closeNotificationMenu"
                    >{$ notifications.enable.label $}
                  </paper-button>
                </a>
              </div>
            </div>
          </div>
        </paper-menu-button>

        <paper-icon-button
          icon="lkim:account"
          on-click="_openDialogProfile"
          hidden$="[[viewport.isPhone]]"
        ></paper-icon-button>
      </app-toolbar>
    `;
  }

  @property({ type: Object })
  route: RoutingState = initialRoutingState;
  @property({ type: Boolean })
  drawerOpened: boolean;
  @property({ type: Object })
  private viewport = {};
  @property({ type: Object })
  private heroSettings = {};
  @property({ type: Object })
  private dialogs = {};
  @property({ type: Object })
  private notifications: { token?: string, status?: string} = {};
  @property({ type: Object })
  private credential: { signedIn?: boolean } = {};
  @property({ type: Boolean, reflect: true })
  private transparent = false;
  
  stateChanged(state: RootState) {
    this.dialogs = state.dialogs;
    this.notifications = state.notifications;
    this.route = state.routing;
    this.credential = state.credential;
    this.heroSettings = state.ui.heroSettings;
    this.viewport = state.ui.viewport;
  }

  connectedCallback() {
    super.connectedCallback();
    (window as TempAny).LKIMAPP.Elements.HeaderToolbar = this;
    this._onScroll = this._onScroll.bind(this)
    window.addEventListener('scroll', this._onScroll);
    this._onScroll();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onScroll);
  }

  private _openDrawer() {
    this.drawerOpened = true;
  }

  private _openDialogProfile() {
    if (!this.credential.signedIn) {
      return showToast({
        message: 'Silahkan login terlebih dahulu'
      })
    }
    openDialog(DIALOGS.PROFILE);
  }

  private _signIn() {
    openDialog(DIALOGS.SIGNIN, { submitLogin: 'Login' })
  }

  private _toggleNotifications() {
    this._closeNotificationsMenu();
    if (this.notifications.status === NOTIFICATIONS_STATUS.GRANTED) {
      store.dispatch(unsubscribe(this.notifications.token))
      return;
    }
    store.dispatch(requestPermission());
  }

  private _closeNotificationsMenu() {
    // TODO: Remove type cast
    (this.$.notificationsMenu as PaperMenuButton).close();
  }

  private _getNotificationsIcon(status) {
    return status === NOTIFICATIONS_STATUS.DEFAULT 
      ? 'bell-outline' : status === NOTIFICATIONS_STATUS.GRANTED ? 'bell' : 'bell-off';
  }

  private _hideNotificationsBlock(status, blockStatus) {
    return status !== NOTIFICATIONS_STATUS[blockStatus];
  }

  private _onScroll() {
    this.transparent = document.documentElement.scrollTop === 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'header-toolbar': HeaderToolbar
  }
}