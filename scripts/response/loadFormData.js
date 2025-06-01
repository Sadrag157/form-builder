export function loadFormStructureFromChunks() {
    const metaString = localStorage.getItem('exportedForm_meta');
    if (!metaString) {
        console.error("Form metadata (exportedForm_meta) not found in localStorage.");
        throw new Error('Form metadata not found. Please build and save a form first.');
    }

    let meta;
    try {
        meta = JSON.parse(metaString);
    } catch (e) {
        console.error("Failed to parse form metadata:", e);
        throw new Error('Corrupted form metadata.');
    }
    

    const formStructure = {
        title: meta.title || 'Untitled Form',
        zones: []
    };

    console.log(`Loading form titled "${formStructure.title}", expecting ${meta.totalChunks} chunks, ${meta.totalZones} zones.`);

    for (let i = 0; i < meta.totalChunks; i++) {
        const chunkKey = `exportedForm_chunk_${i}`;
        const chunkString = localStorage.getItem(chunkKey);
        if (chunkString) {
            try {
                const chunkZones = JSON.parse(chunkString);
                formStructure.zones.push(...chunkZones);
            } catch (e) {
                console.warn(`Failed to parse chunk ${i} (${chunkKey}):`, e);
            }
        } else {
            console.warn(`Missing form chunk: ${chunkKey}.`);
        }
    }

    if (formStructure.zones.length !== meta.totalZones) {
        console.warn(`Data integrity issue: Loaded ${formStructure.zones.length} zones, but metadata expected ${meta.totalZones}. The form might be incomplete or corrupted.`);
    } else {
        console.log(`Successfully loaded ${formStructure.zones.length} zones from ${meta.totalChunks} chunks.`);
    }
    
    return formStructure;
}