import { Success } from '@abraham/remotedata';
import { customElement, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import { ReduxMixin } from '../mixins/redux-mixin';
import { store } from '../store';
import { openDialog } from '../store/dialogs/actions';
import { DIALOGS } from '../store/dialogs/types';
import { setUserFeaturedSessions } from '../store/featured-sessions/actions';
import {
  FeaturedSessionsState,
  initialFeaturedSessionsState,
} from '../store/featured-sessions/state';
import { showToast } from '../store/toast/actions';
import { TempAny } from '../temp-any';
import { getVariableColor, toggleQueryParam } from '../utils/functions';
import './shared-styles';
import './text-truncate';

@customElement('session-element')
export class SessionElement extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
          background-color: var(--primary-background-color);
          height: 100%;
        }

        .session {
          height: 100%;
          color: var(--primary-text-color);
          overflow: hidden;
          border-bottom: 1px solid var(--border-light-color);
        }

        .session:hover {
          background-color: var(--additional-background-color);
        }

        .poster {
          width: 100%;
          height: 200px;
        }

        .session-header,
        .session-content,
        .session-footer {
          padding: 16px;
          z-index: 1;
        }

        .session-header {
          padding-bottom: 8px;
        }

        .icon-details {
          display: inline-block;
          --iron-icon-width: 12px;
          --iron-icon-fill-color: var(--primary-text-color);
          margin-right: 2px;
        }

        .pendaftaran,
        .kategori,
        .tempat {
          margin-right: 2px;
        }

        .tags {
          font-weight: 600;
          color: currentColor;
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

        .language {
          margin-left: 8px;
          font-size: 12px;
          text-transform: uppercase;
          color: var(--secondary-text-color);
        }

        .session-content {
          padding-top: 12px;
        }

        .bookmark-session,
        .feedback-action {
          color: var(--secondary-text-color);
        }

        .session[featured] .bookmark-session {
          color: var(--default-primary-color);
        }

        .bookmark-session:hover,
        .feedback-action:hover {
          color: var(--default-primary-color);
        }

        .session-title {
          font-size: 20px;
          line-height: 1.2;
        }

        .session-details,
        .session-description {
          display: inline-block;
          color: var(--disabled-text-color);
          margin-top: 8px;
        }

        .session-description {
          font-size: 14px;
        }

        .session-details {
          font-size: 12px;
        }

        .session-meta {
          margin: 0;
          padding: 0;
          font-size: 12px;
          color: var(--secondary-text-color);
        }

        .icon-peserta {
          --iron-icon-width: 12px;
          --iron-icon-height: 12px;
        }

        .session-footer {
          font-size: 14px;
        }

        .speakers {
          margin-top: 10px;
        }

        .speaker:not(:last-of-type) {
          padding-bottom: 10px;
        }

        .speaker-photo {
          margin-right: 12px;
          width: 32px;
          height: 32px;
          background-color: var(--secondary-background-color);
          border-radius: 50%;
          overflow: hidden;
          transform: translateZ(0);
        }

        .speaker-name {
          margin-bottom: 4px;
          line-height: 1.2;
        }

        .speaker-title {
          font-size: 12px;
          line-height: 1;
        }

        @media (min-width: 640px) {
          :host {
            border: 1px solid var(--border-light-color);
            border-top: 0;
          }
        }

        @media (min-width: 812px) {
          :host {
            border: 1px solid var(--border-light-color);
          }
        }
      </style>

      <a
        class="session"
        href$="/schedule/[[dayName]]?[[toggleQueryParam(queryParams, 'sessionId', session.id)]]"
        flex
        layout
        vertical
      >
        <plastic-image
          class="poster"
          srcset="[[session.poster]]"
          alt="[[session.title]]"
          lazy-load
          preload
          fade
        ></plastic-image>
        <div class="session-header" layout center>
          <div flex>
            <h3 class="session-title">[[session.title]]</h3>
            <text-truncate lines="3">
              <div class="session-description">[[summary]]</div>
              <div class="session-details">
                <div class="pendaftaran">
                  <iron-icon class="icon-details" icon="icons:assignment"></iron-icon>
                  {$ session.pendaftaran $}
                  <span
                    class="status"
                    style$="background-color: [[_getStatusColor(session.status)]]"
                    >[[session.status]]</span
                  >
                </div>
                <div class="kategori">
                  <iron-icon class="icon-details" icon="icons:label"></iron-icon>
                  {$ session.kategori $}
                  <template is="dom-repeat" items="[[session.tags]]" as="tag">
                    <span class="tags" style$="color: [[getVariableColor(tag)]]">[[tag]]</span>
                  </template>
                </div>
                <div class="tempat">
                  <iron-icon class="icon-details" icon="icons:store"></iron-icon>
                  <span class="session-city">[[session.city]]</span>
                  <span class="session-track"> - [[session.address]]</span>
                </div>
                <div class="session-date">
                  <iron-icon class="icon-details" icon="icons:today"></iron-icon>
                  [[session.dateReadable]],
                </div>
              </div>
            </text-truncate>
          </div>
        </div>

        <div class="session-content" flex layout horizontal justified>
          <div class="session-meta">
            <iron-icon class="icon-details" icon="lkim:people"></iron-icon>
            <span hidden$="[[!session.partisipants]]">[[session.partisipants]]</span>
          </div>
          <div class="session-actions">
            <iron-icon
              class="feedback-action"
              icon="lkim:insert-comment"
              on-click="_toggleFeedback"
            ></iron-icon>
          </div>
        </div>
      </a>
    `;
  }

  @property({ type: Object })
  private user: { uid?: string; signedIn?: boolean } = {};
  @property({ type: Object })
  private session: {
    id: string;
    day: TempAny;
    mainTag: string;
  };
  @property({ type: Object })
  private featuredSessions: FeaturedSessionsState = initialFeaturedSessionsState;
  @property({ type: String })
  private queryParams: string;
  @property({ type: String })
  private dayName: string;
  @property({ type: String, computed: 'getVariableColor(session.mainTag)' })
  private sessionCollor: string;
  @property({ type: String, computed: '_isFeatured(featuredSessions, session.id)' })
  private isFeatured: string;
  @property({ type: String, computed: '_summary(session.description)' })
  private summary: string;
  
  _isFeatured(featuredSessions: FeaturedSessionsState, sessionId?: string) {
    if (featuredSessions instanceof Success && sessionId) {
      return featuredSessions.data[sessionId];
    }
    return false;
  }

  _getEnding(number) {
    return number > 1 ? 's' : '';
  }

  _summary(description = '') {
    const indexes = [
      description.indexOf('\n'),
      description.indexOf('<br'),
      description.length,
    ].filter((index) => index > 0);
    return description.slice(0, Math.min(...indexes));
  }

  _getFeaturedSessionIcon(featuredSessions, sessionId) {
    return this.isFeatured ? 'bookmark-check' : 'bookmark-plus';
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

  _toggleFeaturedSession(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.user.signedIn) {
      showToast({
        message: '{$ schedule.saveSessionsSignedOut $}',
        action: {
          title: 'Sign in',
          callback: () => {
            openDialog(DIALOGS.SIGNIN);
          },
        },
      });
      return;
    }

    if (this.featuredSessions instanceof Success) {
      const sessions = Object.assign({}, this.featuredSessions.data, {
        [this.session.id]: !this.featuredSessions.data[this.session.id] ? true : null,
      });

      store.dispatch(setUserFeaturedSessions(this.user.uid, sessions));
    }
  }

  _toggleFeedback(event) {
    event.preventDefault();
    event.stopPropagation();
    openDialog(DIALOGS.FEEDBACK, this.session);
  }

  _acceptingFeedback() {
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const ONE_MINUTE_MS = 60 * 1000;
    const now = new Date();
    const convertedTimezoneDate = new Date(
      new Date(`${this.session.day}`).getTime() +
        (parseInt('{$ timezoneOffset $}') - now.getTimezoneOffset()) * ONE_MINUTE_MS
    );

    const diff = now.getTime() - convertedTimezoneDate.getTime();
    return diff > 0 && diff < ONE_WEEK_MS;
  }

  _join(company, country) {
    return [company, country].filter(Boolean).join(' / ');
  }

  toggleQueryParam(currentQueryParams, key, value) {
    return toggleQueryParam(currentQueryParams, key, value);
  }

  getVariableColor(value) {
    return getVariableColor(this, value);
  }

  slice(text, number) {
    return text && text.slice(0, number);
  }
}
