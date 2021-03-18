import { Success } from '@abraham/remotedata';
import { customElement, observe, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import { ReduxMixin } from '../mixins/redux-mixin';
import { Schedule } from '../models/schedule';
import {
  FeaturedSessionsState,
  initialFeaturedSessionsState,
} from '../store/featured-sessions/state';
import { generateClassName } from '../utils/functions';
import { initialScheduleState, ScheduleState } from '../store/schedule/state';
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

        .card {
          box-shadow: 0 1px 5px rgb(0 0 0 / 15%);
          border-radius: 0;
          margin-bottom: 16px;
        }

        .card:hover {
          box-shadow: 0 2px 6px rgb(0 0 0 / 15%);
        }

        .tanggal-bulan {
          margin-top: 16px;
          color: var(--secondary-text-color);
          letter-spacing: -0.04em;
          margin-bottom: 8px;
        }

        .tanggal {
          font-size: 24px;
          font-weight: 300;
        }

        .bulan {
          font-size: 16px;
          color: var(--error-color);
          text-transform: uppercase;
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

          .tanggal-bulan {
            margin: 0;
            padding: 0;
            text-align: right;
            transform: translateX(calc(-100% - 16px));
            border-bottom: 0;
          }

          .tanggal {
            font-size: 32px;
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
        <template
          is="dom-repeat"
          items="[[sessions]]"
          as="subSession"
        >
          <div class="session card" layout vertical>
            <session-element
              class="subsession"
              day-name="[[name]]"
              session="[[subSession.timeslots.sessions.items]]"
              user="[[user]]"
              featured-sessions="[[featuredSessions]]"
              query-params="[[queryParams]]"
            ></session-element>
            <a
              class="add-session"
              href$="/schedule/[[month.month]]#[[timeslot.sessions.0.items.id]]"
              style$="grid-area: [[timeslot.sessions.0.gridArea]]"
              layout
              horizontal
              center-center
              hidden$="[[onlyFeatured]]"
            >
              <iron-icon class="add-session-icon" icon="hmi:add-circle-outline"></iron-icon>
              <span>{$ schedule.registerSchedule $}</span>
            </a>
          </div>
        </template>
      </div>
    `;
  }

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
  private viewport = {};
  @property({ type: Object })
  private user = {};

}
