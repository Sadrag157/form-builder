import { FieldData } from '../form/fieldData.js';
import { FieldRenderer } from '../form/fieldRenderer.js';

export async function generateAndAddLargeFormLogic(canvasInstance, numZones = 1000) {
    if (!canvasInstance.formArea) {
        console.error("Form area not found on canvasInstance, can't generate large form.");
        return;
    }
    console.log(`Starting to generate ${numZones} form zones...`);
    const startTime = performance.now();
    const loadingIndicator = canvasInstance.showLoadingIndicator ? canvasInstance.showLoadingIndicator(`Generating ${numZones} questions...`) : null;
    let zonesSuccessfullyAdded = 0;

    const batchSize = 20;
    const progressUpdateInterval = 10;

    for (let i = 0; i < numZones; i++) {
        const questionText = `Question ${i + 1}`;
        
        const dropZoneElement = canvasInstance.addFormZone(questionText); 

        if (!dropZoneElement) {
            console.error(`Failed to add zone ${i + 1} (addFormZone returned null/undefined). Stopping generation.`);
            break; 
        }

        const fieldData = new FieldData('radio', {
            options: [ 
                { text: 'Option A', isCorrect: true },
                { text: 'Option B' },
                { text: 'Option C' }
            ]
        });

        const fieldRenderer = new FieldRenderer(fieldData, dropZoneElement);
        try {
            fieldRenderer.render(); 
        } catch (renderError) {
            console.error(`Error rendering field for zone ${i + 1}. Error:`, renderError);
            break;
        }
        
        const placeholder = dropZoneElement.querySelector('.placeholderText');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        zonesSuccessfullyAdded++;

        if ((i + 1) % progressUpdateInterval === 0) {
             console.log(`Progress: ${zonesSuccessfullyAdded}/${numZones} zones processed.`);
        }

        if ((i + 1) % batchSize === 0) {
            if(loadingIndicator && canvasInstance.showLoadingIndicator) loadingIndicator.textContent = `Generation... ${zonesSuccessfullyAdded}/${numZones} questions added.`;
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    
    if (canvasInstance.hideLoadingIndicator) canvasInstance.hideLoadingIndicator(loadingIndicator);
    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`Generation attempt finished. ${zonesSuccessfullyAdded}/${numZones} zones successfully added in ${duration.toFixed(2)} seconds.`);
}
