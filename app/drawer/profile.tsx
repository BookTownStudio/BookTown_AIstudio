import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from '../../store/i18n.tsx';
import { useAuth } from '../../lib/auth.tsx';
import { useUserProfile } from '../../lib/hooks/useUserProfile.ts';
import LoadingSpinner from '../../components/ui/LoadingSpinner.tsx';
import Button from '../../components/ui/Button.tsx';
import BilingualText from '../../components/ui/BilingualText.tsx';
import { useNavigation } from '../../store/navigation.tsx';
import { ChevronLeftIcon } from '../../components/icons/ChevronLeftIcon.tsx';
import { EditIcon } from '../../components/icons/EditIcon.tsx';
import { CalendarIcon } from '../../components/icons/CalendarIcon.tsx';
import { ReadIcon } from '../../components/icons/ReadIcon.tsx';
import { WriteIcon } from '../../components/icons/WriteIcon.tsx';
import { ShelvesIcon } from '../../components/icons/ShelvesIcon.tsx';
import { useUpdateProfile } from '../../lib/hooks/useUpdateProfile.ts';
import EditProfileModal, { ProfileEditData } from '../../components/modals/EditProfileModal.tsx';
import { useFollowUser, useUnfollowUser } from '../../lib/hooks/useFollowUser.ts';
import { PlusIcon } from '../../components/icons/PlusIcon.tsx';
import { CheckIcon } from '../../components/icons/CheckIcon.tsx';
import { useUserShelves } from '../../lib/hooks/useUserShelves.ts';
import ShelfCarousel from '../../components/content/ShelfCarousel.tsx';
import AddBookModal from '../../components/modals/AddBookModal.tsx';
import EditShelfModal from '../../components/modals/EditShelfModal.tsx';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal.tsx';
import { useDeleteShelf } from '../../lib/hooks/useDeleteShelf.ts';
import { Shelf } from '../../types/entities.ts';

type ProfileTab = 'posts' | 'reviews' | 'shelves' | 'books';
const MANDATORY_SHELVES = ['currently-reading', 'want-to-read', 'finished'];

