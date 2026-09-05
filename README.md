# ECCV 2026 Europe Trip Guide

Traditional Chinese static travel guide for the 2026 Malmö、Copenhagen、Beauvais and Paris trip.

## Website source

The deployable website lives in `site/`:

- `site/index.html`：旅程總覽
- `site/days/`：每日行程子頁
- `site/places.html`：景點介紹
- `site/logistics.html`：交通、航班與住宿整理
- `site/packing.html`：小包、後背包與行李箱的互動式打包清單
- `site/css/styles.css`：全站樣式
- `site/js/data.js`：行程資料
- `site/js/app.js`：頁面渲染與互動

The PDFs under `pdf/` are reference material and are intentionally not uploaded by the Pages workflow.

## Local preview

From the repository root:

```bash
python3 -m http.server 4173 --directory site
```

Then open <http://localhost:4173>.

## GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` deploys the `site/` directory whenever `main` is updated. In the repository settings, set **Pages → Source** to **GitHub Actions**.
