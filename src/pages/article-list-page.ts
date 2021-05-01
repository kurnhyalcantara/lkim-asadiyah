import { Failure, Initialized, Pending, Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
import '@polymer/marked-element';
import '@polymer/paper-progress';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import '../elements/content-loader';
import '../elements/shared-styles';
import '../elements/text-truncate';
import { ReduxMixin } from '../mixins/redux-mixin';
import { Article } from '../models/article';
import { RootState, store } from '../store';
import { fetchArticleList } from '../store/articles/actions';
import { ArticleState, initialArticleState } from '../store/articles/state';
import { Viewport } from '../store/ui/types';
import { getDate } from '../utils/functions';

@customElement('article-list-page')
export class ArticleListPage extends ReduxMixin(PolymerElement) {
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

        .featured {
          padding: 8px 12px;
          background-color: var(--secondary-background-color);
        }

        .featured-post {
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
          font-size: 20px;
          line-height: 1.2;
          color: var(--default-primary-color);
        }

        .description {
          margin-top: 8px;
          opacity: 0.8;
        }

        .date {
          font-size: 12px;
          text-transform: uppercase;
          opacity: 0.8;
        }

        paper-progress {
          width: 100%;
          --paper-progress-active-color: var(--default-primary-color);
          --paper-progress-secondary-color: var(--default-primary-color);
        }

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
      </style>

      <polymer-helmet
        title="{$ heroSettings.article.title $} | {$ title $}"
        description="{$ heroSettings.article.metaDescription $}"
        active="[[active]]"
      ></polymer-helmet>

      <hero-block
        background-image="{$ heroSettings.article.background.image $}"
        background-color="{$ heroSettings.article.background.color $}"
        font-color="{$ heroSettings.article.fontColor $}"
        active="[[active]]"
      >
        <div class="hero-title">{$ heroSettings.article.title $}</div>
        <p class="hero-description">{$ heroSettings.article.description $}</p>
      </hero-block>

      <paper-progress indeterminate hidden$="[[contentLoaderVisibility]]"></paper-progress>

      <div class="featured">
        <div class="container">
          <content-loader
            class="featured-posts-wrapper"
            card-padding="24px"
            card-height="260px"
            border-radius="var(--border-radius)"
            title-top-position="32px"
            title-height="42px"
            title-width="70%"
            load-from="-70%"
            load-to="130%"
            animation-time="1s"
            items-count="{$ contentLoaders.article.itemsCount $}"
            hidden$="[[contentLoaderVisibility]]"
          >
          </content-loader>

          <div class="featured-posts-wrapper">
            <template is="dom-if" if="[[failure]]">
              <p>Tidak ada postingan.</p>
            </template>

            <template is="dom-repeat" items="[[featuredPosts]]" as="post">
              <a
                href$="/article/posts/[[post.id]]/"
                class="featured-post card"
                ga-on="click"
                ga-event-category="article"
                ga-event-action="open post"
                ga-event-label$="[[post.title]]"
                layout
                vertical
              >
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
                      <h2 class="title">[[post.title]]</h2>
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
        </div>
      </div>
    `;
  }

  @property({ type: Boolean })
  active = false;
  @property({ type: Object })
  posts: ArticleState = initialArticleState;

  @property({ type: Object })
  private viewport: Viewport;

  @computed('posts')
  get pending() {
    return this.posts instanceof Pending;
  }

  @computed('posts')
  get failure() {
    return this.posts instanceof Failure;
  }

  stateChanged(state: RootState) {
    this.viewport = state.ui.viewport;
    this.posts = state.article;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.posts instanceof Initialized) {
      store.dispatch(fetchArticleList());
    }
  }

  @computed('posts')
  get featuredPosts(): Article[] {
    if (this.posts instanceof Success) {
      return this.posts.data;
    } else {
      return [];
    }
  }

  @computed('posts')
  get contentLoaderVisibility(): boolean {
    return this.posts instanceof Success || this.posts instanceof Failure;
  }

  _addIfNotPhone(base: number, additional: number) {
    if (this.viewport.isTabletPlus) {
      return base + additional;
    }
    return base;
  }

  getDate(date: Date) {
    return getDate(date);
  }
}
