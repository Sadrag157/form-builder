import { FieldRenderer } from '../form/fieldRenderer.js';
import { FieldData } from '../form/fieldData.js';


export function handleDrop(event, dropZone) {
    event.preventDefault();
    dropZone.classList.remove('highlight');

    const fieldType = event.dataTransfer.getData('text/plain');
    if (fieldType) {
        let fieldInstance;
        if (fieldType === 'radio') {
            const fieldData = new FieldData('radio', {
                options: [{ text: '', id: Date.now() }]
            });

            fieldInstance = new FieldRenderer(fieldData, dropZone);
        } else {
            console.warn('Unknown field type dropped:', fieldType);
            return;
        }

        if (fieldInstance) {
            fieldInstance.render();
            const placeholder = dropZone.querySelector('.placeholderText');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
    }
}
