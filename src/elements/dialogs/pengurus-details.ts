import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/iron-icon';
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior';
import '@polymer/marked-element';
import { html, PolymerElement } from '@polymer/polymer';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import 'plastic-image';
import { ReduxMixin } from '../../mixins/redux-mixin';
import { SessionsHoC } from '../../mixins/sessions-hoc';
import { closeDialog, openDialog } from '../../store/dialogs/actions';
import { DIALOGS } from '../../store/dialogs/types';
import { RootState } from '../../store';
import { getVariableColor, isEmpty } from '../../utils/functions';
import '../shared-styles';
import '../text-truncate';
import './dialog-styles';
import { Session } from '../../models/session';
import { SessionsState } from '../../store/sessions/state';
import { Success } from '@abraham/remotedata';

class PengurusDetails extends SessionsHoC(
  ReduxMixin(mixinBehaviors([IronOverlayBehavior], PolymerElement))
) {
  static get template() {
    return html`
      <style include="shared-styles dialog-styles flex flex-alignment positioning">
        .photo {
          margin-right: 16px;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background-color: var(--contrast-additional-background-color);
          transform: translateZ(0);
          flex-shrink: 0;
        }

        .subtitle {
          font-size: 16px;
          color: var(--secondary-text-color);
        }

        .badge:not(:last-of-type)::after {
          margin-left: -4px;
          content: ',';
        }

        .action {
          color: var(--secondary-text-color);
        }

        .section {
          cursor: pointer;
        }

        .tags {
          margin-top: 8px;
        }

        .star-rating {
          display: inline-block;
          vertical-align: middle;
        }
      </style>

      <polymer-helmet
        title="[[pengurus.name]] | {$ title $}"
        description="[[pengurus.bio]]"
        image="[[pengurus.photoUrl]]"
        active="[[opened]]"
        label1="{$ position $}"
        data1="[[pengurus.title]], [[pengurus.company]]"
        label2="{$ country $}"
        data2="[[pengurus.country]]"
      ></polymer-helmet>

      <app-header-layout has-scrolling-region>
        <app-header slot="header" class="header" fixed="[[viewport.isTabletPlus]]">
          <iron-icon
            class="close-icon"
            icon="lkim:[[_getCloseBtnIcon(viewport.isLaptopPlus)]]"
            on-click="_close"
          ></iron-icon>

          <app-toolbar>
            <div class="dialog-container header-content" layout horizontal center>
              <plastic-image
                class="photo"
                srcset="[[pengurus.photoUrl]]"
                sizing="cover"
                lazy-load
                preload
                fade
              ></plastic-image>
              <div>
                <h2 class="name" flex>[[pengurus.name]]</h2>
                <div class="subtitle">[[pengurus.jabatan]]</div>
              </div>
            </div>
          </app-toolbar>
        </app-header>

        <div class="dialog-container content">

          <marked-element class="description" markdown="[[pengurus.bio]]">
            <div slot="markdown-html"></div>
          </marked-element>

          <div class="actions" layout horizontal>
            <template is="dom-repeat" items="[[pengurus.socials]]" as="social">
              <a class="action" href$="[[social.link]]" target="_blank" rel="noopener noreferrer">
                <iron-icon icon="lkim:[[social.icon]]"></iron-icon>
              </a>
            </template>
          </div>

        </div>
      </app-header-layout>
    `;
  }

  static get is() {
    return 'pengurus-details';
  }

  static get properties() {
    return {
      ...super.properties,
      data: {
        type: Object,
        observer: '_dataUpdate',
      },
      pengurus: {
        type: Object,
      },
      viewport: {
        type: Object,
      },
    };
  }

  stateChanged(state: RootState) {
    super.stateChanged(state);
    this.setProperties({
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

  _dataUpdate() {
    if (this.data?.name === DIALOGS.PENGURUS) {
      this.pengurus = this.data.data;
    }
  }

  _getCloseBtnIcon(isLaptopViewport: boolean) {
    return isLaptopViewport ? 'close' : 'arrow-left';
  }

}

window.customElements.define(PengurusDetails.is, PengurusDetails);
