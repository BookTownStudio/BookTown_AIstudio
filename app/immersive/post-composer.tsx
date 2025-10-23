import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../store/navigation.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useAuth } from '../../lib/auth.tsx';
import { XIcon } from '../../components/icons/XIcon.tsx';
import Button from '../../components/ui/Button.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { BookIcon } from '../../components/icons/BookIcon.tsx';
import { QuoteIcon } from '../../components/icons/QuoteIcon.tsx';
import { MediaIcon } from '../../components/icons/MediaIcon.tsx';
import { ShelvesIcon } from '../../components/icons/ShelvesIcon.tsx';
import { AuthorsIcon } from '../../components/icons/AuthorsIcon.tsx';
import { VenuesIcon } from '../../components/icons/VenuesIcon.tsx';
import SelectBookModal from '../../components/modals/SelectBookModal.tsx';
import { useBookCatalog } from '../../lib/hooks/useBookCatalog.ts';
import { Book } from '../../types/entities.ts';
import { DraftIcon } from '../../components/icons/DraftIcon.tsx';
import { useAuthorDetails } from '../../lib/hooks/useAuthorDetails.ts';

type Attachment = {
    type: 'book' | 'quote' | 'post' | 'shelf' | 'author' | 'venue' | 'media';
    id: string;
} | null;

const AttachmentPreview: React.FC<{ attachment: Attachment, onRemove: () => void }> = ({ attachment, onRemove }) => {
    const { lang } = useI18n();
    const { data: book, isLoading: isLoadingBook } = useBookCatalog(attachment?.type === 'book' ? attachment.id : undefined);
    const { data: author, isLoading: isLoadingAuthor } = useAuthorDetails(attachment?.type === 'author' ? attachment.id : undefined);

    if (!attachment) return null;

    return (
        <div className="mt-4">
            <BilingualText role="Caption" className="mb-2">Attachment:</BilingualText>
            <div className="relative p-2 border border-black/10 dark:border-white/10 rounded-lg">
                {(isLoadingBook || isLoadingAuthor) && <BilingualText role="Caption">Loading attachment...</BilingualText>}
                {attachment.type === 'book' && book && (
                    <div className="flex items-center gap-3">
                        <img src={book.coverUrl} alt="book cover" className="h-16 w-11 rounded object-cover"/>
                        <div>
                            <BilingualText className="font-semibold text-sm">{lang === 'en' ? book.titleEn : book.titleAr}</BilingualText>
                            <BilingualText role="Caption" className="!text-xs">{lang === 'en' ? book.authorEn : book.authorAr}</BilingualText>
                        </div>
                    </div>
                )}
                 {attachment.type === 'author' && author && (
                    <div className="flex items-center gap-3">
                        <img src={author.avatarUrl} alt="author avatar" className="h-16 w-16 rounded-full"/>
                        <div>
                            <BilingualText className="font-semibold text-sm">{lang === 'en' ? author.nameEn : author.nameAr}</BilingualText>
                            <BilingualText role="Caption" className="!text-xs line-clamp-2">{lang === 'en' ? author.bioEn : author.bioAr}</BilingualText>
                        </div>
                    </div>
                )}
                 <Button variant="icon" className="!absolute top-1 right-1 !w-6 !h-6" onClick={onRemove}>
                    <XIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

const PostComposerScreen: React.FC = () => {
    const { currentView, navigate } = useNavigation();
    const { lang, isRTL } = useI18n();
    const { user } = useAuth();
    const [text, setText] = useState('');
    const [attachment, setAttachment] = useState<Attachment>(null);
    const [isBookModalOpen, setBookModalOpen] = useState(false);
    
    const charLimit = 500;

    useEffect(() => {
        if (currentView.type === 'immersive' && currentView.params?.attachment) {
            setAttachment(currentView.params.attachment);
        }
    }, [currentView.params]);

    const handleBack = () => {
        navigate(currentView.params?.from || { type: 'tab', id: 'social' });
    };

    const handlePost = () => {
        console.log('Posting:', { text, attachment });
        handleBack();
    };

    const onBookSelect = (book: Book) => {
        setAttachment({ type: 'book', id: book.id });
        setBookModalOpen(false);
    };

    const attachmentTypes = [
        { type: 'book', icon: BookIcon, action: () => setBookModalOpen(true) },
        { type: 'author', icon: AuthorsIcon, action: () => alert('Author selector coming soon!') },
        { type: 'shelf', icon: ShelvesIcon, action: () => alert('Shelf selector coming soon!') },
        { type: 'quote', icon: QuoteIcon, action: () => alert('Quote selector coming soon!') },
        { type: 'venue', icon: VenuesIcon, action: () => alert('Venue selector coming soon!') },
        { type: 'media', icon: MediaIcon, action: () => alert('Media picker coming soon!') },
    ];

    const isPostDisabled = !text.trim() || text.length > charLimit;

    return (
        <>
            <div className="h-screen w-full flex flex-col bg-gray-50 dark:bg-slate-900">
                <header className="flex-shrink-0">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                        <Button variant="ghost" onClick={handleBack} className="!text-slate-700 dark:!text-slate-200">
                            {lang === 'en' ? 'Cancel' : 'إلغاء'}
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" className="!text-slate-700 dark:!text-slate-200 border border-slate-300 dark:border-slate-700" onClick={() => console.log('Draft saved!')}>
                                <DraftIcon className="h-5 w-5 mr-2" />
                                {lang === 'en' ? 'Draft' : 'مسودة'}
                            </Button>
                            <Button variant="primary" onClick={handlePost} disabled={isPostDisabled} className="!px-6 !rounded-lg">
                                {lang === 'en' ? 'Post' : 'انشر'}
                            </Button>
                        </div>
                    </div>
                </header>
                <main className="flex-grow overflow-y-auto flex flex-col">
                    <div className="container mx-auto px-4 md:px-8 flex-grow flex flex-col pt-4">
                        {/* Attachment Grid */}
                        <div className="grid grid-cols-6 gap-2 my-2">
                             {attachmentTypes.map(att => (
                                <button key={att.type} onClick={att.action} disabled={!!attachment} className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors duration-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <att.icon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                                    <BilingualText role="Caption" className="!text-xs capitalize">{att.type}</BilingualText>
                                </button>
                            ))}
                        </div>
                        
                        <div className="my-4 border-t border-black/10 dark:border-white/10" />

                        {/* Text Input Area */}
                        <div className="flex-grow flex flex-col relative">
                             <div className={`self-end text-sm mb-1 ${text.length > charLimit ? 'text-red-500' : 'text-slate-500 dark:text-white/60'}`}>
                                {text.length} / {charLimit}
                            </div>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={lang === 'en' ? "What's happening?" : 'ماذا يحدث؟'}
                                dir={isRTL ? 'rtl' : 'ltr'}
                                className="w-full flex-grow bg-transparent text-slate-800 dark:text-white/90 placeholder:text-slate-500 dark:placeholder:text-white/40 text-lg resize-none focus:outline-none"
                                maxLength={charLimit}
                                autoFocus
                            />
                        </div>

                        <AttachmentPreview attachment={attachment} onRemove={() => setAttachment(null)} />
                        
                    </div>
                </main>
            </div>
            <SelectBookModal isOpen={isBookModalOpen} onClose={() => setBookModalOpen(false)} onBookSelect={onBookSelect} />
        </>
    );
};

export default PostComposerScreen;