'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AIButton } from './AIButton';
import { ChatPanel } from './ChatPanel';
import { SelectionToolbar } from './SelectionToolbar';

interface AIAssistantProps {
  docSlug: string;
  docTitle: string;
}

export function AIAssistant({ docSlug, docTitle }: AIAssistantProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string>();
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动端
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // 划词提问
  const handleAskAI = useCallback((selectedText: string) => {
    if (isMobile) {
      // 移动端：跳转到聊天页面，携带划词内容
      const params = new URLSearchParams({
        doc: docSlug,
        title: docTitle,
        q: `请解释以下内容：\n\n\`\`\`\n${selectedText}\n\`\`\``,
      });
      router.push(`/chat?${params.toString()}`);
    } else {
      setInitialMessage(selectedText);
      setIsOpen(true);
    }
  }, [isMobile, docSlug, docTitle, router]);

  // 打开/关闭面板
  const togglePanel = useCallback(() => {
    if (isMobile) {
      // 移动端：跳转到聊天页面
      router.push(`/chat?doc=${encodeURIComponent(docSlug)}&title=${encodeURIComponent(docTitle)}`);
    } else {
      setIsOpen(prev => {
        if (prev) {
          setInitialMessage(undefined);
        }
        return !prev;
      });
    }
  }, [isMobile, docSlug, docTitle, router]);

  // 关闭面板
  const closePanel = useCallback(() => {
    setIsOpen(false);
    setInitialMessage(undefined);
  }, []);

  return (
    <>
      {/* 划词工具栏 */}
      <SelectionToolbar onAskAI={handleAskAI} />

      {/* 统一容器：FAB 按钮 + 聊天面板为兄弟节点 */}
      {/* 关闭时 pointer-events-none 让点击穿透，按钮单独恢复 pointer-events-auto */}
      <div
        className={`ai-container fixed bottom-8 z-[90] flex flex-col items-end gap-2 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ right: '308px' }}
      >
        {/* 聊天面板：绑定动画与状态 */}
        <div
          className={`
            transform origin-bottom-right transition-all duration-300 ease-out
            ${isOpen
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
            }
          `}
        >
          <ChatPanel
            isOpen={isOpen}
            onClose={closePanel}
            docSlug={docSlug}
            docTitle={docTitle}
            initialMessage={initialMessage}
          />
        </div>

        {/* 触发按钮：永远可见，永远可点击 */}
        <div className="pointer-events-auto">
          <AIButton isOpen={isOpen} onClick={togglePanel} />
        </div>
      </div>
    </>
  );
}
