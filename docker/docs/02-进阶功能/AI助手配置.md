# AI 助手配置

## 简介

AI 助手可以帮你：
- 解释文档中的内容
- 回答关于文档的问题
- 提供学习建议

## 配置方法

### 1. 获取 API Key

目前支持 [DeepSeek](https://platform.deepseek.com/) API：

1. 注册 DeepSeek 账号
2. 在控制台创建 API Key
3. 复制 API Key

### 2. 修改配置

编辑项目根目录的 `.env` 文件：

```bash
# 启用 AI 功能
AI_API_KEY=sk-your-api-key-here
AI_MODEL=deepseek-chat
AI_NAME=Mock
```

### 3. 重启服务

```bash
docker-compose down
docker-compose up -d
```

## 使用方法

### 桌面端

1. 点击右下角的 AI 按钮
2. 在弹出的聊天窗口输入问题
3. AI 会基于当前文档内容回答

### 移动端

1. 点击底部导航栏的 AI 按钮
2. 进入全屏聊天界面
3. 输入问题即可

### 划词提问

1. 在文档中选中一段文字
2. 点击弹出的「AI 解释」按钮
3. AI 会解释选中的内容

## 费用说明

- DeepSeek API 按使用量计费
- 价格便宜，日常使用费用很低
- 不配置 API Key 则 AI 功能隐藏，不影响其他功能
