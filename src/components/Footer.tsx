import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center text-center space-y-4">

                    <div className="text-sm font-medium text-slate-900 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                        In collaboration with <span className="font-bold text-primary-700">Persatuan Buddhist UM</span> 🤝
                    </div>

                    <div className="text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} University Malaya. All rights reserved.
                    </div>

                </div>
            </div>
        </footer>
    );
};
