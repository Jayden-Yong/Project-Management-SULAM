import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, LayoutDashboard, Calendar, type LucideIcon, User, List, CheckCircle, Search } from 'lucide-react';
import { UserRole } from '../types';

interface UserGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: UserRole;
}

interface GuideStep {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
}

const VOLUNTEER_STEPS: GuideStep[] = [
    {
        title: "Campus Feed",
        description: "Browse upcoming events tailored for you. Filter by category, location, or search for specific opportunities to contribute.",
        icon: Search,
        color: "bg-blue-100 text-blue-600"
    },
    {
        title: "My Impact Dashboard",
        description: "Track your journey! View your scheduled events, check application status (Pending/Confirmed), and see your past contributions.",
        icon: LayoutDashboard,
        color: "bg-teal-100 text-teal-600"
    },
    {
        title: "Completing Events",
        description: "Once an event is done, it will appear in your history. You may receive impact points for your verified participation.",
        icon: CheckCircle,
        color: "bg-green-100 text-green-600"
    },
    {
        title: "Profile & Settings",
        description: "Keep your profile up to date to help organizers trust you. You can edit your bio and contact info easily.",
        icon: User,
        color: "bg-purple-100 text-purple-600"
    }
];

const ORGANIZER_STEPS: GuideStep[] = [
    {
        title: "Organizer Dashboard",
        description: "Your command center. Manage ongoing events, review volunteer applications, and track overall participation stats.",
        icon: LayoutDashboard,
        color: "bg-blue-100 text-blue-600"
    },
    {
        title: "Creating Events",
        description: "Post new volunteering opportunities. Provide clear details, location, and schedules to attract the right volunteers.",
        icon: Calendar,
        color: "bg-teal-100 text-teal-600"
    },
    {
        title: "Managing Volunteers",
        description: "Review incoming applications. Approve or reject volunteers based on their profile and your event capacity.",
        icon: List,
        color: "bg-orange-100 text-orange-600"
    },
    {
        title: "Verification",
        description: "After an event, mark it as completed to award impact points to your dedicated volunteers.",
        icon: CheckCircle,
        color: "bg-green-100 text-green-600"
    }
];

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose, role }) => {
    const steps = role === UserRole.ORGANIZER ? ORGANIZER_STEPS : VOLUNTEER_STEPS;
    const [activeStep, setActiveStep] = useState(0);

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-fade-in" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl p-0 w-[90vw] max-w-2xl z-50 focus:outline-none overflow-hidden border border-slate-100 animate-scale-up">

                    {/* Header */}
                    <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                {role === UserRole.ORGANIZER ? "Organizer Guide" : "Volunteer Guide"}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">Everything you need to know to get started.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col md:flex-row h-[400px]">
                        {/* Sidebar / Navigation */}
                        <div className="w-full md:w-1/3 bg-slate-50/50 border-r border-slate-100 p-4 space-y-2 overflow-y-auto">
                            {steps.map((step, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveStep(index)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeStep === index
                                            ? 'bg-white shadow-sm ring-1 ring-slate-200'
                                            : 'hover:bg-slate-100 text-slate-500'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${step.color} bg-opacity-20`}>
                                        <step.icon className="w-4 h-4" />
                                    </div>
                                    <span className={`text-sm font-semibold ${activeStep === index ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {step.title}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Detail View */}
                        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            {/* Decorative Background Blob */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradian-to-br from-teal-50 to-blue-50 rounded-full blur-3xl -z-10 opacity-50" />

                            <div className={`p-4 rounded-2xl mb-6 ${steps[activeStep].color.replace('text-', 'bg-').replace('100', '50')} ${steps[activeStep].color} bg-opacity-10`}>
                                {React.createElement(steps[activeStep].icon, { className: "w-12 h-12" })}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                {steps[activeStep].title}
                            </h3>

                            <p className="text-slate-600 leading-relaxed max-w-sm">
                                {steps[activeStep].description}
                            </p>

                            <div className="mt-8 flex gap-2">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === i ? 'w-6 bg-teal-500' : 'w-1.5 bg-slate-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
                        {activeStep < steps.length - 1 ? (
                            <button
                                onClick={() => setActiveStep(activeStep + 1)}
                                className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-transform active:scale-95"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-transform active:scale-95 shadow-lg shadow-teal-200"
                            >
                                Got it!
                            </button>
                        )}
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
