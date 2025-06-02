import { FormStreamProcessor } from '../../utils/formStreamProcessor.js';
import {showLoadingIndicator, hideLoadingIndicator} from './canvasUIFeedback.js'

export async function saveFormLogic(canvasInstance) {
    const loadingIndicator = showLoadingIndicator('Saving form in chunks...');
    
    try {
        const chunks = await FormStreamProcessor.saveFormInChunks(canvasInstance.formArea);
        
        chunks.forEach((chunk, index) => {
            localStorage.setItem(`exportedForm_chunk_${index}`, JSON.stringify(chunk));
        });

        const metaData = {
            title: document.querySelector('.form-title-input')?.value || 'Untitled Form',
            totalChunks: chunks.length,
            totalZones: chunks.flat().length,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('exportedForm_meta', JSON.stringify(metaData));
        
        console.log(`Form saved in ${chunks.length} chunks`);
    } catch (error) {
        console.error('Error saving form:', error);
    } finally {
        hideLoadingIndicator(loadingIndicator);
    }
}