import { streamableZoneDataIterator } from './formUtils.js';

export async function saveFormLogic(canvasInstance) {
    if (!canvasInstance.formArea) {
        console.error("Form area not found on canvasInstance.");
        return;
    }
    const formTitleInput = document.querySelector('.form-title-input');
    const formTitle = formTitleInput ? formTitleInput.value.trim() : 'Form without name';
    
    const loadingIndicator = canvasInstance.showLoadingIndicator ? canvasInstance.showLoadingIndicator('Saving the form in chunks...') : null;
    console.log("Starting to save form in chunks...");

    const CHUNKS_PER_KEY = 10;
    let chunkIndex = 0;
    let zonesInCurrentStorageChunk = [];
    let totalZonesProcessed = 0;

    for (let i = 0; ; i++) {
        const chunkKey = `exportedForm_chunk_${i}`;
        if (localStorage.getItem(chunkKey) === null) break;
        localStorage.removeItem(chunkKey);
    }
    localStorage.removeItem('exportedForm_meta');

    for await (const zoneData of streamableZoneDataIterator(canvasInstance.formArea)) {
        zonesInCurrentStorageChunk.push(zoneData);
        totalZonesProcessed++;

        if (zonesInCurrentStorageChunk.length >= CHUNKS_PER_KEY) {
            try {
                localStorage.setItem(`exportedForm_chunk_${chunkIndex}`, JSON.stringify(zonesInCurrentStorageChunk));
                console.log(`Saved chunk ${chunkIndex} with ${zonesInCurrentStorageChunk.length} zones.`);
                if(loadingIndicator && canvasInstance.showLoadingIndicator) loadingIndicator.textContent = `Saving... Chunk ${chunkIndex + 1} saved.`;
            } catch (e) {
                console.error(`Error saving chunk ${chunkIndex} to localStorage:`, e);
                if (canvasInstance.hideLoadingIndicator) canvasInstance.hideLoadingIndicator(loadingIndicator);
                return; 
            }
            chunkIndex++;
            zonesInCurrentStorageChunk = [];
            await new Promise(resolve => setTimeout(resolve, 5)); 
        }
    }

    if (zonesInCurrentStorageChunk.length > 0) {
        try {
            localStorage.setItem(`exportedForm_chunk_${chunkIndex}`, JSON.stringify(zonesInCurrentStorageChunk));
            console.log(`Saved final chunk ${chunkIndex} with ${zonesInCurrentStorageChunk.length} zones.`);
            chunkIndex++;
        } catch (e) {
             console.error(`Error saving final chunk ${chunkIndex} to localStorage:`, e);
             if(canvasInstance.hideLoadingIndicator) canvasInstance.hideLoadingIndicator(loadingIndicator);
             return;
        }
    }

    const metaData = {
        title: formTitle,
        totalChunks: chunkIndex,
        totalZones: totalZonesProcessed,
        savedAt: new Date().toISOString()
    };
    try {
        localStorage.setItem('exportedForm_meta', JSON.stringify(metaData));
    } catch (e) {
        console.error("Error saving form metadata to localStorage:", e);
        if(canvasInstance.hideLoadingIndicator) canvasInstance.hideLoadingIndicator(loadingIndicator);
        return;
    }
    
    if(canvasInstance.hideLoadingIndicator) canvasInstance.hideLoadingIndicator(loadingIndicator);
    console.log(`Form saved in ${chunkIndex} chunks. Total zones: ${totalZonesProcessed}. Title: "${formTitle}"`);
}