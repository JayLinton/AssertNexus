# Assert Nexus 自托管版

一个简洁美观的个人知识库文档站，支持 Docker 一键部署。

## 特性

- 📝 Markdown 文档支持
- 🔍 全文搜索（支持拼音）
- 🤖 AI 助手（可选，需配置 DeepSeek API）
- 📱 移动端适配
- 🎨 简洁美观的界面
- 🚀 Docker 一键部署

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/knowledge-base.git
cd knowledge-base
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```bash
# 站点名称
SITE_NAME=My Knowledge Base

# 站点描述
SITE_DESCRIPTION=我的个人知识库

# AI 功能（可选，不填则隐藏 AI 功能）
AI_API_KEY=sk-your-api-key-here
AI_MODEL=deepseek-chat
AI_NAME=Mock

# 端口
PORT=3000
```

### 3. 添加文档

将你的 Markdown 文档放入 `docker/docs/` 目录：

```
docker/docs/
├── 00-快速开始/
│   └── 欢迎使用.md
├── 01-我的文档/
│   ├── 文档1.md
│   └── 文档2.md
└── 02-其他/
    └── 更多文档.md
```

### 4. 启动服务

```bash
cd docker
docker-compose up -d
```

### 5. 访问

打开浏览器访问 http://localhost:3000

## 文档管理

### 文件夹命名

- 格式：`XX-名称`（XX 为两位数字）
- 数字用于排序，越小越靠前
- 不带数字前缀的文件夹排在最后

### 文档命名

- 使用 `.md` 扩展名
- 文件名即为文档标题
- 支持中文文件名

### 实时更新

- 添加/修改文档后，刷新浏览器即可
- 无需重启容器
- 搜索索引自动更新（5 分钟缓存）

## AI 功能配置

### 获取 API Key

1. 访问 [DeepSeek 平台](https://platform.deepseek.com/)
2. 注册账号并创建 API Key
3. 将 API Key 填入 `.env` 文件

### 使用方法

- **桌面端**：点击右下角 AI 按钮
- **移动端**：点击底部导航栏 AI 按钮
- **划词提问**：选中文本后点击「AI 解释」

## 常用命令

```bash
# 启动
docker-compose up -d

# 停止
docker-compose down

# 查看日志
docker-compose logs -f

# 重启
docker-compose restart

# 重新构建（代码更新后）
docker-compose up -d --build
```

## 高级配置

### 自定义端口

修改 `.env` 文件：

```bash
PORT=8080
```

或启动时指定：

```bash
PORT=8080 docker-compose up -d
```

### 使用外部文档目录

如果想使用外部目录（如 NAS 上的文档），修改 `docker-compose.yml`：

```yaml
volumes:
  - /path/to/your/docs:/app/docs
```

### 配置 HTTPS

建议使用 Nginx 反向代理并配置 SSL 证书：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 目录结构

```
knowledge-base/
├── .env.example              # 环境变量示例
├── README-selfhost.md        # 自托管说明（本文件）
├── docker/
│   ├── Dockerfile            # Docker 构建文件
│   ├── docker-compose.yml    # Docker 编排文件
│   └── docs/                 # 示例文档
├── site/                     # Next.js 应用源码
└── knowledge-base/           # 开发用文档目录
```

## 更新

```bash
# 拉取最新代码
git pull

# 重新构建并启动
cd docker
docker-compose up -d --build
```

## 问题反馈

如遇到问题，请提交 Issue 到 GitHub 仓库。

## 许可证

MIT License
