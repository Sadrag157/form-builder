class Canvas {
    constructor() {
        this.dropZone = document.getElementById('dropZone');
        this.fields = [];
        this.setupDropZone();
    }

    addField(fieldType){
        const field = new Field(fieldType, {label: `Field ${this.fields.length + 1}`})
        this.fields.push(field);
        this.dropZone.appendChild(field.render());
    }

    setupDropZone() {
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('highlight')
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList('highight');
        })

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('highlight');
            const fieldType = e.dataTransfer.getData('text/plain');
            if(fieldType){
                this.addField(fieldType);
            }
        });
    }
}

new Canvas();