import { Success } from '@abraham/remotedata';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-route/app-location';
import '@polymer/app-route/app-route';
import { customElement, observe, property } from '@polymer/decorators';
import '@polymer/iron-dropdown/iron-dropdown-scroll-manager';
import '@polymer/iron-icon';
import '@polymer/iron-media-query';
import '@polymer/iron-pages';
import '@polymer/iron-selector/iron-selector';
import '@polymer/paper-button';
import '@polymer/paper-icon-button';
import '@polymer/paper-menu-button';
import '@polymer/paper-tabs';
import { html, PolymerElement } from '@polymer/polymer';
import {
  setFastDomIf,
  setLegacyWarnings,
  setPassiveTouchGestures,
  setRemoveNestedTemplates,
  setSuppressTemplateNotifications,
} from '@polymer/polymer/lib/utils/settings';
import 'plastic-image';
import './components/hero-block';
import { log } from './console';
import './elements/dialogs/feedback-dialog';
import './elements/dialogs/session-details';
import './elements/dialogs/signin-dialog';
import './elements/dialogs/pengurus-details';
import './elements/dialogs/signup-dialog';
import './elements/dialogs/profile-dialog';
import './elements/dialogs/editprofile-dialog';
import './elements/dialogs/changepass-dialog';
import './elements/dialogs/forgotpass-dialog';
import './elements/dialogs/video-dialog';
import './elements/dialogs/print-form';
import './elements/footer-block';
import './elements/header-toolbar';
import './elements/lkim-icons';
import './elements/polymer-helmet';
import './elements/shared-styles';
import './elements/toast-element';
import { ReduxMixin } from './mixins/redux-mixin';
import './pages/home-page';
import './pages/pengurus-page';
import './pages/news-page';
import './pages/article-page';
import './pages/schedule-page';
import { registerServiceWorker } from './service-worker-registration';
import { RootState, store } from './store';
import { DialogState, initialDialogState } from './store/dialogs/state';
import { DIALOGS } from './store/dialogs/types';
import { getToken, initializeMessaging } from './store/notifications/actions';
import { setRoute } from './store/routing/actions';
import { initialRoutingState, RoutingState } from './store/routing/state';
import { showToast } from './store/toast/actions';
import { setViewportSize } from './store/ui/actions';
import { updateUser } from './store/credential/actions';
import { TempAny } from './temp-any';
import { isDialogOpen } from './utils/dialogs';
import { scrollToY } from './utils/scrolling';
import { openDialog } from './store/dialogs/actions';
import { fetchUser } from './store/users/actions';

setFastDomIf(true);
setPassiveTouchGestures(true);
setRemoveNestedTemplates(true);
setSuppressTemplateNotifications(true);
if (location.hostname === 'localhost') {
  setLegacyWarnings(true);
}

