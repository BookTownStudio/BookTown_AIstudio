import React from 'react';
import PostCard from './PostCard.tsx';
import CommentThread from './CommentThread.tsx';
import { usePostDetails } from '../../lib/hooks/usePostDetails.ts';
import LoadingSpinner from '../ui/LoadingSpinner.tsx';
import Button from '../ui/Button.tsx';
import { XIcon } from '../icons/XIcon.tsx';
import { useI18n } from '../../store/i18n.tsx';

interface DiscussionModalProps {
    postId: string;
    onClose: () => void;
}

const DiscussionModal: React.FC<DiscussionModalProps> = ({ postId, onClose }) => {
    const { lang } = useI18n();
    const { data: post, isLoading } = usePostDetails(postId);

    return (
        <div 
            className="fixed inset-0 z-40 bg-gray-50 dark:bg-slate-900 flex flex-col"
            role="dialog"
            aria-modal="true"
        >
            <header className="flex-shrink-0 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-black/10 dark:border-white/10">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                     <Button variant="ghost" onClick={onClose}>
                        {lang === 'en' ? 'Close' : 'إغلاق'}
                    </Button>
                </div>
            </header>
            
            <div className="flex-grow overflow-y-auto">
                <div className="container mx-auto p-4">
                    {isLoading && <div className="flex justify-center py-16"><LoadingSpinner /></div>}
                    {post && (
                        <>
                            <PostCard post={post} viewMode="list" />
                            <div className="my-4 border-t border-black/10 dark:border-white/10" />
                            <CommentThread post={post} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscussionModal;
