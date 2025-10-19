import { useMutation, useQueryClient } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
// FIX: Add file extension to entities.ts import
import { Project } from '../../types/entities.ts';

interface AutosaveVariables {
    projectId: string;
    updates: Partial<Pick<Project, 'titleEn' | 'content' | 'wordCount'>>;
}

const autosaveProject = async ({ projectId, updates }: AutosaveVariables) => {
    const { uid } = auth.currentUser || {};
    if (!uid) throw new Error("Not authenticated");
    
    // In a real app, this would be a 'merge' update.
    console.log(`[MockAutosave] Saving project ${projectId} with updates:`, updates);
    
    const projectRef = db.doc('users', uid, 'projects', projectId);
    // In a real app, you would use updateDoc.
    // await db.updateDoc(projectRef, { ...updates, updatedAt: new Date().toISOString() });
    
    // For the mock, just log it and simulate a network delay.
    await new Promise(res => setTimeout(res, 300));

    return { success: true };
};

export const useAutosaveProject = () => {
    const queryClient = useQueryClient();
    const { uid } = auth.currentUser || {};
    
    return useMutation({
        mutationFn: autosaveProject,
        onSuccess: (data, variables) => {
            // Invalidate the project list and the specific project details
            queryClient.invalidate(['userProjects', uid]);
            queryClient.invalidate(['project', uid, variables.projectId]);
            console.log(`[MockAutosave] Invalidated project queries for ${variables.projectId}`);
        }
    });
};
