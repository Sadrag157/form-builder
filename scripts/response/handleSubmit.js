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

    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Checking...';

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            await checkAnswersAsync(formContainer, correctAnswers, submitBtn);
            submitBtn.textContent = 'Submitted';
        } catch (err) {
            if (err.name === 'AbortError') {
                console.warn('Submission aborted');
                submitBtn.textContent = 'Aborted';
            } else {
                console.error('Error during submission:', err);
                submitBtn.textContent = 'Error';
            }
        }
    });
}

async function checkAnswersAsync(formContainer, correctAnswers, submitBtn) {
    const allOptionElements = formContainer.querySelectorAll('.response-options-item');

    for(const optionEl of allOptionElements) {

        await new Promise(resolve => setTimeout(resolve, 200));

        optionEl.classList.remove('correct-answer', 'incorrect-answer');
        const radio = optionEl.querySelector('input[type="radio"]');
        if (!radio) continue;

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
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitted';
}
