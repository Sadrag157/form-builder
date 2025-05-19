import Field from '../form/Field.js';

class Canvas {
    constructor() {
        this.formArea=document.getElementById('formArea');
        if(!this.formArea){
            console.error("Form area not found!");
            return;
        }
        this.formZones=[];
        this.setupAddZoneButton();
    }

    setupAddZoneButton(){
        const button = document.getElementById('addFormZoneButton');
        if(button){
            button.addEventListener('click', ()=> this.addFormZone());
        }else{
            console.error("Button 'addFormZoneButton' not found");
        }
    }

    saveForm(){
        const formTitleInput=document.querySelector('.form-title-input');
        const formTitle=formTitleInput?formTitleInput.value:'Untitled Form';

        const formStructure={
            title: formTitle,
            zones:[]
        }

        const dropZones=this.formArea.querySelectorAll('.drop-zone');
        dropZones.forEach(dropZone=>{
            const questionInput=dropZone.querySelector('.question-title');
            const questionTitle=questionInput?questionInput.value:'Untitled Question';

            const zoneData={
                question: questionTitle,
                fields:[]
            }

            const fields=dropZone.querySelectorAll('.field')
            fields.forEach(fieldElement=>{
                const fieldType=fieldElement.dataset.fieldType;

                if(fieldType==='radio'){
                    const options=[];
                    const optionElements=fieldElement.querySelectorAll('.option-item');
                    optionElements.forEach(optionElement=>{
                        const textInput = optionElement.querySelector('.option-text-input');
                        const radioInput = optionElement.querySelector('input[type="radio"]')
                        if(textInput && radioInput){
                            options.push({
                                id: radioInput.value,
                                text: textInput.value,
                                value: radioInput.value,
                                isCorrect: radioInput.checked
                            });
                        }
                    });

                    const fieldData={
                        type:'radio',
                        options: options
                    };

                    if(options.some(opt=> opt.text.trim() !== '')){
                        zoneData.fields.push(fieldData);
                    }else if (options.length===0){
                        console.warn(`Radio field in zone "${questionTitle}" has no options and will not be saved.`)
                    }else{
                        console.warn(`Radio field in zone "${questionTitle}" has options with empty text and will be saved`);
                        zoneData.fields.push(fielddata);
                    }
                }
            });
            if(zoneData.fields.length>0){
                formStructure.zones.push(zoneData);
            }else{
                console.warn(`Zone "${questionTitle}" has no fields and will not be saved`)
            }
        });

        try{
            localStorage.setItem('savedFormData', JSON.stringify(formStructure));
            console.log('Form saved successfully:', formStructure);
        }catch(e){
            console.error('Error saving form to localStorage', e);
        }
    }

    addFormZone(){
        const dropZone = document.createElement('div');
        dropZone.className='drop-zone';

        const questionInput=document.createElement('input');
        questionInput.type='text';
        questionInput.placeholder='Question title';
        questionInput.className='question-title';
        dropZone.appendChild(questionInput);

        const placeholder=document.createElement('p');
        placeholder.textContent='Drag elements here';
        placeholder.className='placeholderText';
        dropZone.appendChild(placeholder);

        const removeZoneButton = document.createElement('button');
        removeZoneButton.innerHTML = '🗑️';
        removeZoneButton.title='Delete';
        removeZoneButton.className='removeZoneButton';
        removeZoneButton.onclick=()=>dropZone.remove();
        dropZone.appendChild(removeZoneButton);

        const currentCanvasInstance = this;
        const currentZoneFields=[];

        removeZoneButton.onclick=()=>{
            dropZone.remove();
            currentCanvasInstance.formZones=currentCanvasInstance.formZones.filter(zone=>zone.dropZone!==dropZone);
        }
        dropZone.appendChild(removeZoneButton);

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('highlight');
        })

        dropZone.addEventListener('dragleave', ()=> {
            dropZone.classList.remove('highlight');
        })

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('highlight');
            const fieldType=e.dataTransfer.getData('text/plain');
            if(fieldType){
                let fieldInstance;
                if(fieldType==='radio') {
                    fieldInstance=new Field('radio', {
                        options: [{id: Date.now(), text: ''}]
                    });
                }else{
                    console.warn('Unknown field type dropped: ', fieldType);
                    return;
                }

                if(fieldInstance){
                    const fieldRenderedElement = fieldInstance.render();
                    const placeholder = dropZone.querySelector('.placeholderText');
                    if(placeholder){
                        dropZone.insertBefore(fieldRenderedElement, placeholder);
                        placeholder.style.display='none';
                    }else{
                        dropZone.appendChild(fieldRenderedElement);
                    }

                }
            }
        });

        this.formArea.appendChild(dropZone);
    }
}

export default Canvas;