import { useQuery } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { User } from '../../types/entities.ts';

const getSuggestedProfiles = async (currentUid: string): Promise<User[]> => {
    const usersCol = db.collection('users');
    const snapshot = await db.getDocs(usersCol);
    const allUsers = snapshot.docs.map(doc => doc.data()) as User[];
    // Filter out the current user and return
    return allUsers.filter(user => user.uid !== currentUid);
};

export const useSuggestedProfiles = () => {
    const { uid } = auth.currentUser || {};
    return useQuery<User[]>({
        queryKey: ['suggestedProfiles', uid],
        queryFn: () => getSuggestedProfiles(uid!),
        enabled: !!uid,
    });
};
