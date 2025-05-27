export function renderForm(formStructure, container, titleElement) {
    titleElement.textContent = formStructure.title || 'Untitled Form';
    container.innerHTML = '';

    if (!formStructure.zones || formStructure.zones.length === 0) {
        container.innerHTML = '<p>This form has no question.</p>';
        return;
    }

    formStructure.zones.forEach((zone, zoneIndex) => {
        const zoneElement = document.createElement('div');
        zoneElement.className = 'response-zone';

        const questionTitle = document.createElement('h3');
        questionTitle.className = 'response-question-title';
        questionTitle.textContent = zone.question || `Question ${zoneIndex + 1}`;
        zoneElement.appendChild(questionTitle);

        zone.fields?.forEach((field, fieldIndex) => {
            const fieldElement = document.createElement('div');
            fieldElement.className = 'response-field';

            if (field.type === 'radio' && field.options?.length > 0) {
                const optionsContainer = document.createElement('div');
                optionsContainer.className = 'response-options-container';
                const radioGroupName = `q_${zoneIndex}_f_${field.id || fieldIndex}_radio`;

                field.options.forEach((option, optionIndex) => {
                    const optionDiv = document.createElement('div');
                    optionDiv.className = 'response-options-item';
                    optionDiv.dataset.optionId = option.id;

                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = radioGroupName;
                    input.value = option.id;
                    input.id = `${radioGroupName}_opt${option.id}`;
                    input.className = 'rasponse-radio-input';

                    const label = document.createElement('label');
                    label.htmlFor = input.id;
                    label.textContent = option.text;

                    optionDiv.appendChild(input);
                    optionDiv.appendChild(label);
                    optionsContainer.appendChild(optionDiv);
                });

                fieldElement.appendChild(optionsContainer);
            }

            if (fieldElement.hasChildNodes()) {
                zoneElement.appendChild(fieldElement);
            }
        });

        container.appendChild(zoneElement);
    });
}
