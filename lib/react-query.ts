// This is a mock implementation of @tanstack/react-query
// It provides the basic 'useQuery' and 'useMutation' hook functionality for development.
// FIX: Import `useContext` from react.
import React, { useState, useEffect, ReactNode, useCallback, useContext, useRef } from 'react';

// Mock Invalidation Context
const InvalidationContext = React.createContext<{ invalidate: (key: any[]) => void }>({ invalidate: () => {} });

// Mock QueryClient
export class QueryClient {
    // In a real scenario, this would manage caching.
    // For the mock, it just provides an invalidation trigger.
    listeners: Set<() => void> = new Set();
    
    invalidateQueries = (queryKey: any[]) => {
        // This is a simplified invalidation. It triggers a re-render in components
        // that use the context, which in turn causes `useQuery` to re-fetch.
        this.listeners.forEach(l => l());
    }

    subscribe = (callback: () => void) => {
        this.listeners.add(callback);
        // FIX: The cleanup function for useEffect must return void. `Set.delete` returns a boolean.
        // Wrap it in a function that returns void.
        return () => {
            this.listeners.delete(callback);
        };
    }
}

// Mock QueryClientProvider
// FIX: Make the 'children' prop optional to resolve a type error where JSX doesn't correctly pass the prop type from a .tsx file to a .ts file.
export const QueryClientProvider = ({ children, client }: { children?: ReactNode, client: QueryClient }) => {
    // The provider just renders children in this mock.
    const [_, setVersion] = useState(0);

    useEffect(() => {
        const unsubscribe = client.subscribe(() => {
            setVersion(v => v + 1);
        });
        return unsubscribe;
    }, [client]);

    // FIX: Using JSX in a .ts file can cause parsing errors if tsconfig is not set up for it.
    // Using React.createElement avoids this and ensures a valid ReactElement is returned, fixing the error in App.tsx.
    return React.createElement(InvalidationContext.Provider, { value: { invalidate: client.invalidateQueries } }, children);
};

// Custom hook to use the invalidation function
export const useQueryClient = () => {
    return useContext(InvalidationContext);
}


interface UseQueryOptions<T> {
    queryKey: any[];
    queryFn: () => Promise<T>;
    enabled?: boolean;
}

// Mock useQuery hook
export const useQuery = <T,>({ queryKey, queryFn, enabled = true }: UseQueryOptions<T>) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState<T | undefined>(undefined);
    
    // This state is used to trigger re-fetches from invalidation
    const [version, setVersion] = useState(0);
    const client = React.useContext(InvalidationContext);
    
    useEffect(() => {
        const keyStr = JSON.stringify(queryKey);
        const unsubscribe = (client as any).subscribe?.(() => {
             // A very basic way to check if this query key is affected.
             // A real implementation is much more complex.
             setVersion(v => v + 1);
        });
        return unsubscribe;
    }, [client, queryKey]);

    const queryKeyString = JSON.stringify(queryKey);

    useEffect(() => {
        if (!enabled) {
            setIsLoading(false);
            return;
        }

        let isCancelled = false;
        
        const fetchData = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const result = await queryFn();
                if (!isCancelled) {
                    setData(result);
                }
            } catch (error) {
                 if (!isCancelled) {
                    setIsError(true);
                 }
            } finally {
                 if (!isCancelled) {
                    setIsLoading(false);
                 }
            }
        };

        fetchData();
        
        return () => {
            isCancelled = true;
        }
    }, [queryKeyString, enabled, version]); // Re-run on version change

    return { data, isLoading, isError };
};


// Mock useMutation hook
interface UseMutationOptions<TData, TVariables> {
    mutationFn: (variables: TVariables) => Promise<TData>;
    onSuccess?: (data: TData, variables: TVariables) => void;
}

// Options for the mutate function itself
interface MutateOptions<TData, TVariables> {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
}


export const useMutation = <TData = unknown, TVariables = void>({
    mutationFn,
    onSuccess: onHookSuccess, // Renaming for clarity
}: UseMutationOptions<TData, TVariables>) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(async (variables: TVariables, options?: MutateOptions<TData, TVariables>) => {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        try {
            const data = await mutationFn(variables);
            onHookSuccess?.(data, variables);
            options?.onSuccess?.(data, variables);
        } catch (err: any) {
            setIsError(true);
            setError(err);
            options?.onError?.(err, variables);
        } finally {
            setIsLoading(false);
        }
    }, [mutationFn, onHookSuccess]);

    return { mutate, isLoading, isError, error };
};


// NEW: Mock useInfiniteQuery hook
interface UseInfiniteQueryOptions<TData> {
    queryKey: any[];
    queryFn: (params: { pageParam?: any }) => Promise<TData>;
    getNextPageParam: (lastPage: TData) => any | undefined;
}

export const useInfiniteQuery = <TData>({
    queryKey,
    queryFn,
    getNextPageParam,
}: UseInfiniteQueryOptions<TData>) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState<{ pages: TData[]; pageParams: any[] }>({ pages: [], pageParams: [] });
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);

    const queryKeyString = JSON.stringify(queryKey);

    const fetchPage = useCallback(async (pageParam?: any, isInitial = false) => {
        if (isInitial) {
            setIsLoading(true);
        } else {
            setIsFetchingNextPage(true);
        }
        setIsError(false);
        
        try {
            const result = await queryFn({ pageParam });
            const nextPageParam = getNextPageParam(result);

            setData(prevData => ({
                pages: isInitial ? [result] : [...prevData.pages, result],
                pageParams: isInitial ? [pageParam] : [...prevData.pageParams, pageParam],
            }));
            setHasNextPage(nextPageParam !== undefined);

        } catch (error) {
            setIsError(true);
        } finally {
            if (isInitial) {
                setIsLoading(false);
            } else {
                setIsFetchingNextPage(false);
            }
        }
    }, [queryKeyString, queryFn, getNextPageParam]);
    
    useEffect(() => {
        // Initial fetch
        fetchPage(undefined, true);
    }, [queryKeyString]); // Only refetch on key change

    const fetchNextPage = useCallback((options?: { pageParam?: any }) => {
        if (!isFetchingNextPage && hasNextPage) {
            const lastPage = data.pages[data.pages.length - 1];
            // Guard against calling with undefined if pages array is empty
            if (lastPage) {
                const nextPageParam = options?.pageParam ?? getNextPageParam(lastPage);
                fetchPage(nextPageParam, false);
            }
        }
    }, [isFetchingNextPage, hasNextPage, data, getNextPageParam, fetchPage]);

    return { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage };
};