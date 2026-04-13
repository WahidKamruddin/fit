'use client'

import { createPortal } from 'react-dom';

interface Props {
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ title, body, confirmLabel = 'Delete', onConfirm, onCancel }: Props) {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onMouseDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
    >
      <div className="w-full max-w-sm bg-off-white-100 rounded-3xl p-8 shadow-2xl">

        <p className="text-[9px] tracking-[0.5em] uppercase text-mocha-400 mb-2">Confirm</p>
        <h2 className="font-cormorant text-3xl font-light text-mocha-500 leading-tight mb-3">
          {title}
        </h2>
        <p className="text-sm font-light text-mocha-400 leading-relaxed mb-8">
          {body}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full border border-mocha-300 text-mocha-400 text-[10px] tracking-[0.3em] uppercase hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.3em] uppercase hover:bg-mocha-400 transition-all duration-200"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
