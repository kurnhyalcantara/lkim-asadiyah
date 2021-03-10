import { Initialized, Success } from '@abraham/remotedata';
import { computed, customElement, property } from '@polymer/decorators';
import '@polymer/iron-icon';
import '@polymer/marked-element';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import { ReduxMixin } from '../mixins/redux-mixin';
import { RootState, store } from '../store';
import { fetchBlogList } from '../store/blog/actions';
import { BlogState, initialBlogState } from '../store/blog/state';
import { getDate } from '../utils/functions';
import './shared-styles';
import './text-truncate';

@customElement('latest-posts-block')
export class LatestPostsBlock extends ReduxMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          display: block;
        }

        .posts-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 16px;
        }

        .post {
          padding: 24px 0;
          display: block;
          color: var(--primary-text-color);
        }

        .post:not(:last-of-type) {
          border-bottom: 1px solid var(--default-primary-color);
        }

        .image {
          margin-right: 24px;
          width: 64px;
          height: 64px;
          border-radius: var(--border-radius);
        }

        .details {
          height: 100%;
        }

        .title {
          font-size: 20px;
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
          .posts-wrapper {
            grid-template-columns: repeat(3, 1fr);
          }

          .post:last-of-type {
            display: none;
          }

          .image {
            width: 128px;
            height: 128px;
          }
        }

        @media (min-width: 812px) {
          .posts-wrapper {
            grid-template-columns: repeat(4, 1fr);
          }

          .post:last-of-type {
            display: flex;
          }
        }
      </style>

      <div class="container">
        <h1 class="container-title">{$ latestPostsBlock.title $}</h1>

        <div class="posts-wrapper">
          <template is="dom-repeat" items="[[latestPosts]]" as="post">
            <a
              href$="/blog/posts/[[post.id]]/"
              class="post"
              ga-on="click"
              ga-event-category="blog"
              ga-event-action="open post"
              ga-event-label$="[[post.title]]"
              layout
              horizontal
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
  posts: BlogState = initialBlogState;

  stateChanged(state: RootState) {
    this.posts = state.blog;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.posts instanceof Initialized) {
      store.dispatch(fetchBlogList());
    }
  }

  @computed('posts')
  get latestPosts() {
    if (this.posts instanceof Success) {
      return this.posts.data.slice(0, 4);
    } else {
      return [];
    }
  }

  getDate(date: Date) {
    return getDate(date);
  }
}
