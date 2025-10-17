import React from 'react';
import { useNavigation } from '../../store/navigation';
import { useI18n } from '../../store/i18n';
import Button from '../../components/ui/Button';
import BilingualText from '../../components/ui/BilingualText';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon';
import { useBookCatalog } from '../../lib/hooks/useBookCatalog';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ReaderScreen: React.FC = () => {
    const { currentView, navigate } = useNavigation();
    const { lang, isRTL } = useI18n();

    const bookId = currentView.type === 'immersive' ? currentView.params?.bookId : undefined;
    const { data: book, isLoading } = useBookCatalog(bookId);

    const handleBack = () => {
        if (currentView.params?.from) {
            navigate(currentView.params.from);
        } else {
            navigate({ type: 'tab', id: 'read' });
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-900">
                <LoadingSpinner />
            </div>
        );
    }
    
    return (
        <div className="h-screen w-full flex flex-col bg-slate-900">
            <header className="fixed top-0 left-0 right-0 z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
                <div className={`container mx-auto flex h-20 items-center justify-between px-4 md:px-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                        <Button variant="ghost" onClick={handleBack} aria-label={lang === 'en' ? 'Back' : 'رجوع'}>
                            <ChevronLeftIcon className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="text-center">
                        <BilingualText role="Body" className="!font-semibold truncate">
                            {book ? (lang === 'en' ? book.titleEn : book.titleAr) : ''}
                        </BilingualText>
                        <BilingualText role="Caption" className="truncate">
                             {book ? (lang === 'en' ? book.authorEn : book.authorAr) : ''}
                        </BilingualText>
                    </div>

                    <div>{/* Right side for settings etc. */}</div>
                </div>
            </header>

            <main className="flex-grow pt-20 overflow-y-auto">
                <div className="container mx-auto p-4 md:p-8">
                    <BilingualText role="Body" className="text-lg leading-loose">
                        {lang === 'en' ? `This is a placeholder for the book content of "${book?.titleEn}". In a real application, this would be a paginated or scrollable view of the book's text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.` : `هذا هو محتوى نائب لكتاب "${book?.titleAr}". في تطبيق حقيقي ، سيكون هذا عرضًا مقسمًا إلى صفحات أو قابلًا للتمرير لنص الكتاب. لوريم إيبسوم دولار سيت أميت ، كونسيكتيتور أديبيسينج إليت ، سيد دو إيوسمود تيمبور إنسيديدونت أوت لابور إت دولور ماجنا أليكوا. أوت إنيم أد مينيم فينيام ، كويز نوسترود إكسيرسيتاتيون أولامكو لابوريس نيسي أوت أليكويب إكس إيا كومودو كونسيكوات. دويز أوت إيرور دولار إن ريبريهينديريت إن فولوبتات فيليت إيس سيليوم دولور إيو فوجيات نولا بارياتور. إكسسيبتور سينت أوكيكات كوبيداتات نون برويدنت ، سانت إن كولبا كوي أوفيسيا ديسيرونت مولليت أنيم إد إست لابوروم.`}
                    </BilingualText>
                </div>
            </main>
        </div>
    );
};

export default ReaderScreen;