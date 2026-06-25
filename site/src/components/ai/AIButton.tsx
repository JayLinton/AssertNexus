'use client';

import { useState } from 'react';
import { config } from '@/site.config';

interface AIButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function AIButton({ isOpen, onClick }: AIButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative z-[90] flex items-center justify-center w-10 h-10 rounded-full"
      style={{
        backgroundColor: isOpen ? '#18181b' : '#ffffff',
        border: isOpen ? 'none' : '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, border 0.3s ease',
        flexShrink: 0,
      }}
      title={isOpen ? `关闭 ${config.aiName}` : `打开 ${config.aiName}`}
    >
      {/* Close icon (X) — visible when open */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
          transform: isOpen ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>

      {/* Logo icon — visible when closed */}
      <img
        src={config.aiFavicon}
        alt="Mock"
        width={22}
        height={22}
        style={{
          position: 'absolute',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
          transform: isOpen
            ? 'rotate(90deg) scale(0.5)'
            : `rotate(0deg) scale(${hovered ? 1.1 : 1})`,
          opacity: isOpen ? 0 : 1,
          filter: 'brightness(0)',
        }}
      />
    </button>
  );
}
