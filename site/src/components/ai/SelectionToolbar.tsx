'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { config } from '@/site.config';

interface SelectionToolbarProps {
  onAskAI: (selectedText: string) => void;
}

export function SelectionToolbar({ onAskAI }: SelectionToolbarProps) {
  const [selection, setSelection] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = useCallback(() => {
    // 延迟检测，确保选择完成
    setTimeout(() => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();

      if (!text || text.length < 2) {
        setIsVisible(false);
        return;
      }

      // Boundary check: only allow selections inside <article>
      const anchorNode = sel?.anchorNode;
      const targetEl = anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement;
      if (!targetEl?.closest('article')) {
        setIsVisible(false);
        return;
      }

      const range = sel!.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelection({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
      setIsVisible(true);
    }, 50);
  }, []);

  const handleAskAI = useCallback(() => {
    if (selection) {
      onAskAI(selection.text);
      setIsVisible(false);
      setSelection(null);
      // 清除选择
      window.getSelection()?.removeAllRanges();
    }
  }, [selection, onAskAI]);

  // 点击其他地方时隐藏按钮
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  if (!isVisible || !selection || selection.text.length < 2) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[100] transform -translate-x-1/2 -translate-y-full"
      style={{ left: selection.x, top: selection.y }}
    >
      <button
        onClick={handleAskAI}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors text-sm font-medium"
      >
        <img
          src="/framer.svg"
          alt="Mock"
          width={14}
          height={14}
          style={{ filter: 'brightness(0) invert(1)', flexShrink: 0 }}
        />
        <span>{config.aiToolbarLabel}</span>
      </button>
    </div>
  );
}
