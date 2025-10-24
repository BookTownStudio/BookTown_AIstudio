// FIX: Add file extension to mock import
import { mockPosts } from '../data/mocks.ts';
// FIX: Add file extension to mock import
import { MOCK_DATA } from '../data/mocks.ts';

// A VERY simple mock of Firestore to make the hooks work.
// This is not a complete implementation by any means.

const getDeepValue = (obj: any, path: string[]) => {
    return path.reduce((acc, part) => acc && acc[part], obj);
}

const setDeepValue = (obj: any, path: string[], value: any) => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        const part = path[i];
        if (current[part] === undefined) {
            // Create path if it doesn't exist
            current[part] = {};
        }
        current = current[part];
    }
    current[path[path.length - 1]] = value;
};

const deleteDeepValue = (obj: any, path: string[]) => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        current = current?.[path[i]];
        if (current === undefined) return; // Path doesn't exist
    }
    delete current[path[path.length - 1]];
};

// Represents a chainable query
class MockQuery {
    path: string[];
    _limit: number | null = null;
    _startAfter: any | null = null;

    constructor(path: string[]) {
        this.path = path;
    }

    limit(l: number) {
        this._limit = l;
        return this;
    }

    startAfter(cursor: any) {
        this._startAfter = cursor;
        return this;
    }
}


const mockDb = {
    doc: (...path: string[]) => {
        // Returns a reference object with the path
        return { path };
    },
    collection: (...path: string[]) => {
        // Returns a chainable query object
        return new MockQuery(path);
    },
    getDoc: async (docRef: { path: string[] }) => {
        // Simulate network delay
        await new Promise(res => setTimeout(res, 150));
        const data = getDeepValue(MOCK_DATA, docRef.path);
        
        return {
            exists: () => !!data,
            data: () => data,
            id: docRef.path[docRef.path.length - 1],
        };
    },
    getDocs: async (colRef: MockQuery) => {
        // Simulate network delay
        await new Promise(res => setTimeout(res, 200));

        // Special handling for the posts collection for pagination
        if (colRef.path.join('/') === 'posts') {
            const sortedPosts = [...mockPosts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            let startIndex = 0;
            if (colRef._startAfter) {
                // Find the index of the post with the cursor timestamp
                const cursorIndex = sortedPosts.findIndex(p => p.timestamp === colRef._startAfter);
                if (cursorIndex !== -1) {
                    startIndex = cursorIndex + 1;
                }
            }
            
            let finalPosts = sortedPosts.slice(startIndex);

            if (colRef._limit) {
                finalPosts = finalPosts.slice(0, colRef._limit);
            }

            const docs = finalPosts.map(post => ({
                id: post.id,
                data: () => post,
                exists: () => true
            }));

            return { docs };
        }


        const collection = getDeepValue(MOCK_DATA, colRef.path);
        const docs = collection ? Object.keys(collection).map(id => ({
            id,
            data: () => collection[id],
            exists: () => true,
        })) : [];

        return {
            docs,
        };
    },
    setDoc: async (docRef: { path: string[] }, data: any) => {
         // Simulate network delay
        await new Promise(res => setTimeout(res, 100));
        console.log(`[MockDB] Setting doc at ${docRef.path.join('/')}`, data);

        // Special case for toggling book on shelf for the mock
        if (docRef.path.includes('entries')) {
            const existing = getDeepValue(MOCK_DATA, docRef.path);
            if (existing) {
                deleteDeepValue(MOCK_DATA, docRef.path);
                 console.log(`[MockDB] Deleting doc at ${docRef.path.join('/')}`);
            } else {
                 const bookId = docRef.path[docRef.path.length - 1];
                 const shelfId = docRef.path[docRef.path.length - 3];
                 const newData = {
                     bookId,
                     addedAt: new Date().toISOString(),
                     progress: shelfId === 'currently-reading' ? 0 : undefined
                 };
                 setDeepValue(MOCK_DATA, docRef.path, newData);
            }
        } else {
            setDeepValue(MOCK_DATA, docRef.path, data);
        }
        return Promise.resolve();
    },
    addDoc: async (colRef: { path: string[] }, data: any) => {
        // Simulate network delay
        await new Promise(res => setTimeout(res, 100));
        const newId = `mock_${Date.now()}`;
        const newPath = [...colRef.path, newId];
        setDeepValue(MOCK_DATA, newPath, data);
        console.log(`[MockDB] Adding doc at ${newPath.join('/')}`, data);
        return { id: newId }; // Return a mock doc ref with the new ID
    },
};

export const db = mockDb;