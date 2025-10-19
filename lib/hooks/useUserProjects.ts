

import { useQuery } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
// FIX: Add file extension to entities.ts import
import { Project } from '../../types/entities.ts';

const getProjects = async (uid: string): Promise<Project[]> => {
    const projectsCol = db.collection('users', uid, 'projects');
    const snapshot = await db.getDocs(projectsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
};

export const useUserProjects = () => {
    const { uid } = auth.currentUser || {};
    return useQuery<Project[]>({
        queryKey: ['userProjects', uid],
        queryFn: () => getProjects(uid!),
        enabled: !!uid,
    });
};
