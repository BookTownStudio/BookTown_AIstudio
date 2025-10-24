import React, { useRef } from 'react';
import ScreenHeader from '../../components/navigation/ScreenHeader.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import { useTheme } from '../../store/theme.tsx';
import { useReadingPreferences, FontSize, FontStyle } from '../../store/reading-prefs.tsx';
import Button from '../../components/ui/Button.tsx';
import { useAuth } from '../../lib/auth.tsx';
import { useUserProfile } from '../../lib/hooks/useUserProfile.ts';
import { useUpdateAiConsent } from '../../lib/hooks/useUpdateAiConsent.ts';

// Icons
import { UploadIcon } from '../../components/icons/UploadIcon.tsx';
import { DownloadIcon } from '../../components/icons/DownloadIcon.tsx';
import { TrashIcon } from '../../components/icons/TrashIcon.tsx';
import { MoonIcon } from '../../components/icons/MoonIcon.tsx';
import { FontSizeIcon } from '../../components/icons/FontSizeIcon.tsx';
import { FontIcon } from '../../components/icons/FontIcon.tsx';
import { LanguageIcon } from '../../components/icons/LanguageIcon.tsx';
import { UserIcon } from '../../components/icons/UserIcon.tsx';
import { SecurityIcon } from '../../components/icons/SecurityIcon.tsx';
import { ChevronRightIcon } from '../../components/icons/ChevronRightIcon.tsx';
import { BrainIcon } from '../../components/icons/BrainIcon.tsx';

const SettingsSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <BilingualText role="Caption" className="!text-accent uppercase tracking-wider mb-2 px-4">{title}</BilingualText>
        <div className="bg-slate-800/50 border border-white/10 rounded-lg">
            {React.Children.map(children, (child, index) => (
                <>
                    {child}
                    {index < React.Children.count(children) - 1 && <div className="border-t border-white/10 mx-4" />}
                </>
            ))}
        </div>
    </div>
);

