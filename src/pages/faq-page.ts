import { customElement, property } from '@polymer/decorators';
import { html, PolymerElement } from '@polymer/polymer';
import '../elements/footer-block';
import '../elements/md-content';
import '../elements/polymer-helmet';

@customElement('faq-page')
export class FaqPage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <polymer-helmet
        title="{$ heroSettings.faq.title $} | {$ title $}"
        description="{$ heroSettings.faq.metaDescription $}"
        active="[[active]]"
      ></polymer-helmet>

      <hero-block
        background-image="{$ heroSettings.faq.background.image $}"
        background-color="{$ heroSettings.faq.background.color $}"
        font-color="{$ heroSettings.faq.fontColor $}"
        active="[[active]]"
      >
        <div class="hero-title">{$ heroSettings.faq.title $}</div>
        <p class="hero-description">{$ heroSettings.faq.description $}</p>
      </hero-block>

      <md-content md-source="[[source]]"></md-content>

      <footer-block></footer-block>
    `;
  }

  @property({ type: Boolean })
  active = false;
  @property({ type: String })
  source = '{$ faq $}';
}
