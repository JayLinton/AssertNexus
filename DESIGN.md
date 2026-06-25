# Design System: Notion-Style Knowledge Base

> 基于 Notion 营销网站设计系统 + Notion 文档编辑器实际排版需求构建
> 用于构建个人知识库文档站，优先阅读体验

## 1. Visual Theme & Atmosphere

知识库文档站的核心是**阅读体验**。设计哲学：让内容成为主角，UI 隐形。

- 页面背景：纯白 `#ffffff`，无纹理、无渐变
- 文字颜色：暖黑色 `rgba(0,0,0,0.95)`，非纯黑，降低阅读疲劳
- 内容区最大宽度：**720px**（阅读舒适宽度），居中
- 侧边导航：可折叠树形，悬浮/滑动式，不占固定空间
- 整体感觉：像纸质笔记本，温暖、干净、专注

**Key Characteristics:**
- 暖中性色阶（带黄棕底调）：`#f6f5f4`, `#31302e`, `#615d59`, `#a39e98`
- 字体：Inter（NotionInter 的替代），字重 400/500/600/700
- 边框：极细 `1px solid rgba(0,0,0,0.1)`，几乎不可见的分割线
- 阴影：多层低透明度叠加（单层 opacity ≤ 0.05），自然光感
- 圆角：按钮 4px，卡片 12px，badge 9999px
- 唯一强调色：Notion Blue `#0075de`，仅用于链接和交互

## 2. Color Palette & Roles

### Primary
- **Notion Black** `rgba(0,0,0,0.95)` / `#000000f2`：主文字、标题、正文
- **Pure White** `#ffffff`：页面背景、卡片表面
- **Notion Blue** `#0075de`：链接、交互强调、CTA

### Warm Neutral Scale
- **Warm White** `#f6f5f4`：交替区块背景、代码块浅色背景、引用块背景
- **Warm Dark** `#31302e`：暗色模式背景
- **Warm Gray 500** `#615d59`：次要文字、描述、muted 标签
- **Warm Gray 300** `#a39e98`：placeholder、禁用状态、caption

### Semantic Accent Colors
- **Teal** `#2a9d99`：成功状态
- **Green** `#1aae39`：确认、完成
- **Orange** `#dd5b00`：警告
- **Pink** `#ff64c8`：装饰强调
- **Purple** `#391c57`：深度强调
- **Brown** `#523410`：暖色强调

### Interactive
- **Link Blue** `#0075de`：链接色，hover 下划线
- **Link Light Blue** `#62aef0`：暗色背景链接
- **Focus Blue** `#097fe8`：焦点环
- **Badge Blue Bg** `#f2f9ff`：pill badge 背景
- **Badge Blue Text** `#097fe8`：pill badge 文字

### Dark Mode
- **Dark Background** `#1e1e1e`：暗色主背景（比纯黑柔和）
- **Dark Surface** `#2d2d2d`：卡片、代码块背景
- **Dark Border** `rgba(255,255,255,0.1)`：暗色边框
- **Dark Text** `rgba(255,255,255,0.95)`：暗色主文字
- **Dark Muted** `rgba(255,255,255,0.6)`：暗色次要文字

### Shadows & Depth
- **Card Shadow**: `rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84688px, rgba(0,0,0,0.02) 0px 0.8px 2.925px, rgba(0,0,0,0.01) 0px 0.175px 1.04062px`
- **Deep Shadow**: `rgba(0,0,0,0.01) 0px 1px 3px, rgba(0,0,0,0.02) 0px 3px 7px, rgba(0,0,0,0.02) 0px 7px 15px, rgba(0,0,0,0.04) 0px 14px 28px, rgba(0,0,0,0.05) 0px 23px 52px`
- **Whisper Border**: `1px solid rgba(0,0,0,0.1)`

## 3. Typography Rules

