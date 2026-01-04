import { useEffect } from 'react';

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
        <div
            id="google_translate_element"
            className="fixed bottom-5 right-5 z-[200] drop-shadow-xl" // Increased z-index to be safe
        />
    );
};
