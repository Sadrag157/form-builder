class Sidebar {
    constructor() {
        this.element = document.getElementById('sidebar')
        this.fields = [
            { type: 'text', label: 'Text box' },
            {type: 'button', label: 'Button'}
        ];
        this.render();
    }
    render() {
        this.element.innerHTML = this.fields.map(field => `
                <div 
                    class="sidebar-item" 
                    data-types="${field.type}"
                    draggable="true"
                >
                    ${field.label}
                </div>
            `).join('');
        
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.type);
            });
        });
    }
}

new Sidebar();