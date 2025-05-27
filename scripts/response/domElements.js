export function getDomElements() {
    return {
        responseFormArea: document.getElementById('responseFormArea'),
        formTitleElement: document.querySelector('.response-form-title'),
        submitButton: document.getElementById('submitResponseButton')
    };
}

export function showErrorUI(message) {
    const { responseFormArea, formTitleElement, submitButton } = getDomElements();
    if (responseFormArea) responseFormArea.innerHTML = `<p>${message}</p>`;
    if (formTitleElement) formTitleElement.textContent = 'Error';
    if (submitButton) submitButton.style.display = 'none';
}
