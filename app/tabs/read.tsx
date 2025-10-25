import React, { useRef, useEffect, useState, useMemo } from 'react';
import AppNav from '../../components/navigation/AppNav.tsx';
import ShelfCarousel from '../../components/content/ShelfCarousel.tsx';
import { useI18n } from '../../store/i18n.tsx';
import { useUserShelves } from '../../lib/hooks/useUserShelves.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import { PlusIcon } from '../../components/icons/PlusIcon.tsx';
import AddBookModal from '../../components/modals/AddBookModal.tsx';
import { useRecommendedShelves } from '../../lib/hooks/useRecommendedShelves.ts';
import RecommendedShelfCard from '../../components/content/RecommendedShelfCard.tsx';
import CreateShelfModal from '../../components/modals/CreateShelfModal.tsx';
import FloatingActionPanel from '../../components/ui/FloatingActionPanel.tsx';
import { ShelvesIcon } from '../../components/icons/ShelvesIcon.tsx';
import EditShelfModal from '../../components/modals/EditShelfModal.tsx';
import { Shelf } from '../../types/entities.ts';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal.tsx';
import { useDeleteShelf } from '../../lib/hooks/useDeleteShelf.ts';
import Button from '../../components/ui/Button.tsx';

const MANDATORY_SHELVES = ['currently-reading', 'want-to-read', 'finished'];

interface RecommendationsPanelProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ isOpen, onOpen, onClose }) => {
    const { lang } = useI18n();
    const { data: recommendedShelves, isLoading: isLoadingRecs, isError: isErrorRecs } = useRecommendedShelves();

    return (
        <>
            <div
                className="fixed bottom-[82px] left-0 right-0 z-20 flex justify-center pointer-events-none"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                <button
                    onClick={onOpen}
                    className="
                        flex items-center gap-2 px-6 py-3
                        bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-md 
                        shadow-xl shadow-primary/10 dark:shadow-black/40 
                        border border-black/5 dark:border-white/10 
                        text-slate-800 dark:text-white 
                        pointer-events-auto 
                        transition-all duration-300 ease-in-out
                        hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20
                        active:scale-100
                        rounded-full"
                    aria-label={lang === 'en' ? 'Open More Shelves' : 'فتح المزيد من الرفوف'}
                >
                    <ShelvesIcon className="h-5 w-5 text-accent" />
                    <BilingualText className="font-bold text-lg">
                        {lang === 'en' ? 'More Shelves' : 'المزيد من الرفوف'}
                    </BilingualText>
                </button>
            </div>
            <FloatingActionPanel isOpen={isOpen} onClose={onClose}>
                <div>
                    <BilingualText role="H1" className="!text-xl mb-2 px-4 pt-2">
                        {lang === 'en' ? 'More Shelves to Follow' : 'رفوف إضافية للمتابعة'}
                    </BilingualText>
                    {isLoadingRecs && <div className="flex justify-center py-4"><LoadingSpinner /></div>}
                    {!isLoadingRecs && !isErrorRecs && recommendedShelves && (
                        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                            {recommendedShelves.map(shelf => (
                                <RecommendedShelfCard key={shelf.id} shelf={shelf} />
                            ))}
                        </div>
                    )}
                     {isErrorRecs && (
                        <div className="px-4 py-4">
                            <BilingualText role="Caption" className="text-center">
                                {lang === 'en' ? 'Could not load recommendations.' : 'تعذر تحميل التوصيات.'}
                            </BilingualText>
                        </div>
                    )}
                </div>
            </FloatingActionPanel>
        </>
    );
};


