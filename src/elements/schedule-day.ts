import { customElement, observe, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import {
  FeaturedSessionsState,
  initialFeaturedSessionsState,
} from '../store/featured-sessions/state';
import { TempAny } from '../temp-any';
import { offsetTop, scrollToY } from '../utils/scrolling';
import './session-element';
import './shared-styles';

@customElement('schedule-day')
export class ScheduleDay extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
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

        @media (min-width: 812px) {
          :host {
            margin-left: auto;
            display: block;
            max-width: calc(100% - 64px);
          }

          .session {
            width: 578px;
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
        }
      </style>

      <div class="grid">
        <div class="container">
          <template
            is="dom-repeat"
            items="[[month.timeslots]]"
            as="timeslot"
            index-as="timeslotIndex"
          >
            <div
              id$="[[timeslot.dateMonth]]"
              class="tanggal-bulan"
              style$="grid-area: [[_getTimePosition(timeslotIndex)]]"
            >
              <span class="tanggal">[[_sliceText(timeslot.dateMonth, 0)]]</span>
              <span class="bulan">[[_sliceText(timeslot.dateMonth, -3)]]</span>
            </div>

            <template
              is="dom-repeat"
              items="[[timeslot.sessions]]"
              as="session"
              index-as="sessionIndex"
            >
              <div class="session card" layout vertical>
                <template is="dom-repeat" items="[[session.items]]" as="subSession">
                  <session-element
                    class="subsession"
                    day-name="[[name]]"
                    session="[[subSession]]"
                    user="[[user]]"
                    featured-sessions="[[featuredSessions]]"
                    query-params="[[queryParams]]"
                  ></session-element>
                </template>
              </div>
            </template>
          </template>
        </div>
      </div>
    `;
  }

  @property({ type: Boolean })
  private active = false;
  @property({ type: Object })
  private month = {};
  @property({ type: String })
  private name: string;
  @property({ type: Object })
  private user = {};
  @property({ type: Object })
  private featuredSessions: FeaturedSessionsState = initialFeaturedSessionsState;
  @property({ type: Boolean })
  private onlyFeatured = true;
  @property({ type: Object })
  private viewport: { isTabletPlus?: boolean } = {};
  @property({ type: String })
  private queryParams: string;

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

  _getTimePosition(timeslotIndex) {
    return `${timeslotIndex + 1} / 1`;
  }

  _sliceText(text, index) {
    if (index === 0) {
      return text.slice(index, -3);
    } else {
      return text.slice(index);
    }
  }
}
