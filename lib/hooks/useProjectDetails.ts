import { useQuery } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { Project } from '../../types/entities.ts';

const getProject = async (uid: string, projectId: string): Promise<Project | null> => {
    if (projectId === 'new') {
        // Return a new, unsaved project structure for the editor
        return {
            id: `new_${Date.now()}`, // Give it a temporary unique ID
            titleEn: 'Untitled Draft',
            titleAr: 'مسودة بدون عنوان',
            content: '',
            typeEn: 'Novel',
            typeAr: 'رواية',
            status: 'Draft',
            wordCount: 0,
            updatedAt: new Date().toISOString(),
        };
    }
    const docRef = db.doc('users', uid, 'projects', projectId);
    const docSnap = await db.getDoc(docRef) as { exists: () => boolean; data: () => Omit<Project, 'id'> };

    if (docSnap.exists()) {
        return { id: projectId, ...docSnap.data() };
    }
    return null;
};

export const useProjectDetails = (projectId: string | undefined) => {
    const { uid } = auth.currentUser || {};
    return useQuery<Project | null>({
        queryKey: ['project', uid, projectId],
        queryFn: () => getProject(uid!, projectId!),
        enabled: !!uid && !!projectId,
    });
};
