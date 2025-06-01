import { createFormZone } from './formZoneHandlers.js';
import { showLoadingIndicator, hideLoadingIndicator} from './canvasUIFeedback.js';
import { generateAndAddLargeFormLogic } from './canvasFormGenerator.js';
import { saveFormLogic } from './canvasFormSaver.js';


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

    async generateAndAddLargeForm(numZones = 1000) {
        await generateAndAddLargeFormLogic(this, numZones);
    }

    showLoadingIndicator(message) {
        return showLoadingIndicator(message);
    }

    hideLoadingIndicator(indicator) {
        hideLoadingIndicator(indicator);
    }

    async saveForm() {
        await saveFormLogic(this);
    }

    addFormZone(questionTitleText) {
        const defaultTitle = `Question ${this.formZones.length + 1}`;
        const title = questionTitleText || defaultTitle;
        
        const zoneElement = createFormZone(this.formZones, this.formArea, title);
        
        const zoneId = `zone-${this.formZones.length}-${Date.now()}`;
        try {
            zoneElement.dataset.id = zoneId; 
        } catch (e) {
            return null;
        }

        const zoneObject = { dropZone: zoneElement, id: zoneId };
        this.formZones.push(zoneObject);
        return zoneElement; 
    }

}

function setupAddZoneButton(callback) {
    const button = document.getElementById('addFormZoneButton');
    if (button) {
        button.addEventListener('click', callback);
    } else {
        console.error("Button 'addFormZoneButton' not found for setup. Add Zone functionality will not work.");
    }
}

export default Canvas;