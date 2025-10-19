import React, { useState } from 'react';
import Modal from '../ui/Modal.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import InputField from '../ui/InputField.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useLiveBookSearch } from '../../lib/hooks/useLiveBookSearch.ts';
import LoadingSpinner from '../ui/LoadingSpinner.tsx';
// FIX: Add file extension to entities.ts import
import { Book } from '../../types/entities.ts';

interface SelectBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBookSelect: (book: Book) => void;
}

const SearchResultItem: React.FC<{ book: Book; onSelect: () => void; }> = ({ book, onSelect }) => {
    const { lang, isRTL } = useI18n();
    return (
        <button onClick={onSelect} className={`w-full text-left flex items-center gap-4 p-2 rounded-lg transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img src={book.coverUrl} alt="cover" className="h-16 w-11 rounded-md object-cover flex-shrink-0" />
            <div className="flex-grow">
                <BilingualText className="font-semibold line-clamp-1">{lang === 'en' ? book.titleEn : book.titleAr}</BilingualText>
                <BilingualText role="Caption" className="line-clamp-1">{lang === 'en' ? book.authorEn : book.authorAr}</BilingualText>
            </div>
        </button>
    );
};

const SelectBookModal: React.FC<SelectBookModalProps> = ({ isOpen, onClose, onBookSelect }) => {
    const { lang } = useI18n();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: searchResults, isLoading: isSearching } = useLiveBookSearch(searchQuery, false);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-lg">
                <BilingualText role="H1" className="!text-xl text-center mb-4">
                    {lang === 'en' ? 'Attach a Book' : 'إرفاق كتاب'}
                </BilingualText>
                
                <InputField
                    id="book-search-modal"
                    label=""
                    type="search"
                    placeholder={lang === 'en' ? 'Search by title or author...' : 'ابحث بالعنوان أو المؤلف...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                />
                
                <div className="mt-4 h-80 overflow-y-auto space-y-2">
                    {isSearching && <div className="flex justify-center pt-8"><LoadingSpinner /></div>}
                    {!isSearching && searchQuery.length > 1 && (!searchResults || searchResults.length === 0) && (
                        <BilingualText className="text-center pt-8 text-slate-500">
                            {lang === 'en' ? 'No results found.' : 'لم يتم العثور على نتائج.'}
                        </BilingualText>
                    )}
                    {!isSearching && searchResults && searchResults.map(book => (
                        <SearchResultItem 
                            key={book.id} 
                            book={book} 
                            onSelect={() => onBookSelect(book)}
                        />
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default SelectBookModal;
