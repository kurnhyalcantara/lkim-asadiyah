import { customElement, property } from '@polymer/decorators';
import '@polymer/marked-element';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import { getDate } from '../utils/functions';
import './shared-styles';
import './text-truncate';

@customElement('article-other-list')
export class ArticleOtherList extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment positioning">
        :host {
          display: block;
        }

        .featured-posts-wrapper {
          grid-template-columns: 1fr;
          display: grid;
          grid-gap: 24px;
        }

        .featured-posts {
          display: block;
          color: var(--primary-text-color);
        }

        .image {
          width: 100%;
          height: 128px;
          border-top-left-radius: var(--border-radius);
          border-top-right-radius: var(--border-radius);
        }

        .details {
          padding: 16px;
        }

        .title {
          line-height: 1.2;
          font-weight: 600;
          color: var(--default-primary-color);
        }

        .description {
          margin-top: 8px;
          color: var(--secondary-text-color);
        }

        .date {
          font-size: 12px;
          text-transform: uppercase;
          color: var(--secondary-text-color);
        }

        @media (min-width: 640px) {
          @media (min-width: 640px) {
            .featured-posts-wrapper {
              grid-template-columns: repeat(3, 1fr);
            }

            .featured-posts:last-of-type {
              display: none;
            }
          }

          @media (min-width: 812px) {
            .featured-posts-wrapper {
              grid-template-columns: repeat(4, 1fr);
            }

            .featured-posts:last-of-type {
              display: flex;
            }
          }
        }
      </style>

      <div class="featured-posts-wrapper">
        <template is="dom-repeat" items="[[posts]]" as="post">
          <a href$="/articles/posts/[[post.id]]/" class="featured-posts card" layout vertical>
            <plastic-image
              class="image"
              srcset="[[post.image]]"
              style$="background-color: [[post.backgroundColor]];"
              sizing="cover"
              lazy-load
              preload
              fade
            ></plastic-image>
            <div class="details" layout vertical justified flex-auto>
              <div>
                <text-truncate lines="2">
                  <h3 class="title">[[post.title]]</h3>
                </text-truncate>
                <text-truncate lines="3">
                  <marked-element class="description" markdown="[[post.brief]]">
                    <div slot="markdown-html"></div>
                  </marked-element>
                </text-truncate>
              </div>
              <span class="date">[[getDate(post.published)]]</span>
            </div>
          </a>
        </template>
      </div>
    `;
  }

  @property({ type: Array })
  posts = [];

  getDate(date) {
    return getDate(date);
  }
}
