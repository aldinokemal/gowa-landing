# GOWA landing page

Static website for [GOWA](https://github.com/aldinokemal/go-whatsapp-web-multidevice) (Go WhatsApp), a self-hosted WhatsApp REST API written in Go and released under the MIT License. The page is plain HTML and CSS at the repository root. There is no framework, no Node.js dependency, and no build step.

This site exists so the project can be hosted on [Netlify](https://www.netlify.com)'s Open Source plan. The homepage includes the text “This site is powered by Netlify” and links to the Netlify home page.

## What GOWA is

GOWA sends and receives WhatsApp messages over HTTP. One process can serve the REST API, webhooks, a Model Context Protocol (MCP) endpoint, and the web dashboard. It can connect more than one WhatsApp account at a time. The project is unofficial and is not affiliated with WhatsApp.

The page content is taken from the core repository's [`readme.md`](https://github.com/aldinokemal/go-whatsapp-web-multidevice/blob/main/readme.md). The logo at `gallery/gowa.svg` is copied from that repository's `gallery/gowa.svg`. Colors follow the light and dark palette in [gowa-ui](https://github.com/aldinokemal/gowa-ui).

## Netlify site settings

Use these values in the Netlify UI. They match [`netlify.toml`](netlify.toml).

| Setting | Value |
| --- | --- |
| Base directory | Leave blank. The site is the repository root. |
| Publish directory | `.` |
| Build command | Leave blank. Do not run a build. |

`netlify.toml` sets `publish = "."` and does not set a build command. No environment variables are required. The file also sets security headers and a short browser cache for the stylesheet, logo, and license. HTML is served with `Cache-Control: public, max-age=0, must-revalidate`.

## Preview locally

From this directory:

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Links

- Source: https://github.com/aldinokemal/go-whatsapp-web-multidevice
- Documentation: https://gowa-docs.mintlify.site/
- Docker Hub image: https://hub.docker.com/r/aldinokemal2104/go-whatsapp-web-multidevice
- License: https://github.com/aldinokemal/go-whatsapp-web-multidevice/blob/main/LICENCE.txt
- Code of Conduct: https://github.com/aldinokemal/go-whatsapp-web-multidevice/blob/main/CODE_OF_CONDUCT.md

This landing repository is also under the MIT License. See [`LICENSE`](LICENSE).
