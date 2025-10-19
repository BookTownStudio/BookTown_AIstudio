import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '../../store/navigation.tsx';
import { useI18n } from '../../store/i18n.tsx';
import Button from '../../components/ui/Button.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon.tsx';
import { useProjectDetails } from '../../lib/hooks/useProjectDetails.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import { useAutosaveProject } from '../../lib/hooks/useAutosaveProject.ts';
import FormattingPane, { Alignment, Format, Style } from '../../components/editor/FormattingPane.tsx';
import { MentorIcon } from '../../components/icons/MentorIcon.tsx';
import Fab from '../../components/ui/Fab.tsx';

// Debounce helper
const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
    const timeoutRef = useRef<number | null>(null);
    return (...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            callback(...args);
        }, delay);
    };
};

const isRtl = (text: string) => {
    const rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC';
    const rtlRegex = new RegExp(`^[^a-zA-Z]*[${rtlChars}]`);
    return rtlRegex.test(text);
};

const EditorScreen: React.FC = () => {
    const { currentView, navigate } = useNavigation();
    const { lang } = useI18n();
    const projectId = currentView.type === 'immersive' ? currentView.params?.projectId : undefined;
    
    const { data: project, isLoading: isLoadingProject } = useProjectDetails(projectId);
    const { mutate: autosave } = useAutosaveProject();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [isTitlePristine, setIsTitlePristine] = useState(true);
    const [textDirection, setTextDirection] = useState<'ltr' | 'rtl'>('ltr');
    
    const editorRef = useRef<HTMLDivElement>(null);
    const lastSavedContent = useRef('');
    
    // --- History State ---
    const [history, setHistory] = useState<string[]>(['']);
    const [historyIndex, setHistoryIndex] = useState(0);

    // --- Effects ---
    useEffect(() => {
        if (project) {
            const initialContent = project.content || '';
            setTitle(project.titleEn);
            setContent(initialContent);
            lastSavedContent.current = initialContent;
            setHistory([initialContent]);
            setHistoryIndex(0);
            if (project.titleEn !== 'Untitled Draft') {
                setIsTitlePristine(false);
            }
        }
    }, [project]);

    useEffect(() => {
        const text = editorRef.current?.innerText || '';
        setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
        setTextDirection(isRtl(text) ? 'rtl' : 'ltr');
    }, [content]);

    const debouncedSave = useDebounce(() => {
        if (project && content !== lastSavedContent.current) {
            // FIX: Changed 'title' to 'titleEn' to match the expected type for the autosave mutation.
            autosave({ projectId: project.id, updates: { content, titleEn: title, wordCount } });
            lastSavedContent.current = content;
        }
    }, 5000);

    useEffect(debouncedSave, [content, title, wordCount, project, autosave]);

    // --- Handlers ---
    const handleBack = () => {
        if (project && content !== lastSavedContent.current) {
            // FIX: Changed 'title' to 'titleEn' to match the expected type for the autosave mutation.
            autosave({ projectId: project.id, updates: { content, titleEn: title, wordCount } });
        }
        navigate(currentView.params?.from || { type: 'tab', id: 'write' });
    };

    const handleTitleFocus = () => {
        if (isTitlePristine) {
            setTitle('');
            setIsTitlePristine(false);
        }
    };
    
    const handleContentInput = () => {
        const newContent = editorRef.current?.innerHTML || '';
        setContent(newContent);

        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const applyFormat = (format: Format | Alignment | Style) => {
        const commands = {
            bold: 'bold',
            italic: 'italic',
            left: 'justifyLeft',
            center: 'justifyCenter',
            right: 'justifyRight',
            body: 'p',
            title: 'h2',
            chapter: 'h1',
        };
        const command = commands[format];

        if (['body', 'title', 'chapter'].includes(format)) {
            document.execCommand('formatBlock', false, command);
        } else {
            document.execCommand(command, false);
        }
        // Refocus the editor after applying format
        editorRef.current?.focus();
        handleContentInput(); // Update state after formatting
    };
    
    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setContent(history[newIndex]);
            if (editorRef.current) editorRef.current.innerHTML = history[newIndex];
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setContent(history[newIndex]);
            if (editorRef.current) editorRef.current.innerHTML = history[newIndex];
        }
    };
    
    if (isLoadingProject) {
        return <div className="h-screen w-full flex items-center justify-center bg-slate-900"><LoadingSpinner /></div>;
    }

    return (
        <div className="h-screen w-full flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white/90">
            <header className="fixed top-0 left-0 right-0 z-20 bg-slate-100 dark:bg-slate-800 border-b border-black/10 dark:border-white/10">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Button variant="ghost" onClick={handleBack} aria-label={lang === 'en' ? 'Back' : 'رجوع'}>
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                </div>
            </header>

            <main className="flex-grow pt-16 overflow-y-auto">
                <div className="container mx-auto px-4 md:px-8 max-w-3xl">
                    <div className="pt-8">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onFocus={handleTitleFocus}
                            placeholder={lang === 'en' ? "Your Title Here" : "عنوانك هنا"}
                            className="w-full bg-transparent text-3xl md:text-4xl font-bold focus:outline-none text-slate-900 dark:text-white"
                        />
                        <BilingualText role="Caption" className="mt-1">{wordCount} {lang === 'en' ? 'words' : 'كلمة'}</BilingualText>
                    </div>

                    <div className="mt-4 -mx-4 md:-mx-8 border-t border-black/10 dark:border-white/10" />

                    <FormattingPane 
                        onFormat={applyFormat}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={historyIndex > 0}
                        canRedo={historyIndex < history.length - 1}
                    />
                    
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleContentInput}
                        dir={textDirection}
                        className="w-full min-h-[60vh] bg-transparent text-lg leading-relaxed focus:outline-none py-6 prose dark:prose-invert prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </main>
            
             <Fab 
                onClick={() => console.log('Open Mentor AI')} 
                aria-label={lang === 'en' ? 'Open Mentor AI' : 'فتح مساعد الكتابة'} 
                className="!bg-purple-600/80 hover:!bg-purple-600 !ring-purple-500"
            >
                <MentorIcon className="h-7 w-7" />
            </Fab>
        </div>
    );
};

export default EditorScreen;