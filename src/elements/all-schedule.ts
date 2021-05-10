import { Success } from '@abraham/remotedata';
import { customElement, observe, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import { ReduxMixin } from '../mixins/redux-mixin';
import { Schedule } from '../models/schedule';
import {
  FeaturedSessionsState,
  initialFeaturedSessionsState,
} from '../store/featured-sessions/state';
import { TempAny } from '../temp-any';
import { offsetTop, scrollToY } from '../utils/scrolling';
import './session-element';
import './shared-styles';

@customElement('all-schedule')
export class AllSchedule extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
        }

        .grid {
          display: grid;
          grid-column-gap: 16px;
          grid-row-gap: 32px;
          grid-template-columns: repeat(auto-fit, minmax(300px, auto));
        }

        .add-session {
          padding: 8px;
          grid-column-end: -1 !important;
          background-color: var(--primary-background-color);
          border-bottom: 1px solid var(--border-light-color);
          font-size: 14px;
          color: var(--secondary-text-color);
          text-transform: uppercase;
        }

        .add-session:hover {
          background-color: var(--additional-background-color);
        }

        .add-session-icon {
          --iron-icon-width: 14px;
          margin-right: 8px;
        }

        @media (min-width: 812px) {
          :host {
            margin-left: auto;
            display: block;
            max-width: calc(100% - 64px);
          }

          .grid {
            display: grid;
            grid-column-gap: 16px;
            grid-row-gap: 32px;
            grid-template-columns: repeat(auto-fit, minmax(300px, auto));
          }

          .subsession:not(:last-of-type) {
            margin-bottom: 16px;
          }

          .add-session {
            border: 1px solid var(--border-light-color);
          }
        }
      </style>

      <div class="grid">
        <template is="dom-repeat" items="[[sessions]]" as="subSession">
          <div class="session card" layout vertical> 
            <session-element
              class="subsession"
              day-name="[[name]]"
              session="[[subSession]]"
              user="[[user]]"
              featured-sessions="[[featuredSessions]]"
              query-params="[[queryParams]]"
            ></session-element>
            <a
              class="add-session"
              href$="[[subSession.link]]"
              style$="grid-area: [[timeslot.sessions.0.gridArea]]"
              layout
              horizontal
              center-center
              hidden$="[[!subSession.featured]]"
            >
              <iron-icon class="add-session-icon" icon="lkim:add-circle-outline"></iron-icon>
              <span>{$ schedule.registerSchedule $}</span>
            </a>
          </div>
        </template>
      </div>
    `;
  }

  @property({ type: Boolean })
  private active = false;
  @property({ type: Object })
  private sessions: {};
  @property({ type: Array })
  private featuredSchedule = [];
  @property({ type: Object })
  private featuredSessions: FeaturedSessionsState = initialFeaturedSessionsState;
  @property({ type: Object })
  private selectedFilters = {};
  @property({ type: String })
  private queryParams: string;
  @property({ type: Boolean })
  private onlyFeatured = true;
  @property({ type: Object })
  private viewport: { isTabletPlus?: boolean } = {};
  @property({ type: Object })
  private user = {};

  @observe('active')
  _pageVisible(active) {
    if (active && window.location.hash) {
      const selectedTime = window.location.hash.slice(1);
      if (selectedTime) {
        requestAnimationFrame(() => {
          const Elements = (window as TempAny).LKIMAPP.Elements;
          const targetElement = this.shadowRoot.querySelector(`[id="${selectedTime}"]`);
          const offset = offsetTop(targetElement);
          const toolbarHeight = Elements.HeaderToolbar.getBoundingClientRect().height - 1;
          const stickyToolbarHeight = Elements.StickyHeaderToolbar.getBoundingClientRect().height;
          const additionalMargin = this.viewport.isTabletPlus ? 8 : 0;
          const scrollTargetY = offset - toolbarHeight - stickyToolbarHeight - additionalMargin;
          scrollToY(scrollTargetY, 1500, 'easeInOutSine');
        });
      }
    }
  }
}
