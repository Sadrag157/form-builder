export default class Field {
    constructor(type, options = {}) {
        this.type = type;
        this.label = options.label || '';
    }

    removeField(button){
        if(button && button.parentElement) {
            button.parentElement.remove();
        }
    }

    render() {
        const field = document.createElement('div');
        field.className = 'field';
        field.innerHTML = `
            <label>${this.label}</label>
            <input type="${this.type}" placeholder="Option">
            <button class="removeButton">✕</button>
        `;

        const removeBtn = field.querySelector('.removeButton')
        removeBtn.addEventListener('click', () => this.removeField(removeBtn));
        return field;
    }
}