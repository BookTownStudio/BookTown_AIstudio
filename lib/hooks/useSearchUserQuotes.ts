import { useQuery } from '../react-query.ts';
import { Quote } from '../../types/entities.ts';
import { useQuotes } from './useQuotes.ts';

const searchQuotes = async (allQuotes: Quote[] | undefined, query: string): Promise<Quote[]> => {
    if (!query || !allQuotes) {
        return allQuotes || [];
    }

    const lowerCaseQuery = query.toLowerCase();
    
    return allQuotes.filter(quote => 
        quote.textEn.toLowerCase().includes(lowerCaseQuery) ||
        quote.textAr.toLowerCase().includes(lowerCaseQuery) ||
        quote.sourceEn.toLowerCase().includes(lowerCaseQuery) ||
        quote.sourceAr.toLowerCase().includes(lowerCaseQuery)
    );
};

export const useSearchUserQuotes = (query: string) => {
    const { data: allQuotes } = useQuotes();

    return useQuery<Quote[]>({
        queryKey: ['searchUserQuotes', query, allQuotes?.length],
        queryFn: () => searchQuotes(allQuotes, query),
        enabled: true,
    });
};