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
import { NewsState, initialNewsState } from '../store/news/state';
import { getDate } from '../utils/functions';
import './shared-styles';
import './text-truncate';

@customElement('news-posts-block')
export class NewsPostsBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          display: block;
        }

        .container {
          padding: 24px 24px;
        }

        .posts-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 24px;
        }

        .post {
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
          .image {
            width: 128px;
            height: 128px;
          }
        }
      </style>

      <div class="container">
        <h1 class="container-title">{$ latestPostsBlock.title $}</h1>

        <div class="posts-wrapper">
          <template is="dom-repeat" items="[[latestPosts]]" as="post">
            <a href$="/news/posts/[[post.id]]/" class="post card" layout horizontal>
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
                  <div class="date">[[getDate(post.published)]]</div>
                </div>
              </div>
            </a>
          </template>
        </div>

        <a href="{$ latestPostsBlock.callToAction.link $}">
          <paper-button class="cta-button animated icon-right">
            <span>{$ latestPostsBlock.callToAction.label $}</span>
            <iron-icon icon="lkim:arrow-right-circle"></iron-icon>
          </paper-button>
        </a>
      </div>
    `;
  }

  @property({ type: Object })
  posts: NewsState = initialNewsState;

  stateChanged(state: RootState) {
    this.posts = state.news;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.posts instanceof Initialized) {
      store.dispatch(fetchNewsList());
    }
  }

  @computed('posts')
  get latestPosts() {
    if (this.posts instanceof Success) {
      return this.posts.data.slice(0, 2);
    } else {
      return [];
    }
  }

  getDate(date: Date) {
    return getDate(date);
  }
}
