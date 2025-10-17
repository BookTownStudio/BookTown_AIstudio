
import React, { useState } from 'react';
// FIX: Added file extensions to imports
import { useNavigation } from '../../store/navigation.tsx';
import { useI18n } from '../../store/i18n.tsx';
import Button from '../../components/ui/Button.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon.tsx';

const EditorScreen: React.FC = () => {
    const { currentView, navigate } = useNavigation();
    const { lang, isRTL } = useI18n();
    const [content, setContent] = useState('Once upon a time...');

    const projectId = currentView.type === 'immersive' ? currentView.params?.projectId : 'New Project';
    
    const handleBack = () => {
        navigate({ type: 'tab', id: 'write' });
    };

    return (
        <div className="h-screen w-full flex flex-col bg-slate-900">
            <header className="fixed top-0 left-0 right-0 z-20 bg-slate-800 border-b border-white/10">
                <div className={`container mx-auto flex h-20 items-center justify-between px-4 md:px-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button variant="ghost" onClick={handleBack} aria-label={lang === 'en' ? 'Back' : 'رجوع'}>
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <BilingualText role="H1" className="!text-lg">{lang === 'en' ? 'Editor' : 'محرر'}</BilingualText>
                    <Button variant="primary">{lang === 'en' ? 'Save' : 'حفظ'}</Button>
                </div>
            </header>

            <main className="flex-grow pt-20 overflow-y-auto">
                <div className="container mx-auto p-4 md:p-8">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className="w-full h-[70vh] bg-transparent text-white/90 text-lg leading-loose focus:outline-none resize-none"
                        placeholder={lang === 'en' ? 'Start writing your story...' : 'ابدأ في كتابة قصتك...'}
                    />
                </div>
            </main>
        </div>
    );
};

export default EditorScreen;
