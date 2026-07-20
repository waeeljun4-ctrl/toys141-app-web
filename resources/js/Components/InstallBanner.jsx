import { useState, useEffect } from 'react';
import { useLocale } from './LocaleContext';

export default function InstallBanner() {
    const { t, dict } = useLocale();
    const [prompt,    setPrompt]    = useState(null);
    const [show,      setShow]      = useState(false);
    const [isIOS,     setIsIOS]     = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('pwa-dismissed')) { setDismissed(true); return; }
        if (window.matchMedia('(display-mode: standalone)').matches) { setInstalled(true); return; }

        const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) && !window.navigator.standalone;
        setIsIOS(ios);
        if (ios) { setShow(true); return; }

        const handler = (e) => { e.preventDefault(); setPrompt(e); setShow(true); };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    function dismiss() {
        localStorage.setItem('pwa-dismissed', '1');
        setShow(false);
        setDismissed(true);
    }

    async function install() {
        if (!prompt) return;
        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') setInstalled(true);
        setShow(false);
    }

    if (!show || dismissed || installed) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4" style={{ direction: dict.dir }}>
            <div className="bg-ink text-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-2xl max-w-lg mx-auto">
                <img src="/icon-192.png" alt="TOYS 141" className="w-11 h-11 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm leading-tight">{t('installTitle')}</p>
                    {isIOS
                        ? <p className="text-xs text-white/50 mt-0.5">
                            {t('installIOSPrefix')}{' '}
                            <span className="text-accent font-bold">{t('installShareLabel')}</span>
                            {' '}{t('installIOSMiddle')}{' '}
                            <span className="text-accent font-bold">"{t('installAddLabel')}"</span>
                          </p>
                        : <p className="text-xs text-white/50 mt-0.5">{t('installSubAndroid')}</p>
                    }
                </div>
                <div className="flex gap-2 shrink-0">
                    {!isIOS && (
                        <button onClick={install}
                            className="bg-accent text-white text-xs font-black px-3 py-2 rounded-xl hover:bg-accent/90 transition-colors">
                            {t('installBtn')}
                        </button>
                    )}
                    <button onClick={dismiss} className="text-white/40 hover:text-white/70 text-lg px-1 transition-colors">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}
