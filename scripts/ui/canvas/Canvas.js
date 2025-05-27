import { setupAddZoneButton, collectFormStructure, saveFormAsync } from './formUtils.js';
import { createFormZone } from './formZoneHandlers.js';

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

    async saveForm() {
        const formStructure = collectFormStructure(this.formArea);
        try {
            await saveFormAsync(formStructure);
            console.log('Form saved asynchronously:', formStructure);
        } catch (e) {
            console.error('Error saving form asynchronously', e);
        }
    }

    addFormZone() {
        const zone = createFormZone(this.formZones, this.formArea);
        this.formZones.push(zone);
    }
}

export default Canvas;