const ReadScreen: React.FC = () => {
    const { lang } = useI18n();
    const { data: shelves, isLoading, isError } = useUserShelves();
    const { navigate, currentView, resetTokens } = useNavigation();
    const mainContentRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isCreateShelfModalOpen, setCreateShelfModalOpen] = useState(false);
    const [targetShelfId, setTargetShelfId] = useState<string | null>(null);
    const [openShelves, setOpenShelves] = useState<Record<string, boolean>>({});
    const [isRecPanelOpen, setRecPanelOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [shelfToEdit, setShelfToEdit] = useState<Shelf | null>(null);
    const [shelfLayouts, setShelfLayouts] = useState<Record<string, 'carousel' | 'list'>>(() => {
        try {
            const item = window.localStorage.getItem('booktown-shelf-layouts');
            return item ? JSON.parse(item) : {};
        } catch (error) {
            console.error("Error reading layouts from localStorage", error);
            return {};
        }
    });
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [shelfToDelete, setShelfToDelete] = useState<Shelf | null>(null);
    const { mutate: deleteShelf, isLoading: isDeleting } = useDeleteShelf();

    useEffect(() => {
        try {
            window.localStorage.setItem('booktown-shelf-layouts', JSON.stringify(shelfLayouts));
        } catch (error) {
            console.error("Error writing layouts to localStorage", error);
        }
    }, [shelfLayouts]);


    // Tab Reset Effect
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (resetTokens.read > 0) {
                mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                setRecPanelOpen(false);
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

    const handleOpenEditModal = (shelf: Shelf) => {
        setShelfToEdit(shelf);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setShelfToEdit(null);
        setEditModalOpen(false);
    };

    const handleOpenDeleteModal = (shelf: Shelf) => {
        setShelfToDelete(shelf);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setShelfToDelete(null);
        setDeleteModalOpen(false);
    };

    const handleConfirmDelete = () => {
        if (shelfToDelete) {
            deleteShelf(shelfToDelete.id, {
                onSuccess: handleCloseDeleteModal
            });
        }
    };

    const toggleShelf = (shelfId: string) => {
        setOpenShelves(prev => ({ ...prev, [shelfId]: !prev[shelfId] }));
    };
    
    const toggleLayout = (shelfId: string) => {
        setShelfLayouts(prev => ({
            ...prev,
            [shelfId]: prev[shelfId] === 'list' ? 'carousel' : 'list'
        }));
    };

    const handleShareRequest = (shelf: Shelf) => {
        navigate({
            type: 'immersive',
            id: 'postComposer',
            params: { from: currentView, attachment: { type: 'shelf', id: shelf.id, ownerId: shelf.ownerId } }
        });
    };

    const sortedShelves = useMemo(() => {
        if (!shelves) return [];
        return [...shelves].sort((a, b) => {
            const aIndex = MANDATORY_SHELVES.indexOf(a.id);
            const bIndex = MANDATORY_SHELVES.indexOf(b.id);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return a.titleEn.localeCompare(b.titleEn);
        });
    }, [shelves]);

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
            <main ref={mainContentRef} className="flex-grow overflow-y-auto pt-20 pb-36">
                <div className="container mx-auto px-4 md:px-8 py-4">
                    <header className="mb-6 flex items-center justify-between">
                        <div>
                            <BilingualText role="H1" className="!text-2xl !font-semibold">
                                {lang === 'en' ? 'Your Library' : 'مكتبتك'}
                            </BilingualText>
                            <BilingualText role="Caption" className="mt-1">
                                {lang === 'en' 
                                    ? `${bookCount} books on ${shelfCount} shelves`
                                    : `${bookCount} كتابًا على ${shelfCount} رفوف`}
                            </BilingualText>
                        </div>
                        <Button variant="primary" onClick={() => setCreateShelfModalOpen(true)}>
                            <PlusIcon className="h-5 w-5 sm:mr-2" />
                            <span className="hidden sm:inline">{lang === 'en' ? 'New Shelf' : 'رف جديد'}</span>
                        </Button>
                    </header>

                    <div className="space-y-4">
                        {sortedShelves?.map(shelf => (
                            <ShelfCarousel 
                                key={shelf.id}
                                shelf={shelf} 
                                onAddBookRequest={handleOpenAddBookModal} 
                                onEditRequest={handleOpenEditModal}
                                onShareRequest={handleShareRequest}
                                onDeleteRequest={handleOpenDeleteModal}
                                isOpen={openShelves[shelf.id] ?? false}
                                onToggle={() => toggleShelf(shelf.id)}
                                onToggleLayout={() => toggleLayout(shelf.id)}
                                layout={shelfLayouts[shelf.id] || 'carousel'}
                                isDeletable={!MANDATORY_SHELVES.includes(shelf.id)}
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <>
            <div className="h-screen flex flex-col">
                <AppNav titleEn="BookTown" titleAr="بوكتاون" />
                {renderContent()}
                <RecommendationsPanel 
                    isOpen={isRecPanelOpen}
                    onOpen={() => setRecPanelOpen(true)}
                    onClose={() => setRecPanelOpen(false)}
                />
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
            <EditShelfModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                shelf={shelfToEdit}
            />
             <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                itemName={shelfToDelete ? (lang === 'en' ? shelfToDelete.titleEn : shelfToDelete.titleAr) : ''}
                itemType={lang === 'en' ? 'shelf' : 'رف'}
            />
        </>
    );
};

export default ReadScreen;