import { useInfiniteQuery } from '../react-query.ts';
import { db } from '../firebase.ts';
// FIX: Add file extension to entities.ts import
import { Post } from '../../types/entities.ts';

const POSTS_PER_PAGE = 5;

const getPostsPage = async ({ pageParam }: { pageParam?: string }): Promise<{ posts: Post[], nextCursor?: string }> => {
    // A real app would sort by a field like 'createdAt'
    let query = db.collection('posts').limit(POSTS_PER_PAGE);

    if (pageParam) {
        query = query.startAfter(pageParam);
    }
    
    const snapshot = await db.getDocs(query);
    const posts: Post[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];

    const lastPost = posts[posts.length - 1];
    const nextCursor = posts.length === POSTS_PER_PAGE ? lastPost?.timestamp : undefined;

    return { posts, nextCursor };
};

export const useSocialFeeds = () => {
    return useInfiniteQuery({
        queryKey: ['socialFeeds'],
        queryFn: getPostsPage,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
};
