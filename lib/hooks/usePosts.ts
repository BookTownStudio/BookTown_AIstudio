import { useQuery } from '../react-query.ts';
import { db } from '../firebase.ts';
import { Post } from '../../types/entities.ts';

// This mock hook now fetches from the mock 'posts' collection
const getPosts = async (): Promise<Post[]> => {
    const snapshot = await db.getDocs(db.collection('posts'));
    return snapshot.docs.map(doc => doc.data()) as Post[];
};

export const usePosts = () => {
    return useQuery<Post[]>({
        queryKey: ['posts'],
        queryFn: getPosts,
    });
};