const ScreenHeader: React.FC<{ title: string; onBack: () => void; }> = ({ title, onBack }) => {
    const { lang, isRTL } = useI18n();
    return (
        <header className="fixed top-0 left-0 right-0 z-20 bg-transparent">
            <div className={`container mx-auto flex h-20 items-center justify-between px-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button variant="icon" onClick={onBack} className="bg-black/20 backdrop-blur-sm !text-white" aria-label={lang === 'en' ? 'Back' : 'رجوع'}>
                    <ChevronLeftIcon className="h-6 w-6" />
                </Button>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm px-4 py-1 rounded-full text-white">
                    <BilingualText role="Body" className="!font-bold">{title}</BilingualText>
                </div>
            </div>
        </header>
    )
}

const ProfileScreen: React.FC = () => {
    const { lang } = useI18n();
    const { user: authUser } = useAuth();
    const { currentView, navigate } = useNavigation();

    const profileUserId = currentView.type === 'immersive' ? currentView.params?.userId : authUser?.uid;
    const isOwnProfile = profileUserId === authUser?.uid;

    // Profile Hooks
    const { data: profile, isLoading } = useUserProfile(profileUserId);
    const { mutate: updateProfile, isLoading: isUpdating } = useUpdateProfile();
    const { mutate: followUser, isLoading: isFollowing } = useFollowUser();
    const { mutate: unfollowUser, isLoading: isUnfollowing } = useUnfollowUser();

    // Shelves Hooks
    const { data: shelves, isLoading: isLoadingShelves } = useUserShelves(profileUserId);
    const { mutate: deleteShelf, isLoading: isDeleting } = useDeleteShelf();
    
    // UI State
    const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
    const [isFollowed, setIsFollowed] = useState(false); // In a real app, this would be derived from user data

    // Edit Profile Modal State
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState<ProfileEditData>({ name: '', bioEn: '', avatarUrl: '' });

    // Shelves State
    const [openShelves, setOpenShelves] = useState<Record<string, boolean>>({});
    const [shelfLayouts, setShelfLayouts] = useState<Record<string, 'carousel' | 'list'>>(() => {
        try {
            const item = window.localStorage.getItem('booktown-shelf-layouts');
            return item ? JSON.parse(item) : {};
        } catch (error) {
            console.error("Error reading layouts from localStorage", error);
            return {};
        }
    });

    // Modals State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [targetShelfId, setTargetShelfId] = useState<string | null>(null);
    // FIX: Renamed state variable to avoid redeclaration.
    const [isShelfEditModalOpen, setShelfEditModalOpen] = useState(false);
    const [shelfToEdit, setShelfToEdit] = useState<Shelf | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [shelfToDelete, setShelfToDelete] = useState<Shelf | null>(null);

    // Persist layout changes
    useEffect(() => {
        if (isOwnProfile) { // Only persist layout changes for the logged-in user
            try {
                window.localStorage.setItem('booktown-shelf-layouts', JSON.stringify(shelfLayouts));
            } catch (error) {
                console.error("Error writing layouts to localStorage", error);
            }
        }
    }, [shelfLayouts, isOwnProfile]);

    const handleBack = () => {
        if (currentView.params?.from) {
            navigate(currentView.params.from);
        } else {
            navigate({ type: 'tab', id: 'home' });
        }
    };

    const handleEditProfile = () => {
        if (profile) {
            setEditData({ name: profile.name, bioEn: profile.bioEn, avatarUrl: profile.avatarUrl });
            setEditModalOpen(true);
        }
    };
    
    const handleFollowToggle = () => {
        if (!profileUserId) return;
        if (isFollowed) {
            unfollowUser(profileUserId, { onSuccess: () => setIsFollowed(false) });
        } else {
            followUser(profileUserId, { onSuccess: () => setIsFollowed(true) });
        }
    };

    const handleSaveProfile = () => {
        updateProfile(editData, {
            onSuccess: () => setEditModalOpen(false),
        });
    };

    // --- Shelves Handlers ---
    const toggleShelf = (shelfId: string) => setOpenShelves(prev => ({ ...prev, [shelfId]: !prev[shelfId] }));
    const toggleLayout = (shelfId: string) => setShelfLayouts(prev => ({ ...prev, [shelfId]: prev[shelfId] === 'list' ? 'carousel' : 'list' }));
    
    const handleOpenAddBookModal = (shelfId: string) => { setTargetShelfId(shelfId); setAddModalOpen(true); };
    const handleCloseAddBookModal = () => { setTargetShelfId(null); setAddModalOpen(false); };
    
    const handleOpenEditModal = (shelf: Shelf) => { setShelfToEdit(shelf); setShelfEditModalOpen(true); };
    const handleCloseEditModal = () => { setShelfToEdit(null); setShelfEditModalOpen(false); };

    const handleOpenDeleteModal = (shelf: Shelf) => { setShelfToDelete(shelf); setDeleteModalOpen(true); };
    const handleCloseDeleteModal = () => { setShelfToDelete(null); setDeleteModalOpen(false); };
    
    const handleConfirmDelete = () => {
        if (shelfToDelete) {
            deleteShelf(shelfToDelete.id, { onSuccess: handleCloseDeleteModal });
        }
    };
    
    const handleShareRequest = (shelf: Shelf) => {
        navigate({
            type: 'immersive',
            id: 'postComposer',
            params: { from: currentView, attachment: { type: 'shelf', id: shelf.id, ownerId: shelf.ownerId } }
        });
    };

    // --- Memoized Data ---
    const joinDate = profile ? new Date(profile.joinDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', year: 'numeric' }) : '';
    
    const TABS: { id: ProfileTab; en: string; ar: string; }[] = [
        { id: 'posts', en: 'Posts', ar: 'المنشورات' },
        { id: 'reviews', en: 'Reviews', ar: 'المراجعات' },
        { id: 'shelves', en: 'Shelves', ar: 'الرفوف' },
        { id: 'books', en: 'Books', ar: 'الكتب' },
    ];

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


    if (isLoading) {
        return <div className="h-screen w-full flex items-center justify-center"><LoadingSpinner /></div>;
    }

    if (!profile) {
        return (
             <div className="h-screen w-full flex flex-col items-center justify-center">
                 <BilingualText>Profile not found.</BilingualText>
                 <Button onClick={handleBack} className="mt-4">Go Back</Button>
             </div>
        );
    }
    
    return (
        <>
            <div className="h-screen flex flex-col overflow-y-auto bg-gray-50 dark:bg-slate-900">
                <ScreenHeader title={profile.handle} onBack={handleBack} />

                {/* Header section */}
                <div className="relative h-48 w-full flex-shrink-0">
                    <img src={profile.bannerUrl} alt="Profile banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-slate-900 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                        {isOwnProfile ? (
                            <Button 
                                onClick={handleEditProfile} 
                                className="!px-3 !py-2 bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-white/20 !text-white"
                                disabled={isUpdating}
                            >
                                <EditIcon className="h-4 w-4 mr-2"/> 
                                {isUpdating ? (lang === 'en' ? 'Saving...' : 'جار الحفظ...') : (lang === 'en' ? 'Edit Profile' : 'تعديل الملف')}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleFollowToggle}
                                disabled={isFollowing || isUnfollowing}
                                className={`!px-3 !py-2 !text-white ${isFollowed ? 'bg-accent/80' : 'bg-primary/80'} backdrop-blur-sm border border-white/20 hover:bg-opacity-100`}
                            >
                                {isFollowed ? <CheckIcon className="h-4 w-4 mr-2" /> : <PlusIcon className="h-4 w-4 mr-2" />}
                                {(isFollowing || isUnfollowing) ? '...' : (isFollowed ? (lang === 'en' ? 'Following' : 'تتابعه') : (lang === 'en' ? 'Follow' : 'متابعة'))}
                            </Button>
                        )}
                    </div>
                    <div className="absolute -bottom-12 left-4">
                        <div className="h-28 w-28 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-gray-50 dark:border-slate-900 overflow-hidden">
                            <img src={profile.avatarUrl} alt="User avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="container mx-auto px-4 pt-16 pb-4">
                     <BilingualText role="H1" className="!text-2xl">{profile.name}</BilingualText>
                     <BilingualText role="Caption">{profile.handle}</BilingualText>
                     <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-white/60">
                        <CalendarIcon className="h-4 w-4" />
                        <BilingualText role="Caption">{lang === 'en' ? `Joined ${joinDate}` : `انضم في ${joinDate}`}</BilingualText>
                     </div>
                </div>
                
                {/* Stats */}
                <div className="container mx-auto px-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-white/80">
                    <BilingualText><span className="font-bold text-slate-800 dark:text-white">{profile.followers}</span> {lang === 'en' ? 'Followers' : 'متابعون'}</BilingualText>
                    <BilingualText><span className="font-bold text-slate-800 dark:text-white">{profile.following}</span> {lang === 'en' ? 'Following' : 'يتابع'}</BilingualText>
                    <div className="flex items-center gap-1.5"><ReadIcon className="h-4 w-4"/><BilingualText><span className="font-bold text-slate-800 dark:text-white">{profile.booksRead}</span> {lang === 'en' ? 'Books' : 'كتب'}</BilingualText></div>
                    <div className="flex items-center gap-1.5"><WriteIcon className="h-4 w-4"/><BilingualText><span className="font-bold text-slate-800 dark:text-white">{profile.wordsWritten}</span> {lang === 'en' ? 'Words' : 'كلمات'}</BilingualText></div>
                    <div className="flex items-center gap-1.5"><ShelvesIcon className="h-4 w-4"/><BilingualText><span className="font-bold text-slate-800 dark:text-white">{profile.shelvesCount}</span> {lang === 'en' ? 'Shelves' : 'رفوف'}</BilingualText></div>
                </div>

                {/* Tabs */}
                <div className="sticky top-0 z-10 bg-gray-50 dark:bg-slate-900 border-b border-black/10 dark:border-white/10 mt-4">
                     <div className="container mx-auto px-4 flex items-center">
                        {TABS.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 text-center font-semibold border-b-2 transition-colors ${activeTab === tab.id ? 'text-accent border-accent' : 'text-slate-500 dark:text-white/60 border-transparent hover:text-slate-900 dark:hover:text-white'}`}>
                                {lang === 'en' ? tab.en : tab.ar}
                            </button>
                        ))}
                     </div>
                </div>

                {/* Tab Content */}
                <div className="container mx-auto px-4 py-8 flex-grow">
                    {activeTab === 'posts' && (
                        <div className="text-center text-slate-500 dark:text-white/60 py-16">
                            <BilingualText>No posts yet</BilingualText>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                         <div className="text-center text-slate-500 dark:text-white/60 py-16">
                            <BilingualText>No reviews yet.</BilingualText>
                        </div>
                    )}
                    {activeTab === 'books' && (
                         <div className="text-center text-slate-500 dark:text-white/60 py-16">
                            <BilingualText>Book history coming soon.</BilingualText>
                        </div>
                    )}
                    {activeTab === 'shelves' && (
                        isLoadingShelves ? (
                             <div className="flex justify-center pt-8"><LoadingSpinner /></div>
                        ) : (
                            <div className="space-y-4">
                                {sortedShelves.length > 0 ? sortedShelves.map(shelf => (
                                    <ShelfCarousel
                                        key={shelf.id}
                                        shelf={shelf}
                                        isOpen={openShelves[shelf.id] ?? false}
                                        onToggle={() => toggleShelf(shelf.id)}
                                        layout={shelfLayouts[shelf.id] || 'carousel'}
                                        onToggleLayout={() => toggleLayout(shelf.id)}
                                        onShareRequest={handleShareRequest}
                                        onAddBookRequest={isOwnProfile ? handleOpenAddBookModal : undefined}
                                        onEditRequest={isOwnProfile ? handleOpenEditModal : undefined}
                                        onDeleteRequest={isOwnProfile ? handleOpenDeleteModal : undefined}
                                        isDeletable={isOwnProfile && !MANDATORY_SHELVES.includes(shelf.id)}
                                    />
                                )) : (
                                    <div className="text-center text-slate-500 dark:text-white/60 py-16">
                                        <BilingualText>No shelves to display.</BilingualText>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
            {isOwnProfile && (
                <>
                    <EditProfileModal
                        isOpen={isEditModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        profileData={editData}
                        setProfileData={setEditData}
                        onSave={handleSaveProfile}
                        isSaving={isUpdating}
                    />
                    <AddBookModal
                        isOpen={isAddModalOpen}
                        onClose={handleCloseAddBookModal}
                        targetShelfId={targetShelfId}
                    />
                    <EditShelfModal
                        isOpen={isShelfEditModalOpen}
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
            )}
        </>
    );
};

export default ProfileScreen;