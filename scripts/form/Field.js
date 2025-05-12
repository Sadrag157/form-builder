class Field {
    constructor(type, options = {}) {
        this.type = type;
        this.label = options.label || '';
        this.placeholder = options.placeholder || '';
    }

    render() {
        const field = document.createElement('div');
        field.className = 'field';
        field.innerHTML = `
            <label>${this.label}</label>
            <input type="${this.type}" place holder="${this.placeholder}">
        `;
        return field;
    }
}