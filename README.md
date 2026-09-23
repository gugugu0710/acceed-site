# acceed — 会员制餐厅官网

一个纯静态、零依赖的单页官网，苹果官网式的排版与滚动节奏（大字号、留白、深色与浅色分区、粘性叙事、顺滑滚动动效）。
无需构建工具，也不需要 npm：把文件放进 GitHub 仓库，开启 GitHub Pages 就能上线。

```
index.html              整站内容（单页，锚点导航）
assets/css/style.css    全部样式（含动效、响应式、深色分区）
assets/js/main.js       交互（导航、滚动揭示、粘性叙事、画廊拖拽）
assets/img/favicon.svg  浏览器图标
assets/img/og.svg       分享封面（社交平台建议换成 1200×630 的 PNG）
.nojekyll               让 GitHub Pages 原样输出文件
```

## 本地预览

直接双击 `index.html` 即可；或者起一个本地服务（推荐，路径与缓存更接近线上）：

```bash
python3 -m http.server 8000
# 然后打开 http://localhost:8000
```

## 部署到 GitHub Pages

1. 新建一个仓库，例如 `acceed-site`（或 `<你的用户名>.github.io` 以获得根域名）。
2. 把本目录所有文件推上去：
   ```bash
   git init
   git add .
   git commit -m "acceed 官网"
   git branch -M main
   git remote add origin https://github.com/<用户名>/<仓库名>.git
   git push -u origin main
   ```
3. 仓库页面 → **Settings → Pages** → Source 选 **Deploy from a branch** → Branch 选 `main` + `/ (root)` → Save。
4. 约 1 分钟后访问 `https://<用户名>.github.io/<仓库名>/`。
5. 如果绑定自定义域名：在仓库 Pages 设置里填域名，并把 `index.html` 中的 `canonical` 和 `og:` 链接改成你的域名。

## 需要替换的内容（搜索 `TODO`）

| 位置 | 现在写的 | 说明 |
| --- | --- | --- |
| `index.html` `<link rel="canonical">` | `https://REPLACE-WITH-YOUR-DOMAIN/` | 换成正式域名 |
| 预约区 / 页脚 | `021-0000 0000`、`hello@example.com` | 换成真实电话与邮箱，同时更新 `tel:`、`mailto:` 链接 |
| 预约区 | `上海市黄浦区（示例地址，请替换）` | 换成真实地址（地图链接也可以加） |
| 菜单区 | 秋季八品与价格 `¥2,880` / `¥1,280` | 换成真实菜单、价格、更新日期 |
| 会员区 | 银卡 `¥8,800`、金卡 `¥28,000`、黑卡邀请制 | 换成真实会费与权益，并同步下方对比表 |
| 分享封面 | `assets/img/og.svg` | 社交平台多不支持 SVG，建议导出 1200×630 的 `og.jpg` 并改链接 |

## 想换成真实照片？

当前视觉完全由 CSS 渐变与图形构成（没有任何外部图片请求，加载极快、不会失效）。
想换成实拍照片时，把图片放进 `assets/img/`，然后：

- **空间画廊**：在 `.material__art` 上加一行背景图，例如
  ```html
  <div class="material__art" style="background-image:url('assets/img/bar.jpg');background-size:cover;background-position:center" aria-hidden="true"></div>
  ```
- **头图**：把 `.hero__glow` 换成
  ```html
  <div class="hero__glow hero__glow--photo" style="background-image:url('assets/img/hero.jpg')" aria-hidden="true"></div>
  ```
  并在 CSS 中加 `.hero__glow--photo{background-size:cover;background-position:center;filter:none;opacity:.55}`。

图片建议压缩到 300KB 以内（可用 WebP），并同步修改 `og:image`。

## 设计说明

- **字体**：`-apple-system` / `SF Pro Display` / `PingFang SC` 系统字体栈，苹果设备上自动呈现 SF Pro，中文自动落到苹方。
- **节奏**：深色头图 → 浅色理念 → 浅灰体验 → 白色叙事 → 纯黑菜单 → 白色空间 → 浅灰会员 → 纯黑预约，明暗交替形成段落感。
- **动效**：`IntersectionObserver` 驱动的滚动揭示、粘性叙事（左侧“盘面”随步骤变色）、跑马灯、画廊横向滚动；全部遵循 `prefers-reduced-motion`。
- **无障碍**：跳过导航链接、语义化标签、`aria` 属性、键盘可聚焦的画廊、可见的焦点样式。
- **响应式**：1024 / 860 / 760 / 480 四档断点，移动端自动切换为整屏菜单与单列卡片。
