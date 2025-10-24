import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import Button from '../ui/Button.tsx';
import InputField from '../ui/InputField.tsx';
import { useI18n } from '../../store/i18n.tsx';
import LoadingSpinner from '../ui/LoadingSpinner.tsx';
import { Shelf } from '../../types/entities.ts';
import { useUpdateShelf } from '../../lib/hooks/useUpdateShelf.ts';

interface EditShelfModalProps {
    isOpen: boolean;
    onClose: () => void;
    shelf: Shelf | null;
}

const EditShelfModal: React.FC<EditShelfModalProps> = ({ isOpen, onClose, shelf }) => {
    const { lang } = useI18n();
    const [titleEn, setTitleEn] = useState('');
    const { mutate: updateShelf, isLoading: isUpdating } = useUpdateShelf();

    useEffect(() => {
        if (shelf) {
            setTitleEn(shelf.titleEn);
        } else {
            setTitleEn('');
        }
    }, [shelf]);

    const handleSave = () => {
        if (!titleEn.trim() || !shelf) return;

        // For this mock, we'll just derive the Arabic title.
        const titleAr = `${titleEn.trim()} (AR)`;
        
        updateShelf({ 
            shelfId: shelf.id, 
            updates: { titleEn: titleEn.trim(), titleAr } 
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <BilingualText role="H1" className="!text-xl text-center mb-6">
                {lang === 'en' ? 'Edit Shelf' : 'تعديل الرف'}
            </BilingualText>
            
            <div className="space-y-4">
                <InputField
                    id="edit-shelf-name"
                    label={lang === 'en' ? 'Shelf Name (English)' : 'اسم الرف (انجليزي)'}
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                />
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Button variant="ghost" onClick={onClose} disabled={isUpdating}>
                    {lang === 'en' ? 'Cancel' : 'إلغاء'}
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={isUpdating || !titleEn.trim()}>
                    {isUpdating ? <LoadingSpinner /> : (lang === 'en' ? 'Save Changes' : 'حفظ التغييرات')}
                </Button>
            </div>
        </Modal>
    );
};

export default EditShelfModal;