### Font Family
- **Primary**: `Inter, -apple-system, system-ui, Segoe UI, Helvetica, Apple Color Emoji, Arial, sans-serif`
- **Monospace**: `JetBrains Mono, Fira Code, Menlo, Monaco, Consolas, monospace`
- **OpenType Features**: `"lnum"` (lining numerals) on标题和正文

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Page Title | Inter | 40px (2.5rem) | 700 | 1.2 | -0.02em | 页面大标题，文档站首页 |
| H1 | Inter | 32px (2rem) | 700 | 1.3 | -0.015em | 文档主标题 |
| H2 | Inter | 26px (1.63rem) | 700 | 1.35 | -0.01em | 章节标题 |
| H3 | Inter | 22px (1.38rem) | 600 | 1.4 | -0.005em | 小节标题 |
| H4 | Inter | 18px (1.125rem) | 600 | 1.4 | 0 | 子节标题 |
| Body Large | Inter | 18px (1.125rem) | 400 | 1.75 | 0 | 引言、摘要 |
| Body | Inter | 16px (1rem) | 400 | 1.75 | 0 | 标准正文 |
| Body Medium | Inter | 16px (1rem) | 500 | 1.75 | 0 | 导航、UI 文字 |
| Caption | Inter | 14px (0.875rem) | 400 | 1.5 | 0 | 元数据、辅助文字 |
| Badge | Inter | 12px (0.75rem) | 600 | 1.33 | 0.125px | Pill badge |
| Code | Mono | 14px (0.875rem) | 400 | 1.6 | 0 | 代码块、行内代码 |

### Principles
- **阅读优先**：正文行高 1.75（比营销网站的 1.5 更宽松），减少阅读疲劳
- **标题压缩**：大字标题使用负字间距，但比营销网站更保守（H1 用 -0.015em 而非 -2.125px）
- **四档字重**：400（阅读）、500（UI）、600（强调）、700（标题）
- **内容区宽度限制**：正文 max-width 720px，标题可稍宽（800px）

## 4. Component Stylings

### Buttons

**Primary Blue**
- Background: `#0075de`
- Text: `#ffffff`
- Padding: 8px 16px
- Radius: 4px
- Border: `1px solid transparent`
- Hover: background `#005bab`
- Active: scale(0.98)
- Focus: `2px solid #097fe8` outline

**Secondary**
- Background: `rgba(0,0,0,0.05)`
- Text: `rgba(0,0,0,0.95)`
- Padding: 8px 16px
- Radius: 4px
- Hover: background `rgba(0,0,0,0.08)`

**Ghost / Link**
- Background: transparent
- Text: `#0075de`
- Hover: underline

**Pill Badge**
- Background: `#f2f9ff`
- Text: `#097fe8`
- Padding: 4px 10px
- Radius: 9999px
- Font: 12px weight 600

### Cards & Containers
- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.1)`
- Radius: 12px
- Shadow: 4-layer card shadow（见上方）
- Hover: shadow 轻微增强，translateY(-1px)
- Padding: 24px

**文档卡片（首页 Gallery）**
- 白色背景，12px 圆角，whisper border
- 标题 18px weight 600
- 描述 14px weight 400，颜色 `#615d59`
- 底部元数据：文件数、修改时间，12px caption
- 悬停：阴影加深，轻微上浮

### Inputs & Forms
- Background: `#ffffff`
- Border: `1px solid rgba(0,0,0,0.15)`
- Padding: 8px 12px
- Radius: 4px
- Focus: border `#0075de`，`0 0 0 3px rgba(0,117,222,0.15)` 光环
- Placeholder: `#a39e98`

### Navigation

**顶部导航**
- Background: `#ffffff` / `rgba(255,255,255,0.95)` + backdrop-blur
- Height: 56px
- Border-bottom: `1px solid rgba(0,0,0,0.05)`
- 左侧：Logo + 站点名称
- 右侧：搜索框 + 暗色模式切换 + 设置
- 字体：15px weight 500

**侧边文档树（核心导航）**
- 宽度：280px（可折叠）
- 背景：`#f6f5f4`（浅色模式）/ `#2d2d2d`（暗色模式）
- 文件夹：可展开/折叠，左侧有展开箭头
- 文件：点击跳转，当前页面高亮（背景 `#e3f2fd` / `#1a3a5c`）
- 字体：14px weight 400，文件夹名 500
- 缩进：每层 16px
- Hover：背景 `rgba(0,0,0,0.04)`
- 滚动条：极细，暗色模式下反色

