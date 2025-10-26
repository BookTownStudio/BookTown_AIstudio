import React, { useState, useRef, useCallback, useEffect } from 'react';
import AppNav from '../../components/navigation/AppNav.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { PlusIcon } from '../../components/icons/PlusIcon.tsx';
import { useUserProjects } from '../../lib/hooks/useUserProjects.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import ProjectCard from '../../components/content/ProjectCard.tsx';
import FloatingActionPanel from '../../components/ui/FloatingActionPanel.tsx';
import TemplateCard from '../../components/content/TemplateCard.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import { mockTemplates } from '../../data/mocks.ts';
import { TemplatesIcon } from '../../components/icons/TemplatesIcon.tsx';
import Button from '../../components/ui/Button.tsx';

interface TemplatesPanelTriggerProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const TemplatesPanelTrigger: React.FC<TemplatesPanelTriggerProps> = ({ isOpen, onOpen, onClose }) => {
    const { lang } = useI18n();
    const { navigate, currentView } = useNavigation();
    const [currentPage, setCurrentPage] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleTemplateSelect = (templateId: string) => {
        onClose();
        navigate({ 
            type: 'immersive', 
            id: 'editor', 
            params: { projectId: 'new', templateId: templateId, from: currentView } 
        });
    };

     // Helper to chunk the array
    const chunk = <T,>(arr: T[], size: number): T[][] =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );

    const templatePages = chunk(mockTemplates, 4);
    const totalPages = templatePages.length;

    const handleScroll = useCallback(() => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const page = Math.round(scrollLeft / clientWidth);
            if (page !== currentPage) {
                setCurrentPage(page);
            }
        }
    }, [currentPage]);


    return (
        <>
            <div
                className="fixed bottom-[72px] left-0 right-0 z-20 flex justify-center pointer-events-none"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                <button
                    onClick={onOpen}
                    className="
                        flex items-center gap-2 px-6 py-3
                        bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-md 
                        shadow-xl shadow-primary/10 dark:shadow-black/40 
                        border border-black/5 dark:border-white/10 
                        text-slate-800 dark:text-white 
                        pointer-events-auto 
                        transition-all duration-300 ease-in-out
                        hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20
                        active:scale-100
                        rounded-full"
                    aria-label={lang === 'en' ? 'Open Templates' : 'فتح القوالب'}
                >
                    <TemplatesIcon className="h-5 w-5 text-accent" />
                    <BilingualText className="font-bold text-lg">
                        {lang === 'en' ? 'Templates' : 'القوالب'}
                    </BilingualText>
                </button>
            </div>
            <FloatingActionPanel isOpen={isOpen} onClose={onClose}>
                 <div>
                    <div 
                        ref={scrollContainerRef} 
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    >
                        {templatePages.map((page, pageIndex) => (
                            <div key={pageIndex} className="w-full flex-shrink-0 snap-start grid grid-cols-2 gap-4 p-1">
                                {page.map(template => (
                                    <TemplateCard
                                        key={template.id}
                                        title={lang === 'en' ? template.titleEn : template.titleAr}
                                        description={lang === 'en' ? template.descriptionEn : template.descriptionAr}
                                        icon={template.icon}
                                        onClick={() => handleTemplateSelect(template.id)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 w-2 rounded-full transition-colors ${currentPage === index ? 'bg-accent' : 'bg-slate-500/50'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </FloatingActionPanel>
        </>
    );
};


const WriteScreen: React.FC = () => {
    const { lang } = useI18n();
    const { data: projects, isLoading } = useUserProjects();
    const { navigate, currentView, resetTokens } = useNavigation();
    const [isPanelOpen, setPanelOpen] = useState(false);
    const isInitialMount = useRef(true);

    // Tab Reset Effect
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            // A non-zero token indicates a reset has been triggered.
            if (resetTokens.write > 0) {
                setPanelOpen(false); // Close the panel on tab reset
            }
        }
    }, [resetTokens.write]);


    const handleNewProject = () => {
        navigate({ type: 'immersive', id: 'editor', params: { projectId: 'new', from: currentView } });
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex-grow flex items-center justify-center pt-16"><LoadingSpinner /></div>;
        }

        if (!projects || projects.length === 0) {
            return (
                <div className="flex-grow flex flex-col items-center justify-center pt-16 text-center text-slate-500 dark:text-white/60">
                    <BilingualText role="H1" className="!text-2xl">
                        {lang === 'en' ? 'Your canvas is empty.' : 'لوحتك فارغة.'}
                    </BilingualText>
                    <BilingualText className="mt-2">
                        {lang === 'en' ? 'Start a new project from a template or a blank page.' : 'ابدأ مشروعًا جديدًا من قالب أو صفحة فارغة.'}
                    </BilingualText>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <AppNav titleEn="Write" titleAr="اكتب" />
            <main className="flex-grow overflow-y-auto pt-20 pb-32">
                <div className="container mx-auto px-4 md:px-8 py-6">
                    <div className="flex justify-between items-center mb-6">
                        <BilingualText role="H1" className="!text-2xl !font-semibold">
                            {lang === 'en' ? 'Your Projects' : 'مشاريعك'}
                        </BilingualText>
                        <Button variant="primary" onClick={handleNewProject}>
                            <PlusIcon className="h-5 w-5 sm:mr-2" />
                            <span className="hidden sm:inline">{lang === 'en' ? 'New Project' : 'مشروع جديد'}</span>
                        </Button>
                    </div>
                    {renderContent()}
                </div>
            </main>
            <TemplatesPanelTrigger 
                isOpen={isPanelOpen}
                onOpen={() => setPanelOpen(true)}
                onClose={() => setPanelOpen(false)}
            />
        </div>
    );
};

// Add scroll snap helper styles
const style = document.createElement('style');
style.innerHTML = `
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.snap-x {
    scroll-snap-type: x;
}
.snap-mandatory {
    scroll-snap-stop: always;
    scroll-snap-type: x mandatory;
}
.snap-start {
    scroll-snap-align: start;
}
`;
document.head.appendChild(style);

export default WriteScreen;