export class FieldRenderer {
    constructor(fieldDataInstance, containerElement = null) {
        this.fieldData = fieldDataInstance;
        this.hostElement = containerElement;
        this.fieldElement = null;
        this.optionsContainerElement = null;

        this._handleAddOptionClick = this._handleAddOptionClick.bind(this);
        this._handleRemoveFieldClick = this._handleRemoveFieldClick.bind(this);
    }

    render() {
        this.fieldElement = document.createElement('div');
        this.fieldElement.className = `field field-container-builder ${this.fieldData.type}-field-builder`;
        this.fieldElement.dataset.fieldId = this.fieldData.id;
        this.fieldElement.dataset.fieldType = this.fieldData.type;

        if (this.fieldData.type === 'radio') {
            this.fieldElement.classList.add('radio-field');
            this.fieldElement.style.width = '100%';
            this.fieldElement.style.margin = '0';

            this.optionsContainerElement = document.createElement('div');
            this.optionsContainerElement.className = 'options-container';

            if (this.fieldData.options.length === 0) {
                this.fieldData.addOption();
            }
             this.fieldData._ensureInitialCorrectOption();


            this.fieldData.options.forEach(option => {
                if (!option.value) option.value = `value_${option.id}`;
                const optionElement = this._createOptionElement(option);
                this.optionsContainerElement.appendChild(optionElement);
            });

            const addOptionButton = document.createElement('button');
            addOptionButton.textContent = 'Add Option';
            addOptionButton.className = 'add-option-button sidebar-button';
            addOptionButton.type = 'button';
            addOptionButton.addEventListener('click', this._handleAddOptionClick);

            const removeFieldButton = document.createElement('button');
            removeFieldButton.innerHTML = '✕';
            removeFieldButton.className = 'removeButton';
            removeFieldButton.title = 'Delete Field';
            removeFieldButton.addEventListener('click', this._handleRemoveFieldClick);

            this.fieldElement.appendChild(this.optionsContainerElement);
            this.fieldElement.appendChild(addOptionButton);
            this.fieldElement.appendChild(removeFieldButton);

        } else {
            this.fieldElement.innerHTML = `<p style="color:red;">Unknown field type: ${this.fieldData.type}</p>`;
        }

        if (this.hostElement) {
            this.hostElement.appendChild(this.fieldElement);
        }
        return this.fieldElement;
    }

    _createOptionElement(optionInstance) {
        const optionElement = document.createElement('div');
        optionElement.className = 'option-item';
        optionElement.dataset.optionId = optionInstance.id;

        const correctMarkerRadio = document.createElement('input');
        correctMarkerRadio.type = 'radio';
        correctMarkerRadio.name = `field_correct_option_${this.fieldData.id}`;
        correctMarkerRadio.checked = optionInstance.isCorrect;
        correctMarkerRadio.title = "Mark as correct answer";
        correctMarkerRadio.value = String(optionInstance.id);
        correctMarkerRadio.addEventListener('change', (e) => {
            this.fieldData.updateCorrectOption(e.target.value);
            this._updateRadioStatesInDOM();
        });

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = optionInstance.text;
        textInput.placeholder = 'Option text';
        textInput.className = 'option-text-input';
        textInput.addEventListener('input', (e) => {
            optionInstance.text = e.target.value;
            optionInstance.value = e.target.value; 
        });

        const removeOptionButton = document.createElement('button');
        removeOptionButton.innerHTML = '✕';
        removeOptionButton.className = 'remove-option-button';
        removeOptionButton.title = 'Delete Option';
        removeOptionButton.addEventListener('click', () => {
            const wasCorrect = optionInstance.isCorrect;
            this.fieldData.removeOption(optionInstance.id);
            optionElement.remove();
            this._ensureCorrectOptionAfterDataChange(wasCorrect);
        });

        optionElement.appendChild(correctMarkerRadio);
        optionElement.appendChild(textInput);
        optionElement.appendChild(removeOptionButton);

        return optionElement;
    }
    
    _ensureCorrectOptionAfterDataChange(wasImpactedOptionCorrect = false) {
        if (this.fieldData.type === 'radio' && this.fieldData.options.length > 0) {
            if (wasImpactedOptionCorrect && !this.fieldData.options.some(opt => opt.isCorrect)) {
                 this.fieldData.options[0].isCorrect = true;
            }
        }
        this._updateRadioStatesInDOM();
    }


    _handleAddOptionClick() {
        const newOptionInstance = this.fieldData.addOption({});
        if (newOptionInstance && this.optionsContainerElement) {
            const newOptionElement = this._createOptionElement(newOptionInstance);
            this.optionsContainerElement.appendChild(newOptionElement);
            this._ensureCorrectOptionAfterDataChange();
        }
    }

    _handleRemoveFieldClick() {
        if (this.fieldElement) {
            this.fieldElement.remove();
            this.fieldElement = null;
        }
    }

    _updateRadioStatesInDOM() {
        if (!this.fieldElement || this.fieldData.type !== 'radio') return;

        const radioInputs = this.fieldElement.querySelectorAll(
            `.option-item input[type="radio"][name="field_correct_option_${this.fieldData.id}"]`
        );
        radioInputs.forEach(radio => {
            const parentOptionItem = radio.closest('.option-item');
            if (parentOptionItem) {
                const optionId = parentOptionItem.dataset.optionId;
                const linkedOptionData = this.fieldData.getOptionById(optionId);
                if (linkedOptionData) {
                    radio.checked = linkedOptionData.isCorrect;
                }
            }
        });
    }

    destroy() {
        this._handleRemoveFieldClick();
    }
}