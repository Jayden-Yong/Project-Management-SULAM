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
        let attempts = 0;
        const maxAttempts = 20; // Try for 2 seconds

        const tryChange = () => {
            const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;

            if (combo) {
                combo.value = langCode;
                // Dispatch multiple event types with bubbling to ensure capture
                combo.dispatchEvent(new Event('change', { bubbles: true }));
                combo.dispatchEvent(new Event('input', { bubbles: true }));
                combo.dispatchEvent(new Event('click', { bubbles: true }));

                setCurrentLang(langCode);
                setIsOpen(false);
                return;
            }

            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(tryChange, 100);
            } else {
                console.error('Google Translate: Dropdown not found after 2 seconds.');
            }
        };

        tryChange();
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
                <div id="google_translate_element" className="absolute opacity-0 pointer-events-none" />
                {isOpen ? (
                    <XIcon className="w-6 h-6" />
                ) : (
                    <Globe className="w-6 h-6" />
                )}
            </button>
        </div>
    );
};

// Simple X Icon component for internal use if needed, or import from lucide-react
const XIcon = ({ className }: { className: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
