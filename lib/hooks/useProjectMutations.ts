

import { useMutation, useQueryClient } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
// FIX: Add file extension to entities.ts import
import { Project } from '../../types/entities.ts';

const createProject = async (newProject: Omit<Project, 'id' | 'updatedAt'>) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("User not authenticated");

    const newId = `proj${Date.now()}`;
    const projectWithMeta: Omit<Project, 'id'> & { updatedAt: string } = {
        ...newProject,
        updatedAt: new Date().toISOString(),
    }
    
    const projectRef = db.doc('users', uid, 'projects', newId);
    await db.setDoc(projectRef, projectWithMeta);
    return { ...projectWithMeta, id: newId };
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            const { uid } = auth.currentUser || {};
            queryClient.invalidate(['userProjects', uid]);
        },
    });
};
