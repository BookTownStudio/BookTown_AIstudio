import React, { useState, useMemo } from 'react';
import { useI18n } from '../../store/i18n.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import ScreenHeader from '../../components/navigation/ScreenHeader.tsx';
import { useNotifications, useMarkAllAsRead } from '../../lib/hooks/useNotifications.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import NotificationCard from '../../components/content/NotificationCard.tsx';
import Button from '../../components/ui/Button.tsx';
import { Notification } from '../../types/entities.ts';

type NotificationFilter = 'all' | 'mentions' | 'system';

const NotificationsFeedScreen: React.FC = () => {
    const { lang } = useI18n();
    const { navigate, currentView } = useNavigation();
    const [activeTab, setActiveTab] = useState<NotificationFilter>('all');
    const { data: notifications, isLoading, isError } = useNotifications();
    const { mutate: markAllAsRead } = useMarkAllAsRead();

    const handleBack = () => navigate(currentView.params?.from || { type: 'tab', id: 'home' });

    const filteredNotifications = useMemo(() => {
        if (!notifications) return [];
        switch (activeTab) {
            case 'mentions':
                return notifications.filter(n => n.type === 'social_like' || n.type === 'social_reply');
            case 'system':
                return notifications.filter(n => n.type === 'system_recommendation');
            case 'all':
            default:
                return notifications;
        }
    }, [notifications, activeTab]);

    const TABS: { id: NotificationFilter, en: string, ar: string }[] = [
        { id: 'all', en: 'All', ar: 'الكل' },
        { id: 'mentions', en: 'Mentions', ar: 'الإشارات' },
        { id: 'system', en: 'System', ar: 'النظام' },
    ];

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex-grow flex items-center justify-center"><LoadingSpinner /></div>;
        }
        if (isError) {
            return <div className="flex-grow flex items-center justify-center"><BilingualText>Error loading notifications.</BilingualText></div>;
        }
        if (filteredNotifications.length === 0) {
            return (
                <div className="flex-grow flex items-center justify-center text-center">
                    <BilingualText className="text-white/60">
                        {lang === 'en' ? 'All caught up! Check back later.' : 'أنت على اطلاع دائم! تحقق مرة أخرى لاحقًا.'}
                    </BilingualText>
                </div>
            );
        }
        return (
            <div className="divide-y divide-white/10">
                {filteredNotifications.map(notification => (
                    <NotificationCard key={notification.id} notification={notification} />
                ))}
            </div>
        );
    };

    return (
        <div className="h-screen flex flex-col">
            <ScreenHeader titleEn="Notifications" titleAr="الإشعارات" onBack={handleBack} />
            <main className="flex-grow overflow-y-auto pt-20">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="overflow-x-auto scrollbar-hide">
                            <div className="flex items-center border-b border-white/10">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-shrink-0 py-3 px-4 text-center font-semibold border-b-2 transition-colors ${activeTab === tab.id ? 'text-accent border-accent' : 'text-white/60 border-transparent hover:text-white'}`}
                                    >
                                        {lang === 'en' ? tab.en : tab.ar}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Button variant="ghost" className="!text-xs !text-accent flex-shrink-0" onClick={() => markAllAsRead()}>
                            {lang === 'en' ? 'Mark all as read' : 'تحديد الكل كمقروء'}
                        </Button>
                    </div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default NotificationsFeedScreen;