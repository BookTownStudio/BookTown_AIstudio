
import React, { useState } from 'react';
// FIX: Add file extensions to imports
import Modal from '../ui/Modal.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import Button from '../ui/Button.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useAuth } from '../../lib/auth.tsx';
import { MediaIcon } from '../icons/MediaIcon.tsx';
import { BookIcon } from '../icons/BookIcon.tsx';

interface PostComposerProps {
    isOpen: boolean;
    onClose: () => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ isOpen, onClose }) => {
    const { lang, isRTL } = useI18n();
    const { user } = useAuth();
    const [text, setText] = useState('');
    const charLimit = 280;

    const handlePost = () => {
        // Mock post creation
        console.log('Posting:', text);
        onClose();
        setText('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-lg">
                <div className="flex items-start gap-4">
                     <img src={`https://i.pravatar.cc/150?u=${user?.email}`} alt="Avatar" className="h-12 w-12 rounded-full bg-slate-700" />
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={lang === 'en' ? 'What\'s happening?' : 'ماذا يحدث؟'}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className="w-full h-32 bg-transparent text-slate-800 dark:text-white/90 placeholder:text-slate-500 dark:placeholder:text-white/40 text-lg resize-none focus:outline-none"
                        maxLength={charLimit}
                    />
                </div>
                <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Button variant="icon" aria-label="Add media"><MediaIcon className="h-6 w-6" /></Button>
                        <Button variant="icon" aria-label="Tag a book"><BookIcon className="h-6 w-6" /></Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <BilingualText role="Caption">
                            {charLimit - text.length}
                        </BilingualText>
                        <Button variant="primary" disabled={!text.trim()} onClick={handlePost}>
                            {lang === 'en' ? 'Post' : 'انشر'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PostComposer;