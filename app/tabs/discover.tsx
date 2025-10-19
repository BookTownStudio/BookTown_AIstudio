import React, { useState, useRef, useEffect } from 'react';
import AppNav from '../../components/navigation/AppNav.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
// FIX: Add file extension to mocks.ts import
import { mockAgents } from '../../data/mocks.ts';
// FIX: Add file extension to entities.ts import
import { Agent } from '../../types/entities.ts';
import AgentGridCard from '../../components/content/AgentGridCard.tsx';
import Button from '../../components/ui/Button.tsx';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon.tsx';
import { SendIcon } from '../../components/icons/SendIcon.tsx';
import { ClockIcon } from '../../components/icons/ClockIcon.tsx';
import { useNavigation } from '../../store/navigation.tsx';

const AgentChatUI: React.FC<{ agent: Agent }> = ({ agent }) => {
    const { lang, isRTL } = useI18n();
    const [input, setInput] = useState('');
    const [examplesVisible, setExamplesVisible] = useState(true);

    const examplePrompts = lang === 'en' ? agent.examplePromptsEn : agent.examplePromptsAr;
    const placeholderText = lang === 'en' ? agent.placeholderEn : agent.placeholderAr;

    return (
        <div className="container mx-auto px-4 md:px-8 py-6 h-full flex flex-col">
            <div className="flex justify-end mb-2">
                <Button variant="ghost" className="!text-xs" onClick={() => setExamplesVisible(!examplesVisible)}>
                    {examplesVisible ? (lang === 'en' ? 'Hide examples' : 'إخفاء الأمثلة') : (lang === 'en' ? 'Show examples' : 'إظهار الأمثلة')}
                </Button>
            </div>
            
            {examplesVisible && (
                <div className="space-y-3">
                    {examplePrompts.map((prompt, i) => (
                        <Button key={i} variant="ghost" className="w-full !justify-start !text-left !font-normal bg-black/5 dark:bg-white/5">
                            {prompt}
                        </Button>
                    ))}
                </div>
            )}

             <footer className="fixed bottom-[88px] left-0 right-0 z-10 bg-gray-50 dark:bg-slate-900 border-t border-black/10 dark:border-white/10 mt-auto">
                <div className="container mx-auto p-2">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder={placeholderText}
                            dir={isRTL ? 'rtl' : 'ltr'}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-slate-200 dark:bg-slate-800 rounded-full py-3 pl-4 pr-12 text-slate-900 dark:text-white/90 placeholder:text-slate-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <Button variant="icon" className="absolute right-2 top-1/2 -translate-y-1/2 !text-accent">
                            <SendIcon className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const AgentInteractionShell = ({ agent, onBack, onSelectAgent }: { agent: Agent, onBack: () => void, onSelectAgent: (id: Agent['id']) => void }) => {
    const { lang } = useI18n();

    return (
        <div className="h-screen w-full flex flex-col bg-gray-50 dark:bg-slate-900">
            <header className="fixed top-0 left-0 right-0 z-20 bg-gray-50/50 dark:bg-slate-900/50 backdrop-blur-lg border-b border-black/10 dark:border-white/10">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <Button variant="ghost" onClick={onBack} aria-label={lang === 'en' ? 'Back to Agents' : 'العودة للمساعدين'}>
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <BilingualText role="H1" className="!text-xl absolute left-1/2 -translate-x-1/2">
                        {agent.name}
                    </BilingualText>
                    <div className="w-10"></div>
                </div>
            </header>

            <div className="sticky top-20 z-10 bg-gray-50 dark:bg-slate-900 border-b border-black/10 dark:border-white/10">
                <div className="container mx-auto p-2">
                    <div className="grid grid-cols-4 gap-2">
                        {mockAgents.map(a => {
                            const isActive = agent.id === a.id;
                            return (
                                <button
                                    key={a.id}
                                    onClick={() => onSelectAgent(a.id)}
                                    className={`
                                        flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors duration-200
                                        ${a.isPremium ? 'opacity-50 cursor-not-allowed' : ''}
                                        ${isActive 
                                            ? 'bg-primary/10 dark:bg-blue-900/40 text-accent' 
                                            : 'text-slate-500 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'}
                                    `}
                                    disabled={a.isPremium}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <a.icon className="h-7 w-7 mb-1" />
                                    <BilingualText role="Caption" className="!text-xs !text-inherit text-center">
                                        {a.name}
                                    </BilingualText>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            <main className="flex-grow overflow-y-auto">
                <AgentChatUI agent={agent} />
            </main>
        </div>
    );
};


const DiscoverScreen: React.FC = () => {
    const { lang } = useI18n();
    const [selectedAgentId, setSelectedAgentId] = useState<Agent['id'] | null>(null);
    const { resetTokens } = useNavigation();
    const mainContentRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    // Tab Reset Effect
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (resetTokens.discover > 0) {
                if (selectedAgentId) {
                    setSelectedAgentId(null);
                } else {
                    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        }
    }, [resetTokens.discover, selectedAgentId]);

    const handleSelectAgent = (agentId: Agent['id']) => {
        const agent = mockAgents.find(a => a.id === agentId);
        if (agent && !agent.isPremium) {
            setSelectedAgentId(agentId);
        }
    }
    
    const selectedAgent = mockAgents.find(a => a.id === selectedAgentId);

    if (selectedAgent) {
        return <AgentInteractionShell 
                    agent={selectedAgent} 
                    onBack={() => setSelectedAgentId(null)}
                    onSelectAgent={handleSelectAgent}
                />
    }

    return (
        <div className="h-screen flex flex-col">
            <AppNav titleEn="BookTown" titleAr="بوكتاون" />
            <main ref={mainContentRef} className="flex-grow overflow-y-auto pt-20 pb-28">
                <div className="container mx-auto px-4 md:px-8 py-6">
                     <div className="flex items-center justify-center gap-2 mb-6 text-slate-500 dark:text-white/60">
                        <ClockIcon className="h-5 w-5"/>
                        <BilingualText role="Body">
                            {lang === 'en' ? 'Chat with bookwise AI agents.' : 'الدردشة مع وكلاء الذكاء الاصطناعي الحكماء.'}
                        </BilingualText>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {mockAgents.map(agent => (
                            <AgentGridCard
                                key={agent.id}
                                agent={agent}
                                onClick={() => handleSelectAgent(agent.id)}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DiscoverScreen;