### 搜索框
- 顶部导航中央或右侧
- 背景：`#f6f5f4`
- Border: `1px solid rgba(0,0,0,0.08)`
- Radius: 8px
- Placeholder: "搜索文档..."
- 聚焦：展开下拉，显示搜索结果（标题 + 匹配片段）
- 快捷键：Cmd/Ctrl + K 唤起

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px, 96px

### Content Area
- 内容区最大宽度：720px（正文）/ 800px（标题区）
- 内容区水平居中
- 内容区上下 padding：48px（桌面）/ 24px（移动端）
- 侧边导航收起时，内容区可扩展至 900px

### Grid & Container
- 整体布局：侧边导航（280px，可折叠）+ 内容区（flexible）
- 移动端：侧边导航变为悬浮抽屉
- 首页卡片网格：3 列（桌面）/ 2 列（平板）/ 1 列（手机）
- Gap：24px

### Whitespace Philosophy
- **内容优先**：大量留白围绕内容，但内容本身紧凑（段落间距 1em）
- **呼吸感**：区块间距 48-64px，让眼睛有休息的地方
- **温暖交替**：白色内容区与 `#f6f5f4` 侧边导航形成自然分界，无需硬边框

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow, no border | 页面背景、纯文本 |
| Whisper | `1px solid rgba(0,0,0,0.1)` | 卡片边框、分割线 |
| Soft Card | 4-layer shadow (max opacity 0.04) | 内容卡片、文档卡片 |
| Deep Card | 5-layer shadow (max opacity 0.05) | 模态框、搜索下拉、悬浮菜单 |
| Focus | `2px solid #097fe8` + shadow | 键盘焦点 |

**Shadow Philosophy**: 多层极低透明度阴影叠加，营造自然光感，元素像是嵌入页面而非悬浮其上。

## 7. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | < 640px | 单列，侧边导航变为抽屉，内容区全宽 |
| Tablet | 640-1024px | 侧边导航可折叠，内容区 720px |
| Desktop | > 1024px | 完整布局，侧边导航常驻 |

### Typography Scaling
- H1: 32px → 28px（移动端）
- H2: 26px → 22px
- Body: 16px 不变（阅读字号不缩放）
- 内容区 padding: 48px → 24px → 16px

## 8. Accessibility & States

### Focus System
- 所有交互元素有可见焦点指示器
- Focus: `2px solid #097fe8` outline + `0 0 0 3px rgba(9,127,232,0.15)`
- 键盘导航支持

### Interactive States
- **Default**: 标准外观
- **Hover**: 文字颜色偏移，按钮 scale(1.02)，链接下划线
- **Active/Pressed**: scale(0.98)，背景变深
- **Focus**: 蓝色光环
- **Disabled**: `#a39e98` 文字，降低透明度

### Color Contrast
- 主文字 on 白色: ~18:1 (AAA)
- 次要文字 `#615d59` on 白色: ~5.5:1 (AA)
- 链接 `#0075de` on 白色: ~4.6:1 (AA)

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: `#0075de`
- Background: `#ffffff`
- Alt Background: `#f6f5f4`
- Heading text: `rgba(0,0,0,0.95)`
- Body text: `rgba(0,0,0,0.95)`
- Secondary text: `#615d59`
- Muted text: `#a39e98`
- Border: `1px solid rgba(0,0,0,0.1)`
- Link: `#0075de`
- Focus: `#097fe8`
- Dark bg: `#1e1e1e`
- Dark surface: `#2d2d2d`

### Example Component Prompts
- "Create a hero section on white background. Headline at 40px Inter weight 700, line-height 1.2, letter-spacing -0.02em, color rgba(0,0,0,0.95). Subtitle at 18px weight 400, line-height 1.75, color #615d59."
- "Design a document card: white background, 1px solid rgba(0,0,0,0.1) border, 12px radius, 24px padding. Title at 18px Inter weight 600. Description at 14px weight 400, color #615d59. Use 4-layer card shadow."
- "Build a pill badge: #f2f9ff background, #097fe8 text, 9999px radius, 4px 10px padding, 12px Inter weight 600."
- "Create navigation sidebar: 280px width, #f6f5f4 background, collapsible folder tree with 16px indentation. Current item highlighted with #e3f2fd background. Font 14px Inter weight 400."
- "Design search input: #f6f5f4 background, 8px radius, 8px 12px padding, placeholder #a39e98. Focus: border #0075de, blue glow ring."

