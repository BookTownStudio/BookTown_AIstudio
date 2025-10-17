
import React from 'react';
// FIX: Add file extensions to imports
import { useNavigation } from '../../store/navigation.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useTheme } from '../../store/theme.tsx';
import Button from '../ui/Button.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import { UserIcon } from '../icons/UserIcon.tsx';
import { BookmarkIcon } from '../icons/BookmarkIcon.tsx';
import { QuoteIcon } from '../icons/QuoteIcon.tsx';
import { SettingsIcon } from '../icons/SettingsIcon.tsx';
import { MoonIcon } from '../icons/MoonIcon.tsx';
import { DrawerScreenName } from '../../types/navigation.ts';
import { useAuth } from '../../lib/auth.tsx';
import { useUserProfile } from '../../lib/hooks/useUserProfile.ts';
import { AuthorsIcon } from '../icons/AuthorsIcon.tsx';
import { VenuesIcon } from '../icons/VenuesIcon.tsx';
import { FeedbackIcon } from '../icons/FeedbackIcon.tsx';
import { EmailIcon } from '../icons/EmailIcon.tsx';
import { AdminIcon } from '../icons/AdminIcon.tsx';
import { LogoutIcon } from '../icons/LogoutIcon.tsx';


const Drawer: React.FC = () => {
    const { isDrawerOpen, closeDrawer, navigate, currentView } = useNavigation();
    const { isRTL, lang } = useI18n();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { data: profile } = useUserProfile(user?.uid);

    const handleNavigate = (id: DrawerScreenName) => {
        navigate({ type: 'drawer', id });
    };

    const MAIN_ITEMS: { id: DrawerScreenName; en: string; ar: string; icon: React.FC<any>; }[] = [
        { id: 'profile', en: 'Profile', ar: 'الملف الشخصي', icon: UserIcon },
        { id: 'bookmarks', en: 'Bookmarks', ar: 'العلامات المرجعية', icon: BookmarkIcon },
        { id: 'quotes', en: 'Quotes', ar: 'الاقتباسات', icon: QuoteIcon },
        { id: 'authors', en: 'Authors', ar: 'المؤلفون', icon: AuthorsIcon },
        { id: 'venues', en: 'Venues', ar: 'الأماكن', icon: VenuesIcon },
    ];

    const SETTINGS_ITEMS: { id: DrawerScreenName; en: string; ar: string; icon: React.FC<any>; adminOnly?: boolean }[] = [
        { id: 'settings', en: 'Settings', ar: 'الإعدادات', icon: SettingsIcon },
        { id: 'adminDashboard', en: 'Admin Dashboard', ar: 'لوحة التحكم', icon: AdminIcon, adminOnly: true },
    ];

    const renderList = (items: typeof MAIN_ITEMS | typeof SETTINGS_ITEMS) => (
         <ul className="space-y-1">
            {items.flatMap(item => {
                 if ('adminOnly' in item && item.adminOnly && !(profile?.role === 'admin' || profile?.role === 'superuser')) {
                    return [];
                }
                const isActive = currentView.type === 'drawer' && currentView.id === item.id;
                
                const menuItem = (
                    <li key={item.id}>
                        <Button
                            variant="ghost"
                            className={`w-full !justify-start !text-inherit !font-normal !px-3 ${isRTL ? '!flex-row-reverse' : ''} ${isActive ? 'bg-accent/20' : ''}`}
                            onClick={() => handleNavigate(item.id)}
                        >
                            <item.icon className={`h-6 w-6 ${isRTL ? 'ml-4' : 'mr-4'}`} />
                            {lang === 'en' ? item.en : item.ar}
                        </Button>
                    </li>
                );

                if (item.id === 'profile' && items === MAIN_ITEMS) {
                    const separator = (
                        <li key="profile-separator" className="py-1" aria-hidden="true">
                            <div className="border-t border-black/10 dark:border-white/10" />
                        </li>
                    );
                    return [menuItem, separator];
                }

                return [menuItem];
            })}
        </ul>
    );

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeDrawer}
            />

            {/* Drawer Panel */}
            <div className={`
                fixed top-0 bottom-0 z-40 w-80 max-w-[85vw] 
                bg-gray-100/80 dark:bg-slate-800/50 backdrop-blur-xl border-black/10 dark:border-white/10
                transition-transform duration-300 ease-in-out
                flex flex-col
                ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}
                ${isDrawerOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
            `}>
                <button
                    className={`w-full p-4 text-left transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5`}
                    onClick={() => handleNavigate('profile')}
                    aria-label={lang === 'en' ? 'View Profile' : 'عرض الملف الشخصي'}
                >
                   {profile ? (
                     <div className="flex items-center gap-3">
                        <img src={profile.avatarUrl} alt="User Avatar" className="h-12 w-12 rounded-full" />
                        <div>
                            <BilingualText className="font-bold">{profile.name}</BilingualText>
                            <BilingualText role="Caption">{profile.email}</BilingualText>
                             <div className={`flex items-center gap-4 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <BilingualText role="Caption">
                                    <span className="font-bold text-slate-800 dark:text-white">{profile.following}</span> {lang === 'en' ? 'Following' : 'يتابع'}
                                </BilingualText>
                                <BilingualText role="Caption">
                                     <span className="font-bold text-slate-800 dark:text-white">{profile.followers}</span> {lang === 'en' ? 'Followers' : 'متابعون'}
                                </BilingualText>
                            </div>
                        </div>
                     </div>
                   ) : (
                    <div className="h-[68px]"></div> // Placeholder for loading state
                   )}
                </button>
                
                <div className="flex-grow overflow-y-auto px-4 pt-2">
                    <nav>{renderList(MAIN_ITEMS)}</nav>

                    <div className="my-2 border-t border-black/10 dark:border-white/10"></div>
                    
                    <div className="space-y-1">
                        {/* Dark Mode Toggle */}
                        <div className={`flex items-center justify-between px-3 py-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <MoonIcon className={`h-6 w-6 text-slate-600 dark:text-white/80 ${isRTL ? 'ml-4' : 'mr-4'}`} />
                                <BilingualText role="Body">{lang === 'en' ? 'Dark Mode' : 'الوضع الداكن'}</BilingualText>
                            </div>
                            <label htmlFor="dark-mode-toggle" className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="dark-mode-toggle" 
                                    className="sr-only peer"
                                    checked={theme === 'dark'}
                                    onChange={toggleTheme}
                                />
                                <div className="w-11 h-6 bg-slate-400 dark:bg-slate-600 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        {/* Feedback Button */}
                        <Button
                            variant="ghost"
                            className={`w-full !justify-start !text-inherit !font-normal !px-3 ${isRTL ? '!flex-row-reverse' : ''} ${currentView.type === 'drawer' && currentView.id === 'feedback' ? 'bg-accent/20' : ''}`}
                            onClick={() => handleNavigate('feedback')}
                        >
                            <FeedbackIcon className={`h-6 w-6 ${isRTL ? 'ml-4' : 'mr-4'}`} />
                            {lang === 'en' ? 'Feedback' : 'ملاحظات'}
                        </Button>
                    </div>

                    <div className="my-2 border-t border-black/10 dark:border-white/10"></div>

                    <nav>{renderList(SETTINGS_ITEMS)}</nav>
                </div>
                
                <div className="p-4 border-t border-black/10 dark:border-white/10">
                    <Button variant="ghost" onClick={logout} className={`w-full !justify-start !text-inherit !font-normal !px-3 ${isRTL ? '!flex-row-reverse' : ''}`}>
                        <LogoutIcon className={`h-6 w-6 ${isRTL ? 'ml-4' : 'mr-4'}`} />
                        {lang === 'en' ? 'Sign Out' : 'تسجيل الخروج'}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Drawer;
