import { Failure, Initialized, Pending, Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
import '@polymer/marked-element';
import '@polymer/paper-progress';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import '../elements/content-loader';
import '../elements/news-other-list';
import '../elements/shared-styles';
import '../elements/text-truncate';
import { ReduxMixin } from '../mixins/redux-mixin';
import { News } from '../models/news';
import { RootState, store } from '../store';
import { fetchNewsList } from '../store/news/actions';
import { NewsState, initialNewsState } from '../store/news/state';
import { Viewport } from '../store/ui/types';
import { getDate } from '../utils/functions';

@customElement('news-list-page')
export class NewsListPage extends ReduxMixin(PolymerElement) {
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
          background-color: var(--secondary-background-color);
        }

        .featured-post {
          display: block;
          color: var(--primary-text-color);
          padding: 16px;
        }

        .image {
          margin-right: 24px;
          width: 64px;
          height: 64px;
          border-radius: var(--border-radius);
        }

        .image-overlay {
          background-color: rgba(0, 0, 0, 0.6);
        }

        .details {
          height: 100%;
        }

        .title {
          line-height: 1.2;
          font-weight: 600;
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
          .image {
            width: 128px;
            height: 128px;
          }
        }
      </style>

      <polymer-helmet
        title="{$ heroSettings.news.title $} | {$ title $}"
        description="{$ heroSettings.news.metaDescription $}"
        active="[[active]]"
      ></polymer-helmet>

      <hero-block
        background-image="{$ heroSettings.news.background.image $}"
        background-color="{$ heroSettings.news.background.color $}"
        font-color="{$ heroSettings.news.fontColor $}"
        active="[[active]]"
      >
        <div class="hero-title">{$ heroSettings.news.title $}</div>
        <p class="hero-description">{$ heroSettings.news.description $}</p>
      </hero-block>

      <paper-progress indeterminate hidden$="[[contentLoaderVisibility]]"></paper-progress>

      <div class="featured">
        <div class="container">
          <content-loader
            class="featured-posts-wrapper"
            card-padding="24px"
            card-height="160px"
            border-radius="var(--border-radius)"
            title-top-position="32px"
            title-height="42px"
            title-width="70%"
            load-from="-70%"
            load-to="130%"
            animation-time="1s"
            items-count="{$ contentLoaders.news.itemsCount $}"
            hidden$="[[contentLoaderVisibility]]"
          >
          </content-loader>

          <div class="featured-posts-wrapper">
            <template is="dom-if" if="[[failure]]">
              <p>Tidak ada postingan.</p>
            </template>

            <template is="dom-repeat" items="[[featuredPosts]]" as="post">
              <a href$="/news/posts/[[post.id]]/" class="featured-post card" layout horizontal>
                <plastic-image
                  class="image"
                  srcset="[[post.image]]"
                  style$="background-color: [[post.backgroundColor]];"
                  sizing="cover"
                  lazy-load
                  preload
                  fade
                ></plastic-image>
                <div flex>
                  <div class="details" layout vertical justified>
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
  posts: NewsState = initialNewsState;

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
    this.posts = state.news;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.posts instanceof Initialized) {
      store.dispatch(fetchNewsList());
    }
  }

  @computed('posts')
  get featuredPosts(): News[] {
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

  getDate(date: Date) {
    return getDate(date);
  }
}