### Iteration Guide
1. 始终使用暖中性色，不要用蓝灰色
2. 正文行高 1.75，不是 1.5
3. 内容区最大宽度 720px，不要全宽
4. 边框是 whisper 级别：`1px solid rgba(0,0,0,0.1)`
5. 阴影用 4-5 层叠加，单层 opacity 不超过 0.05
6. 侧边导航背景 `#f6f5f4`，与内容区自然分界
7. 暗色模式背景用 `#1e1e1e`，不要用纯黑
8. 链接只用一个蓝色 `#0075de`
9. 按钮圆角 4px，卡片 12px，badge 9999px
10. 字体始终用 Inter，代码用 JetBrains Mono

---

## 10. Document Content Styles (知识库文档排版)

> 这是专门针对 Markdown 文档渲染的排版规范，确保阅读体验接近 Notion 编辑器。

### Headings

**H1 (文档主标题)**
- Font: Inter 32px weight 700
- Line-height: 1.3
- Letter-spacing: -0.015em
- Color: rgba(0,0,0,0.95)
- Margin-top: 0
- Margin-bottom: 24px
- Border-bottom: `1px solid rgba(0,0,0,0.1)`（可选，作为文档分隔）

**H2 (章节标题)**
- Font: Inter 26px weight 700
- Line-height: 1.35
- Letter-spacing: -0.01em
- Color: rgba(0,0,0,0.95)
- Margin-top: 48px
- Margin-bottom: 16px
- 与上方内容有明显间距，形成章节感

**H3 (小节标题)**
- Font: Inter 22px weight 600
- Line-height: 1.4
- Letter-spacing: -0.005em
- Color: rgba(0,0,0,0.95)
- Margin-top: 32px
- Margin-bottom: 12px

**H4 (子节标题)**
- Font: Inter 18px weight 600
- Line-height: 1.4
- Color: rgba(0,0,0,0.95)
- Margin-top: 24px
- Margin-bottom: 8px

### Paragraphs
- Font: Inter 16px weight 400
- Line-height: 1.75
- Color: rgba(0,0,0,0.95)
- Margin-bottom: 1em
- Max-width: 720px
- Text-align: left（不两端对齐）

### Links
- Color: `#0075de`
- Text-decoration: none
- Hover: underline
- Transition: color 0.2s ease
- 暗色模式：color `#62aef0`

### Lists

**Unordered List**
- Bullet: 6px solid circle, color `#615d59`
- Indent: 24px
- Item spacing: 0.5em
- Nested indent:  additional 24px

**Ordered List**
- Number: Inter 16px weight 400, color rgba(0,0,0,0.95)
- Indent: 24px
- Item spacing: 0.5em

**Task List (Todo)**
- Checkbox: 16px square, 2px border `#615d59`, border-radius 4px
- Checked: background `#0075de`, border `#0075de`,白色 checkmark
- Item spacing: 0.5em

### Code

**Inline Code**
- Font: JetBrains Mono 14px weight 400
- Background: `#f6f5f4`
- Color: `#e83e8c`（柔和的红粉色，类似 Notion）
- Padding: 2px 6px
- Border-radius: 4px
- Border: `1px solid rgba(0,0,0,0.06)`

**Code Block**
- Font: JetBrains Mono 14px weight 400
- Line-height: 1.6
- Background: `#1e1e1e`（深色背景，与暗色模式一致）
- Color: `#e6e6e6`
- Padding: 20px 24px
- Border-radius: 12px
- Overflow-x: auto
- 复制按钮：右上角，24px 圆形，hover 背景 `rgba(255,255,255,0.1)`
- 语言标签：左上角，12px caption，颜色 `rgba(255,255,255,0.5)`
- 语法高亮：使用类似 One Dark / GitHub Dark 的主题

### Blockquotes
- Left border: 4px solid `#0075de`
- Padding-left: 20px
- Color: `#615d59`
- Font-style: normal（不用斜体）
- Background: transparent（或极淡的 `#f6f5f4`）
- Margin: 1.5em 0

