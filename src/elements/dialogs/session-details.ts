import { Success } from '@abraham/remotedata';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/iron-icon';
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior';
import '@polymer/marked-element';
import '@material/mwc-fab';
import { html, PolymerElement } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import 'plastic-image';
import '../../components/auth-required';
import { ReduxMixin } from '../../mixins/redux-mixin';
import { RootState, store } from '../../store';
import { closeDialog, openDialog } from '../../store/dialogs/actions';
import { DIALOGS } from '../../store/dialogs/types';
import { setUserFeaturedSessions } from '../../store/featured-sessions/actions';
import {
  FeaturedSessionsState,
  initialFeaturedSessionsState,
} from '../../store/featured-sessions/state';
import { showToast } from '../../store/toast/actions';
import { getVariableColor, getDate } from '../../utils/functions';
import '../feedback-block';
import '../shared-styles';
import '../text-truncate';
import './dialog-styles';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const ONE_MINUTE_MS = 60 * 1000;

class SessionDetails extends ReduxMixin(mixinBehaviors([IronOverlayBehavior], PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles dialog-styles flex flex-alignment positioning">
        .section {
          cursor: pointer;
        }

        .tags {
          margin-top: 12px;
        }

        .status {
          display: inline;
          padding: 0.2em 0.6em 0.3em;
          font-size: 75%;
          font-weight: 700;
          line-height: 1;
          color: #fff;
          text-align: center;
          text-transform: uppercase;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.25em;
          background-color: currentColor;
        }

        .pendaftaran,
        .date,
        .tempat {
          font-size: 14px;
          margin: 12px 0;
        }

        .details {
          font-weight: 600;
        }

        .star-rating {
          display: inline-block;
          vertical-align: middle;
        }
      </style>

      <polymer-helmet
        title="[[session.title]] | {$ title $}"
        description="[[session.description]]"
        image="[[session.poster]]"
        active="[[opened]]"
        label1="{$ tanggal $}"
        data1="[[session.tanggal]]"
        label2="{$ sessionDetails.pesertaKegiatan $}"
        data2="[[session.partisipants]]"
      ></polymer-helmet>

      <app-header-layout has-scrolling-region>
        <app-header slot="header" class="header" fixed="[[viewport.isTabletPlus]]">
          <iron-icon
            class="close-icon"
            icon="lkim:[[_getCloseBtnIcon(viewport.isLaptopPlus)]]"
            on-click="_close"
          ></iron-icon>
          <app-toolbar>
            <div class="dialog-container header-content" layout vertical>
              <div class="pendaftaran" hidden$="[[!session.registration]]">
                <span
                  class="status"
                  style$="background-color: [[_getStatusColor(session.registration)]]"
                  >[[session.registration]]</span
                >
                <span class="until" hidden$="[[isClosedRegistration(session.registration)]]"
                  >{$ session.untilRegistration $} [[getDate(session.until)]]</span
                >
              </div>
              <div class="date" hidden$="[[!session.tanggal]]">
                [[getDate(session.tanggal)]], <span class="clock">[[session.time]]</span>
              </div>
              <h2 class="name">[[session.title]]</h2>
              <div class="tags" hidden$="[[!session.tags.length]]">
                <template is="dom-repeat" items="[[session.tags]]" as="tag">
                  <span class="tag" style$="color: [[getVariableColor(tag)]]">[[tag]]</span>
                </template>
              </div>
              <div class="tempat">
                <iron-icon class="icon-details" icon="lkim:location"></iron-icon>
                <span class="session-city">[[session.city]]</span>
                <span class="session-track"> - [[session.address]]</span>
              </div>
            </div>
          </app-toolbar>
        </app-header>

        <div class="dialog-container content">
          <div class="float-button">
            <mwc-fab
              extended
              hidden$="[[!session.featured]]"
              on-click="_toggleFeaturedSession"
              label="Isi Formulir"
            ></mwc-fab>
          </div>

          <div class="details">{$ sessionDetails.detail $}</div>
          <marked-element class="description" markdown="[[session.description]]">
            <div slot="markdown-html"></div>
          </marked-element>

          <div id="feedback" class="additional-sections">
            <h3>{$ feedback.headline $}</h3>

            <auth-required hidden="[[!acceptingFeedback]]">
              <slot slot="prompt">{$ feedback.leaveFeedback $}</slot>
              <feedback-block session-id="[[session.id]]"></feedback-block>
            </auth-required>

            <p hidden="[[acceptingFeedback]]">{$ feedback.sessionClosed $}</p>
          </div>
        </div>
      </app-header-layout>
    `;
  }

  static get is() {
    return 'session-details';
  }

  static get properties() {
    return {
      ...super.properties,
      disabledSchedule: {
        type: Boolean,
        value: () => JSON.parse('{$ disabledSchedule $}'),
      },
      data: {
        type: Object,
        observer: '_dataUpdate',
      },
      session: {
        type: Object,
        observer: '_sessionUpdate',
      },
      acceptingFeedback: {
        value: false,
        type: Boolean,
      },
      viewport: {
        type: Object,
      },
      credential: {
        type: Object,
      },
      featuredSessions: {
        type: Object,
        value: initialFeaturedSessionsState,
      },
      currentSpeaker: {
        type: String,
      },
      opened: {
        type: Boolean,
        value: false,
      },
    };
  }

  stateChanged(state: RootState) {
    super.stateChanged(state);
    this.setProperties({
      featuredSessions: state.featuredSessions,
      currentSpeaker: state.routing.subRoute,
      credential: state.credential,
      viewport: state.ui.viewport,
    });
  }

  constructor() {
    super();
    this.addEventListener('iron-overlay-canceled', this._close);
  }

  _close() {
    closeDialog();
    history.back();
  }

  _getCloseBtnIcon(isLaptopViewport: boolean) {
    return isLaptopViewport ? 'close' : 'arrow-left';
  }

  _getStatusColor(status) {
    if (status === 'terbuka') {
      return 'var(--terbuka);';
    } else if (status === 'ditutup') {
      return 'var(--ditutup);';
    } else {
      return 'var(--tidak-ada);';
    }
  }

  getDate(date) {
    return getDate(date);
  }

  isClosedRegistration(registration) {
    if (registration === 'ditutup') {
      return true;
    }
  }

  _toggleFeaturedSession(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.credential.signedIn) {
      showToast({
        message: '{$ schedule.saveSessionsSignedOut $}',
        action: {
          title: 'Sign in',
          callback: () => openDialog(DIALOGS.SIGNIN),
        },
      });
      return;
    }
    const sessions = Object.assign({}, this.featuredSessions.data, {
      [this.session.id]: !this.featuredSessions.data[this.session.id] ? true : null,
    });

    store.dispatch(setUserFeaturedSessions(this.credential.uid, sessions));
  }

  _getFeaturedSessionIcon(featuredSessions: FeaturedSessionsState, sessionId?: string) {
    return featuredSessions instanceof Success && featuredSessions.data[sessionId]
      ? 'bookmark-check'
      : 'bookmark-plus';
  }

  _dataUpdate() {
    if (this.data?.name === DIALOGS.SESSION) {
      this.session = this.data.data;
    }
  }

  _sessionUpdate() {
    const { day } = this.session;
    console.log(day);
    if (day) {
      const now = new Date();
      const currentTime = new Date(`${day}`).getTime();
      const timezoneOffset = parseInt('{$ timezoneOffset $}') - now.getTimezoneOffset();
      console.log(now.getTimezoneOffset());
      const convertedTimezoneDate = new Date(currentTime + timezoneOffset * ONE_MINUTE_MS);
      const diff = now.getTime() - convertedTimezoneDate.getTime();
      console.log(diff);
      this.acceptingFeedback = diff > 0 && diff < ONE_WEEK_MS;
    } else {
      this.acceptingFeedback = false;
    }
  }

  getVariableColor(value: string) {
    return getVariableColor(this, value);
  }
}

window.customElements.define(SessionDetails.is, SessionDetails);
