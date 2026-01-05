import { useEffect, useState } from 'react';
import { Globe, Check, X } from 'lucide-react';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'zh-CN', label: '中文 (Simplified)', flag: '🇨🇳' },
    { code: 'ta', label: 'Tamil', flag: '🇮🇳' },
];

export const GoogleTranslate = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        // 1. Initial setup check
        const initGoogleTranslate = () => {
            if (window.google && window.google.translate && window.google.translate.TranslateElement) {
                if (!document.getElementById('google_translate_element')) return;

                try {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: 'en',
                            autoDisplay: false,
                            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                        },
                        'google_translate_element'
                    );
                } catch (e) {
                    console.error("Google Translate init error:", e);
                }
            }
        }

        window.googleTranslateElementInit = initGoogleTranslate;

        // 2. Check if script is already present
        const existingScript = document.getElementById('google-translate-script');
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        } else {
            // If script is already loaded, manually trigger init
            initGoogleTranslate();
        }

        // 3. Try to sync initial language from cookie if exists
        const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
        if (match && match[1]) {
            setCurrentLang(match[1]);
        }
    }, []);

    const changeLanguage = (langCode: string) => {
        // 1. Set the cookie explicitly (Google Translate source of truth)
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=/auto/${langCode}; path=/; domain=${window.location.hostname}`;

        setCurrentLang(langCode);
        setIsOpen(false);

        // 2. Force reload to apply changes reliably
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return (
        <div className="fixed bottom-5 right-5 z-[1000] flex flex-col items-end gap-2">

            {/* 
                HIDDEN GOOGLE TRANSLATE ELEMENT
                Must be created outside the button and consistently present in DOM.
                We hide it visually but keep it compatible with Google's script.
             */}
            <div
                id="google_translate_element"
                className="absolute opacity-0 pointer-events-none w-px h-px overflow-hidden"
                style={{ top: 0, left: 0 }}
            />

            {/* Custom Language Dropdown */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 min-w-[160px] animate-slide-up mb-2">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentLang === lang.code
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-lg">{lang.flag}</span>
                                {lang.label}
                            </span>
                            {currentLang === lang.code && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center border transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen
                    ? 'bg-primary-600 border-primary-600 text-white rotate-12'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-200'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Globe className="w-6 h-6" />
                )}
            </button>
        </div>
    );
};
