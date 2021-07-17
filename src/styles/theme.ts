import { css } from 'lit-element';

export const theme = css`
  :host {
    --dark-primary-color: #0c92d1;
    --default-primary-color: #25aff3;
    --focused-color: #0b86c1;
    --light-primary-color: #96d9fa;
    --text-primary-color: #ffffff;
    --accent-color: #e91da2;
    --primary-background-color: #ffffff;
    --primary-text-color: #424242;
    --secondary-text-color: #757575;
    --disabled-text-color: #bdbdbd;
    --divider-color: #ededed;
    --footer-background-color: #f5f5f5;
    --footer-text-color: #616161;
    --twitter-color: #4099ff;
    --facebook-color: #3b5998;
    --whatsapp-color: #128c7e;
    --border-light-color: #e2e2e2;
    --error-color: #e64a19;

    /* Custom */
    --default-background-color: #ffffff;
    --secondary-background-color: #f8f8f8;
    --additional-background-color: #e2e2e2;
    --contrast-additional-background-color: #e8e8e8;
    --animation: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    --slideAnimation: 0.4s cubic-bezier(0, 0, 0.2, 1);
    --border-radius: 4px;
    --box-shadow: 18px 18px 46px #d9d9d9, -18px -18px 46px #ffffff;
    --box-shadow-header: rgb(0 0 0 / 12%) 0px 2px 6px 0px, rgb(218 220 224) 0px -1px 0px 0px inset;
    --box-shadow-primary-color: 0 3px 3px -2px rgba(37, 175, 243, 0.3),
      0 3px 4px 0 rgba(37, 175, 243, 0.3), 0 1px 8px 0 rgba(37, 175, 243, 0.3);
    --box-shadow-primary-color-hover: 0 1px 3px -2px rgba(37, 175, 243, 0.4),
      0 4px 5px 0 rgba(37, 175, 243, 0.4), 0 2px 9px 0 rgba(37, 175, 243, 0.4);
    --font-family: -apple-system, BlinkMacSystemFont, 'Fira Sans', Roboto, Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    --max-container-width: 1280px;

    --primary-color-transparent: rgba(37, 175, 243, 0.1);
    --primary-color-light: rgba(37, 175, 243, 0.8);
    --primary-color-white: #ede7f6;

    /* Labels */
    --gde: #3d5afe;
    --wtm: #1de9b6;
    --gdg: #00b0ff;

    /* Tags */
    --umum: #c112fc;
    --internal: #f09c1e;
    --open-recruitment: var(--light-primary-color);
    --pelatihan: #0606d0;
    --follow-up: #a3e30d;
    --aktualisasi-diri: #9603ed;

    /* Status */
    --terbuka: #00c131;
    --ditutup: #c0c0c0;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: var(--font-family);
    text-rendering: optimizeLegibility;
    color: var(--primary-text-color);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    font-weight: normal;
  }

  h1 {
    padding: 8px 8px 24px 14px;
    font-size: 24px;
    line-height: 30px;
    font-weight: 500;
  }

  a {
    color: var(--default-primary-color);
    text-decoration: none;
    transition: border-color var(--animation);
  }

  mwc-button {
    --mdc-theme-primary: var(--default-primary-color);
    --mdc-theme-on-primary: var(--default-background-color);
  }

  paper-button {
    padding: 0.7em;
    border-radius: var(--border-radius);
    font-size: 14px;
    font-family: var(--font-family);
    font-weight: 600;
    color: var(--default-primary-color);
    transition: background-color var(--animation);
  }

  paper-button:hover {
    background-color: var(--primary-color-transparent);
  }

  paper-button[disabled] {
    cursor: default;
    background-color: var(--primary-color-transparent);
    opacity: 0.8;
  }

  paper-button[primary] {
    background-color: var(--default-primary-color);
    color: var(--text-primary-color);
  }

  paper-button[primary]:hover {
    background-color: var(--primary-color-light);
  }

  paper-button[primary][invert] {
    color: var(--default-primary-color);
    background-color: var(--text-primary-color);
  }

  paper-button[primary][invert]:hover {
    background-color: var(--primary-color-white);
  }

  paper-button[primary][stroke] {
    color: var(--default-primary-color);
    background-color: transparent;
    border: 1px solid var(--default-primary-color);
  }

  paper-button[primary][stroke]:hover {
    background-color: var(--primary-color-white);
  }

  paper-button[primary-text] {
    color: var(--default-primary-color);
  }

  paper-button[danger] {
    background-color: var(--error-color);
    color: var(--text-primary-color);
  }

  paper-button[danger]:hover {
    background-color: var(--error-color);
    opacity: 0.8;
    color: var(--text-primary-color);
  }

  paper-button iron-icon {
    --iron-icon-height: 20px;
    --iron-icon-width: 20px;
  }

  paper-button.icon-right iron-icon {
    margin-left: 8px;
  }

  paper-button.icon-left iron-icon {
    margin-right: 8px;
  }

  paper-button.animated iron-icon {
    transition: transform var(--animation);
  }

  paper-button.animated.icon-right:hover iron-icon {
    transform: translateX(4px);
  }

  paper-button.animated.icon-left:hover iron-icon {
    transform: translateX(-4px);
  }

  paper-tab {
    font-family: var(--font-family);
    font-weight: 600;
  }

  .container,
  .container-narrow {
    margin: 0 auto;
    padding: 24px 16px;
    max-width: var(--max-container-width);
  }

  .container-narrow {
    max-width: 800px;
  }

  .container-title {
    margin-bottom: 24px;
    padding: 0;
    font-size: 28px;
    font-weight: 600;
  }

  .container-title::after {
    content: '';
    display: block;
    height: 3px;
    width: 60px;
    background-color: var(--default-primary-color);
    margin: 12px 0;
  }

  .big-icon {
    --iron-icon-height: 48px;
    --iron-icon-width: 48px;
  }

  .gde-b {
    background-color: var(--gde);
  }

  .wtm-b {
    background-color: var(--wtm);
  }

  .gdg-b {
    background-color: var(--gdg);
  }

  .google-b {
    background-color: var(--secondary-background-color);
  }

  .google-b .badge-icon {
    --iron-icon-width: 18px;
    --iron-icon-height: 18px;
    color: #fff;
  }

  .card {
    background-color: var(--default-background-color);
    box-shadow: var(--box-shadow);
    border-radius: 12px;
    transition: box-shadow var(--animation);
    cursor: pointer;
  }

  .card:hover {
    background-color: var(--secondary-background-color);
  }

  .tag {
    height: 32px;
    padding: 8px 12px;
    font-size: 12px;
    color: currentColor;
    background: white;
    border: 1px solid currentColor;
    border-radius: 32px;
  }

  @media (min-width: 640px) {
    .container,
    .container-narrow {
      padding: 32px;
    }

    .container-title {
      font-size: 32px;
    }
  }
`;
