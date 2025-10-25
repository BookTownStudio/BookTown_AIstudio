import { Post } from '../types/entities.ts';
import { MOCK_DATA } from '../data/mocks.ts';

const getDeepValue = (obj: any, path: string[]) => {
    return path.reduce((acc, part) => acc && acc[part], obj);
}

const setDeepValue = (obj: any, path: string[], value: any) => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        const part = path[i];
        if (current[part] === undefined) {
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
        if (current === undefined) return;
    }
    delete current[path[path.length - 1]];
};

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
        return { path };
    },
    collection: (...path: string[]) => {
        return new MockQuery(path);
    },
    getDoc: async (docRef: { path: string[] }) => {
        await new Promise(res => setTimeout(res, 150));
        const data = getDeepValue(MOCK_DATA, docRef.path);
        
        return {
            exists: () => !!data,
            data: () => data,
            id: docRef.path[docRef.path.length - 1],
        };
    },
    getDocs: async (colRef: MockQuery) => {
        await new Promise(res => setTimeout(res, 200));

        if (colRef.path.join('/') === 'posts') {
            const postsObject = getDeepValue(MOCK_DATA, ['posts']);
            const allPosts = postsObject ? Object.values(postsObject) as Post[] : [];
            const sortedPosts = allPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            let startIndex = 0;
            if (colRef._startAfter) {
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
        await new Promise(res => setTimeout(res, 100));
        console.log(`[MockDB] Setting doc at ${docRef.path.join('/')}`, data);

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
        await new Promise(res => setTimeout(res, 100));
        const newId = `mock_${Date.now()}`;
        const newPath = [...colRef.path, newId];
        setDeepValue(MOCK_DATA, newPath, data);
        console.log(`[MockDB] Adding doc at ${newPath.join('/')}`, data);
        return { id: newId };
    },
    deleteDoc: async (docRef: { path: string[] }) => {
        await new Promise(res => setTimeout(res, 100));
        deleteDeepValue(MOCK_DATA, docRef.path);
        console.log(`[MockDB] Deleting doc at ${docRef.path.join('/')}`);
        return Promise.resolve();
    },
};

export const db = mockDb;