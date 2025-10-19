
import React, { useRef, useEffect, useState } from 'react';
import AppNav from '../../components/navigation/AppNav.tsx';
import ShelfCarousel from '../../components/content/ShelfCarousel.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useUserShelves } from '../../lib/hooks/useUserShelves.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import Fab from '../../components/ui/Fab.tsx';
import { PlusIcon } from '../../components/icons/PlusIcon.tsx';
import AddBookModal from '../../components/modals/AddBookModal.tsx';
import { useRecommendedShelves } from '../../lib/hooks/useRecommendedShelves.ts';
import RecommendedShelfCard from '../../components/content/RecommendedShelfCard.tsx';
import CreateShelfModal from '../../components/modals/CreateShelfModal.tsx';

const ReadScreen: React.FC = () => {
    const { lang } = useI18n();
    const { data: shelves, isLoading, isError } = useUserShelves();
    const { resetTokens } = useNavigation();
    const mainContentRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isCreateShelfModalOpen, setCreateShelfModalOpen] = useState(false);
    const [targetShelfId, setTargetShelfId] = useState<string | null>(null);
    const [openShelves, setOpenShelves] = useState<Record<string, boolean>>({});

    const { data: recommendedShelves, isLoading: isLoadingRecs, isError: isErrorRecs } = useRecommendedShelves();

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
    
    // Initialize openShelves state when shelves are loaded, defaulting them to collapsed.
    useEffect(() => {
        if (shelves) {
            const initialState = shelves.reduce((acc, shelf) => {
                // Keep existing state if it's there, otherwise default to false
                acc[shelf.id] = openShelves[shelf.id] ?? false;
                return acc;
            }, {} as Record<string, boolean>);
            setOpenShelves(initialState);
        }
    }, [shelves]);

    const handleOpenAddBookModal = (shelfId: string) => {
        setTargetShelfId(shelfId);
        setAddModalOpen(true);
    };
    
    const handleCloseAddBookModal = () => {
        setTargetShelfId(null);
        setAddModalOpen(false);
    };

    const toggleShelf = (shelfId: string) => {
        setOpenShelves(prev => ({ ...prev, [shelfId]: !prev[shelfId] }));
    };

    const bookCount = shelves?.reduce((acc, shelf) => acc + Object.keys(shelf.entries || {}).length, 0) || 0;
    const shelfCount = shelves?.length || 0;

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
            <main ref={mainContentRef} className="flex-grow overflow-y-auto pt-20 pb-28">
                <div className="container mx-auto px-4 md:px-8 py-4">
                    <header className="mb-6">
                        <BilingualText role="H1" className="!text-3xl">
                            {lang === 'en' ? 'Your Library' : 'مكتبتك'}
                        </BilingualText>
                        <BilingualText role="Caption" className="mt-1">
                            {lang === 'en' 
                                ? `${bookCount} books on ${shelfCount} shelves`
                                : `${bookCount} كتابًا على ${shelfCount} رفوف`}
                        </BilingualText>
                    </header>

                    <div className="space-y-2">
                        {shelves?.map(shelf => (
                            <ShelfCarousel 
                                key={shelf.id}
                                shelf={shelf} 
                                onAddBookRequest={handleOpenAddBookModal} 
                                isOpen={openShelves[shelf.id] ?? false}
                                onToggle={() => toggleShelf(shelf.id)}
                            />
                        ))}
                    </div>

                    <section className="mt-12 border-t border-black/10 dark:border-white/10 pt-8">
                        <BilingualText role="H1" className="!text-xl mb-4">
                            {lang === 'en' ? 'Shelf Recommendations to Follow' : 'توصيات رفوف للمتابعة'}
                        </BilingualText>
                        {isLoadingRecs && <div className="flex justify-center py-4"><LoadingSpinner /></div>}
                        {!isLoadingRecs && !isErrorRecs && recommendedShelves && (
                            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                                {recommendedShelves.map(shelf => (
                                    <RecommendedShelfCard key={shelf.id} shelf={shelf} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        );
    }

    return (
        <>
            <div className="h-screen flex flex-col">
                <AppNav titleEn="BookTown" titleAr="بوكتاون" />
                {renderContent()}
                <Fab onClick={() => setCreateShelfModalOpen(true)} aria-label={lang === 'en' ? 'Create Shelf' : 'إنشاء رف'}>
                    <PlusIcon className="h-8 w-8" />
                </Fab>
            </div>
            <AddBookModal 
                isOpen={isAddModalOpen}
                onClose={handleCloseAddBookModal}
                targetShelfId={targetShelfId}
            />
            <CreateShelfModal
                isOpen={isCreateShelfModalOpen}
                onClose={() => setCreateShelfModalOpen(false)}
            />
        </>
    );
};

export default ReadScreen;
