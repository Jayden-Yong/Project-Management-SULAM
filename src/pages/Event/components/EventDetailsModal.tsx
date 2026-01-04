import { Copy, Check, ExternalLink } from 'lucide-react';
import React, { useState } from 'react';
import { Event } from '../../../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
}

/**
 * Modal for Viewing Event Details.
 * Read-only view for volunteers to see full event info.
 */
export const EventDetailsModal: React.FC<Props> = ({ isOpen, onClose, event }) => {
    const [isCopied, setIsCopied] = useState(false);

    if (!isOpen || !event) return null;

    const handleCopy = () => {
        if (event.whatsappLink) {
            navigator.clipboard.writeText(event.whatsappLink);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full h-[85vh] sm:h-auto sm:max-h-[85vh] sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col relative z-10 animate-slide-up sm:animate-fade-in-up">

                {/* Header Image */}
                <div className="relative h-48 sm:h-56 bg-slate-100">
                    {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <span className="text-4xl">📷</span>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur rounded-full text-white transition-colors"
                    >
                        ✕
                    </button>
                    <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-slate-800 uppercase tracking-wider shadow-sm">
                            {event.category}
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2">{event.title}</h2>

                    <div className="flex flex-col gap-2 text-sm text-slate-600 mb-6">
                        <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span className="font-medium">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span className="font-medium">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>👤</span>
                            <span className="font-medium">Organized by {event.organizerName}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">About Activity</h3>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{event.description}</p>
                        </div>

                        {event.tasks && (
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                <h3 className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-2">Volunteer Duties</h3>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{event.tasks}</p>
                            </div>
                        )}

                        {/* Post-Approval Details (Only visible if backend returns them) */}
                        {(event.whatsappLink || event.welcomeMessage) && (
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 animate-slide-up">
                                <h3 className="text-xs font-bold text-green-800 uppercase tracking-wide mb-3">✅ Confirmed Volunteer Info</h3>

                                {event.welcomeMessage && (
                                    <div className="mb-4">
                                        <p className="text-sm text-green-900 whitespace-pre-wrap font-medium">{event.welcomeMessage}</p>
                                    </div>
                                )}

                                {event.whatsappLink && (
                                    <div className="mt-4">
                                        <label className="text-xs font-bold text-green-800 uppercase tracking-wide block mb-1">
                                            Group Chat Link
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={event.whatsappLink}
                                                    className="w-full pl-3 pr-10 py-2 bg-white border border-green-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                                />
                                            </div>

                                            <button
                                                onClick={handleCopy}
                                                className="p-2 bg-white border border-green-200 rounded-lg text-green-700 hover:bg-green-100 hover:border-green-300 transition-all shadow-sm"
                                                title="Copy Link"
                                            >
                                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </button>

                                            <a
                                                href={event.whatsappLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-green-600 border border-transparent rounded-lg text-white hover:bg-green-700 transition-all shadow-sm"
                                                title="Open Link"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                        <p className="text-[10px] text-green-700 mt-1 opacity-80">
                                            Check the link before joining. Organizers may occasionally leave this blank.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 border-t border-slate-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