const SettingsItem: React.FC<{ icon: React.FC<any>, label: string, onClick?: () => void, children?: React.ReactNode, isDestructive?: boolean }> = ({ icon: Icon, label, onClick, children, isDestructive = false }) => {
    const { isRTL } = useI18n();
    const content = (
        <div className={`flex items-center justify-between w-full p-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Icon className={`h-6 w-6 flex-shrink-0 ${isDestructive ? 'text-red-400' : 'text-accent'}`} />
                <BilingualText className={`flex-grow ${isDestructive ? '!text-red-400' : ''}`}>{label}</BilingualText>
            </div>
            {children ? children : (onClick && <ChevronRightIcon className="h-5 w-5 text-white/50 flex-shrink-0" />)}
        </div>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className="w-full text-left transition-colors hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg">
                {content}
            </button>
        );
    }
    return <div className="w-full">{content}</div>;
};

// Segmented Control Component
interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="flex items-center bg-slate-700 rounded-lg p-1 text-sm">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-2 py-1 font-semibold rounded-md transition-colors w-full ${value === option.value ? 'bg-slate-500 text-white' : 'text-white/70 hover:bg-slate-600'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

const SettingsScreen: React.FC = () => {
    // Hooks
    const { lang, setLang } = useI18n();
    const { navigate } = useNavigation();
    const { theme, toggleTheme } = useTheme();
    const { fontSize, setFontSize, fontStyle, setFontStyle } = useReadingPreferences();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    const { data: profile } = useUserProfile(user?.uid);
    const { mutate: updateAiConsent } = useUpdateAiConsent();

    // Handlers
    const handleBack = () => navigate({ type: 'tab', id: 'home' });
    const handleImportClick = () => fileInputRef.current?.click();
    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log(`[Mock Import] Importing file: ${e.target.files[0].name}`);
            alert('Goodreads data import started. (Mock)');
        }
    };
    const handleExport = () => alert('Downloading all your data. (Mock)');
    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            console.log('[Mock Delete] Account deletion initiated.');
            alert('Account deletion initiated. (Mock)');
        }
    };
    const handleAiConsentToggle = () => {
        updateAiConsent(!profile?.aiConsent);
    }


    return (
        <div className="h-screen flex flex-col">
            <ScreenHeader titleEn="Settings" titleAr="الإعدادات" onBack={handleBack} />
            <main className="flex-grow overflow-y-auto pt-24 pb-28">
                <div className="container mx-auto px-4 md:px-8">
                
                    <SettingsSection title={lang === 'en' ? 'Data & Privacy' : 'البيانات والخصوصية'}>
                        <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".csv" className="hidden" />
                        <SettingsItem icon={UploadIcon} label={lang === 'en' ? 'Import Reading History' : 'استيراد سجل القراءة'} onClick={handleImportClick} />
                        <SettingsItem icon={DownloadIcon} label={lang === 'en' ? 'Download All Data' : 'تنزيل كل البيانات'} onClick={handleExport} />
                        <SettingsItem icon={BrainIcon} label={lang === 'en' ? 'AI/MatchMaker Data Usage' : 'استخدام بيانات الذكاء الاصطناعي'}>
                            <label htmlFor="ai-consent-toggle" className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="ai-consent-toggle" 
                                    className="sr-only peer"
                                    checked={!!profile?.aiConsent}
                                    onChange={handleAiConsentToggle}
                                />
                                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/50 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </SettingsItem>
                    </SettingsSection>

                    <SettingsSection title={lang === 'en' ? 'General Preferences' : 'التفضيلات العامة'}>
                        <SettingsItem icon={MoonIcon} label={lang === 'en' ? 'Dark Mode' : 'الوضع الداكن'}>
                            <label htmlFor="dark-mode-toggle" className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="dark-mode-toggle" className="sr-only peer" checked={theme === 'dark'} onChange={toggleTheme} />
                                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/50 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </SettingsItem>
                        <SettingsItem icon={FontSizeIcon} label={lang === 'en' ? 'Font Size' : 'حجم الخط'}>
                           <div className="w-32"><SegmentedControl<FontSize>
                                options={[{value: 'sm', label: 'S'}, {value: 'md', label: 'M'}, {value: 'lg', label: 'L'}]}
                                value={fontSize}
                                onChange={setFontSize}
                            /></div>
                        </SettingsItem>
                        <SettingsItem icon={FontIcon} label={lang === 'en' ? 'Font Style' : 'نمط الخط'}>
                            <div className="w-48"><SegmentedControl<FontStyle>
                                options={[{value: 'default', label: 'Default'}, {value: 'dyslexic', label: 'Dyslexic'}]}
                                value={fontStyle}
                                onChange={setFontStyle}
                            /></div>
                        </SettingsItem>
                        <SettingsItem icon={LanguageIcon} label={lang === 'en' ? 'Language' : 'اللغة'}>
                             <div className="w-48"><SegmentedControl<'en' | 'ar'>
                                options={[{value: 'en', label: 'English'}, {value: 'ar', label: 'العربية'}]}
                                value={lang}
                                onChange={setLang}
                            /></div>
                        </SettingsItem>
                    </SettingsSection>

                    <SettingsSection title={lang === 'en' ? 'Account & Security' : 'الحساب والأمان'}>
                        <SettingsItem icon={UserIcon} label={lang === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'} onClick={() => navigate({ type: 'drawer', id: 'profile' })} />
                        <SettingsItem icon={SecurityIcon} label={lang === 'en' ? 'Change Password' : 'تغيير كلمة المرور'} onClick={() => alert('Change password flow (Mock)')} />
                    </SettingsSection>

                    <SettingsSection title={lang === 'en' ? 'Danger Zone' : 'منطقة الخطر'}>
                        <SettingsItem icon={TrashIcon} label={lang === 'en' ? 'Delete Account' : 'حذف الحساب'} onClick={handleDeleteAccount} isDestructive />
                    </SettingsSection>
                </div>
            </main>
        </div>
    );
};

export default SettingsScreen;