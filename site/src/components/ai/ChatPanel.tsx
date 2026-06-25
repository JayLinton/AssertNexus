'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowUp, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { config } from '@/site.config';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  docSlug: string;
  docTitle: string;
  initialMessage?: string;
}

let _msgIdCounter = 0;
function nextMsgId() {
  return String(++_msgIdCounter);
}

export function ChatPanel({
  isOpen,
  onClose,
  docSlug,
  docTitle,
  initialMessage,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSentInitial, setHasSentInitial] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const docContentCacheRef = useRef<string>('');

  // Fetch doc content on demand (cached after first call)
  const fetchDocContent = useCallback(async (): Promise<string> => {
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
    // Reset textarea height
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
          // Collect all data: lines within one SSE event
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

  // 发送初始消息（划词提问）
  useEffect(() => {
    if (initialMessage && !hasSentInitial && isOpen) {
      sendMessage(`请解释以下内容：\n\n\`\`\`\n${initialMessage}\n\`\`\``);
      setHasSentInitial(true);
    }
  }, [initialMessage, hasSentInitial, isOpen, sendMessage]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 重置状态
  useEffect(() => {
    if (!isOpen) setHasSentInitial(false);
  }, [isOpen]);

  // 打开时聚焦输入框
  useEffect(() => {
    if (isOpen && !initialMessage) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialMessage]);

  // 组件卸载时取消请求
  useEffect(() => {
    return () => { abortControllerRef.current?.abort(); };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Check if a message is the current loading placeholder
  const isLoadingPlaceholder = (msg: Message) =>
    msg.role === 'assistant' && msg.content === '' && isLoading;

  return (
    <div
      className="chat-panel"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
        width: '420px',
        height: '600px',
        borderRadius: '12px',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#18181b', fontFamily: 'var(--font-sans)' }}>
            {config.aiName}
          </span>
          <span style={{ fontSize: '12px', color: '#a1a1aa', marginTop: 1, fontFamily: 'var(--font-sans)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {config.aiSubtitle}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-sidebar-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Empty state */}
        {messages.length === 0 && (
          <div style={{ paddingTop: '80px', textAlign: 'left' }}>
            <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.6, marginBottom: '12px' }}>
              你好！我是 {config.aiName}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              选中文档中的内容，点击 &quot;AI 解释&quot; 即可提问
            </p>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.8, marginTop: '4px' }}>
              也可以直接在下方输入问题
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
                    borderRadius: '10px',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    ...(isUser
                      ? {
                          padding: '8px 12px',
                          background: '#333333',
                          color: '#ffffff',
                        }
                      : {
                          padding: '8px 12px',
                          background: 'var(--color-warm-white)',
                          color: 'var(--color-text)',
                        }),
                  }}
                >
                  {isLoadingDots ? (
                    /* Bouncing dots loading indicator */
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p style={{ margin: 0, lineHeight: 1.7 }}>{children}</p>,
                          strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
                          em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                          code: ({ children, className }) => {
                            const isInline = !className;
                            if (isInline) {
                              return (
                                <code
                                  style={{
                                    background: 'var(--color-code-inline-bg)',
                                    color: 'var(--color-code-inline-text)',
                                    padding: '2px 4px',
                                    borderRadius: '3px',
                                    fontSize: '0.85em',
                                    fontFamily: 'var(--font-mono)',
                                  }}
                                >
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
                            <pre
                              style={{
                                background: 'var(--color-code-block-bg)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '6px',
                                padding: '12px 16px',
                                overflowX: 'auto',
                                margin: '8px 0',
                                fontSize: '13px',
                                lineHeight: 1.6,
                              }}
                            >
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
                    </div>
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
          padding: '16px 20px',
          borderTop: '1px solid var(--color-border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-warm-white)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '0 12px',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border-strong)';
          }}
          onBlur={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
          }}
        >
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              // Auto-expand height
              const el = e.target;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 128) + 'px';
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
              padding: '10px 0',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-text)',
              resize: 'none',
              maxHeight: '128px',
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
              width: 28,
              height: 28,
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              color: inputValue.trim() ? 'var(--color-text)' : 'var(--color-text-disabled)',
              cursor: inputValue.trim() ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            <ArrowUp size={18} strokeWidth={inputValue.trim() ? 2.5 : 2} />
          </button>
        </div>
      </form>
    </div>
  );
}
