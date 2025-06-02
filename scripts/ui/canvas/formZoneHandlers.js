import { handleDrop } from './dragAndDropHandlers.js';

export function createFormZone(formZones, formArea, questionTitleText) {
    if (!formArea || typeof formArea.appendChild !== 'function') {
        return undefined; 
    }

    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.placeholder = 'Question title';
    questionInput.className = 'question-title';
    questionInput.value = questionTitleText || `Question ${formZonesArray.length + 1}`;
    dropZone.appendChild(questionInput);

    const placeholder = document.createElement('p');
    placeholder.textContent = 'Drag elements here';
    placeholder.className = 'placeholderText';
    dropZone.appendChild(placeholder);

    const removeZoneButton = document.createElement('button');
    removeZoneButton.innerHTML = '🗑️';
    removeZoneButton.title = 'Delete';
    removeZoneButton.className = 'removeZoneButton';
    removeZoneButton.onclick = () => {
        dropZone.remove();
        formZones.splice(formZones.indexOf(dropZone), 1);
    };
    dropZone.appendChild(removeZoneButton);

    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('highlight');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('highlight');
    });

    if (typeof handleDrop === 'function') {
        dropZone.addEventListener('drop', e => handleDrop(e, dropZone));
    } else {
        console.warn('[createFormZone] handleDrop is not a function. Drag and drop will not work for fields.');
    }
    
    try {
        formArea.appendChild(dropZone);
    } catch (e) {
        console.error("[createFormZone] CRITICAL: Error appending dropZone to formArea:", e);
        return undefined; 
    }

    return dropZone;
}