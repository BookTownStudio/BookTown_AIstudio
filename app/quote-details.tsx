import React from 'react';
import { useNavigation } from '../../store/navigation.tsx';
import { useI18n } from '../../store/i18n.tsx';
import Button from '../../components/ui/Button.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon.tsx';

const QuoteDetailsScreen: React.FC = () => {
    const { currentView, navigate } = useNavigation();
    const { lang } = useI18n();

    const handleBack = () => {
        if (currentView.params?.from) {
            navigate(currentView.params.from);
        } else {
            navigate({ type: 'tab', id: 'home' });
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-slate-900">
            <header className="fixed top-0 left-0 right-0 z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto flex h-20 items-center">
                    <Button variant="ghost" onClick={handleBack} aria-label={lang === 'en' ? 'Back' : 'رجوع'}>
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center pt-20 pb-8">
                <div className="container mx-auto p-4 md:p-8 text-center">
                    <BilingualText role="H1">
                        {lang === 'en' ? 'Quote Details' : 'تفاصيل الاقتباس'}
                    </BilingualText>
                    <BilingualText role="Body" className="mt-2 text-white/60">
                        {lang === 'en' ? 'This page will show details and discussions about the quote.' : 'ستعرض هذه الصفحة تفاصيل ومناقشات حول الاقتباس.'}
                    </BilingualText>
                </div>
            </main>
        </div>
    );
};

export default QuoteDetailsScreen;