class Field {
    constructor(type, options = {}) {
        this.type = type;
        this.label = options.label || '';
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
                <input type="${this.type}" placeholder="">
            `;
        }
        return field;
    }
}