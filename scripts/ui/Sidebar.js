class Sidebar {
    constructor() {
        this.itemsContainer=document.getElementById('sidebarItemsContainer');
        if(!this.itemsContainer){
            console.error("Container for sidebar's elements not found!")
            return;
        }
        this.fields = [
            { type: 'text', label: 'Text box' },
        ];
        this.render();
    }
    render() {
        this.itemsContainer.innerHTML = this.fields.map(field => `
                <div 
                    class="sidebar-item" 
                    data-type="${field.type}"
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

export default Sidebar;