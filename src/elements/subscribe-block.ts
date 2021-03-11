import { Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import { ReduxMixin } from '../mixins/redux-mixin';
import { RootState, store } from '../store';
import { openDialog } from '../store/dialogs/actions';
import { DialogForm, DIALOGS } from '../store/dialogs/types';
import { requestPermission } from '../store/notifications/actions';
import { initialNotificationState } from '../store/notifications/state';
import { NOTIFICATIONS_STATUS } from '../store/notifications/types';
import './lkim-icons';
import './shared-styles';

@customElement('subscribe-block')
export class SubscribeBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          display: flex;
          width: 100%;
          background: var(--default-primary-color);
          color: #fff;
          padding: 16px 0;
        }

        .description {
          font-size: 24px;
          line-height: 1.5;
          margin: 0 0 16px;
        }

        paper-button {
          color: #fff;
        }

        paper-button[disabled] {
          background: var(--default-primary-color);
          color: #fff;
        }

        @media (min-width: 640px) {
          :host {
            padding: 32px 0;
          }

          .description {
            font-size: 32px;
            margin: 0 0 24px;
            text-align: center;
          }
        }
      </style>

      <div class="container" layout vertical center$="[[viewport.isTabletPlus]]">
        <div class="description">{$ subscribeBlock.callToAction.description $}</div>
        <div class="cta-button">
          <paper-button
            class="animated icon-right"
            on-click="_toggleNotifications"
            ga-on="click"
            ga-event-category="attendees"
            ga-event-action="subscribe"
            ga-event-label="subscribe block"
          >
            <span class="cta-label">{$  subscribeBlock.callToAction.label $}</span>
            <iron-icon icon="lkim:arrow-right-circle"></iron-icon>
          </paper-button>
        </div>
      </div>
    `;
  }

  @property({ type: Object })
  private notifications: { token?: string; status?: string } = {};

  @property({ type: Object })
  private user: { signedIn?: boolean; email?: string; displayName?: string } = {};
  @property({ type: Object })
  private viewport = {};

  stateChanged(state: RootState) {
    this.notifications = state.notifications;
    this.user = state.user;
    this.viewport = state.ui.viewport;
  }

  _toggleNotifications() {
    store.dispatch(requestPermission());
  }

}
