# AGENTS.md

## 项目概述
构建一个**个人知识库文档站**，用于阅读已写好的 Markdown 文档。
文档目录结构已存在，按模块/主题组织（如 00-学习路线, 01-Python测试编程 等）。
**这不是一个营销网站，是一个阅读工具**。

## 技术栈
- 框架：Next.js 14 (App Router) + React + TypeScript
- 样式：Tailwind CSS
- 内容：MDX / Markdown 渲染（使用 next-mdx-remote 或 @next/mdx）
- 字体：Inter（Google Fonts）—— 作为 NotionInter 的替代
- 图标：Lucide React

## 关键约束
1. **阅读体验优先**：这是供我自己阅读的知识库，不是给别人看的文档站
3. **严格遵循 DESIGN.md**：所有颜色、字体、间距、阴影、圆角必须按 DESIGN.md 执行
4. **内容结构**：从本地 Markdown 文件读取，按文件夹层级自动生成导航
5. **搜索功能**：必须支持全文搜索，快速定位知识

## 构建顺序
1. 先读取 DESIGN.md 建立设计系统（CSS variables + Tailwind config）
2. 搭建基础布局：顶部简洁导航 + 中央内容区 + 可选的悬浮目录
3. 实现 Markdown 渲染：标题、段落、代码块、表格、引用、列表
4. 实现文件系统导航：侧边栏或顶部下拉，按文件夹层级组织
5. 实现搜索：基于内容的快速搜索
6. 添加暗色模式、响应式适配
7. 优化阅读细节：行宽限制（max-width 720px 左右）、字体渲染、代码高亮