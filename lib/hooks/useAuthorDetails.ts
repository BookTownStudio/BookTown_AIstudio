import { useQuery } from '../react-query.ts';
import { db } from '../firebase.ts';
import { Author } from '../../types/entities.ts';

const getAuthor = async (authorId: string | undefined): Promise<Author> => {
    if (!authorId) {
        throw new Error("Author ID is required.");
    }
    const docRef = db.doc('authors', authorId);
    const docSnap = await db.getDoc(docRef) as { exists: () => boolean; data: () => Author; };

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        throw new Error("Author not found.");
    }
};

export const useAuthorDetails = (authorId: string | undefined) => {
    return useQuery<Author>({
        queryKey: ['author', authorId],
        queryFn: () => getAuthor(authorId),
        enabled: !!authorId,
    });
};