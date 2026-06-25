import OpenAI from 'openai';

// 在运行时初始化，避免构建时错误
let openai: OpenAI | null = null;

function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }
  return openai;
}

export async function POST(req: Request) {
  try {
    const { messages, docSlug, docTitle, docContent } = await req.json();

    // 系统提示词
    const systemPrompt = `你是一个知识库文档助手，帮助用户理解文档内容。

## 当前文档信息
- 标题：${docTitle}
- 路径：${docSlug}

## 文档内容
${docContent}

## 回答规则（重要）
1. **简洁回答**：简单问题简单回答，不要写小作文
2. **直接了当**：先给结论，再给解释（如果需要）
3. **代码优先**：如果用户问代码问题，直接给代码示例
4. **中文回答**：使用中文
5. **适当格式**：使用 Markdown，但不要过度格式化

## 回答长度指南
- 简单问题（是什么、怎么用）：2-3句话
- 中等问题（为什么、区别）：1-2段
- 复杂问题（调试、设计）：详细但有条理`;

    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'deepseek-v4-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      stream: true,
    });

    // 创建一个 ReadableStream 来处理流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              // 使用 SSE 格式发送数据
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          // 发送结束标记
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
