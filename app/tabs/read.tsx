import React, { useRef, useEffect } from 'react';
import AppNav from '../../components/navigation/AppNav';
import ShelfCarousel from '../../components/content/ShelfCarousel';
import { useI18n } from '../../store/i18n';
import { useUserShelves } from '../../lib/hooks/useUserShelves';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import BilingualText from '../../components/ui/BilingualText';
import { useNavigation } from '../../store/navigation';

const ReadScreen: React.FC = () => {
    const { lang } = useI18n();
    const { data: shelves, isLoading, isError } = useUserShelves();
    const { resetTokens } = useNavigation();
    const mainContentRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    // Tab Reset Effect
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (resetTokens.read > 0) {
                mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [resetTokens.read]);


    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex-grow flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            );
        }

        if (isError) {
            return (
                 <div className="flex-grow flex items-center justify-center">
                    <BilingualText>{lang === 'en' ? 'Error loading shelves.' : 'خطأ في تحميل الرفوف.'}</BilingualText>
                </div>
            );
        }

        return (
            <div ref={mainContentRef} className="flex-grow overflow-y-auto pt-20 pb-28">
                <div className="space-y-8 py-6">
                    {shelves?.map(shelf => (
                        <div key={shelf.id} className="container mx-auto px-4 md:px-8">
                            <ShelfCarousel shelf={shelf} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <AppNav titleEn="Read" titleAr="اقرأ" />
            {renderContent()}
        </div>
    );
};

export default ReadScreen;