class Field {
    constructor(type, options = {}) {
        this.type = type;
        this.label = options.label || '';
    }

    removeField(button){
        button.parentElement.remove();
    }

    render() {
        const field = document.createElement('div');
        field.className = 'field';
        if(this.type === 'button') {
            field.innerHTML = `<button>${this.label}</button>`;
        }
        else{
            field.innerHTML = `
                <label>${this.label}</label>
                <input type="${this.type}" placeholder="Option">
                <button class="removeButton"onclick="removeField(this)">✕</button>
            `;

            const removeBtn = field.querySelector('.removeButton')
            removeBtn.addEventListener('click', () => this.removeField(removeBtn));
        }
        return field;
    }
}