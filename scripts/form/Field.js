export default class Field {
    constructor(type, options = {}) {
        this.type = type;

        this.options= [];
        this.id=options.id || Date.now();
        if(type==='radio'){
            const initialOptions=options.options || [];
            this.options=initialOptions.map((opt, index) =>({
                id: opt.id || Date.now() + index + Math.random(),
                text: opt.text || ``,
                value: opt.value || `value_${Date.now() + index + Math.random()}`,
                isCorrect: opt.isCorrect || false,
            }));
        }
        this.addOption=this.addOption.bind(this);
        this.removeOption=this.removeOption.bind(this);
        this.updateCorrectOption = this.updateCorrectOption.bind(this);
    }

    addOption(){
        const newOptionId = Date.now() + Math.random();
        const newOption = {
            id: newOptionId,
            text: '',
            value: `value_${newOptionId}`,
            isCorrect: false,
        };
        if (this.options.length === 0 || !this.options.some(opt => opt.isCorrect)) {
            newOption.isCorrect = true;
        }

        this.options.push(newOption);

        if (newOption.isCorrect) {
            this.options.forEach(opt => {
                if (opt.id !== newOption.id) {
                    opt.isCorrect = false;
                }
            });
        }
        console.log('Option added:', newOption, this.options);
        return newOption;
    }

    removeOption(optionId){
        const removedOption = this.options.find(opt => opt.id === optionId);
        this.options=this.options.filter(option=>option.id!==optionId);
        console.log('Option removed:', optionId, this.options);

        if (removedOption && removedOption.isCorrect && this.options.length > 0) {
            if (!this.options.some(opt => opt.isCorrect)) {
                 this.options[0].isCorrect = true;
            }
        }
    }

    updateCorrectOption(selectedOptionId) {
        let optionActuallyChangedToBeCorrect = null;
        this.options.forEach(option => {
            const shouldBeCorrect = (String(option.id) === selectedOptionId);
            if (option.isCorrect !== shouldBeCorrect) {
                option.isCorrect = shouldBeCorrect;
                if (shouldBeCorrect) {
                    optionActuallyChangedToBeCorrect = option;
                }
            }
        });
        const fieldElement = document.querySelector(`.field-container-builder[data-field-id="${this.id}"]`);
        if (fieldElement) {
            const radioButtons = fieldElement.querySelectorAll(`.option-item input[type="radio"]`);
            radioButtons.forEach(radio => {
                const parentOptionItem = radio.closest('.option-item');
                if (parentOptionItem) {
                    const optionId = parentOptionItem.dataset.optionId;
                    const linkedOption = this.options.find(opt => String(opt.id) === optionId);
                    if(linkedOption) radio.checked = linkedOption.isCorrect;
                }
            });
        }
    }

    removeField(button){
        if(button && button.parentElement) {
            button.remove();
        }
    }

    createOptionElement(option){
        const optionElement=document.createElement('div');
        optionElement.className='option-item';
        optionElement.dataset.optionId=option.id;

        const correctMarkerRadio = document.createElement('input');
        correctMarkerRadio.type = 'radio';
        correctMarkerRadio.name = `field_correct_option_${this.id}`;
        correctMarkerRadio.checked = option.isCorrect;
        correctMarkerRadio.title = "Mark as correct answer";
        correctMarkerRadio.value = String(option.id);
        correctMarkerRadio.addEventListener('change', (e) => {
            this.updateCorrectOption(e.target.value);
        });


        const textInput = document.createElement('input');
        textInput.type='text';
        textInput.value=option.text;
        textInput.placeholder='Option text';
        textInput.className='option-text-input';
        textInput.addEventListener('input', (e)=>{
            const optToUpdate = this.options.find(o => o.id === option.id);
            if (optToUpdate) {
                optToUpdate.text = e.target.value;
                optToUpdate.value = e.target.value;
            }
        });

        const removeOptionButton=document.createElement('button');
        removeOptionButton.innerHTML='✕';
        removeOptionButton.className='remove-option-button';
        removeOptionButton.title='Delete';
        removeOptionButton.addEventListener('click', ()=>{
            const parentOptionsContainer = optionElement.parentElement;
            const wasCorrect=option.isCorrect;

            this.removeOption(option.id);
            optionElement.remove();

            if (wasCorrect && this.options.length > 0) {
                this.updateCorrectOption(this.options[0].id);
            }else if (this.options.length > 0 && !this.options.some(opt => opt.isCorrect)) {
                this.updateCorrectOption(this.options[0].id);
            }
        });

        optionElement.appendChild(correctMarkerRadio);
        optionElement.appendChild(textInput);
        optionElement.appendChild(removeOptionButton);

        return optionElement;
    }

    render() {
        const field = document.createElement('div');
        field.className=`field field-container-builder ${this.type}-field-builder`;
        field.dataset.fieldId=this.id;
        field.dataset.fieldType=this.type;

        if (this.type==='radio'){
            field.className='field radio-field';
            field.style.width='100%';
            field.style.margin='0';

            const optionsContainer=document.createElement('div');
            optionsContainer.className='options-container';

            if(this.options.length===0){
                this.addOption();
            }else if (!this.options.some(opt => opt.isCorrect)) {
                this.options[0].isCorrect = true; 
            }

            this.options.forEach(option=>{
                if (!option.value) option.value = `value_${option.id}`;
                const optionElement=this.createOptionElement(option);
                optionsContainer.appendChild(optionElement);
            });

            const addOptionButton = document.createElement('button');
            addOptionButton.textContent='Add Option';
            addOptionButton.className='add-option-button sidebar-button';
            addOptionButton.type='button';
            addOptionButton.addEventListener('click', ()=>{
                const newOption = this.addOption();
                const newOptionElement = this.createOptionElement(newOption);
                optionsContainer.appendChild(newOptionElement);

                if (newOption.isCorrect) {
                    const allRadiosInGroup = optionsContainer.querySelectorAll(`input[type="radio"][name="field_correct_option_${this.id}"]`);
                    allRadiosInGroup.forEach(radio => {
                        const radioOptionItem = radio.closest('.option-item');
                        if (radioOptionItem && radioOptionItem.dataset.optionId !== String(newOption.id)) {
                            radio.checked = false;
                        }
                    });
                }
            });

            field.appendChild(optionsContainer);
            field.appendChild(addOptionButton);

            const removeBtn=document.createElement('button');
            removeBtn.innerHTML='✕';
            removeBtn.className='removeButton';
            removeBtn.title='Delete';
            removeBtn.addEventListener('click', ()=>this.removeField(field));
            field.appendChild(removeBtn);
        }else{
            field.innerHTML=`<p style="color:red;">Unkown field type: ${this.type}</p>`;
        }
        return field;
    }
}