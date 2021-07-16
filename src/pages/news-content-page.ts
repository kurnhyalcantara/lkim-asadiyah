import { Initialized, Success } from '@abraham/remotedata';
import '@polymer/app-route/app-route';
import { customElement, observe, property } from '@polymer/decorators';
import '@polymer/iron-ajax/iron-ajax';
import '@polymer/marked-element';
import '@polymer/paper-button';
import { html, PolymerElement } from '@polymer/polymer';
import 'plastic-image';
import '../elements/news-other-list';
import '../elements/shared-styles';
import { ReduxMixin } from '../mixins/redux-mixin';
import { News } from '../models/news';
import { RootState, store } from '../store';
import { fetchNewsList } from '../store/news/actions';
import { NewsState, initialNewsState } from '../store/news/state';
import { getDate } from '../utils/functions';
import { share } from '../utils/share';

@customElement('news-content-page')
export class NewsContentPage extends ReduxMixin(PolymerElement) {
  @property({ type: Boolean })
  active = false;
  @property({ type: Object })
  route: object;
  @property({ type: Object })
  posts: NewsState = initialNewsState;

  @property({ type: Object })
  private post: News;
  @property({ type: Array })
  private suggestedPosts: News[] = [];
  @property({ type: String })
  private postContent: string;
  @property({ type: Object })
  private postData: { id?: string } = {};

  static get template() {
    return html`
      <style include="shared-styles flex flex-alignment">
        :host {
          display: block;
        }

        .post {
          margin-bottom: 32px;
        }

        .date {
          font-size: 12px;
          text-transform: uppercase;
          color: var(--secondary-text-color);
        }

        .suggested-posts {
          margin: 24px 0 -20px;
          padding-top: 24px;
          background-color: var(--primary-background-color);
        }

        .hero-title {
          margin: 12px 0;
          font-size: 24px;
          font-weight: 600;
          line-height: 1.2;
        }

        .path-content {
          font-size: 12px;
          color: var(--default-primary-color);
        }

        .post-meta {
          font-size: 12px;
          color: var(--secondary-text-color);
        }

        .author-avatar {
          display: inline-block;
          float: left;
          position: relative;
          z-index: 1;
          margin-right: 10px;
        }

        .img-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          z-index: 1;
          padding: 3px;
        }

        .nav-inline {
          display: contents;
          margin: 0 55px 0 4px;
        }

        .share {
          width: 35px;
          display: inline-block;
          margin: 0;
        }

        .share-twitter {
          color: var(--twitter-color);
        }

        .share-facebook {
          color: var(--facebook-color);
        }

        .share-whatsapp {
          color: var(--whatsapp-color);
        }

        [slot='markdown-html'] {
          line-height: 1.8;
          color: var(--primary-text-color);
        }

        [slot='markdown-html'] h1,
        [slot='markdown-html'] h2,
        [slot='markdown-html'] h3 {
          margin: 48px 0 16px;
        }

        [slot='markdown-html'] p {
          margin-top: 0;
          margin-bottom: 24px;
        }

        [slot='markdown-html'] img {
          width: 100%;
        }

        [slot='markdown-html'] plastic-image {
          margin: 32px 0 8px -16px;
          --iron-image-width: calc(100% + 32px);
          width: calc(100% + 32px);
          min-height: 200px;
          background-color: var(--secondary-background-color);
        }

        @media (min-width: 640px) {
          [slot='markdown-html'] plastic-image {
            min-height: 400px;
          }

          .hero-title {
            font-size: 30px;
          }

          .suggested-posts {
            margin-top: 48px;
            padding-bottom: 36px;
          }
        }
      </style>

      <polymer-helmet
        title="[[post.title]] | {$ title $}"
        description="[[post.brief]]"
        image="[[post.image]]"
        active="[[active]]"
        label1="{$ news.published $}"
        data1="[[published]]"
      ></polymer-helmet>

      <app-route route="[[route]]" pattern="/:id" data="{{postData}}"></app-route>

      <hero-block background-color="[[post.primaryColor]]" font-color="#000" active="[[active]]">
        <div class="path-content">{$ pathContent.news $}[[post.tag]]</div>
        <h3 class="hero-title">[[post.title]]</h3>
        <div class="post-meta" layout horizontal justified flex>
          <div class="post-author" layout horizontal>
            <div class="author-avatar">
              <plastic-image class="img-avatar" srcset="[[post.avatar]]" lazy-load preload fade>
              </plastic-image>
            </div>
            <div class="post-details" layout vertical>
              <div class="author-name">[[post.author]]</div>
              <div class="post-published">[[getDate(post.published)]]</div>
            </div>
          </div>
          <div class="share-social">
            <div class="nav-inline">
              <div class="share">
                <paper-icon-button
                  class="share-facebook"
                  icon="lkim:facebook"
                  share="facebook"
                  on-click="share"
                >
                </paper-icon-button>
              </div>
              <div class="share">
                <paper-icon-button
                  class="share-twitter"
                  icon="lkim:twitter"
                  share="twitter"
                  on-click="share"
                >
                </paper-icon-button>
              </div>
              <div class="share">
                <paper-icon-button
                  class="share-whatsapp"
                  icon="lkim:whatsapp"
                  share="whatsapp"
                  on-click="share"
                >
                </paper-icon-button>
              </div>
            </div>
          </div>
        </div>
      </hero-block>

      <div class="container-narrow">
        <marked-element class="post" markdown="[[postContent]]">
          <div slot="markdown-html"></div>
        </marked-element>
        <div class="date">{$ news.published $}: [[getDate(post.published)]]</div>
      </div>

      <div class="suggested-posts">
        <div class="container-narrow">
          <h3 class="container-title">{$ news.suggested $}</h3>
          <news-other-list posts="[[suggestedPosts]]"></news-other-list>
        </div>
      </div>

      <iron-ajax
        auto
        url="[[post.source]]"
        handle-as="text"
        on-response="handleMarkdownFileFetch"
      ></iron-ajax>
    `;
  }

  stateChanged(state: RootState) {
    this.posts = state.news;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.posts instanceof Initialized) {
      store.dispatch(fetchNewsList());
    }
  }

  handleMarkdownFileFetch(event: any) {
    if (event.detail.response) {
      this.postContent = event.detail.response;
    }
  }

  @observe('postData.id', 'posts')
  _postDataObserver(postId: string, posts: NewsState) {
    if (posts instanceof Success) {
      const post = posts.data.find(({ id }) => id === postId);
      this.post = post;
      this.postContent = post?.content;
      this.suggestedPosts = posts.data.filter(({ id }) => id !== postId).slice(0, 3);
    }
  }

  getDate(date: Date) {
    return getDate(date);
  }

  share(e) {
    return share(e);
  }
}
