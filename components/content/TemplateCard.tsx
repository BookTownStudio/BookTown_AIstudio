import React from 'react';
import GlassCard from '../ui/GlassCard.tsx';
import BilingualText from '../ui/BilingualText.tsx';

interface TemplateCardProps {
    title: string;
    description: string;
    icon: React.FC<any>;
    onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, description, icon: Icon, onClick }) => {
    return (
        <button onClick={onClick} className="w-full text-left">
            <GlassCard className="!p-4 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/10 aspect-square">
                <Icon className="h-10 w-10 text-accent mb-2" />
                <BilingualText className="font-bold">{title}</BilingualText>
                <BilingualText role="Caption" className="!text-xs mt-1">{description}</BilingualText>
            </GlassCard>
        </button>
    );
};

export default TemplateCard;