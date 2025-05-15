import Sidebar from './ui/Sidebar.js';
import Canvas from './ui/Canvas.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded and parsed")
    new Sidebar();
    new Canvas();
})