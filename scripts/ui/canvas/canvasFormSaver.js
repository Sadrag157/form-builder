import { db, auth, doc, setDoc, collection } from '../../api/firebase.js';
import { FormStreamProcessor } from '../../utils/formStreamProcessor.js';
import {showLoadingIndicator, hideLoadingIndicator} from './canvasUIFeedback.js'

export async function saveFormLogic(canvasInstance) {
    const loadingIndicator = showLoadingIndicator('Saving form in chunks...');
    
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated. Please sign in to save forms.');
        }

        const formTitle = document.querySelector('.form-title-input')?.value || 'Untitled Form';
        const formId = Date.now().toString();

        const chunks = await FormStreamProcessor.saveFormInChunks(canvasInstance.formArea);
        
        const formRef = doc(db, 'users', user.uid, 'forms', formId);
        await setDoc(formRef, {
            title: formTitle,
            totalChunks: chunks.length,
            totalZones: chunks.reduce((total, chunk) => total + chunk.length, 0),
            createdAt: new Date().toISOString()
        });
        
        for (let i = 0; i < chunks.length; i++) {
            const chunkRef = doc(collection(db, formRef.path, 'chunks'), `chunk_${i}`);
            await setDoc(chunkRef, {
                index: i,
                zones: chunks[i]
            });
        }
    
        console.log(`Form saved to Firestore with ID: ${formId}`);
        localStorage.setItem('lastSavedFormId', formId);
    } catch (error) {
        console.error('Error saving form:', error);
    } finally {
        hideLoadingIndicator(loadingIndicator);
    }
}