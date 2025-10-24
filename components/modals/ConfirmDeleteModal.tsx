import React from 'react';
import Modal from '../ui/Modal.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import Button from '../ui/Button.tsx';
import { useI18n } from '../../store/i18n.tsx';
import LoadingSpinner from '../ui/LoadingSpinner.tsx';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    itemName: string;
    itemType: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    isDeleting,
    itemName,
    itemType
}) => {
    const { lang } = useI18n();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                <BilingualText role="H1" className="!text-xl">
                    {lang === 'en' ? `Delete ${itemType}?` : `حذف ${itemType}؟`}
                </BilingualText>
                <BilingualText role="Body" className="mt-4 text-slate-600 dark:text-white/70">
                    {lang === 'en' 
                        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.` 
                        : `هل أنت متأكد أنك تريد حذف "${itemName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                </BilingualText>
            </div>
            <div className="mt-6 flex justify-center gap-4">
                <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
                    {lang === 'en' ? 'Cancel' : 'إلغاء'}
                </Button>
                <Button 
                    variant="primary" 
                    onClick={onConfirm} 
                    disabled={isDeleting}
                    className="!bg-red-600 hover:!bg-red-700 focus:!ring-red-500"
                >
                    {isDeleting ? <LoadingSpinner /> : (lang === 'en' ? 'Delete' : 'حذف')}
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;