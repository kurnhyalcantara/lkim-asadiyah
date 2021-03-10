import { Success } from '@abraham/remotedata';
import { computed, customElement } from '@polymer/decorators';
import '@polymer/iron-icon';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import { ReduxMixin } from '../mixins/redux-mixin';
import { PengurusHoC } from '../mixins/pengurus-hoc';
import { Pengurus } from '../models/pengurus';
import './shared-styles';
import './text-truncate';

@customElement('pengurus-block')
export class PengurusBlock extends PengurusHoC(ReduxMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
        }

        .pengurus-wrapper {
          margin: 40px 0 32px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 32px 16px;
        }

        .pengurus {
          text-align: center;
          cursor: pointer;
        }

        .photo {
          width: 72px;
          height: 72px;
          background-color: var(--accent-color);
          border-radius: 50%;
          overflow: hidden;
          transform: translateZ(0);
        }

        .badges {
          position: absolute;
          top: 0;
          left: calc(50% + 24px);
        }

        .badge {
          margin-left: -10px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #fff;
          transition: transform var(--animation);
        }

        .badge:hover {
          transform: scale(1.1);
        }

        .badge:nth-of-type(2) {
          transform: translate(0, 100%);
        }

        .badge:nth-of-type(2):hover {
          transform: translate3d(0, 100%, 20px) scale(1.1);
        }

        .badge-icon {
          --iron-icon-width: 12px;
          --iron-icon-height: 12px;
          color: #fff;
        }

        .company-logo {
          margin-top: 6px;
          width: 100%;
          height: 16px;
        }

        .description {
          color: var(--primary-text-color);
        }

        .name {
          margin-top: 8px;
          line-height: 1.1;
        }

        .origin {
          margin-top: 4px;
          font-size: 14px;
          line-height: 1.1;
        }

        .cta-button {
          margin-top: 24px;
        }

        @media (min-width: 640px) {
          .photo {
            width: 128px;
            height: 128px;
          }

          .name {
            font-size: 24px;
          }
        }

        @media (min-width: 812px) {
          .pengurus-wrapper {
            grid-template-columns: repeat(3, 1fr);
          }

          .pengurus:last-of-type {
            display: none;
          }

          .badges {
            left: calc(50% + 32px);
          }

          .badge:nth-of-type(2) {
            transform: translate(25%, 75%);
          }

          .badge:nth-of-type(2):hover {
            transform: translate3d(25%, 75%, 20px) scale(1.1);
          }

          .badge:nth-of-type(3) {
            transform: translate(10%, 180%);
          }

          .badge:nth-of-type(3):hover {
            transform: translate3d(10%, 180%, 20px) scale(1.1);
          }
        }

        @media (min-width: 1024px) {
          .pengurus-wrapper {
            grid-template-columns: repeat(4, 1fr);
          }

          .pengurus:last-of-type {
            display: block;
          }
        }
      </style>

      <div class="container">
        <h1 class="container-title">{$ pengurusBlock.title $}</h1>

        <div class="pengurus-wrapper">
          <template is="dom-repeat" items="[[featuredPengurus]]" as="pengurus">
            <div
              class="pengurus"
              on-click="_openSpeaker"
              ga-on="click"
              ga-event-category="pengurus"
              ga-event-action="open details"
              ga-event-label$="[[pengurus.name]]"
            >
              <div relative>
                <plastic-image
                  class="photo"
                  srcset="[[pengurus.photoUrl]]"
                  sizing="cover"
                  lazy-load
                  preload
                  fade
                ></plastic-image>
              </div>
              <div class="description">
                <text-truncate lines="1">
                  <h3 class="name">[[pengurus.name]]</h3>
                </text-truncate>
                <text-truncate lines="1">
                  <div class="origin">[[pengurus.jabatan]]</div>
                </text-truncate>
              </div>
            </div>
          </template>
        </div>

        <a href="{$ pengurusBlock.callToAction.link $}">
          <paper-button class="cta-button animated icon-right">
            <span>{$ pengurusBlock.callToAction.label $}</span>
            <iron-icon icon="lkim:arrow-right-circle"></iron-icon>
          </paper-button>
        </a>
      </div>
    `;
  }

  _openSpeaker(e) {
    window.history.pushState({}, null, '/pengurus/');
    window.history.pushState({}, null, `/pengurus/${e.model.pengurus.id}/`);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

  @computed('pengurus')
  get featuredPengurus(): Pengurus[] {
    if (this.pengurus instanceof Success) {
      return this.pengurus.data.slice(0, 4);
    } else {
      return [];
    }
  }
}
