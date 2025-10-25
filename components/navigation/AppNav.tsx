import React from 'react';
import Button from '../ui/Button.tsx';
import BilingualText from '../ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import { HamburgerIcon } from '../icons/HamburgerIcon.tsx';
import { BellIcon } from '../icons/BellIcon.tsx';
import { EmailIcon } from '../icons/EmailIcon.tsx';

interface AppNavProps {
    titleEn: string;
    titleAr: string;
}

const AppNav: React.FC<AppNavProps> = ({ titleEn, titleAr }) => {
  const { isRTL, lang } = useI18n();
  const { openDrawer, navigate, currentView } = useNavigation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 bg-gray-50/50 dark:bg-slate-900/50 backdrop-blur-lg border-b border-black/10 dark:border-white/10">
        <div className={`container mx-auto flex h-20 items-center justify-between px-4 md:px-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Left Section */}
            <div>
                <Button variant="icon" aria-label={lang === 'en' ? 'Open menu' : 'افتح القائمة'} onClick={openDrawer}>
                    <HamburgerIcon className="h-6 w-6" />
                </Button>
            </div>

            {/* Center Section */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <BilingualText role="H1" className="text-xl">
                    {lang === 'en' ? titleEn : titleAr}
                </BilingualText>
            </div>

            {/* Right Section */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="icon" aria-label={lang === 'en' ? 'Notifications' : 'الإشعارات'} onClick={() => navigate({ type: 'immersive', id: 'notificationsFeed', params: { from: currentView } })}>
                    <BellIcon className="h-6 w-6" />
                </Button>
                <Button variant="icon" aria-label={lang === 'en' ? 'Messages' : 'الرسائل'} onClick={() => navigate({ type: 'immersive', id: 'messengerList', params: { from: currentView } })}>
                    <EmailIcon className="h-6 w-6" />
                </Button>
            </div>
        </div>
    </nav>
  );
};

export default AppNav;