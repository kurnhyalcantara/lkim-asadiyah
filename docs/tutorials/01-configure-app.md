# Configure

Configuration data is split into two files:
`data/settings.json` (configuration data):

```json
  "organizer": {..},
  "url": "..",
  "webapp": {..},
  "hashtag": "..",
  "navigation": [..],
  "location": {..}
  "social": [..],
  "gallery": {..},
  ...
```

and `data/resources.json` (texts and other configurations):

### Pages configuration

Disable, reorder or modify blocks for individual pages inside their individual files that can be found in `/pages` folder.
The top block (aka 'hero') view of the page can be adjusted via `heroSettings` in `data/settings.json`

```json
  "heroSettings": {
    "home": {
      "description1": "Selamat Datang di Portal",
      "description2": "LKIM IAI Asadiyah Web App",
      "background": {
        "color": "#FFF"
      },
      "fontColor": "#424242"
    },
    "pengurus": {
      "title": "Pengurus",
      "metaDescription": "Mengenal lebih dekat profil Pengurus Lembaga Kajian Ilmiah Mahasiswa (LKIM) IAI Asadiyah masa khidmat 2021-2022",
      "description": "Mengenal lebih dekat profil Pengurus Lembaga Kajian Ilmiah Mahasiswa (LKIM) IAI Asadiyah masa khidmat 2021-2022",
      "background": {
        "color": "#FFF",
        "image": "/images/backgrounds/bg1.svg"
      },
      "fontColor": "#424242"
    },
    "news": {
      "title": "Berita",
      "metaDescription": "Berita agenda dan cerita terbaru LKIM IAI As'adiyah",
      "description": "Berita agenda dan cerita terbaru LKIM IAI As'adiyah",
      "background": {
        "color": "#FFF",
        "image": "/images/backgrounds/bg1.svg"
      },
      "fontColor": "#424242"
    },
    "article": {
      "title": "Artikel",
      "metaDescription": "Berbagai tulisan berupa artikel dan opini karya anggota dan pengurus LKIM IAI Asadiyah",
      "description": "Berbagai tulisan berupa artikel dan opini karya anggota dan pengurus LKIM IAI Asadiyah",
      "background": {
        "color": "#FFF",
        "image": "/images/backgrounds/bg1.svg"
      },
      "fontColor": "#424242"
    },
    "schedule": {
      "title": "Agenda",
      "metaDescription": "Daftar agenda kegiatan pengurus LKIM IAI Asadiyah masa khidmat 2021-2022",
      "description": "Daftar agenda kegiatan pengurus LKIM IAI Asadiyah masa khidmat 2021-2022",
      "background": {
        "color": "#fff",
        "image": "/images/backgrounds/bg1.svg"
      },
      "fontColor": "#424242"
    }
  },
```

If you don't need some pages, don't forget to remove them (or comment out)
in `lkim-app.ts`

```html
<iron-pages
  attr-for-selected="name"
  selected="[[route.route]]"
  selected-attribute="active"
  hide-immediately
>
  <home-page name="home"></home-page>
  <pengurus-page name="pengurus" route="[[subRoute]]"></pengurus-page>
  <news-page name="news" route="[[subRoute]]"></news-page>
  <article-page name="articles" route="[[subRoute]]"></article-page>
  <schedule-page name="schedule" route="[[subRoute]]"></schedule-page>
</iron-pages>
```

### Toolbar Navigation

Define a page's label and url in `navigation` in `data/settings.json`

```json
"navigation": [
  {
    "route": "home",
    "permalink": "/",
    "label": "Home",
    "icon": "home"
  },
  {
    "route": "pengurus",
    "permalink": "/pengurus/",
    "label": "Pengurus",
    "icon": "assignment-ind"
  },
  ...
]
```

# Next steps

Now your Web App is configured, learn how to integrate [firebase][firebase] with, [style][style app] and [deploy][deploy] your app.

[style app]: 03-styling.md
[deploy]: 04-deploy.md
[firebase]: 02-firebase.md
