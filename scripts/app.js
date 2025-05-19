import Sidebar from './ui/Sidebar.js';
import Canvas from './ui/Canvas.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded and parsed")
    const sidebar = new Sidebar();
    const canvas = new Canvas();

    const saveButton=document.getElementById('saveFormButton');
    if(saveButton){
        saveButton.addEventListener('click', ()=>{
        canvas.saveForm();
        });
    }else{
        console.error("Button 'saveFormButton not found");
    }

    const ResponseButton=document.getElementById('ResponseButton');
    if(ResponseButton){
        ResponseButton.addEventListener('click', ()=>{
            window.open('response.html', '_blank');
        });
    }else{
        console.error("button 'ResponseButton' not found");
    }
});