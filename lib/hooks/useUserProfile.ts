

import { useQuery } from '../react-query.ts';
// FIX: Added file extension to firebase import.
import { db } from '../firebase.ts'; // Using mock firestore
// FIX: Add file extension to entities.ts import
import { User } from '../../types/entities.ts';

const getUserProfile = async (uid: string | undefined): Promise<User> => {
    if (!uid) {
        throw new Error("User ID is required to fetch profile.");
    }
    const userDocRef = db.doc('users', uid);
    // FIX: The mock `db.getDoc` returns an untyped promise. Cast the result to the expected shape to resolve type errors.
    const userDoc = await db.getDoc(userDocRef) as { exists: () => boolean; data: () => User; };

    if (userDoc.exists()) {
        return userDoc.data();
    } else {
        throw new Error("User profile not found.");
    }
};

export const useUserProfile = (uid: string | undefined) => {
    return useQuery<User>({
        queryKey: ['userProfile', uid],
        queryFn: () => getUserProfile(uid),
        enabled: !!uid, // Only run the query if the uid is available
    });
};
