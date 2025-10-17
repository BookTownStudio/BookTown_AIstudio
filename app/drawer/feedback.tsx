
import React from 'react';
import ScreenHeader from '../../components/navigation/ScreenHeader.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useNavigation } from '../../store/navigation.tsx';

const FeedbackScreen: React.FC = () => {
    const { lang } = useI18n();
    const { navigate } = useNavigation();
    const handleBack = () => navigate({ type: 'tab', id: 'home' });

    return (
        <div className="h-screen flex flex-col">
            <ScreenHeader titleEn="Feedback" titleAr="ملاحظات" onBack={handleBack} />
            <main className="flex-grow overflow-y-auto pt-24 pb-28">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <BilingualText role="Body" className="text-white/60">
                        {lang === 'en' ? 'Feedback form will be here.' : 'سيكون نموذج الملاحظات هنا.'}
                    </BilingualText>
                </div>
            </main>
        </div>
    );
};
export default FeedbackScreen;
