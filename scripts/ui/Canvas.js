class Canvas {
    constructor() {
        this.element = document.getElementById('canvas');
        this.fields = [];
        this.setupDragAndDrop();
    }

    addField(field) {
        this.fields.push(field);
        this.element.appendChild(field.render());
    }

    setupDragAndDrop() {
        this.element.addEventListener('dragover', e => e.preventDefault());
        this.element.addEventListener('drop', e => {
            e.preventDefault();
            const type = e.dataTransfer.getData('text/plain');
            this.addField(new Field(type, {label: `Field ${this.field.length + 1}`}));
        })
    }
}

new Canvas();