class Canvas {
    constructor() {
        this.dropZone = document.getElementById('dropZone');
        this.placeholderText=document.getElementById('placeholderText');
        this.fields = [];
        this.setupDropZone();
        this.updatePlaceholderVisibility();
    }

    updatePlaceholderVisibility(){
        if(this.fields.length===0) {
            this.placeholderText.style.display='block';
        }else{
            this.placeholderText.style.display='none';
        }
    }

    addField(fieldType){
        const field = new Field(fieldType, {label: ''})
        this.fields.push(field);
        this.dropZone.appendChild(field.render());
        this.updatePlaceholderVisibility();
    }
    
    setupDropZone() {
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('highlight')
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('highlight');
        })
        console.log(this.dropZone)
        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('highlight');
            const fieldType = e.dataTransfer.getData('text/plain');
            if(fieldType){
                this.addField(fieldType);
            }else{
                this.updatePlaceholderVisibility();
            }
        });
    }
}

new Canvas();