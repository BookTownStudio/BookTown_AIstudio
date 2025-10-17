
import React from 'react';
import ScreenHeader from '../../components/navigation/ScreenHeader.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useNavigation } from '../../store/navigation.tsx';

const BookmarksScreen: React.FC = () => {
    const { lang } = useI18n();
    const { navigate } = useNavigation();

    const handleBack = () => navigate({ type: 'tab', id: 'home' });

    return (
        <div className="h-screen flex flex-col">
            <ScreenHeader titleEn="Bookmarks" titleAr="العلامات المرجعية" onBack={handleBack} />
            <main className="flex-grow overflow-y-auto pt-24 pb-28">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <BilingualText role="Body" className="text-white/60">
                        {lang === 'en' ? 'Your bookmarked items will be displayed here.' : 'سيتم عرض العناصر التي وضعتها في المرجعية هنا.'}
                    </BilingualText>
                </div>
            </main>
        </div>
    );
};

export default BookmarksScreen;
