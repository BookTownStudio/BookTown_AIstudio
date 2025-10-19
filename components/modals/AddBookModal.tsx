

import React, { useState } from 'react';
import Modal from '../ui/Modal.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import Button from '../ui/Button.tsx';
import InputField from '../ui/InputField.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useLiveBookSearch } from '../../lib/hooks/useLiveBookSearch.ts';
import { useToggleBookOnShelf } from '../../lib/hooks/useToggleBookOnShelf.ts';
import LoadingSpinner from '../ui/LoadingSpinner.tsx';
// FIX: Add file extension to entities.ts import
import { Book } from '../../types/entities.ts';
import { PlusIcon } from '../icons/PlusIcon.tsx';

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetShelfId?: string | null;
}

const SearchResultItem: React.FC<{ book: Book; onAdd: () => void; isAdding: boolean }> = ({ book, onAdd, isAdding }) => {
    const { lang, isRTL } = useI18n();
    return (
        <div className={`flex items-center gap-4 p-2 rounded-lg transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img src={book.coverUrl} alt="cover" className="h-16 w-11 rounded-md object-cover flex-shrink-0" />
            <div className="flex-grow">
                <BilingualText className="font-semibold line-clamp-1">{lang === 'en' ? book.titleEn : book.titleAr}</BilingualText>
                <BilingualText role="Caption" className="line-clamp-1">{lang === 'en' ? book.authorEn : book.authorAr}</BilingualText>
            </div>
            <Button variant="ghost" onClick={onAdd} disabled={isAdding} className="!px-3">
                <PlusIcon className="h-5 w-5 mr-1" />
                {lang === 'en' ? 'Add' : 'إضافة'}
            </Button>
        </div>
    );
};

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, targetShelfId }) => {
    const { lang } = useI18n();
    const [activeTab, setActiveTab] = useState<'search' | 'upload'>('search');
    const [searchQuery, setSearchQuery] = useState('');
    
    const { data: searchResults, isLoading: isSearching } = useLiveBookSearch(searchQuery, false);
    const { mutate: toggleBook, isLoading: isAdding } = useToggleBookOnShelf();

    const handleAddBook = (bookId: string) => {
        if (targetShelfId) {
            toggleBook({ shelfId: targetShelfId, bookId }, {
                onSuccess: () => {
                    // Maybe show a toast here in a real app
                    onClose();
                }
            });
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-lg">
                <BilingualText role="H1" className="!text-xl text-center mb-4">
                    {lang === 'en' ? 'Add Book to Shelf' : 'إضافة كتاب إلى الرف'}
                </BilingualText>

                <div className="flex items-center justify-center border-b border-black/10 dark:border-white/10 mb-4">
                    <button 
                        onClick={() => setActiveTab('search')}
                        className={`py-2 px-4 font-semibold border-b-2 ${activeTab === 'search' ? 'text-accent border-accent' : 'border-transparent text-slate-500'}`}
                    >
                        {lang === 'en' ? 'Search' : 'بحث'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('upload')}
                        className={`py-2 px-4 font-semibold border-b-2 ${activeTab === 'upload' ? 'text-accent border-accent' : 'border-transparent text-slate-500'}`}
                    >
                        {lang === 'en' ? 'Upload' : 'رفع'}
                    </button>
                </div>
                
                {activeTab === 'search' && (
                    <div>
                        <InputField
                            id="book-search"
                            label=""
                            type="search"
                            placeholder={lang === 'en' ? 'Search by title or author...' : 'ابحث بالعنوان أو المؤلف...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                         <BilingualText role="Caption" className="text-center mt-2">
                            {lang === 'en' ? 'Enter at least 2 characters to begin search.' : 'أدخل حرفين على الأقل لبدء البحث.'}
                        </BilingualText>
                        
                        <div className="mt-4 h-64 overflow-y-auto space-y-2">
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
                                    onAdd={() => handleAddBook(book.id)}
                                    isAdding={isAdding}
                                />
                            ))}
                        </div>
                    </div>
                )}
                
                {activeTab === 'upload' && (
                    <div className="text-center py-16 text-slate-500">
                        <BilingualText>
                            {lang === 'en' ? 'Upload functionality coming soon.' : 'ميزة الرفع ستتوفر قريبًا.'}
                        </BilingualText>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AddBookModal;