### Tables
- Border: `1px solid rgba(0,0,0,0.1)`
- Header: background `#f6f5f4`, font-weight 600
- Cell padding: 12px 16px
- Striped rows: alternate `#ffffff` / `#f6f5f4`
- Text-align: left
- 表头底部边框：`1px solid rgba(0,0,0,0.15)`
- 暗色模式：header bg `#2d2d2d`, striped `#1e1e1e` / `#2d2d2d`

### Horizontal Rule
- Border: none
- Border-top: `1px solid rgba(0,0,0,0.1)`
- Margin: 32px 0
- 暗色模式：`rgba(255,255,255,0.1)`

### Images
- Max-width: 100%
- Border-radius: 8px
- Margin: 24px 0
- Caption: 14px caption, color `#615d59`, centered
- 可选：轻微阴影 `rgba(0,0,0,0.04) 0px 4px 18px`

### Callouts (Notion-style)
- Background: `#f6f5f4`
- Border-left: 4px solid `#0075de`
- Padding: 16px 20px
- Border-radius: 0 8px 8px 0
- Icon: 20px，左侧，颜色与边框一致
- 文字：16px body
- 变体：
  - Info: 蓝色 `#0075de`
  - Warning: 橙色 `#dd5b00`
  - Success: 绿色 `#1aae39`
  - Error: 红色 `#e74c3c`
  - Tip: 紫色 `#9b59b6`

### Table of Contents (悬浮目录)
- Position: fixed right
- Width: 240px
- Font: 14px Inter
- Color: `#615d59`
- Current heading: color `#0075de`, font-weight 500
- Hover: color `rgba(0,0,0,0.95)`
- 层级缩进：H2 0px, H3 16px, H4 32px
- 暗色模式：background `#2d2d2d`, text `rgba(255,255,255,0.6)`

### Footnotes
- Font: 14px caption
- Color: `#615d59`
- Border-top: `1px solid rgba(0,0,0,0.1)`
- Margin-top: 48px
- Padding-top: 16px

### Math / KaTeX
- Font: KaTeX_Main, serif
- 行内公式：与正文同高
- 块级公式：居中，上下 margin 24px

---

## 11. Dark Mode Specifics

### Color Mapping
| Light Mode | Dark Mode |
|------------|-----------|
| `#ffffff` bg | `#1e1e1e` bg |
| `#f6f5f4` surface | `#2d2d2d` surface |
| `rgba(0,0,0,0.95)` text | `rgba(255,255,255,0.95)` text |
| `#615d59` secondary | `rgba(255,255,255,0.6)` secondary |
| `#a39e98` muted | `rgba(255,255,255,0.4)` muted |
| `#0075de` link | `#62aef0` link |
| `rgba(0,0,0,0.1)` border | `rgba(255,255,255,0.1)` border |
| `#f6f5f4` code inline bg | `#2d2d2d` code inline bg |
| `#1e1e1e` code block bg | `#0d0d0d` code block bg |

### Transition
- 切换时所有颜色属性 transition 0.3s ease
- 尊重系统偏好 `prefers-color-scheme`
- 手动切换按钮：太阳/月亮图标，顶部导航右侧

---

## 12. Do's and Don'ts

### Do
- 使用暖中性色，不用冷灰
- 正文行高 1.75，段落间距 1em
- 内容区限制 720px，居中
- 代码块用深色背景，与正文形成对比
- 侧边导航可折叠，不占固定空间
- 暗色模式背景用 `#1e1e1e`，不用纯黑
- 所有交互元素有 hover 和 focus 状态
- 使用系统字体栈作为 Inter 的 fallback

### Don't
- 不要用纯黑 `#000000` 作为文字色
- 不要用蓝灰色（如 `#f0f2f5`）代替暖白色
- 不要让正文全宽（超过 720px 阅读困难）
- 不要用单层重阴影（要用多层叠加）
- 不要在移动端保留固定侧边导航
- 不要用斜体做引用块（Notion 不用斜体引用）
- 不要让代码块和正文用同样背景色
- 不要用默认浏览器滚动条（要自定义细滚动条）
