'use client';

import { useEffect } from 'react';

const FONT_AWESOME_HREF =
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';

export default function DeferredFontAwesome() {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_AWESOME_HREF}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_AWESOME_HREF;
    link.crossOrigin = 'anonymous';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  }, []);

  return null;
}
