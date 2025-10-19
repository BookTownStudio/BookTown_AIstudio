import React, { useRef, useEffect } from 'react';
import AppNav from '../../components/navigation/AppNav';
import BilingualText from '../../components/ui/BilingualText';
import Fab from '../../components/ui/Fab';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { useI18n } from '../../store/i18n';
import { useUserProjects } from '../../lib/hooks/useUserProjects';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ProjectCard from '../../components/content/ProjectCard';
import { useNavigation } from '../../store/navigation';

const WriteScreen: React.FC = () => {
    const { lang } = useI18n();
    const { data: projects, isLoading, isError } = useUserProjects();
    const { navigate, currentView, resetTokens } = useNavigation();
    const mainContentRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    // Tab Reset Effect
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (resetTokens.write > 0) {
                mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [resetTokens.write]);

    const handleNewProject = () => {
        navigate({ type: 'immersive', id: 'editor', params: { projectId: 'new', from: currentView } });
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex-grow flex items-center justify-center"><LoadingSpinner /></div>;
        }

        if (isError) {
            return <div className="flex-grow flex items-center justify-center"><BilingualText>Error loading projects.</BilingualText></div>;
        }

        if (!projects || projects.length === 0) {
            return (
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <BilingualText role="H1">Your writing desk is empty</BilingualText>
                    <BilingualText role="Body" className="mt-2 text-white/60">Tap the + button to start a new project.</BilingualText>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(project => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        );
    }
    
    return (
        <div className="h-screen flex flex-col">
            <AppNav titleEn="Write" titleAr="اكتب" />
            <main ref={mainContentRef} className="flex-grow overflow-y-auto pt-24 pb-28">
                <div className="container mx-auto px-4 md:px-8">
                     {renderContent()}
                </div>
            </main>
            <Fab onClick={handleNewProject} aria-label={lang === 'en' ? 'New Project' : 'مشروع جديد'}>
                <PlusIcon className="h-8 w-8" />
            </Fab>
        </div>
    );
};

export default WriteScreen;
