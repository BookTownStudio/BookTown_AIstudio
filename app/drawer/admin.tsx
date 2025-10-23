
import React, { useState } from 'react';
import ScreenHeader from '../../components/navigation/ScreenHeader.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import { UsersIcon } from '../../components/icons/UsersIcon.tsx';
import { BookIcon } from '../../components/icons/BookIcon.tsx';
import { AnalyticsIcon } from '../../components/icons/AnalyticsIcon.tsx';
import { FeedbackIcon } from '../../components/icons/FeedbackIcon.tsx';
import InputField from '../../components/ui/InputField.tsx';
import Button from '../../components/ui/Button.tsx';
import GlassCard from '../../components/ui/GlassCard.tsx';

type AdminTab = 'users' | 'content' | 'analytics' | 'feedback';

const mockUsers = [
    { id: 'u1', name: 'Jane Smith', handle: '@janesmith', email: 'jane@example.com', role: 'user', reports: 0 },
    { id: 'u2', name: 'Sam Jones', handle: '@samjones', email: 'sam@example.com', role: 'user', reports: 2 },
];

const mockContent = [
    { id: 'c1', type: 'Review', author: '@janesmith', content: 'This book was absolutely stunning, but the ending felt a bit rushed. I would still recommend it for fans of the genre.' },
    { id: 'c2', type: 'Post', author: '@samjones', content: 'Just discovered the works of Frank Herbert. Mind blown! #Dune' },
];

const mockFeedback = [
    { id: 'f1', type: 'Bug', user: '@janesmith', text: 'The app crashes when I try to open a book from the discovery feed on my device.' },
    { id: 'f2', type: 'Suggestion', user: '@samjones', text: 'It would be great if we could have collaborative shelves for book clubs!' },
];

