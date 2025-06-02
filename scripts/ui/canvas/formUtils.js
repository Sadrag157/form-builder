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