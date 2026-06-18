'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * フォーム送信中のオーバーレイ＋誤離脱防止。
 * - show=true の間、全画面オーバーレイ（スピナー＋「閉じないで」案内）を body にポータル表示。
 * - 送信中はブラウザの閉じる/リロード/戻るを beforeunload で警告（送信中断・取りこぼし防止）。
 * - スタイルは自己完結（インライン＋スピナーkeyframeのみ <style>）。globals.css 非依存。
 */
export default function FormSubmitOverlay({ show }: { show: boolean }) {
  useEffect(() => {
    if (!show) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [show]);

  if (!show || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        style={{
          background: '#fff', borderRadius: 18, padding: '30px 26px',
          maxWidth: 340, width: '100%', textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,.3)',
        }}
      >
        <div
          className="form-submit-overlay-spinner"
          aria-hidden="true"
          style={{
            width: 48, height: 48, margin: '0 auto 18px', borderRadius: '50%',
            border: '5px solid #E2E8F2', borderTopColor: '#3366FF',
          }}
        />
        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1E3A8A', marginBottom: 10 }}>
          送信中です
        </div>
        <div style={{ fontSize: '.86rem', color: '#475569', lineHeight: 1.8 }}>
          完了まで数秒かかる場合があります。このままお待ちください。<br />
          <strong style={{ color: '#B23E00' }}>ページを閉じたり、更新したりしないでください。</strong>
        </div>
      </div>
      <style>{`
        @keyframes form-submit-overlay-spin { to { transform: rotate(360deg); } }
        .form-submit-overlay-spinner { animation: form-submit-overlay-spin .9s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .form-submit-overlay-spinner { animation: none; } }
      `}</style>
    </div>,
    document.body,
  );
}
