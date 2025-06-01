import Sidebar from './ui/Sidebar.js';
import Canvas from './ui/canvas/Canvas.js';

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

    const generateLargeFormButton = document.getElementById('FormGenerator');
    if (generateLargeFormButton) {
        generateLargeFormButton.addEventListener('click', async () => {
            console.log("[App.js] 'Generate Large Form' button clicked.");
            if (!canvas || typeof canvas.generateAndAddLargeForm !== 'function') {
                console.error("Generate button: Canvas instance or generateAndAddLargeForm method is not available.");
                generateLargeFormButton.disabled = false;
                return;
            }
            
            generateLargeFormButton.disabled = true;
            
            await canvas.generateAndAddLargeForm(1000); 

            generateLargeFormButton.disabled = false;
        });
    } else {
        console.error("Button 'FormGenerator' not found");
    }
});