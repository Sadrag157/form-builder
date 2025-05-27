import { setupAddZoneButton } from './formUtils.js';
import { createFormZone } from './formZoneHandlers.js';
import { collectFormStructure } from './formUtils.js';

class Canvas {
    constructor() {
        this.formArea = document.getElementById('formArea');
        if (!this.formArea) {
            console.error("Form area not found!");
            return;
        }
        this.formZones = [];
        setupAddZoneButton(() => this.addFormZone());
    }

    saveForm() {
        const formStructure = collectFormStructure(this.formArea);
        try {
            localStorage.setItem('savedFormData', JSON.stringify(formStructure));
            console.log('Form saved successfully:', formStructure);
        } catch (e) {
            console.error('Error saving form to localStorage', e);
        }
    }

    addFormZone() {
        const zone = createFormZone(this.formZones, this.formArea);
        this.formZones.push(zone);
    }
}

export default Canvas;