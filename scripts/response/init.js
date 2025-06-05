import { getDomElements, showErrorUI } from './domElements.js';
import { loadFormStructureFromFirebase } from './loadFormData.js';
import { renderForm } from './renderForm.js';
import { setupSubmitHandler } from './handleSubmit.js';
import { auth, onAuthStateChanged } from '../api/firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Response page DOM loaded and parsed");

    const { responseFormArea, formTitleElement, submitButton } = getDomElements();
    if (!responseFormArea || !formTitleElement || !submitButton) {
        console.warn("Required elements not found");
        return;
    }

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            showErrorUI('Please sign in to view forms');
            return;
        }

        try {
            const formStructure = await loadFormStructureFromFirebase();

            if (!formStructure || !formStructure.zones || formStructure.zones.length === 0) {
                console.log("Loaded form structure is empty or invalid.");
                showErrorUI('The loaded form is empty or has no questions.');
                if(submitButton) submitButton.style.display = 'none';
                return;
            }
            
            renderForm(formStructure, responseFormArea, formTitleElement);
            setupSubmitHandler(formStructure, responseFormArea, submitButton);
        } catch (e) {
            console.error('Error loading form:', e);
            showErrorUI('Error loading form data.');
            if(submitButton) submitButton.style.display = 'none';
        }
    });
});
