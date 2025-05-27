import { getDomElements, showErrorUI } from './domElements.js';
import { loadFormStructure } from './loadFormData.js';
import { renderForm } from './renderForm.js';
import { setupSubmitHandler } from './handleSubmit.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Response page DOM loaded and parsed");

    const { responseFormArea, formTitleElement, submitButton } = getDomElements();
    if (!responseFormArea || !formTitleElement || !submitButton) {
        console.warn("Required elements not found");
        return;
    }

    const savedFormString = localStorage.getItem('exportedForm');
    if (!savedFormString) {
        showErrorUI('No form data found. Please build and save a form first');
        return;
    }

    try {
        const formStructure = loadFormStructure(savedFormString);
        renderForm(formStructure, responseFormArea, formTitleElement);
        setupSubmitHandler(formStructure, responseFormArea, submitButton);
    } catch (e) {
        console.error('Error loading form:', e);
        showErrorUI('Error loading form data.');
    }
});
