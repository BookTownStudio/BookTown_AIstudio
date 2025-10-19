import { useQuery } from '../react-query.ts';
import { db, auth } from '../firebase.ts';
import { Project } from '../../types/entities.ts';
import { mockTemplates } from '../../data/mocks.ts';

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const getProject = async (uid: string | undefined, projectId: string, templateId?: string): Promise<Project> => {
    if (projectId === 'new') {
        if (templateId) {
            const template = mockTemplates.find(t => t.id === templateId);
            if (!template) throw new Error('Template not found');
            return {
                id: 'new',
                titleEn: template.titleEn,
                titleAr: template.titleAr,
                content: template.boilerplateContent,
                wordCount: countWords(template.boilerplateContent),
                typeEn: template.titleEn,
                typeAr: template.titleAr,
                status: 'Draft',
                updatedAt: new Date().toISOString(),
            };
        }
        // Blank new project
        return {
            id: 'new',
            titleEn: 'Untitled Project',
            titleAr: 'مشروع غير معنون',
            content: '',
            wordCount: 0,
            typeEn: 'Draft',
            typeAr: 'مسودة',
            status: 'Draft',
            updatedAt: new Date().toISOString(),
        };
    }

    if (!uid) throw new Error("User not authenticated for fetching existing project.");
    const docRef = db.doc('users', uid, 'projects', projectId);
    const docSnap = await db.getDoc(docRef) as { exists: () => boolean; data: () => Project; };

    if (docSnap.exists()) {
        return { id: projectId, ...docSnap.data() };
    } else {
        throw new Error("Project not found.");
    }
};

export const useProjectDetails = (projectId?: string, templateId?: string) => {
    const { uid } = auth.currentUser || {};
    return useQuery<Project>({
        queryKey: ['project', uid, projectId, templateId],
        queryFn: () => getProject(uid, projectId!, templateId),
        enabled: !!projectId, // Enabled as long as we have a projectId (including 'new')
    });
};