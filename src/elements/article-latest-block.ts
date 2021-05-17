import { Initialized, Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/marked-element';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import { ReduxMixin } from '../mixins/redux-mixin';
import { RootState, store } from '../store';
import { fetchNewsList } from '../store/news/actions';
import { ArticleState, initialArticleState } from '../store/articles/state';
import { getDate } from '../utils/functions';
import './shared-styles';
import './text-truncate';

@customElement('article-latest-block')
export class ArticleLatestBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          display: block;
        }

        .container {
          padding: 24px 24px;
        }

        .articles-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 16px;
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
          font-size: 20px;
          font-weight: 600;
          line-height: 1.2;
          color: var(--default-primary-color);
        }

        .description {
          margin-top: 8px;
          color: var(--secondary-text-color);
        }

        .date {
          margin-top: 16px;
          font-size: 12px;
          text-transform: uppercase;
          color: var(--secondary-text-color);
        }

        .cta-button {
          margin-top: 24px;
        }

        @media (min-width: 640px) {
          .articles-wrapper {
            grid-template-columns: repeat(3, 1fr);
          }

          .article:last-of-type {
            display: none;
          }
        }

        @media (min-width: 812px) {
          .articles-wrapper {
            grid-template-columns: repeat(4, 1fr);
          }

          .article:last-of-type {
            display: flex;
          }
        }
      </style>

      <div class="container">
        <h1 class="container-title">{$ articleLatestBlock.title $}</h1>
        <div class="articles-wrapper">
          <template is="dom-repeat" items="[[articlePosts]]" as="article">
            <a
              href$="/articles/posts/[[article.id]]/"
              class="article card"
              ga-on="click"
              ga-event-category="article"
              ga-event-action="open article"
              ga-event-label$="[[article.title]]"
              layout
              vertical
            >
              <plastic-image
                class="image"
                srcset="[[article.image]]"
                style$="background-color: [[article.backgroundColor]];"
                sizing="cover"
                lazy-load
                preload
                fade
              ></plastic-image>
              <div class="details" layout vertical justified flex-auto>
                <div>
                  <text-truncate lines="2">
                    <h3 class="title">[[article.title]]</h3>
                  </text-truncate>
                  <text-truncate lines="3">
                    <marked-element class="description" markdown="[[article.brief]]">
                      <div slot="markdown-html"></div>
                    </marked-element>
                  </text-truncate>
                </div>
                <div class="date">[[getDate(article.published)]]</div>
              </div>
            </a>
          </template>
        </div>

        <a href="{$ articleLatestBlock.callToAction.link $}">
          <paper-button class="cta-button animated icon-right">
            <span>{$ articleLatestBlock.callToAction.label $}</span>
            <iron-icon icon="lkim:arrow-right-circle"></iron-icon>
          </paper-button>
        </a>
      </div>
    `;
  }

  @property({ type: Object })
  articles: ArticleState = initialArticleState;

  stateChanged(state: RootState) {
    this.articles = state.article;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.articles instanceof Initialized) {
      store.dispatch(fetchNewsList());
    }
  }

  @computed('articles')
  get articlePosts() {
    if (this.articles instanceof Success) {
      return this.articles.data.slice(0, 4);
    } else {
      return [];
    }
  }

  getDate(date: Date) {
    return getDate(date);
  }
}
