

import React from 'react';
import GlassCard from '../ui/GlassCard.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
// FIX: Add file extension to entities.ts import
import { Agent } from '../../types/entities.ts';
import { LockIcon } from '../icons/LockIcon.tsx';

interface AgentGridCardProps {
    agent: Agent;
    onClick: () => void;
}

const AgentGridCard: React.FC<AgentGridCardProps> = ({ agent, onClick }) => {
    const { lang } = useI18n();

    return (
        <button
            onClick={onClick}
            disabled={agent.isPremium}
            className="text-left w-full disabled:opacity-60 disabled:cursor-not-allowed group"
        >
            <GlassCard className="!p-4 aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 group-hover:bg-white/10 group-disabled:hover:bg-transparent">
                {agent.isPremium && (
                    <div className="absolute top-3 right-3 bg-amber-500/20 p-1.5 rounded-full">
                         <LockIcon className="h-4 w-4 text-amber-400" />
                    </div>
                )}
                <agent.icon className={`h-10 w-10 ${agent.color} mb-2 transition-transform duration-300 group-hover:scale-110`} />
                <BilingualText className="font-bold">
                    {agent.name}
                </BilingualText>
                <BilingualText role="Caption" className="!text-xs mt-1 leading-tight">
                    {lang === 'en' ? agent.descriptionEn : agent.descriptionAr}
                </BilingualText>
            </GlassCard>
        </button>
    );
};

export default AgentGridCard;
