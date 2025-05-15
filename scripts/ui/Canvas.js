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

    addFormZone(){
        const dropZone = document.createElement('div');
        dropZone.className='drop-zone';

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
                const label = '';
                const fieldInstance = new Field(fieldType, {label: label});

                currentZoneFields.push(fieldInstance);

                const fieldRenderedElement=fieldInstance.render();
                dropZone.appendChild(fieldRenderedElement);

                if(placeholder){
                    placeholder.style.display='none';
                }
            }
        });

        this.formArea.appendChild(dropZone);
        this.formZones.push({dropZone:dropZone, fields:currentZoneFields});
    }
}

export default Canvas;