
import React from 'react';
import Modal from '../ui/Modal.tsx';
import InputField from '../ui/InputField.tsx';
import Button from '../ui/Button.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import LoadingSpinner from '../ui/LoadingSpinner.tsx';

// Define the type for the form data, matching the update variables
export type ProfileEditData = {
    name: string;
    bioEn: string;
    avatarUrl: string;
};

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profileData: ProfileEditData;
    setProfileData: React.Dispatch<React.SetStateAction<ProfileEditData>>;
    onSave: () => void;
    isSaving: boolean;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    profileData,
    setProfileData,
    onSave,
    isSaving
}) => {
    const { lang } = useI18n();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <BilingualText role="H1" className="!text-2xl mb-6 text-center">
                {lang === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
            </BilingualText>
            <div className="space-y-4">
                <InputField
                    id="name"
                    name="name"
                    label={lang === 'en' ? 'Name' : 'الاسم'}
                    value={profileData.name}
                    onChange={handleChange}
                />
                <InputField
                    id="avatarUrl"
                    name="avatarUrl"
                    label={lang === 'en' ? 'Avatar URL' : 'رابط الصورة الرمزية'}
                    value={profileData.avatarUrl}
                    onChange={handleChange}
                />
                <div>
                    <label htmlFor="bioEn">
                        <BilingualText role="Caption" className="!text-slate-700 dark:!text-white/80 mb-1 block">
                            {lang === 'en' ? 'Bio' : 'النبذة التعريفية'}
                        </BilingualText>
                    </label>
                    <textarea
                        id="bioEn"
                        name="bioEn"
                        value={profileData.bioEn}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-md px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 resize-none"
                    />
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Button variant="ghost" onClick={onClose} disabled={isSaving}>
                    {lang === 'en' ? 'Cancel' : 'إلغاء'}
                </Button>
                <Button variant="primary" onClick={onSave} disabled={isSaving}>
                    {isSaving ? <LoadingSpinner /> : (lang === 'en' ? 'Save Changes' : 'حفظ التغييرات')}
                </Button>
            </div>
        </Modal>
    );
};

export default EditProfileModal;
