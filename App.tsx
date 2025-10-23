
import React from 'react';
// FIX: Added file extensions to imports
import { I18nProvider } from './store/i18n.tsx';
import { NavigationProvider, useNavigation } from './store/navigation.tsx';
import { QueryClient, QueryClientProvider } from './lib/react-query.ts';
import { AuthProvider, useAuth } from './lib/auth.tsx';
import { ThemeProvider } from './store/theme.tsx';

import HomeScreen from './app/tabs/home.tsx';
import ReadScreen from './app/tabs/read.tsx';
import DiscoverScreen from './app/tabs/discover.tsx';
// FIX: Add file extension to write.tsx import
import WriteScreen from './app/tabs/write.tsx';
import SocialScreen from './app/tabs/social.tsx';

import BottomNavBar from './components/navigation/BottomNavBar.tsx';
import Drawer from './components/navigation/Drawer.tsx';
import LoginScreen from './app/auth/login.tsx';

import ProfileScreen from './app/drawer/profile.tsx';
import BookmarksScreen from './app/drawer/bookmarks.tsx';
import QuotesScreen from './app/drawer/quotes.tsx';
import SettingsScreen from './app/drawer/settings.tsx';
import AgentChatScreen from './app/agent.tsx';
import BookDetailsScreen from './app/book-details.tsx';
// FIX: Add file extension to editor/[id].tsx import
import EditorScreen from './app/editor/[id].tsx';
import ReaderScreen from './app/reader.tsx';
import AuthorsScreen from './app/drawer/authors.tsx';
import VenuesScreen from './app/drawer/venues.tsx';
import FeedbackScreen from './app/drawer/feedback.tsx';
import EmailScreen from './app/drawer/email.tsx';
import AdminDashboardScreen from './app/drawer/admin.tsx';
import BookFlowButton from './components/navigation/BookFlowButton.tsx';
import { TabName } from './types/navigation.ts';
import PostComposerScreen from './app/immersive/post-composer.tsx';
import AuthorDetailsScreen from './app/author-details.tsx';
import QuoteDetailsScreen from './app/quote-details.tsx';
import BooksScreen from './app/drawer/books.tsx';
import DiscoveryFlowScreen from './app/discovery/flow.tsx';

// A single instance of QueryClient
const queryClient = new QueryClient();

const TabScreens: React.FC = () => {
    const { currentView } = useNavigation();

    // This component should only render the visible tab and the nav bar.
    // It shouldn't be responsible for deciding IF a tab screen should be shown.
    if (currentView.type !== 'tab') {
        // Fallback or render nothing if the view isn't a tab.
        // The main router should prevent this from happening.
        return null;
    }

    const activeTab = currentView.id;

    return (
        <>
            <div className="h-full w-full">
                <div style={{ display: activeTab === 'home' ? 'block' : 'none', height: '100%' }}><HomeScreen /></div>
                <div style={{ display: activeTab === 'read' ? 'block' : 'none', height: '100%' }}><ReadScreen /></div>
                <div style={{ display: activeTab === 'discover' ? 'block' : 'none', height: '100%' }}><DiscoverScreen /></div>
                <div style={{ display: activeTab === 'write' ? 'block' : 'none', height: '100%' }}><WriteScreen /></div>
                <div style={{ display: activeTab === 'social' ? 'block' : 'none', height: '100%' }}><SocialScreen /></div>
            </div>
            {activeTab === 'home' && <BookFlowButton />}
            <BottomNavBar activeTab={activeTab} />
        </>
    );
};


const AppContent: React.FC = () => {
    const { user, isLoading } = useAuth();
    const { currentView } = useNavigation();

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                {/* Could be a splash screen */}
            </div>
        );
    }

    if (!user) {
        return <LoginScreen />;
    }

    const renderView = () => {
        switch (currentView.type) {
            case 'tab':
                return <TabScreens />;
            case 'drawer':
                switch (currentView.id) {
                    case 'profile': return <ProfileScreen />;
                    case 'bookmarks': return <BookmarksScreen />;
                    case 'quotes': return <QuotesScreen />;
                    case 'settings': return <SettingsScreen />;
                    case 'authors': return <AuthorsScreen />;
                    case 'venues': return <VenuesScreen />;
                    case 'feedback': return <FeedbackScreen />;
                    case 'email': return <EmailScreen />;
                    case 'adminDashboard': return <AdminDashboardScreen />;
                    case 'books': return <BooksScreen />;
                    default: return <TabScreens />; // Fallback to tabs
                }
            case 'immersive':
                switch(currentView.id) {
                    case 'agentChat': return <AgentChatScreen />;
                    case 'bookDetails': return <BookDetailsScreen />;
                    case 'editor': return <EditorScreen />;
                    case 'reader': return <ReaderScreen />;
                    case 'discoveryFlow': return <DiscoveryFlowScreen />;
                    case 'postComposer': return <PostComposerScreen />;
                    case 'profile': return <ProfileScreen />;
                    case 'authorDetails': return <AuthorDetailsScreen />;
                    case 'quoteDetails': return <QuoteDetailsScreen />;
                    default: return <TabScreens />; // Fallback
                }
            default:
                return <TabScreens />;
        }
    }

    return (
        <div className="h-screen w-full bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-white selection:bg-accent selection:text-white">
            <Drawer />
            <div className="h-full">
                {renderView()}
            </div>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <I18nProvider>
                <ThemeProvider>
                    <NavigationProvider>
                        <AuthProvider>
                            <AppContent />
                        </AuthProvider>
                    </NavigationProvider>
                </ThemeProvider>
            </I18nProvider>
        </QueryClientProvider>
    );
};

export default App;