

import { useQuery } from '../react-query.ts';
// FIX: Add file extension to mocks.ts import
import { mockPosts } from '../../data/mocks.ts';
// FIX: Add file extension to entities.ts import
import { Post } from '../../types/entities.ts';

const getPost = async (postId: string | undefined): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
    if (!postId) {
        throw new Error("Post ID is required.");
    }
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
        return post;
    }
    throw new Error("Post not found.");
};

export const usePostDetails = (postId: string | undefined) => {
    return useQuery<Post>({
        queryKey: ['post', postId],
        queryFn: () => getPost(postId),
        enabled: !!postId,
    });
};
