# Knowledge Base — 个人知识库文档站

基于 Next.js 14 的 Markdown 知识库阅读器，支持全文搜索、AI 对话、目录导航。

## 快速开始

### 1. Clone

```bash
git clone <your-repo-url>
cd knowledge_base
```

### 2. 准备文档

将你的 Markdown 文件放入 `knowledge-base/` 目录，按文件夹分类：

```
knowledge-base/
├── 01-分类名/
│   ├── 01-文档标题.md
│   └── 02-另一个文档.md
├── 02-另一个分类/
│   └── 01-文档.md
└── ...
```

文件夹名前的数字用于排序（如 `01-`、`02-`），渲染时会自动去除。

### 3. 修改配置

编辑 `site/src/site.config.ts`：

```ts
export const config = {
  siteName: "你的站点名",
  siteNameBold: "你的",       // 品牌名前半（粗体）
  siteNameLight: "站点名",     // 品牌名后半（细体）
  description: "站点描述",
  titleTemplate: "%s | 你的站点名",
  titleDefault: "你的站点名 | 知识库",

  homeLabel: "首页",
  searchPlaceholder: "搜索文档...",
  docTreeLabel: "文档目录",
  footer: "© 2026 你的站点名. All rights reserved.",

  aiName: "AI助手",
  aiSubtitle: "基于你的站点名为您解答",
  aiToolbarLabel: "AI 解释",
  aiFavicon: "/framer.svg",

  logo: "/favicon.png",
  favicon: "/favicon.png",

  docsDir: "../knowledge-base",  // 文档目录相对于 site/
};
```

替换 `site/public/favicon.png` 为你自己的 Logo。

### 4. 配置 AI 功能（可选）

复制环境变量模板并填入 DeepSeek API Key：

```bash
cd site
cp .env.local.example .env.local
# 编辑 .env.local，填入 DEEPSEEK_API_KEY=sk-xxx
```

不配置 API Key 不影响其他功能，只是 AI 对话不可用。

### 5. 安装 & 构建

```bash
cd site
npm install
npm run build
```

### 6. 启动

**开发模式：**
```bash
npm run dev
```

**生产模式（PM2）：**
```bash
npm install -g pm2
pm2 start npm --name knowledge-base -- start
pm2 save
```

**生产模式（Docker）：**
```bash
# 使用 standalone 输出（在 next.config.mjs 中添加 output: 'standalone'）
docker build -t knowledge-base .
docker run -p 3000:3000 knowledge-base
```

## 目录结构

```
knowledge_base/
├── knowledge-base/          # Markdown 文档（按文件夹分类）
├── site/                    # Next.js 网站
│   ├── src/
│   │   ├── site.config.ts   # ⭐ 站点配置（改这里）
│   │   ├── app/             # 页面
│   │   ├── components/      # 组件
│   │   ├── lib/             # 工具函数
│   │   └── hooks/           # React Hooks
│   ├── public/              # 静态资源（favicon、logo）
│   ├── .env.local           # 环境变量（API Key）
│   └── package.json
└── README.md
```

## 部署到服务器

### 方式一：SSH + PM2

```bash
# 服务器上
mkdir -p /opt/knowledge-base
cd /opt/knowledge-base

# 上传 site/ 和 knowledge-base/ 目录
# 然后：
cd site
npm install
npm run build
pm2 start npm --name knowledge-base -- start
```

配置 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 方式二：使用部署脚本

```bash
# Windows
cd site
双击 update.bat

# Linux/Mac
cd site
bash update.sh
```

脚本会自动打包、上传、安装依赖、构建、重启 PM2。需要先修改 `update.sh` 中的服务器地址。

## 常见问题

**Q: 如何添加新文档？**
A: 在 `knowledge-base/` 对应文件夹下创建 `.md` 文件，刷新页面即可。ISR 模式下每 5 分钟自动更新，或重启 PM2 立即生效。

**Q: 如何自定义样式？**
A: 修改 `site/src/app/globals.css`（全局样式）和 `site/src/app/doc-content.css`（文档排版）。

**Q: AI 功能不工作？**
A: 检查 `site/.env.local` 中 `DEEPSEEK_API_KEY` 是否正确配置。

**Q: 搜索结果不更新？**
A: 搜索索引有 5 分钟缓存，重启 PM2 可立即刷新。