@customElement('lkim-app')
export class LkimApp extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-reverse flex-alignment positioning">
        :host {
          display: block;
          position: relative;
          min-height: 100%;
          height: 100%;
          --paper-menu-button-dropdown-background: var(--primary-background-color);
          --app-drawer-content-container: {
            display: flex;
            flex-direction: column;
          }
        }

        app-drawer app-toolbar {
          padding: 36px 24px 24px;
          border-bottom: 1px solid var(--divider-color);
        }

        app-drawer a {
          padding: 8px 24px;
        }

        app-toolbar {
          height: auto;
        }

        app-drawer .version {
          font-size: 14px;
          margin-top: 42px;
        }

        app-drawer .design {
          margin-top: 4px;
          font-size: 12px;
          color: var(--secondary-text-color);
        }

        .design .by {
          color: var(--default-primary-color);
        }

        .drawer-account .action-account {
          width: 50%;
          padding: 12px;
        }

        .action-account {
          text-align: center;
          color: var(--text-primary-color);
          background-color: var(--default-primary-color);
        }

        .action-account:hover {
          background-color: var(--primary-color-light);
        }

        .drawer-signedin {
          width: 100%;
          padding: 8px 16px;
          background-color: var(--default-primary-color);
          color: var(--text-primary-color);
        }

        .drawer-signedin:hover {
          background-color: var(--primary-color-light);
        }

        .profile-icon {
          --iron-icon-width: 24px;
          --iron-icon-heigth: 24px;
          margin-right: 12px;
        }

        .action-account:not(:last-of-type) {
          border-right: 1px solid #fff;
        }

        .drawer-content iron-icon {
          --iron-icon-width: 24px;
          margin-right: 24px;
        }

        .drawer-list {
          padding: 16px 0;
          margin: 0
          display: block;
        }

        .drawer-list a {
          display: block;
          color: var(--primary-text-color);
          outline: 0;
        }

        .drawer-list a.selected {
          color: var(--default-primary-color);
          background-color: var(--primary-color-transparent);
          --iron-icon-fill-color: var(--default-primary-color);
          border-top-right-radius: 50px;
          border-bottom-right-radius: 50px;
          margin-right: 8px;
        }

        app-header-layout {
          margin-top: 0px;
        }

        app-header.remove-shadow::before {
          opacity: 0;
        }

        iron-pages {
          background-color: var(--primary-background-color);
          min-height: 100%;
          height: 100%;
        }

        .bottom-drawer-link {
          padding: 16px 24px;
          font-size: 14px;
          cursor: pointer;
          display: block;
          background-color: var(--default-primary-color);
          color: var(--text-primary-color);
        }

        .bottom-drawer-link:hover {
          background-color: var(--primary-color-light);
        }

        .profile-name {
          font-size: 14px;
        }


        @media (min-width: 640px) {
          app-toolbar {
            padding: 0 36px;
            height: initial;
          }
        }
      </style>

      <iron-media-query
        id="mq-phone"
        full
        query="(max-width: {$ mediaQueries.xs.max $})"
        query-matches="{{isPhoneSize}}"
      ></iron-media-query>
      <iron-media-query
        id="mq-laptop"
        full
        query="(min-width: {$ mediaQueries.md.min $})"
        query-matches="{{isLaptopSize}}"
      ></iron-media-query>

      <app-location route="{{appRoute}}"></app-location>
      <app-route
        route="{{appRoute}}"
        pattern="/:page"
        data="{{routeData}}"
        tail="{{subRoute}}"
      ></app-route>

      <app-drawer-layout drawer-width="300px" force-narrow fullbleed>
        <app-drawer id="drawer" slot="drawer" opened="{{drawerOpened}}" swipe-open>
          <app-toolbar layout vertical start>
            <plastic-image
              class="toolbar-logo"
              srcset="{$ toolbarLogo $}"
              alt="{$ title $}"
            ></plastic-image>
            <div class="version">{$ version $}</div>
            <div class="design">
              {$ design $}<span class="by" on-tap="_openInstaDesigner">{$ by $}</span>
            </div>
          </app-toolbar>
          <div class="drawer-account" layout horizontal hidden$="[[credential.signedIn]]">
            <div class="action-account" on-click="_openSignUpDialog">{$ signUp $}</div>
            <div class="action-account" on-click="_openSignInDialog">{$ logIn $}</div>
          </div>
          <div
            class="drawer-signedin"
            on-click="_openProfileDialog"
            hidden$="[[!credential.signedIn]]"
          >
            <iron-icon class="profile-icon" icon="lkim:account"></iron-icon>
            <span class="profile-name">Hai! [[user.nama_lengkap]]</span>
          </div>
          <div class="drawer-content" layout vertical justified flex>
            <iron-selector
              class="drawer-list"
              selected="[[route.route]]"
              attr-for-selected="path"
              selected-class="selected"
              role="navigation"
            >
              {% for nav in navigation %}
              <a href="{$ nav.permalink $}" path="{$ nav.route $}" on-click="_closeDrawer">
                <iron-icon icon="icons:{$ nav.icon $}"></iron-icon>
                <span>{$ nav.label $}</span>
              </a>
              {% endfor %}
            </iron-selector>

            <div>
              <a class="bottom-drawer-link" on-click="_onAddToHomeScreen">
                <iron-icon icon="icons:add-box"></iron-icon>
                <span>{$ addToHomeScreen.cta $}</span>
              </a>
            </div>
          </div>
        </app-drawer>

        <app-header-layout id="headerLayout" fullbleed>
          <app-header id="header" slot="header" condenses fixed>
            <header-toolbar drawer-opened="{{drawerOpened}}"></header-toolbar>
          </app-header>

          <iron-pages
            attr-for-selected="name"
            selected="[[route.route]]"
            selected-attribute="active"
            hide-immediately
          >
            <home-page name="home"></home-page>
            <pengurus-page name="pengurus" route="[[subRoute]]"></pengurus-page>
            <news-page name="news" route="[[subRoute]]"></news-page>
            <article-page name="articles" route="[[subRoute]]"></article-page>
            <schedule-page name="schedule" route="[[subRoute]]"></schedule-page>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>

      <video-dialog
        opened="[[ui.videoDialog.opened]]"
        title="[[ui.videoDialog.title]]"
        youtube-id="[[ui.videoDialog.youtubeId]]"
        entry-animation="scale-up-animation"
        exit-animation="fade-out-animation"
        disable-controls="[[!ui.videoDialog.disableControls]]"
        fit
        fixed-top
      ></video-dialog>

      <pengurus-details
        opened="[[isSpeakerDialogOpen]]"
        data="[[dialogs.data]]"
        with-backdrop="[[viewport.isTabletPlus]]"
        no-cancel-on-outside-click="[[viewport.isPhone]]"
      ></pengurus-details>

      <session-details
        opened="[[isSessionDialogOpen]]"
        data="[[dialogs.data]]"
        with-backdrop="[[viewport.isTabletPlus]]"
        no-cancel-on-outside-click="[[viewport.isPhone]]"
      ></session-details>

      <feedback-dialog
        opened="[[isFeedbackDialogOpen]]"
        data="[[dialogs.data]]"
        with-backdrop
      ></feedback-dialog>

      <signup-dialog
        opened="[[isSignupDialogOpen]]"
        data="[[dialogs.data.data]]"
        with-backdrop
        no-cancel-on-outside-click="[[viewport.isPhone]]"
      >
      </signup-dialog>

      <signin-dialog
        opened="[[isSigninDialogOpen]]"
        data="[[dialogs.data.data]]"
        with-backdrop
        no-cancel-on-outside-click="[[viewport.isPhone]]"
      ></signin-dialog>

      <profile-dialog
        opened="[[isProfileDialogOpen]]"
        data="[[dialogs.data.data]]"
        with-backdrop
        no-cancel-on-outside-click="[[viewport.isPhone]]"
      ></profile-dialog>

      <changepass-dialog
        opened="[[isChangePassDialogOpen]]"
        data="[[dialogs.data.data]]"
        with-backdrop
        no-cancel-on-outside-click="[[viewport.isPhone]]"
      ></changepass-dialog>

      <editprofile-dialog
        opened="[[isEditProfileDialogOpen]]"
        data="[[dialogs.data.data]]"
        with-backdrop
        no-cancel-on-outside-click="[[viewport.isPhone]]"
      ></editprofile-dialog>

      <forgotpass-dialog
        opened="[[isForgotPassDialogOpen]]"
        data="[[dialogs.data.data]]"
        with-backdrop
        no-cancel-on-outside-click="[[viewport.isPhone]]"
      ></forgotpass-dialog>

      <print-form
        opened="[[isPrintFormDialogOpen]]"
        data="[[dialogs.data.data]]"
        with-backdrop
        no-cancel-on-outside-click="[[viewport.isPhone]]"
      ></print-form>

      <toast-element></toast-element>
    `;
  }

  @property({ type: Object })
  private ui = {};
  @property({ type: Object })
  private addToHomeScreen: TempAny;
  @property({ type: Boolean })
  private drawerOpened = false;
  @property({ type: Object })
  private route: RoutingState = initialRoutingState;
  @property({ type: Object })
  private dialogs: DialogState = initialDialogState;
  @property({ type: Object })
  private viewport = {};
  @property({ type: Object })
  private notifications;
  @property({ type: Boolean })
  private _openedDialog = false;
  @property({ type: Object })
  private credential: { uid?: string; signedIn?: boolean } = {};
  @property({ type: Object })
  private user = {};
  @property({ type: Array })
  private providerUrls = '{$ signInProviders.allowedProvidersUrl $}'.split(',');
  @property({ type: Boolean })
  private isPhoneSize = false;
  @property({ type: Boolean })
  private isLaptopSize = false;
  @property({ type: Object })
  private appRoute = {};
  @property({ type: Object })
  private subRoute = {};
  @property({ type: Object })
  private routeData = {};
  @property({ type: Boolean })
  private isSigninDialogOpen = false;
  @property({ type: Boolean })
  private isProfileDialogOpen = false;
  @property({ type: Boolean })
  private isChangePassDialogOpen = false;
  @property({ type: Boolean })
  private isEditProfileDialogOpen = false;
  @property({ type: Boolean })
  private isSignupDialogOpen = false;
  @property({ type: Boolean })
  private isForgotPassDialogOpen = false;
  @property({ type: Boolean })
  private isSpeakerDialogOpen = false;
  @property({ type: Boolean })
  private isPreviousSpeakerDialogOpen = false;
  @property({ type: Boolean })
  private isSessionDialogOpen = false;
  @property({ type: Boolean })
  private isFeedbackDialogOpen = false;
  @property({ type: Boolean })
  private isPrintFormDialogOpen = false;

  stateChanged(state: RootState) {
    this.dialogs = state.dialogs;
    this.isSigninDialogOpen = isDialogOpen(this.dialogs, DIALOGS.SIGNIN);
    this.isProfileDialogOpen = isDialogOpen(this.dialogs, DIALOGS.PROFILE);
    this.isEditProfileDialogOpen = isDialogOpen(this.dialogs, DIALOGS.EDITPROFILE);
    this.isChangePassDialogOpen = isDialogOpen(this.dialogs, DIALOGS.CHANGEPASS);
    this.isForgotPassDialogOpen = isDialogOpen(this.dialogs, DIALOGS.FORGOTPASS);
    this.isSignupDialogOpen = isDialogOpen(this.dialogs, DIALOGS.SIGNUP);
    this.isSpeakerDialogOpen = isDialogOpen(this.dialogs, DIALOGS.PENGURUS);
    this.isSessionDialogOpen = isDialogOpen(this.dialogs, DIALOGS.SESSION);
    this.isFeedbackDialogOpen = isDialogOpen(this.dialogs, DIALOGS.FEEDBACK);
    this.isPrintFormDialogOpen = isDialogOpen(this.dialogs, DIALOGS.PRINTFORM);
    this.notifications = state.notifications;
    this.route = state.routing;
    this.ui = state.ui;
    this.user = state.user;
    this.credential = state.credential;
    this.viewport = state.ui.viewport;
  }

  constructor() {
    super();
    window.performance && performance.mark && performance.mark('lkim-app.created');
    this._toggleHeaderShadow = this._toggleHeaderShadow.bind(this);
    this._toggleDrawer = this._toggleDrawer.bind(this);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.addToHomeScreen = e;
    });

    window.addEventListener('load', () => registerServiceWorker());
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('element-sticked', this._toggleHeaderShadow);
    this.$.drawer.addEventListener('opened-changed', this._toggleDrawer);
    window.addEventListener('offline', () => {
      showToast({
        message: '{$ offlineMessage $}',
      });
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('element-sticked', this._toggleHeaderShadow);
    this.$.drawer.removeEventListener('opened-changed', this._toggleDrawer);
  }

  ready() {
    super.ready();
    log('LKIM Web App is ready!');
    this.removeAttribute('unresolved');
    updateUser();
    initializeMessaging().then(() => store.dispatch(getToken()));
  }

  _closeDrawer() {
    this.drawerOpened = false;
  }

  @observe('credential')
  _userChanged(credential) {
    store.dispatch(fetchUser(credential.uid));
  }

  @observe('routeData.page', 'subRoute.path')
  _routeDataChanged(page, subroutePath) {
    if (!page && page !== '') {
      return;
    }
    const hasSubroute = subroutePath !== '' && subroutePath !== '/';

    if (!this.route || page !== this.route.route) {
      !hasSubroute && scrollToY(0, 600);
      setRoute(page);
      this.$.header.classList.remove('remove-shadow');
    }

    const canonicalLink = `{$ url $}${page}${subroutePath}`;
    document.querySelector('link[rel="canonical"]').setAttribute('href', canonicalLink);
  }

  @observe('isPhoneSize', 'isLaptopSize')
  _viewportChanged(isPhoneSize, isLaptopSize) {
    setViewportSize({
      isPhone: isPhoneSize,
      isTabletPlus: !isPhoneSize,
      isLaptopPlus: isLaptopSize,
    });
  }

  @observe('dialogs')
  _dialogToggled(dialogs: DialogState) {
    document.body.style.overflow = dialogs instanceof Success ? 'hidden' : '';
  }

  _toggleHeaderShadow(e) {
    this.$.header.classList.toggle('remove-shadow', e.detail.sticked);
  }

  _toggleDrawer(e) {
    this.drawerOpened = e.detail.value;
  }

  _openInstaDesigner() {
    window.open('https://www.instagram.com/kurnhyalcantara24', '_blank');
  }

  _onAddToHomeScreen() {
    if (!this.addToHomeScreen) {
      this._closeDrawer();
      showToast({ message: '{$ addToHomeScreen.installed $}' });
    }
    this.addToHomeScreen.prompt();
    this.addToHomeScreen.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        ga('send', 'event', 'add_to_home_screen_prompt', 'accepted');
      } else {
        ga('send', 'event', 'add_to_home_screen_prompt', 'dismissed');
      }
      this.addToHomeScreen = null;
      this._closeDrawer();
    });
  }

  _openSignUpDialog() {
    this.drawerOpened = false;
    openDialog(DIALOGS.SIGNUP, { submitLabel: 'Buat Akun' });
  }

  _openSignInDialog() {
    this.drawerOpened = false;
    openDialog(DIALOGS.SIGNIN, { submitLogin: 'Login' });
  }

  _openProfileDialog() {
    this.drawerOpened = false;
    openDialog(DIALOGS.PROFILE);
  }
}
