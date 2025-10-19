import React, { useState } from 'react';
import { useI18n } from '../../store/i18n.tsx';
import Button from '../ui/Button.tsx';
import EditorMenu from './EditorMenu.tsx';
import { ItalicIcon } from '../icons/ItalicIcon.tsx';
import { UndoIcon } from '../icons/UndoIcon.tsx';
import { RedoIcon } from '../icons/RedoIcon.tsx';
import { AlignLeftIcon } from '../icons/AlignLeftIcon.tsx';
import { AlignCenterIcon } from '../icons/AlignCenterIcon.tsx';
import { AlignRightIcon } from '../icons/AlignRightIcon.tsx';
import { ChevronDownIcon } from '../icons/ChevronDownIcon.tsx';

export type Format = 'bold' | 'italic';
export type Alignment = 'left' | 'center' | 'right';
export type Style = 'body' | 'title' | 'chapter';

interface FormattingPaneProps {
    onFormat: (format: Format | Alignment | Style) => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const FormattingPane: React.FC<FormattingPaneProps> = ({ onFormat, onUndo, onRedo, canUndo, canRedo }) => {
    const { lang } = useI18n();
    const [openMenu, setOpenMenu] = useState<'style' | 'align' | null>(null);

    const STYLES: { id: Style, label: string }[] = [
        { id: 'body', label: 'Body' },
        { id: 'title', label: 'Title' },
        { id: 'chapter', label: 'Chapter' },
    ];
    
    const ALIGNMENTS: { id: Alignment, icon: React.FC<any> }[] = [
        { id: 'left', icon: AlignLeftIcon },
        { id: 'center', icon: AlignCenterIcon },
        { id: 'right', icon: AlignRightIcon },
    ];

    const handleMenuAction = (action: () => void) => {
        action();
        setOpenMenu(null);
    };

    return (
        <div className="sticky top-16 z-10 bg-white dark:bg-slate-800 -mx-4 md:-mx-8 px-4 md:px-8 pb-2 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-1">
                {/* Style Menu */}
                <div className="relative">
                    <Button variant="ghost" className="!px-3" onClick={() => setOpenMenu(openMenu === 'style' ? null : 'style')}>
                        {lang === 'en' ? 'Style' : 'نمط'} <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </Button>
                    {openMenu === 'style' && (
                        <EditorMenu>
                            {STYLES.map(s => (
                                <button key={s.id} onClick={() => handleMenuAction(() => onFormat(s.id))} className="w-full text-left px-3 py-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-sm">
                                    {s.label}
                                </button>
                            ))}
                        </EditorMenu>
                    )}
                </div>

                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                {/* Basic Formatting */}
                <Button variant="icon" onClick={() => onFormat('bold')}>
                    <span className="font-bold text-lg">B</span>
                </Button>
                <Button variant="icon" onClick={() => onFormat('italic')}><ItalicIcon className="h-5 w-5" /></Button>
                
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                {/* Alignment Menu */}
                <div className="relative">
                     <Button variant="ghost" className="!px-3" onClick={() => setOpenMenu(openMenu === 'align' ? null : 'align')}>
                        <AlignLeftIcon className="h-5 w-5" /> <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </Button>
                     {openMenu === 'align' && (
                        <EditorMenu>
                            <div className="flex justify-around">
                            {ALIGNMENTS.map(a => (
                                <button key={a.id} onClick={() => handleMenuAction(() => onFormat(a.id))} className="flex-1 p-2 rounded hover:bg-black/10 dark:hover:bg-white/10">
                                    <a.icon className="h-5 w-5 mx-auto" />
                                </button>
                            ))}
                            </div>
                        </EditorMenu>
                    )}
                </div>

                <div className="flex-grow" />

                {/* History */}
                <Button variant="icon" onClick={onUndo} disabled={!canUndo}><UndoIcon className="h-5 w-5" /></Button>
                <Button variant="icon" onClick={onRedo} disabled={!canRedo}><RedoIcon className="h-5 w-5" /></Button>
            </div>
        </div>
    );
};

export default FormattingPane;