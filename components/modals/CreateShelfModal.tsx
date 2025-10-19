import React, { useState } from 'react';
import Modal from '../ui/Modal.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import Button from '../ui/Button.tsx';
import InputField from '../ui/InputField.tsx';
import { useI18n } from '../../store/i18n.tsx';
import LoadingSpinner from '../ui/LoadingSpinner.tsx';
import { useCreateShelf } from '../../lib/hooks/useCreateShelf.ts';

interface CreateShelfModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateShelfModal: React.FC<CreateShelfModalProps> = ({ isOpen, onClose }) => {
    const { lang } = useI18n();
    const [titleEn, setTitleEn] = useState('');
    const { mutate: createShelf, isLoading: isCreating } = useCreateShelf();

    const handleCreate = () => {
        if (!titleEn.trim()) return;

        // For this mock, we'll just derive the Arabic title.
        const titleAr = `${titleEn} (AR)`;
        
        createShelf({ titleEn, titleAr }, {
            onSuccess: () => {
                setTitleEn('');
                onClose();
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-lg">
                <BilingualText role="H1" className="!text-xl text-center mb-6">
                    {lang === 'en' ? 'Create New Shelf' : 'إنشاء رف جديد'}
                </BilingualText>
                
                <div className="space-y-4">
                    <InputField
                        id="shelf-name"
                        label={lang === 'en' ? 'Shelf Name (English)' : 'اسم الرف (انجليزي)'}
                        type="text"
                        placeholder={lang === 'en' ? 'e.g., Sci-Fi Classics' : 'مثال: كلاسيكيات الخيال العلمي'}
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                    />
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <Button variant="ghost" onClick={onClose} disabled={isCreating}>
                        {lang === 'en' ? 'Cancel' : 'إلغاء'}
                    </Button>
                    <Button variant="primary" onClick={handleCreate} disabled={isCreating || !titleEn.trim()}>
                        {isCreating ? <LoadingSpinner /> : (lang === 'en' ? 'Create Shelf' : 'إنشاء رف')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateShelfModal;
