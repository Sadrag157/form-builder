import { handleDrop } from './dragAndDropHandlers.js';
import { asyncFilter } from '../../utils/asyncArray.js';

const abortController = new AbortController();

export async function removeFieldsByType(zone, typeToRemove) {
    try {
        zone.fields = await asyncFilter(
            zone.fields,
            async (field) => {
                await new Promise(res => setTimeout(res, 10));
                return field.type !== typeToRemove;
            },
            abortController.signal
        );
    } catch (e) {
        if (e.name === 'AbortError') {
            console.warn('Filtering aborted');
        } else {
            throw e;
        }
    }
}

export function createFormZone(formZones, formArea) {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.placeholder = 'Question title';
    questionInput.className = 'question-title';
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

    dropZone.addEventListener('drop', e => handleDrop(e, dropZone));

    formArea.appendChild(dropZone);

    return { dropZone };
}