// --- User Management Tab ---
const UsersTab: React.FC = () => {
    const { lang } = useI18n();
    return (
        <div className="space-y-4">
            <InputField id="user-search" label="" type="search" placeholder={lang === 'en' ? 'Search users by name, email, or handle...' : 'ابحث عن المستخدمين...'} />
            <div className="space-y-2">
                {mockUsers.map(user => (
                    <GlassCard key={user.id} className="!p-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-grow">
                                <p className="font-bold">{user.name} <span className="font-normal text-slate-400">{user.handle}</span></p>
                                <p className="text-sm text-slate-500">{user.email}</p>
                                <p className="text-sm">Role: <span className="font-semibold text-accent">{user.role}</span> | Reports: <span className={`font-semibold ${user.reports > 0 ? 'text-red-400' : 'text-green-400'}`}>{user.reports}</span></p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Button variant="ghost" className="!text-xs">Assign Role</Button>
                                <Button variant="ghost" className="!text-xs !text-red-400">Suspend</Button>
                                <Button variant="ghost" className="!text-xs">Reports</Button>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

// --- Content Moderation Tab ---
const ContentTab: React.FC = () => {
    return (
        <div className="space-y-6">
            <section>
                <BilingualText role="H1" className="!text-lg mb-2">Moderation Queue</BilingualText>
                <div className="space-y-2">
                    {mockContent.map(item => (
                        <GlassCard key={item.id} className="!p-3">
                            <p className="text-xs text-slate-400">{item.type} by {item.author}</p>
                            <p className="mt-1 line-clamp-2">"{item.content}"</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Button variant="ghost" className="!text-xs !text-green-400">Approve</Button>
                                <Button variant="ghost" className="!text-xs !text-red-400">Reject</Button>
                                <Button variant="ghost" className="!text-xs">Feature</Button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </section>
            <section>
                 <BilingualText role="H1" className="!text-lg mb-2">Edit Book Metadata</BilingualText>
                 <GlassCard className="!p-4">
                     <div className="flex items-end gap-2">
                        <InputField id="book-id-lookup" label="Book ID" type="text" placeholder="Enter Book ID to edit..." className="flex-grow"/>
                        <Button variant="primary">Fetch</Button>
                     </div>
                 </GlassCard>
            </section>
        </div>
    );
};

// --- Analytics Tab ---
const AnalyticsTab: React.FC = () => {
    const MetricCard: React.FC<{ title: string; value: string; change?: string; }> = ({ title, value, change }) => (
        <GlassCard>
            <BilingualText role="Caption" className="!text-slate-400">{title}</BilingualText>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {change && <p className="text-sm text-green-400">{change}</p>}
        </GlassCard>
    );

    const ChartPlaceholder: React.FC<{ title: string }> = ({ title }) => (
        <GlassCard className="h-64 flex flex-col">
            <BilingualText className="font-semibold">{title}</BilingualText>
            <div className="flex-grow flex items-center justify-center text-slate-500">
                Chart Placeholder
            </div>
        </GlassCard>
    );
    
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Daily Active Users (DAU)" value="1.2K" change="+5.2%" />
                <MetricCard title="Weekly Active Users (WAU)" value="5.8K" change="+3.1%" />
                <MetricCard title="Monthly Active Users (MAU)" value="15.1K" change="+1.8%" />
                <MetricCard title="Retention (Week 1)" value="45%" change="-0.5%" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartPlaceholder title="User Growth Over Time" />
                <ChartPlaceholder title="Content Engagement by Type" />
            </div>
        </div>
    );
};

// --- Feedback Triage Tab ---
const FeedbackTab: React.FC = () => {
    const [selectedFeedback, setSelectedFeedback] = useState<(typeof mockFeedback[0]) | null>(null);
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-4">
                <div className="flex items-center gap-2">
                    <Button variant="primary" className="!text-xs flex-1">All</Button>
                    <Button variant="ghost" className="!text-xs flex-1">Bug</Button>
                    <Button variant="ghost" className="!text-xs flex-1">Suggestion</Button>
                </div>
                <div className="space-y-2">
                    {mockFeedback.map(item => (
                        <button key={item.id} onClick={() => setSelectedFeedback(item)} className="w-full text-left">
                            <GlassCard className={`!p-3 ${selectedFeedback?.id === item.id ? 'border-accent' : ''}`}>
                                <p className="text-xs font-semibold text-accent">{item.type} <span className="font-normal text-slate-400">from {item.user}</span></p>
                                <p className="mt-1 line-clamp-2 text-sm">{item.text}</p>
                            </GlassCard>
                        </button>
                    ))}
                </div>
            </div>
            <div className="md:col-span-2">
                {selectedFeedback ? (
                    <GlassCard className="!p-4">
                        <BilingualText role="H1" className="!text-lg">Feedback Details</BilingualText>
                        <p className="mt-2 text-sm text-slate-400">From: {selectedFeedback.user}</p>
                        <p className="mt-4">{selectedFeedback.text}</p>
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                            <BilingualText role="Caption">Actions</BilingualText>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button variant="ghost" className="!text-xs">Tag: Investigating</Button>
                                <Button variant="ghost" className="!text-xs">Tag: Feature Request</Button>
                                <Button variant="ghost" className="!text-xs">Assign: Dev Team</Button>
                            </div>
                        </div>
                    </GlassCard>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-500">
                        <BilingualText>Select a feedback item to view details.</BilingualText>
                    </div>
                )}
            </div>
        </div>
    );
};


const AdminDashboardScreen: React.FC = () => {
    const { lang } = useI18n();
    const { navigate } = useNavigation();
    const [activeTab, setActiveTab] = useState<AdminTab>('users');

    const handleBack = () => navigate({ type: 'tab', id: 'home' });

    const TABS = [
        { id: 'users', en: 'Users', ar: 'المستخدمون', icon: UsersIcon },
        { id: 'content', en: 'Content', ar: 'المحتوى', icon: BookIcon },
        { id: 'analytics', en: 'Analytics', ar: 'التحليلات', icon: AnalyticsIcon },
        { id: 'feedback', en: 'Feedback', ar: 'الملاحظات', icon: FeedbackIcon },
    ];

    return (
        <div className="h-screen flex flex-col">
            <ScreenHeader titleEn="Admin Dashboard" titleAr="لوحة التحكم" onBack={handleBack} />
            <main className="flex-grow overflow-y-auto pt-20 pb-8">
                <div className="container mx-auto px-4 md:px-8 h-full">
                    {/* Tab Navigation */}
                    <div className="mb-4 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center border-b border-white/10">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as AdminTab)}
                                    className={`flex-shrink-0 flex items-center gap-2 py-3 px-4 text-center font-semibold border-b-2 transition-colors ${activeTab === tab.id ? 'text-accent border-accent' : 'text-white/60 border-transparent hover:text-white'}`}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    {lang === 'en' ? tab.en : tab.ar}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-4">
                        {activeTab === 'users' && <UsersTab />}
                        {activeTab === 'content' && <ContentTab />}
                        {activeTab === 'analytics' && <AnalyticsTab />}
                        {activeTab === 'feedback' && <FeedbackTab />}
                    </div>
                </div>
            </main>
        </div>
    );
};
export default AdminDashboardScreen;
