import { db, auth, doc, getDoc, collection, getDocs, query } from '../api/firebase.js';

export async function loadFormStructureFromFirebase() {
    try{
        const formId = localStorage.getItem('lastSavedFormId');
        if (!formId) {
            throw new Error('No form ID found. Please save a form first.');
        }
    
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated. Please sign in to load forms.');
        }
            
        const formRef = doc(db, 'users', user.uid, 'forms', formId);
        const chunksRef = collection(db, 'users', user.uid, 'forms', formId, 'chunks');
        
        const [formSnap, chunksSnap] = await Promise.all([
            getDoc(formRef),
            getDocs(query(chunksRef))
        ]);
        
        if (!formSnap.exists()) {
            throw new Error('Form not found in Firebase. It may have been deleted.');
        }
    
        const formData = {
            id: formSnap.id,
            title: formSnap.data().title || 'Untitled Form',
            zones: []
        };
    
        const chunks = [];
        chunksSnap.forEach(doc => {
            chunks.push({
                    id: doc.id,
                    index: doc.data().index,
                    zones: doc.data().zones || []
                });
        });
        chunks.sort((a, b) => a.index - b.index);
    
        chunks.forEach(chunk => {
            formData.zones.push(...chunk.zones);
        });
        
        return formData;
    } catch(error) {
        console.error('Error loading form:', error);
        throw error;
    }
}