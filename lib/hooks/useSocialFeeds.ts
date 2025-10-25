import { useInfiniteQuery } from '../react-query.ts';
import { db } from '../firebase.ts';
import { Post } from '../../types/entities.ts';
import { MOCK_DATA } from '../../data/mocks.ts';

const POSTS_PER_PAGE = 5;

export type SocialFeedFilter = 'explore' | 'for-you' | 'books';

const getPostsPage = async ({ pageParam, filter }: { pageParam?: string, filter: SocialFeedFilter }): Promise<{ posts: Post[], nextCursor?: string }> => {
    // In a real app, this would be a more complex query.
    // For the mock, we fetch all and filter client-side.
    const postsObject = MOCK_DATA.posts;
    let allPosts = postsObject ? Object.values(postsObject) as Post[] : [];

    // Apply filter
    const currentUser = 'alex_doe'; // Hardcoded for mock
    const following = ['jane_smith', 'sam_jones', 'maria_garcia']; // Mock following list

    switch (filter) {
        case 'for-you':
            allPosts = allPosts.filter(p => following.includes(p.authorId));
            break;
        case 'books':
            allPosts = allPosts.filter(p => p.attachment?.type === 'book' || p.bookTagId);
            break;
        case 'explore':
        default:
            // No extra filtering needed for explore
            break;
    }

    const sortedPosts = allPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    let startIndex = 0;
    if (pageParam) {
        const cursorIndex = sortedPosts.findIndex(p => p.timestamp === pageParam);
        if (cursorIndex !== -1) {
            startIndex = cursorIndex + 1;
        }
    }
    
    const finalPosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const lastPost = finalPosts[finalPosts.length - 1];
    const nextCursor = finalPosts.length === POSTS_PER_PAGE ? lastPost?.timestamp : undefined;

    return { posts: finalPosts, nextCursor };
};

export const useSocialFeeds = (filter: SocialFeedFilter) => {
    return useInfiniteQuery({
        queryKey: ['socialFeeds', filter],
        queryFn: ({ pageParam }) => getPostsPage({ pageParam, filter }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
};
