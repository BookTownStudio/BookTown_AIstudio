import React from 'react';
// FIX: Add file extensions to imports
import GlassCard from '../ui/GlassCard.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import { Project } from '../../types/entities.ts';

interface ProjectCardProps {
    project: Project;
}

const statusStyles: Record<Project['status'], { text: string; bg: string; }> = {
    Idea: { text: 'text-blue-300', bg: 'bg-blue-500/20' },
    Draft: { text: 'text-amber-300', bg: 'bg-amber-500/20' },
    Revision: { text: 'text-purple-300', bg: 'bg-purple-500/20' },
    Final: { text: 'text-green-300', bg: 'bg-green-500/20' },
};


const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const { lang, isRTL } = useI18n();
    const { navigate, currentView } = useNavigation();

    const handlePress = () => {
        navigate({ type: 'immersive', id: 'editor', params: { projectId: project.id, from: currentView } });
    };

    const statusStyle = statusStyles[project.status];
    const wordCountLabel = lang === 'en' ? 'words' : 'كلمة';

    return (
        <button onClick={handlePress} className="w-full text-left">
            <GlassCard className="!p-4 hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200">
                <div className="flex flex-col h-full">
                    <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div>
                             <BilingualText className="text-lg font-bold">
                                {lang === 'en' ? project.titleEn : project.titleAr}
                            </BilingualText>
                            <BilingualText role="Caption">
                                {lang === 'en' ? project.typeEn : project.typeAr}
                            </BilingualText>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                            {project.status}
                        </div>
                    </div>
                   
                    <div className="mt-4 pt-2 border-t border-black/10 dark:border-white/10">
                        <BilingualText role="Caption">
                             {`${project.wordCount.toLocaleString()} ${wordCountLabel}`}
                        </BilingualText>
                    </div>
                </div>
            </GlassCard>
        </button>
    );
};

export default ProjectCard;
