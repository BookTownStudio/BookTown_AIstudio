import { useQuery } from '../react-query.ts';
import { Post, User } from '../../types/entities.ts';
import { mockPosts, mockUsers } from '../../data/mocks.ts';

type SearchResult = {
    posts: Post[];
    users: User[];
    topics: string[];
}

const searchSocial = async (query: string): Promise<SearchResult> => {
    await new Promise(res => setTimeout(res, 200)); // Simulate delay
    if (!query) {
        return { posts: [], users: [], topics: [] };
    }
    const lowerCaseQuery = query.toLowerCase();

    const posts = mockPosts.filter(p => 
        p.content.toLowerCase().includes(lowerCaseQuery) ||
        p.authorName.toLowerCase().includes(lowerCaseQuery) ||
        p.authorHandle.toLowerCase().includes(lowerCaseQuery)
    );

    const users = mockUsers.filter(u => 
        u.name.toLowerCase().includes(lowerCaseQuery) ||
        u.handle.toLowerCase().includes(lowerCaseQuery)
    );

    // Mock topics
    const topics = ['#SciFi', '#FantasyReads', '#BookClub']
        .filter(t => t.toLowerCase().includes(lowerCaseQuery));
    
    return { posts, users, topics };
}

export const useSocialSearch = (query: string) => {
    return useQuery<SearchResult>({
        queryKey: ['socialSearch', query],
        queryFn: () => searchSocial(query),
        enabled: !!query,
    });
};