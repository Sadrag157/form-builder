export function collectFormStructure(formArea) {
    const formTitleInput = document.querySelector('.form-title-input');
    const formTitle = formTitleInput ? formTitleInput.value : 'Untitled Form';

    const formStructure = {
        title: formTitle,
        zones: []
    };

    const dropZones = formArea.querySelectorAll('.drop-zone');
    dropZones.forEach(dropZone => {
        const questionInput = dropZone.querySelector('.question-title');
        const questionTitle = questionInput ? questionInput.value : 'Untitled Question';

        const zoneData = {
            question: questionTitle,
            fields: []
        };

        const fields = dropZone.querySelectorAll('.field');
        fields.forEach(fieldElement => {
            const fieldType = fieldElement.dataset.fieldType;
            if (fieldType === 'radio') {
                const options = [];
                const optionElements = fieldElement.querySelectorAll('.option-item');
                optionElements.forEach(optionElement => {
                    const textInput = optionElement.querySelector('.option-text-input');
                    const radioInput = optionElement.querySelector('input[type="radio"]');
                    if (textInput && radioInput) {
                        options.push({
                            id: radioInput.value,
                            text: textInput.value,
                            value: radioInput.value,
                            isCorrect: radioInput.checked
                        });
                    }
                });

                if (options.length > 0 && options.some(opt => opt.text.trim() !== '')) {
                    zoneData.fields.push({ type: 'radio', options });
                }
            }
        });

        if (zoneData.fields.length > 0) {
            formStructure.zones.push(zoneData);
        }
    });

    return formStructure;
}

export async function* streamableZoneDataIterator(formArea) {
    const dropZones = formArea.querySelectorAll('.drop-zone');
    let zoneIndex = 0;

    for (const dropZone of dropZones) {
        const questionInput = dropZone.querySelector('.question-title');
        const questionTitle = questionInput ? questionInput.value : `Untitled Question ${zoneIndex + 1}`;
        const zoneId = dropZone.dataset.id || `zone-dom-${zoneIndex}`;

        const zoneData = {
            id: zoneId,
            question: questionTitle,
            fields: []
        };

        const fieldElements = dropZone.querySelectorAll('.field.field-container-builder');
        for (const fieldElement of fieldElements) {
            const fieldType = fieldElement.dataset.fieldType;
            const fieldDataId = fieldElement.dataset.fieldId;

            if (fieldType === 'radio') {
                const options = [];
                const optionItems = fieldElement.querySelectorAll('.option-item');
                optionItems.forEach(item => {
                    const textInput = item.querySelector('.option-text-input');
                    const correctMarker = item.querySelector(`input[type="radio"][name="field_correct_option_${fieldDataId}"]`);
                    const optionId = item.dataset.optionId;

                    if (textInput && correctMarker && optionId) {
                        options.push({
                            id: optionId,
                            text: textInput.value,
                            value: optionId,
                            isCorrect: correctMarker.checked
                        });
                    }
                });

                if (options.length > 0) {
                    zoneData.fields.push({
                        id: fieldDataId,
                        type: 'radio',
                        options: options
                    });
                }
            }
        }

        if (zoneData.fields.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
            yield zoneData;
        }
        zoneIndex++;
    }
}

export async function saveFormAsync(formStructure) {
    try {
        const json = JSON.stringify(formStructure);
        localStorage.setItem('exportedForm', json);
        console.log('Form saved:', formStructure);
    } catch (e) {
        console.error('Error saving form:', e);
    }
}