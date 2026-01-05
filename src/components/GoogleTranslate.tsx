import { useEffect } from 'react';
import { Globe } from 'lucide-react';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export const GoogleTranslate = () => {
    useEffect(() => {
        // 1. Define the callback expected by the Google script
        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
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
            // If script exists, manually trigger init if needed (edge case for re-renders)
            if (window.google && window.google.translate) {
                window.googleTranslateElementInit();
            }
        }
    }, []);

    return (
        <div className="fixed bottom-5 right-5 z-50 flex items-center justify-center">
            {/* Custom Visual Button (Earth Icon) */}
            <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border border-slate-200 cursor-pointer hover:bg-slate-50 hover:text-teal-600 transition-all hover:scale-105 active:scale-95 group">
                <Globe className="w-6 h-6 text-slate-600 group-hover:text-teal-600 transition-colors" />
            </div>

            {/* Invisible Google Translate Overlay that intercepts clicks */}
            <div id="google_translate_element" />
        </div>
    );
};
