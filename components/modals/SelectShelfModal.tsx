import React from 'react';
import Modal from '../ui/Modal.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useUserShelves } from '../../lib/hooks/useUserShelves.ts';
import { useToggleBookOnShelf } from '../../lib/hooks/useToggleBookOnShelf.ts';
import LoadingSpinner from '../ui/LoadingSpinner.tsx';
import { BookIcon } from '../icons/BookIcon.tsx';
import { CheckIcon } from '../icons/CheckIcon.tsx';

interface SelectShelfModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookId: string;
}

const SelectShelfModal: React.FC<SelectShelfModalProps> = ({ isOpen, onClose, bookId }) => {
    const { lang } = useI18n();
    const { data: shelves, isLoading } = useUserShelves();
    const { mutate: toggleBook, isLoading: isToggling } = useToggleBookOnShelf();

    const handleSelectShelf = (shelfId: string) => {
        if (!bookId) return;
        toggleBook({ shelfId, bookId }, {
            onSuccess: () => onClose()
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <BilingualText role="H1" className="!text-xl text-center mb-4">
                {lang === 'en' ? 'Add to a Shelf' : 'إضافة إلى رف'}
            </BilingualText>
            {isLoading ? <div className="flex justify-center"><LoadingSpinner /></div> : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {shelves?.map(shelf => {
                        const isBookOnShelf = Object.keys(shelf.entries || {}).includes(bookId);
                        return (
                            <button
                                key={shelf.id}
                                onClick={() => handleSelectShelf(shelf.id)}
                                disabled={isToggling}
                                className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <BookIcon className="h-5 w-5 text-slate-500" />
                                <span className="flex-grow">{lang === 'en' ? shelf.titleEn : shelf.titleAr}</span>
                                {isBookOnShelf && <CheckIcon className="h-5 w-5 text-accent" />}
                            </button>
                        )
                    })}
                </div>
            )}
        </Modal>
    );
};

export default SelectShelfModal;