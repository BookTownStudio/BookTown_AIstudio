import React, { useEffect, useReducer } from 'react';
import { useNavigation } from '../../store/navigation';
import { useI18n } from '../../store/i18n';
import Button from '../../components/ui/Button';
import BilingualText from '../../components/ui/BilingualText';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon';
import { useProjectDetails } from '../../lib/hooks/useProjectDetails';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { BrainIcon } from '../../components/icons/BrainIcon';
import FormattingPane, { Format, Alignment, Style } from '../../components/editor/FormattingPane';
import { useAutosaveProject } from '../../lib/hooks/useAutosaveProject';
import { useDebounce } from 'use-debounce';

// Simple undo/redo reducer
type EditorState = { content: string; wordCount: number };
type HistoryState = { past: EditorState[], present: EditorState, future: EditorState[] };
type HistoryAction = { type: 'UNDO' } | { type: 'REDO' } | { type: 'SET', payload: EditorState };

const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
    const { past, present, future } = state;
    switch (action.type) {
        case 'UNDO':
            if (past.length === 0) return state;
            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);
            return { past: newPast, present: previous, future: [present, ...future] };
        case 'REDO':
            if (future.length === 0) return state;
            const next = future[0];
            const newFuture = future.slice(1);
            return { past: [...past, present], present: next, future: newFuture };
        case 'SET':
            if (action.payload.content === present.content) return state;
            return { past: [...past, present], present: action.payload, future: [] };
        default:
            return state;
    }
};

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const EditorScreen: React.FC = () => {
    const { currentView, navigate } = useNavigation();
    const { lang } = useI18n();
    const projectId = currentView.type === 'immersive' ? currentView.params?.projectId : undefined;
    const templateId = currentView.type === 'immersive' ? currentView.params?.templateId : undefined;
    const { data: project, isLoading, isError } = useProjectDetails(projectId, templateId);
    const { mutate: autosave } = useAutosaveProject();

    const initialState: HistoryState = {
        past: [],
        present: { content: '', wordCount: 0 },
        future: []
    };
    const [state, dispatch] = useReducer(historyReducer, initialState);
    const { present } = state;

    const [debouncedContent] = useDebounce(present.content, 1500);

    useEffect(() => {
        if (project && project.content !== present.content) {
            dispatch({ type: 'SET', payload: { content: project.content, wordCount: project.wordCount } });
        }
    }, [project]);

    useEffect(() => {
        // Only autosave for existing projects, not for new ones.
        if (projectId && projectId !== 'new' && project && debouncedContent !== project.content) {
            autosave({ projectId, updates: { content: debouncedContent, wordCount: present.wordCount } });
        }
    }, [debouncedContent, projectId, project, autosave, present.wordCount]);

    const handleBack = () => {
        navigate(currentView.params?.from || { type: 'tab', id: 'write' });
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        const newWordCount = countWords(newContent);
        dispatch({ type: 'SET', payload: { content: newContent, wordCount: newWordCount } });
    };

    const handleFormat = (format: Format | Alignment | Style) => {
        console.log(`[Mock Format]: Applied ${format}`);
    };

    if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-slate-900"><LoadingSpinner /></div>;
    if (isError || !project) return <div className="h-screen w-full flex items-center justify-center">Error loading project.</div>;

    return (
        <div className="h-screen w-full flex flex-col bg-white dark:bg-slate-900">
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-black/10 dark:border-white/10">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                    <Button variant="ghost" onClick={handleBack}><ChevronLeftIcon className="h-6 w-6" /></Button>
                    <div className="text-center">
                        <BilingualText className="font-semibold">{lang === 'en' ? project.titleEn : project.titleAr}</BilingualText>
                        <BilingualText role="Caption">{present.wordCount} {lang === 'en' ? 'words' : 'كلمة'}</BilingualText>
                    </div>
                    <Button variant="ghost"><BrainIcon className="h-6 w-6" /></Button>
                </div>
            </header>
            
            <div className="flex-grow flex flex-col">
                <FormattingPane 
                    onFormat={handleFormat}
                    onUndo={() => dispatch({ type: 'UNDO' })}
                    onRedo={() => dispatch({ type: 'REDO' })}
                    canUndo={state.past.length > 0}
                    canRedo={state.future.length > 0}
                />
                <div className="flex-grow container mx-auto px-4 md:px-8 py-4">
                    <textarea
                        value={present.content}
                        onChange={handleContentChange}
                        className="w-full h-full resize-none bg-transparent text-lg text-slate-800 dark:text-white/90 focus:outline-none"
                        placeholder="Start writing..."
                    />
                </div>
            </div>
        </div>
    );
};

export default EditorScreen;