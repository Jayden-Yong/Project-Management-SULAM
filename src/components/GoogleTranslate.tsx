import { useEffect, useState } from 'react';
import { Globe, Check } from 'lucide-react';

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
        // 1. Define the callback expected by the Google script
        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        autoDisplay: false,
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                    },
                    'google_translate_element'
                );
            }
        };

        // 2. Check if script is already present
        const existingScript = document.getElementById('google-translate-script');
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        } else {
            if (window.google && window.google.translate) {
                window.googleTranslateElementInit();
            }
        }

        // 3. Try to sync initial language from cookie if exists
        const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
        if (match && match[1]) {
            setCurrentLang(match[1]);
        }
    }, []);

    const changeLanguage = (langCode: string) => {
        const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;

        if (combo) {
            combo.value = langCode;
            combo.dispatchEvent(new Event('change'));
            setCurrentLang(langCode);
            setIsOpen(false);
        } else {
            console.warn('Google Translate widget not ready yet. Retrying...');
            // Simple retry mechanism
            setTimeout(() => {
                const retryCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                if (retryCombo) {
                    retryCombo.value = langCode;
                    retryCombo.dispatchEvent(new Event('change'));
                    setCurrentLang(langCode);
                    setIsOpen(false);
                } else {
                    console.error('Failed to find Google Translate dropdown after retry.');
                }
            }, 500);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-[1000] flex flex-col items-end gap-2">

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
                <Globe className="w-6 h-6" />
            </button>

            {/* Hidden Target for Google Script */}
            <div id="google_translate_element" style={{ display: 'none' }} />
        </div>
    );
};
