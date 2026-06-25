'use client';

import { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSearchParams, useRouter } from 'next/navigation';
import { config } from '@/site.config';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

let _msgIdCounter = 0;
function nextMsgId() {
  return String(++_msgIdCounter);
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docSlug = searchParams.get('doc') || '';
  const docTitle = searchParams.get('title') || '';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const docContentCacheRef = useRef<string>('');

  // Fetch doc content on demand
  const fetchDocContent = useCallback(async (): Promise<string> => {
    if (!docSlug) return '';
    if (docContentCacheRef.current) return docContentCacheRef.current;
    try {
      const res = await fetch(`/api/doc-content?slug=${encodeURIComponent(docSlug)}`);
      if (res.ok) {
        const data = await res.json();
        docContentCacheRef.current = data.content || '';
        return docContentCacheRef.current;
      }
    } catch { /* ignore */ }
    return '';
  }, [docSlug]);

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: nextMsgId(),
      role: 'user',
      content,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const aiMessageId = nextMsgId();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
    };
    setMessages(prev => [...prev, aiMessage]);

    try {
      abortControllerRef.current = new AbortController();

      const docContent = await fetchDocContent();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content }],
          docSlug,
          docTitle,
          docContent,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('请求失败');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const dataLines = part.split('\n').filter(l => l.startsWith('data: '));
          const dataStr = dataLines.map(l => l.slice(6)).join('');
          if (!dataStr || dataStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.content) {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, content: msg.content + parsed.content }
                    : msg
                )
              );
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('发送消息失败:', error);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId
              ? { ...msg, content: '抱歉，发生了错误，请稍后重试。' }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, docSlug, docTitle, fetchDocContent]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 组件卸载时取消请求
  useEffect(() => {
    return () => { abortControllerRef.current?.abort(); };
  }, []);

  // 聚焦输入框
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const isLoadingPlaceholder = (msg: Message) =>
    msg.role === 'assistant' && msg.content === '' && isLoading;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        background: 'var(--color-surface)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderBottom: '1px solid var(--color-border-subtle)',
          background: 'var(--color-surface)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text)',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>
            {config.aiName}
          </div>
          {docTitle && (
            <div style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              关于：{docTitle}
            </div>
          )}
        </div>
      </header>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        {/* Empty state */}
        {messages.length === 0 && (
          <div style={{ paddingTop: '60px', textAlign: 'center' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'var(--color-warm-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <img src={config.aiFavicon} alt={config.aiName} width={28} height={28} style={{ filter: 'brightness(0.3)' }} />
            </div>
            <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px' }}>
              你好！我是 {config.aiName}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              {docTitle
                ? `我可以帮你解答关于「${docTitle}」的问题`
                : '有什么我可以帮你的？'}
            </p>
          </div>
        )}

        {/* Message list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((message) => {
            const isUser = message.role === 'user';
            const isLoadingDots = isLoadingPlaceholder(message);

            return (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    borderRadius: '12px',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    ...(isUser
                      ? {
                          padding: '10px 14px',
                          background: 'var(--color-text)',
                          color: '#ffffff',
                        }
                      : {
                          padding: '10px 14px',
                          background: 'var(--color-warm-white)',
                          color: 'var(--color-text)',
                        }),
                  }}
                >
                  {isLoadingDots ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '20px' }}>
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          style={{
                            display: 'inline-block',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'var(--color-text-muted)',
                            animation: `bounce 1.4s ${i * 0.16}s ease-in-out infinite`,
                          }}
                        />
                      ))}
                    </div>
                  ) : message.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p style={{ margin: 0, lineHeight: 1.7 }}>{children}</p>,
                        strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
                        em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                        code: ({ children, className }) => {
                          const isInline = !className;
                          if (isInline) {
                            return (
                              <code style={{
                                background: 'var(--color-code-inline-bg)',
                                color: 'var(--color-code-inline-text)',
                                padding: '2px 4px',
                                borderRadius: '3px',
                                fontSize: '0.9em',
                                fontFamily: 'var(--font-mono)',
                              }}>
                                {children}
                              </code>
                            );
                          }
                          return (
                            <code style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => (
                          <pre style={{
                            background: 'var(--color-code-block-bg)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            padding: '12px',
                            overflowX: 'auto',
                            margin: '8px 0',
                            fontSize: '13px',
                            lineHeight: 1.6,
                          }}>
                            {children}
                          </pre>
                        ),
                        ul: ({ children }) => <ul style={{ paddingLeft: '20px', marginBottom: '8px', listStyle: 'disc' }}>{children}</ul>,
                        ol: ({ children }) => <ol style={{ paddingLeft: '20px', marginBottom: '8px', listStyle: 'decimal' }}>{children}</ol>,
                        li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                        h1: ({ children }) => <h1 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{children}</h1>,
                        h2: ({ children }) => <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{children}</h2>,
                        h3: ({ children }) => <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>{children}</h3>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p style={{ whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.7 }}>{message.content}</p>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input ── */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--color-border-subtle)',
          background: 'var(--color-surface)',
          flexShrink: 0,
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-warm-white)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '0 12px',
          }}
        >
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              const el = e.target;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 120) + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputValue);
              }
            }}
            placeholder="输入你的问题..."
            rows={1}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 0',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '15px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-text)',
              resize: 'none',
              maxHeight: '120px',
              overflowY: 'auto',
              lineHeight: '1.5',
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '8px',
              border: 'none',
              background: inputValue.trim() ? 'var(--color-text)' : 'transparent',
              color: inputValue.trim() ? '#ffffff' : 'var(--color-text-disabled)',
              cursor: inputValue.trim() ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        background: 'var(--color-surface)',
      }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>加载中...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
