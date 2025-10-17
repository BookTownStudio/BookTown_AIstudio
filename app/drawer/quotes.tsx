
import React from 'react';
import ScreenHeader from '../../components/navigation/ScreenHeader.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import { useQuotes } from '../../lib/hooks/useQuotes.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import QuotesList from '../../components/features/quotes/QuotesList.tsx';

const QuotesScreen: React.FC = () => {
    const { lang } = useI18n();
    const { navigate } = useNavigation();
    const { data: quotes, isLoading, isError } = useQuotes();

    const handleBack = () => navigate({ type: 'tab', id: 'home' });

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex-grow flex items-center justify-center h-full">
                    <LoadingSpinner />
                </div>
            );
        }

        if (isError || !quotes) {
            return (
                <div className="flex-grow flex items-center justify-center h-full">
                    <BilingualText>{lang === 'en' ? 'Error loading quotes.' : 'خطأ في تحميل الاقتباسات.'}</BilingualText>
                </div>
            );
        }

        return <QuotesList quotes={quotes} />;
    };

    return (
        <div className="h-screen flex flex-col">
            <ScreenHeader titleEn="Quotes" titleAr="الاقتباسات" onBack={handleBack} />
            <main className="flex-grow overflow-y-auto pt-20 pb-28">
                <div className="container mx-auto px-4 md:px-8 h-full">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default QuotesScreen;
