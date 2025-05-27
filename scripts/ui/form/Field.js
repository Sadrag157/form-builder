import { FieldData } from './fieldData.js';
import { FieldRenderer } from './fieldRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
    const fieldsContainer = document.getElementById('fields-area');

    if (!fieldsContainer) {
        console.error('Container for fields not found');
        return;
    }

    const radioFieldData2 = new FieldData('radio', { id: 'question2' });
    const radioFieldRenderer2 = new FieldRenderer(radioFieldData2, fieldsContainer);
    radioFieldRenderer2.render();

    setTimeout(() => {
        if (radioFieldData1) {
            const addedOption = radioFieldData1.addOption({ text: 'New option added' });
            
            if (addedOption && radioFieldRenderer1.optionsContainerElement) {
                const newOptionElement = radioFieldRenderer1._createOptionElement(addedOption);
                radioFieldRenderer1.optionsContainerElement.appendChild(newOptionElement);
                radioFieldRenderer1._updateRadioStatesInDOM();
                console.log('Option added in DOM');
            }
        }
    }, 3000);

});

export default {
    FieldData,
    FieldRenderer
};