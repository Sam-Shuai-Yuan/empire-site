# Empire Square Group — website front end

A static site with no build step. Its layout and motion follow iconiq.com.

## Stack
- Plain HTML and CSS, plus one JS file (`js/main.js`)
- GSAP 3.12.5 and ScrollTrigger from the cdnjs CDN. These are the same libraries ICONIQ uses for its homepage animation.
- Font: Source Serif 4 from Google Fonts. It is a free stand-in for ICONIQ's licensed Quadraat. If you have a Quadraat licence, put it first in `--serif` in `css/style.css`.

## Structure
```
index.html        Home: pinned hero → pillars → Inside Empire (stats + cards) → CTA → footer
why-empire.html   Why Empire: hero, parallax banner, sticky sub-nav, 3 chapters, CTA
css/style.css     All styles (design tokens are at the top in :root)
js/main.js        Hero intro, scroll pin, split-line headings, reveals, counters, nav
assets/           logo.svg, logo-white.svg, mark.svg (from empiresquaregroup.com)
assets/photos/    stock photos (Unsplash, see Photo credits)
```

## Home hero animation
ICONIQ's hero is a film of its logo being drawn in pencil on paper. Once you scroll, the film fades out and a statement rises into place while the section stays pinned. Here the "film" is built in SVG, so no video file is needed:
1. On load, the camera pushes in slowly while pencil construction lines are sketched across the page.
2. The Empire Square mark is outlined, then shaded with a graphite texture. Then the wordmark is drawn letter by letter.
3. On scroll, the hero is pinned for 130% of the viewport height. The drawing fades out and "The key to your world of direct real estate investments." rises into the centre.

To use a real video instead, replace `.hero__svg` with a `<video autoplay muted loop playsinline>`. The scroll timeline in `heroIntro()` still works, because it animates the `[data-hero-art]` wrapper.

## Nav mega-menu
Hovering over (or tabbing to) Direct Investment, Performance or Turnkey Service opens a full-width panel, like ICONIQ's. The panel and the nav bar both take on that menu's tint. Each panel has four items (thumbnail, title, short text) and a featured bar at the bottom. Items link to anchors on the Why Empire page. The tint is set with `style="--tint:…"` on each `.dd`. Below 900px the burger menu is used instead.

## Run locally
Any static server works, for example:
```
python -m http.server 8080
```
Then open http://localhost:8080. Opening `index.html` directly from the file system also works.

## Content to confirm
- IRR: the current home page says **20%** and the Why Empire page says **21%**. Both figures are kept where each one appears. Please confirm which is correct.
- The footer disclaimer is generic placeholder text. Have it reviewed by legal or compliance.
- All photos are generic Unsplash stock images, not Empire Square Group properties. Replace them with the company's own photos when you have them. Keep the same file names in `assets/photos/` and no code changes are needed.

## Photo credits
All photos are from [Unsplash](https://unsplash.com/license), which allows free commercial use. Attribution is not required but is appreciated. Before launch, check that none were later moved to Unsplash+.

| File | Used in | Photographer | Source |
|---|---|---|---|
| `why-banner.jpg` | Why Empire banner | Markus Spiske | [c489JFF96VU](https://unsplash.com/photos/c489JFF96VU) |
| `card-markets.jpg` | Home card 1 | Luca Bravo | [JstDl1mhzxY](https://unsplash.com/photos/JstDl1mhzxY) |
| `card-stewardship.jpg / menu-ts-feature.jpg` | Home card 2, Turnkey menu feature | Nastuh Abootalebi | [yWwob8kwOCk](https://unsplash.com/photos/yWwob8kwOCk) |
| `office-new-york.jpg` | "Our Team · New York" | Bernd Dittrich | [sRdk8gh-fB8](https://unsplash.com/photos/sRdk8gh-fB8) |
| `menu-di-1.jpg` | Direct Investment menu | Andrew Whitmore | [46OCz6383Gg](https://unsplash.com/photos/46OCz6383Gg) |
| `menu-di-2.jpg` | Direct Investment menu | Juan Carlos Becerra | [g3qxucnmr2s](https://unsplash.com/photos/g3qxucnmr2s) |
| `menu-di-3.jpg` | Direct Investment menu | Alex Padurariu | [nzRkTNxSRFQ](https://unsplash.com/photos/nzRkTNxSRFQ) |
| `menu-di-4.jpg` | Direct Investment menu | Nataliia Kvitovska | [bDH1CNZFX0c](https://unsplash.com/photos/bDH1CNZFX0c) |
| `menu-di-feature.jpg` | Direct Investment menu | Melrose By The Lake | [43vHzsfrmxk](https://unsplash.com/photos/43vHzsfrmxk) |
| `menu-pf-1.jpg` | Performance menu | Nicole Padin | [bJyQu2omalY](https://unsplash.com/photos/bJyQu2omalY) |
| `menu-pf-2.jpg` | Performance menu | Justus Menke | [hc7MCn4vk6g](https://unsplash.com/photos/hc7MCn4vk6g) |
| `menu-pf-3.jpg` | Performance menu | Simone Hutsch | [iDSfeuoxM0o](https://unsplash.com/photos/iDSfeuoxM0o) |
| `menu-pf-4.jpg` | Performance menu | Marcus Lenk | [B1yRgQ2zAaw](https://unsplash.com/photos/B1yRgQ2zAaw) |
| `menu-pf-feature.jpg` | Performance menu | Saxon White | [cFCpvWq86Bo](https://unsplash.com/photos/cFCpvWq86Bo) |
| `menu-ts-1.jpg` | Turnkey menu | Aalo Lens | [pt0nGH-NvoA](https://unsplash.com/photos/pt0nGH-NvoA) |
| `menu-ts-2.jpg` | Turnkey menu | Nastuh Abootalebi | [eHD8Y1Znfpk](https://unsplash.com/photos/eHD8Y1Znfpk) |
| `menu-ts-3.jpg` | Turnkey menu | Aalo Lens | [LqGf5UvHCZ8](https://unsplash.com/photos/LqGf5UvHCZ8) |
| `menu-ts-4.jpg` | Turnkey menu | Darshan Patel | [DfzzpBRZCT0](https://unsplash.com/photos/DfzzpBRZCT0) |
