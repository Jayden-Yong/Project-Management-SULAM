import { useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileEditModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user } = useUser();
    const [name, setName] = useState(user?.fullName || '');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    if (!isOpen || !user) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const [firstName, ...lastName] = name.split(' ');
            await user.update({
                firstName: firstName,
                lastName: lastName.join(' ')
            });
            onClose();
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await user.setProfileImage({ file });
        } catch (err) {
            console.error("Failed to upload image", err);
            alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 relative z-10 animate-slide-up sm:animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-900">Edit Profile</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">✕</button>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                        <img
                            src={user.imageUrl}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-slate-50"
                        />
                        <label className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${uploading ? 'opacity-100' : ''}`}>
                            <span className="text-white text-xs font-bold">{uploading ? '...' : 'Change'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Click image to change</p>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 disabled:opacity-70"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};
