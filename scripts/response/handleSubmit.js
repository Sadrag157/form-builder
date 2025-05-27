export function setupSubmitHandler(formStructure, formContainer, submitBtn) {
    const correctAnswers = {};

    formStructure.zones?.forEach((zone, zoneIndex) => {
        zone.fields?.forEach((field, fieldIndex) => {
            if (field.type === 'radio') {
                const radioGroupName = `q_${zoneIndex}_f_${field.id || fieldIndex}_radio`;
                const correctOption = field.options?.find(opt => opt.isCorrect);
                if (correctOption) {
                    correctAnswers[radioGroupName] = String(correctOption.id);
                }
            }
        });
    });

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const allOptionElements = formContainer.querySelectorAll('.response-options-item');

        allOptionElements.forEach(optionEl => {
            optionEl.classList.remove('correct-answer', 'incorrect-answer');
            const radio = optionEl.querySelector('input[type="radio"]');
            if (!radio) return;

            const groupName = radio.name;
            const selected = radio.checked;
            const correctId = correctAnswers[groupName];
            const isCorrect = optionEl.dataset.optionId === correctId;

            if (selected && isCorrect) {
                optionEl.classList.add('correct-answer');
            } else if (selected) {
                optionEl.classList.add('incorrect-answer');
            } else if (!selected && isCorrect) {
                optionEl.classList.add('correct-answer');
            }

            radio.disabled = true;
        });

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitted';
    });
}