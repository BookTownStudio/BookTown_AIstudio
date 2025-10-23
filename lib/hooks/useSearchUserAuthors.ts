import { useQuery } from '../react-query.ts';
import { Author } from '../../types/entities.ts';
import { MOCK_DATA } from '../../data/mocks.ts';

const searchAuthors = async (query: string): Promise<Author[]> => {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 100));

    const allAuthors = Object.values(MOCK_DATA.authors);

    if (!query) {
        return allAuthors; // Return all authors if query is empty
    }

    const lowerCaseQuery = query.toLowerCase();
    
    return allAuthors.filter(author => 
        author.nameEn.toLowerCase().includes(lowerCaseQuery) ||
        author.nameAr.toLowerCase().includes(lowerCaseQuery)
    );
};

export const useSearchUserAuthors = (query: string) => {
    return useQuery<Author[]>({
        queryKey: ['searchUserAuthors', query],
        queryFn: () => searchAuthors(query),
        enabled: true,
    });
};
