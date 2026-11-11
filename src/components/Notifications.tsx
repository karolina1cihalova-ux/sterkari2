import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

/**
 * The site's single Sonner <Toaster />, mounted once in Layout.astro.
 *
 * Astro components show a message without importing React by dispatching an event:
 *   window.dispatchEvent(new CustomEvent('toast', { detail: 'Text' }))
 *   window.dispatchEvent(new CustomEvent('toast', { detail: { message, description, type: 'success' } }))
 */
type Detail =
  | string
  | { message: string; description?: string; type?: 'success' | 'error' | 'info' | 'warning' };

export default function Notifications() {
  useEffect(() => {
    const onToast = (e: Event) => {
      const d = (e as CustomEvent<Detail>).detail;
      if (typeof d === 'string') return void toast(d);
      const show = d.type ? toast[d.type] : toast;
      show(d.message, { description: d.description });
    };
    window.addEventListener('toast', onToast);
    return () => window.removeEventListener('toast', onToast);
  }, []);

  return (
    <Toaster
      position="bottom-center"
      duration={3500}
      mobileOffset={16}
      toastOptions={{
        style: {
          background: 'var(--color-ink)',
          color: '#fff',
          border: '0',
          borderRadius: '10px',
          fontFamily: 'var(--font-sans)',
          fontSize: '14.5px',
          boxShadow: '0 10px 30px -10px rgb(0 0 0 / 0.4)',
        },
        classNames: {
          title: 'font-semibold!',
          description: 'text-white/70!',
          icon: 'text-[#e8a37f]!',
        },
      }}
    />
  );
}
